import { Block } from '@tarojs/components'
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
import './myusers-detail.scss'
import WXAPI from '../../../apifm-wxapi'
@withWeapp({
  /**
   * 页面的初始数据
   */
  data: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options.id = 1871848
    this.userDetailSpreadUser(options.id)
  },
  onShow: function () {},
  async userDetailSpreadUser(uid) {
    const res = await WXAPI.userDetailSpreadUser(
      Taro.getStorageSync('token'),
      uid
    )
    if (res.code != 0) {
      Taro.showModal({
        title: '错误',
        content: res.msg,
        showCancel: false,
      })
      return
    }
    this.setData({
      userInfoMap: res.data,
    })
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
