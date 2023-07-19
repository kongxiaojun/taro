import { Block } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import VanArea from '../../@vant/weapp/area/index'
import VanDatetimePicker from '../../@vant/weapp/datetime-picker/index'
import VanOverlay from '../../@vant/weapp/overlay/index'
import VanTabs from '../../@vant/weapp/tabs/index'
import VanTab from '../../@vant/weapp/tab/index'
import VanImage from '../../@vant/weapp/image/index'
import VanGridItem from '../../@vant/weapp/grid-item/index'
import VanGrid from '../../@vant/weapp/grid/index'
import VanUploader from '../../@vant/weapp/uploader/index'
import VanRate from '../../@vant/weapp/rate/index'
import VanSwitch from '../../@vant/weapp/switch/index'
import VanCalendar from '../../@vant/weapp/calendar/index'
import VanSwipeCell from '../../@vant/weapp/swipe-cell/index'
import VanDialog from '../../@vant/weapp/dialog/index'
import VanSticky from '../../@vant/weapp/sticky/index'
import VanStepper from '../../@vant/weapp/stepper/index'
import VanPicker from '../../@vant/weapp/picker/index'
import VanPopup from '../../@vant/weapp/popup/index'
import VanGoodsActionButton from '../../@vant/weapp/goods-action-button/index'
import VanGoodsActionIcon from '../../@vant/weapp/goods-action-icon/index'
import VanGoodsAction from '../../@vant/weapp/goods-action/index'
import VanEmpty from '../../@vant/weapp/empty/index'
import VanSidebarItem from '../../@vant/weapp/sidebar-item/index'
import VanSidebar from '../../@vant/weapp/sidebar/index'
import VanRadioGroup from '../../@vant/weapp/radio-group/index'
import VanRadio from '../../@vant/weapp/radio/index'
import VanField from '../../@vant/weapp/field/index'
import VanSubmitBar from '../../@vant/weapp/submit-bar/index'
import VanProgress from '../../@vant/weapp/progress/index'
import VanCard from '../../@vant/weapp/card/index'
import VanTag from '../../@vant/weapp/tag/index'
import VanCellGroup from '../../@vant/weapp/cell-group/index'
import VanCell from '../../@vant/weapp/cell/index'
import VanButton from '../../@vant/weapp/button/index'
import VanCountDown from '../../@vant/weapp/count-down/index'
import VanIcon from '../../@vant/weapp/icon/index'
import VanDivider from '../../@vant/weapp/divider/index'
import VanSearch from '../../@vant/weapp/search/index'
import VanNoticeBar from '../../@vant/weapp/notice-bar/index'
import MpHtml from '../../mp-html'
import Login from '../../components/login/index'
import GoodsPop from '../../components/goods-pop/index'
import Fuwuxieyi from '../../components/fuwuxieyi/index'
import './logs.scss'
import WXAPI from '../../apifm-wxapi'
@withWeapp({
  data: {
    page: 1, // 读取第几页
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.cardId = options.id
    this.cardMyLogs()
  },
  async cardMyLogs() {
    Taro.showLoading({
      title: '',
    })
    const res = await WXAPI.cardMyLogs({
      token: Taro.getStorageSync('token'),
      cardId: this.data.cardId,
      page: this.data.page,
    })
    Taro.hideLoading()
    if (res.code == 0) {
      if (this.data.page == 1) {
        this.setData({
          list: res.data.result,
        })
      } else {
        this.setData({
          list: this.data.list.concat(res.data.result),
        })
      }
    } else {
      if (this.data.page == 1) {
        this.setData({
          list: null,
        })
      } else {
        Taro.showToast({
          title: '没有更多了',
          icon: 'none',
        })
      }
    }
  },
  onPullDownRefresh: function () {
    this.data.page = 1
    this.cardMyLogs()
    Taro.stopPullDownRefresh()
  },
  onReachBottom() {
    this.data.page++
    this.cardMyLogs()
  },
})
class _C extends React.Component {
  render() {
    const { list } = this.data
    return (
      <Block>
        {!list && <VanEmpty description="暂无消费记录"></VanEmpty>}
        {list.map((item, index) => {
          return (
            <VanCell
              key={item.id}
              title={item.typeStr}
              value={item.amount + ' (余额:' + item.balance + ')'}
              label={item.dateAdd}
            ></VanCell>
          )
        })}
      </Block>
    )
  }
}
export default _C
