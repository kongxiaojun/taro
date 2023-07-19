import { Block, View } from '@tarojs/components'
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
import './index.scss'
import WXAPI from '../../apifm-wxapi'
const app = Taro.getApp()
@withWeapp({
  data: {},
  onLoad: function (e) {
    this.data.orderId = e.id
    this.data.trackingNumber = e.trackingNumber
    this.orderDetail()
  },
  onShow: function () {},
  async orderDetail() {
    // https://www.yuque.com/apifm/nu0f75/oamel8
    const res = await WXAPI.orderDetail(
      Taro.getStorageSync('token'),
      this.data.orderId
    )
    if (res.code != 0) {
      Taro.showModal({
        title: '错误',
        content: res.msg,
        showCancel: false,
        success: () => {
          Taro.navigateBack()
        },
      })
      return
    }
    const orderLogisticsShippers = res.data.orderLogisticsShippers
    let trackingNumber = this.data.trackingNumber
    if (!trackingNumber) {
      trackingNumber = res.data.logistics.trackingNumber
    }
    let shipperName = this.data.shipperName
    if (!shipperName) {
      shipperName = res.data.logistics.shipperName
    }
    let logisticsTraces = null
    if (this.data.trackingNumber && orderLogisticsShippers) {
      // 查看子快递单
      const entity = orderLogisticsShippers.find((ele) => {
        return ele.trackingNumber == this.data.trackingNumber
      })
      if (entity.traces) {
        entity.tracesArray = JSON.parse(entity.traces)
        logisticsTraces = entity.tracesArray.reverse()
      }
    } else {
      if (res.data.logisticsTraces) {
        logisticsTraces = res.data.logisticsTraces.reverse()
      }
    }
    this.setData({
      trackingNumber,
      shipperName,
      orderDetail: res.data,
      logisticsTraces,
    })
  },
})
class _C extends React.Component {
  render() {
    const { trackingNumber, shipperName, logisticsTraces } = this.data
    return (
      <View className="container">
        <View className="top-sec">
          <View className="a-row">
            <View className="label">物流单号</View>
            <View className="text">{trackingNumber}</View>
          </View>
          <View className="a-row">
            <View className="label">物流公司</View>
            <View className="text">{shipperName}</View>
          </View>
        </View>
        <View className="sec-wrap">
          {(!logisticsTraces || logisticsTraces.length == 0) && (
            <VanEmpty description="暂无物流信息"></VanEmpty>
          )}
          <View className="details-info">
            <View className="line-box"></View>
            {logisticsTraces.map((item, index) => {
              return (
                <View className="a-row" key={item.index}>
                  <View className="dot">
                    {!(index == 0 ? false : true) && (
                      <View className="active-dot">
                        <View className="yuan-red"></View>
                      </View>
                    )}
                    {!(index == 0 ? true : false) && (
                      <View className="default-dot"></View>
                    )}
                  </View>
                  <View className="info">
                    <View className="date-box">{item.AcceptTime}</View>
                    <View className="text">{item.AcceptStation}</View>
                  </View>
                </View>
              )
            })}
          </View>
        </View>
      </View>
    )
  }
}
export default _C
