import { Block, Picker, View } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import WXAPI from '../../apifm-wxapi'
const AUTH = require('../../utils/auth.js')
import wxbarcode from 'wxbarcode'
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
import './order-detail.scss'
@withWeapp({
  data: {
    logisticsType: '0',
    // 0 自己送货 1 快递
    shopIndex: -1,
  },
  onLoad(e) {
    // e.id = 3
    this.data.id = e.id
    this.recycleOrderDetail()
  },
  onShow() {},
  async recycleOrderDetail() {
    Taro.showLoading({
      title: '',
    })
    const res = await WXAPI.recycleOrderDetail(
      Taro.getStorageSync('token'),
      this.data.id
    )
    Taro.hideLoading()
    if (res.code == 0) {
      const orderInfo = res.data.orderInfo
      if (orderInfo.shopId) {
        this.shopSubdetail(orderInfo.shopId)
      }
      if (orderInfo.logisticsType == 0) {
        wxbarcode.qrcode('qrcode', orderInfo.hxNumber, 650, 650)
      }
      this.setData({
        orderInfo,
        shipperName: orderInfo.shipperName,
        trackingNumber: orderInfo.trackingNumber,
      })
    } else {
      Taro.showModal({
        title: '错误',
        content: res.msg,
        showCancel: false,
        success: (res) => {
          Taro.navigateBack()
        },
      })
    }
  },
  async shopSubdetail(shopId) {
    const res = await WXAPI.shopSubdetail(shopId)
    if (res.code == 0) {
      this.setData({
        shopInfodetail: res.data,
      })
    }
  },
  callMobile() {
    Taro.makePhoneCall({
      phoneNumber: this.data.shopInfodetail.info.linkPhone,
    })
  },
  goMap() {
    const shop = this.data.shopInfodetail.info
    const latitude = shop.latitude
    const longitude = shop.longitude
    Taro.openLocation({
      latitude,
      longitude,
      scale: 18,
    })
  },
  fahuo() {
    this.setData({
      popupShow: true,
    })
  },
  popupClose() {
    this.setData({
      popupShow: false,
    })
  },
  trackingNumberScan() {
    Taro.scanCode({
      success: (res) => {
        this.setData({
          trackingNumber: res.result,
        })
      },
    })
  },
  async submit() {
    if (!this.data.shipperName) {
      Taro.showToast({
        title: '填写回快递公司',
        icon: 'none',
      })
      return
    }
    if (!this.data.trackingNumber) {
      Taro.showToast({
        title: '填写回快递单号',
        icon: 'none',
      })
      return
    }
    this.setData({
      submitButtonLoading: true,
    })
    const res = await WXAPI.recycleOrderFahuo({
      token: Taro.getStorageSync('token'),
      id: this.data.id,
      shipperName: this.data.shipperName,
      trackingNumber: this.data.trackingNumber,
    })
    this.setData({
      submitButtonLoading: false,
    })
    if (res.code != 0) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
      return
    }
    Taro.showToast({
      title: '提交成功',
    })
    this.popupClose()
    this.recycleOrderDetail()
  },
})
class _C extends React.Component {
  render() {
    const {
      orderInfo,
      platform,
      amountRecycle,
      remark,
      shopIndex,
      shops,
      logisticsType,
    } = this.data
    return (
      <Block>
        {platform == 'jd' && (
          <VanCard
            num={orderInfo.skuNum}
            price={orderInfo.actualCosPrice}
            title={orderInfo.skuName}
            thumb={orderInfo.imageUrl}
            centered
          ></VanCard>
        )}
        {platform == 'pdd' && (
          <VanCard
            num={orderInfo.goodsNum}
            price={orderInfo.orderAmount}
            title={orderInfo.goodsName}
            thumb={orderInfo.imageUrl}
            centered
          ></VanCard>
        )}
        <VanField
          modelValue={amountRecycle}
          label="回收价格"
          type="digit"
          clearable
          required
          inputAlign="right"
          placeholder="填写你预期的回收价格"
        ></VanField>
        <VanField
          modelValue={remark}
          label="备注"
          clearable
          inputAlign="right"
          placeholder="填写备注信息"
        ></VanField>
        <VanCellGroup title="回收点">
          <Picker
            onChange={this.shopSelect}
            value={shopIndex}
            range={shops}
            rangeKey="name"
          >
            <VanCell
              title="选择回收点"
              value={shopIndex == -1 ? '请选择' : shops[shopIndex].name}
              required
              isLink
            ></VanCell>
          </Picker>
          {shopIndex != -1 && shops[shopIndex].distance && (
            <VanCell
              title="距你"
              value={shops[shopIndex].distance + 'km'}
            ></VanCell>
          )}
          {shopIndex != -1 && shops[shopIndex].linkMan && (
            <VanCell title="联系人" value={shops[shopIndex].linkMan}></VanCell>
          )}
          {shopIndex != -1 && (
            <VanCell
              title="电话"
              value={shops[shopIndex].linkPhone}
              isLink
              onClick={this.callMobile}
            ></VanCell>
          )}
          {shopIndex != -1 && (
            <VanCell
              title="地址"
              titleWidth="64rpx"
              value={shops[shopIndex].address}
              isLink
              onClick={this.goMap}
            ></VanCell>
          )}
        </VanCellGroup>
        <VanRadioGroup
          value={logisticsType}
          onChange={this.logisticsTypeChange}
        >
          <VanCellGroup title="回收方式">
            <VanCell
              title="自己送到回收点"
              clickable
              data-name="0"
              onClick={this.logisticsTypeClick}
              renderRighticon={
                <Block>
                  <VanRadio name="0"></VanRadio>
                </Block>
              }
            ></VanCell>
            <VanCell
              title="快递至回收点"
              clickable
              data-name="1"
              onClick={this.logisticsTypeClick}
              renderRighticon={
                <Block>
                  <VanRadio name="1"></VanRadio>
                </Block>
              }
            ></VanCell>
          </VanCellGroup>
        </VanRadioGroup>
        <View className="btn">
          <VanButton type="primary" block onClick={this.submit}>
            申请回收
          </VanButton>
        </View>
      </Block>
    )
  }
}
export default _C
