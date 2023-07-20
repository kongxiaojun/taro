import { Block, View, Image } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import VanArea from '../../../@vant/weapp/area/index'
import VanDatetimePicker from '../../../@vant/weapp/datetime-picker/index'
import VanOverlay from '../../../@vant/weapp/overlay/index'
import VanTabs from '../../../@vant/weapp/tabs/index'
import VanTab from '../../../@vant/weapp/tab/index'
import VanImage from '../../../@vant/weapp/image/index'
import VanGridItem from '../../../@vant/weapp/grid-item/index'
import VanGrid from '../../../@vant/weapp/grid/index'
import VanUploader from '../../../@vant/weapp/uploader/index'
import VanRate from '../../../@vant/weapp/rate/index'
import VanSwitch from '../../../@vant/weapp/switch/index'
import VanCalendar from '../../../@vant/weapp/calendar/index'
import VanSwipeCell from '../../../@vant/weapp/swipe-cell/index'
import VanDialog from '../../../@vant/weapp/dialog/index'
import VanSticky from '../../../@vant/weapp/sticky/index'
import VanStepper from '../../../@vant/weapp/stepper/index'
import VanPicker from '../../../@vant/weapp/picker/index'
import VanPopup from '../../../@vant/weapp/popup/index'
import VanGoodsActionButton from '../../../@vant/weapp/goods-action-button/index'
import VanGoodsActionIcon from '../../../@vant/weapp/goods-action-icon/index'
import VanGoodsAction from '../../../@vant/weapp/goods-action/index'
import VanEmpty from '../../../@vant/weapp/empty/index'
import VanSidebarItem from '../../../@vant/weapp/sidebar-item/index'
import VanSidebar from '../../../@vant/weapp/sidebar/index'
import VanRadioGroup from '../../../@vant/weapp/radio-group/index'
import VanRadio from '../../../@vant/weapp/radio/index'
import VanField from '../../../@vant/weapp/field/index'
import VanSubmitBar from '../../../@vant/weapp/submit-bar/index'
import VanProgress from '../../../@vant/weapp/progress/index'
import VanCard from '../../../@vant/weapp/card/index'
import VanTag from '../../../@vant/weapp/tag/index'
import VanCellGroup from '../../../@vant/weapp/cell-group/index'
import VanCell from '../../../@vant/weapp/cell/index'
import VanButton from '../../../@vant/weapp/button/index'
import VanCountDown from '../../../@vant/weapp/count-down/index'
import VanIcon from '../../../@vant/weapp/icon/index'
import VanDivider from '../../../@vant/weapp/divider/index'
import VanSearch from '../../../@vant/weapp/search/index'
import VanNoticeBar from '../../../@vant/weapp/notice-bar/index'
import MpHtml from '../../../mp-html'
import Login from '../../../components/login/index'
import GoodsPop from '../../../components/goods-pop/index'
import Fuwuxieyi from '../../../components/fuwuxieyi/index'
import './index.scss'
import WXAPI from '../../../apifm-wxapi'
@withWeapp({
  /**
   * 页面的初始数据
   */
  data: {
    number1: 0,
    // 直推用户数
    number2: 0,
    // 间推用户数
    activeIndex: 0,
    // tab点亮索引
    page: 1, // 读取第几页
  },

  onLoad: function () {
    this.fxMembersStatistics()
    this.fxMembers()
  },
  onShow: function () {},
  async fxMembersStatistics() {
    const res = await WXAPI.fxMembersStatistics(Taro.getStorageSync('token'))
    if (res.code == 0) {
      this.setData({
        number1: res.data.totleFansLevel1,
        number2: res.data.totleFansLevel2,
      })
    }
  },
  async fxMembers() {
    const res = await WXAPI.fxMembers({
      token: Taro.getStorageSync('token'),
      page: this.data.page,
      level: this.data.activeIndex == 0 ? 1 : 2,
    })
    if (res.code == 700) {
      if (this.data.page == 1) {
        this.setData({
          members: [],
        })
      } else {
        Taro.showToast({
          title: '没有更多了',
          icon: 'none',
        })
      }
    }
    if (res.code == 0) {
      const statisticsCommisionMap = res.data.statisticsCommisionMap
      const userCashMap = res.data.userCashMap
      res.data.result.forEach((ele) => {
        if (!ele.avatarUrls) {
          ele.avatarUrls = '/images/default.png'
        }
        if (!ele.nicks) {
          ele.nicks = '用户' + ele.uids
        }
        const _statisticsCommisionMap = statisticsCommisionMap[ele.uids]
        if (_statisticsCommisionMap) {
          ele.saleroom = _statisticsCommisionMap.saleroom
          ele.numberOrder = _statisticsCommisionMap.numberOrder
        }
        if (userCashMap) {
          const _userCashMap = userCashMap[ele.uids]
          if (_userCashMap) {
            ele.totleConsumed = _userCashMap.totleConsumed
            ele.totalPayNumber = _userCashMap.totalPayNumber
            ele.totalPayAmount = _userCashMap.totalPayAmount
          }
        }
      })
      if (this.data.page == 1) {
        this.setData({
          members: res.data.result,
        })
      } else {
        this.setData({
          members: this.data.members.concat(res.data.result),
        })
      }
    }
  },
  tabChange(e) {
    this.setData({
      activeIndex: e.detail.index,
      page: 1,
    })
    this.fxMembers()
  },
  onReachBottom: function () {
    this.data.page += 1
    this.fxMembers()
  },
  onPullDownRefresh: function () {
    this.data.page = 1
    this.fxMembersStatistics()
    this.fxMembers()
    Taro.stopPullDownRefresh()
  },
})
class _C extends React.Component {
  render() {
    const { activeIndex, number1, number2, members } = this.data
    return (
      <Block>
        <VanSticky>
          <VanTabs active={activeIndex} onChange={this.tabChange}>
            <VanTab title="直推" info={number1 ? number1 : ''}></VanTab>
            <VanTab title="间推" info={number2 ? number2 : ''}></VanTab>
          </VanTabs>
        </VanSticky>
        {(!members || members.length == 0) && (
          <VanEmpty description="暂无团队"></VanEmpty>
        )}
        {members.map((item, index) => {
          return (
            <View key={item.id} className="list">
              <Image
                src={item.avatarUrls}
                mode="aspectFill"
                className="l"
              ></Image>
              <View className="r">
                <VanCell
                  title={item.nicks}
                  label={item.mobileMasks}
                  isLink
                  url={'myusers-detail?id=' + item.uids}
                ></VanCell>
                <VanCell
                  titleStyle={{flex:2}}
                  title="成交额"
                  value={'¥' + (item.totalPayAmount ? item.totalPayAmount : 0)}
                ></VanCell>
                <VanCell
                  titleStyle={{flex:2}}
                  title="订单数"
                  label={
                    '最近下单:' +
                    (item.lastOrderDate ? item.lastOrderDate : '-')
                  }
                  value={(item.totalPayNumber ? item.totalPayNumber : 0) + '笔'}
                ></VanCell>
              </View>
            </View>
          )
        })}
      </Block>
    )
  }
}
export default _C
