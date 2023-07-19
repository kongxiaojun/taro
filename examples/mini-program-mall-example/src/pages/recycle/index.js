import { Block, Picker, View } from '@tarojs/components'
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
const AUTH = require('../../utils/auth.js')
@withWeapp({
  data: {
    logisticsType: '0',
    // 0 自己送货 1 快递
    shopIndex: -1,
  },
  onLoad(e) {
    // e.type = 1
    // e.orderId = 3
    // e.platform = 'jd'

    this.setData({
      type: e.type,
      orderId: e.orderId,
      platform: e.platform,
    })
    Taro.getLocation({
      type: 'gcj02',
      // 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: (res) => {
        this.data.latitude = res.latitude
        this.data.longitude = res.longitude
        this.initData()
      },
      fail: (err) => {
        console.error(err)
        this.initData()
        AUTH.checkAndAuthorize('scope.userLocation')
      },
    })
  },
  onShow() {},
  async initData() {
    this.fetchShops()
    if (this.data.type == 1 && this.data.platform == 'jd') {
      this.cpsJdOrderDetail()
    }
    if (this.data.type == 1 && this.data.platform == 'pdd') {
      this.cpsPddOrderDetail()
    }
  },
  async fetchShops() {
    const p = {}
    if (this.data.latitude) {
      p.curlatitude = this.data.latitude
    }
    if (this.data.longitude) {
      p.curlongitude = this.data.longitude
    }
    const res = await WXAPI.fetchShops(p)
    if (res.code == 0) {
      res.data.forEach((ele) => {
        if (ele.distance) {
          ele.distance = ele.distance.toFixed(3) // 距离保留3位小数
        }
      })

      this.setData({
        shops: res.data,
      })
    }
  },
  async cpsJdOrderDetail() {
    Taro.showLoading({
      title: '',
    })
    const res = await WXAPI.cpsJdOrderDetail(
      Taro.getStorageSync('token'),
      this.data.orderId
    )
    Taro.hideLoading()
    if (res.code == 0) {
      const orderInfo = res.data.orderInfo
      if (orderInfo.validCode != 17) {
        Taro.showModal({
          title: '错误',
          content: '已完成订单才可以申请回收',
          showCancel: false,
          success: (res) => {
            Taro.navigateBack()
          },
        })
      }
      if (orderInfo.recycleOrderId) {
        Taro.showModal({
          title: '错误',
          content: '请勿重复申请回收',
          showCancel: false,
          success: (res) => {
            Taro.navigateBack()
          },
        })
      }
      this.setData({
        orderInfo,
        amountRecycle: orderInfo.estimateCosPrice,
        name: orderInfo.skuName,
        pic: orderInfo.imageUrl,
        amount: orderInfo.actualCosPrice,
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
  async cpsPddOrderDetail() {
    Taro.showLoading({
      title: '',
    })
    const res = await WXAPI.cpsPddOrderDetail(
      Taro.getStorageSync('token'),
      this.data.orderId
    )
    Taro.hideLoading()
    if (res.code == 0) {
      const orderInfo = res.data.orderInfo
      if (
        orderInfo.status != 2 &&
        orderInfo.status != 3 &&
        orderInfo.status != 5
      ) {
        Taro.showModal({
          title: '错误',
          content: '已完成订单才可以申请回收',
          showCancel: false,
          success: (res) => {
            Taro.navigateBack()
          },
        })
      }
      if (orderInfo.recycleOrderId) {
        Taro.showModal({
          title: '错误',
          content: '请勿重复申请回收',
          showCancel: false,
          success: (res) => {
            Taro.navigateBack()
          },
        })
      }
      this.setData({
        orderInfo,
        amountRecycle: orderInfo.orderAmount,
        name: orderInfo.goodsName,
        pic: orderInfo.imageUrl,
        amount: orderInfo.orderAmount,
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
  logisticsTypeChange(e) {
    this.setData({
      logisticsType: e.detail,
    })
  },
  logisticsTypeClick(e) {
    this.setData({
      logisticsType: e.currentTarget.dataset.name,
    })
  },
  shopSelect(e) {
    this.setData({
      shopIndex: e.detail.value,
    })
  },
  callMobile() {
    const shop = this.data.shops[this.data.shopIndex]
    Taro.makePhoneCall({
      phoneNumber: shop.linkPhone,
    })
  },
  goMap() {
    const shop = this.data.shops[this.data.shopIndex]
    const latitude = shop.latitude
    const longitude = shop.longitude
    Taro.openLocation({
      latitude,
      longitude,
      scale: 18,
    })
  },
  async submit() {
    if (!this.data.amountRecycle) {
      Taro.showToast({
        title: '填写回收价格',
        icon: 'none',
      })
      return
    }
    if (this.data.shopIndex == -1) {
      Taro.showToast({
        title: '请选择回收点',
        icon: 'none',
      })
      return
    }
    const res = await WXAPI.recycleOrderApply({
      token: Taro.getStorageSync('token'),
      type: this.data.type,
      platform: this.data.platform,
      buyOrderId: this.data.orderId,
      name: this.data.name,
      pic: this.data.pic,
      amount: this.data.amount,
      amountRecycle: this.data.amountRecycle,
      logisticsType: this.data.logisticsType,
      shopId: this.data.shops[this.data.shopIndex].id,
      remark: this.data.remark ? this.data.remark : '',
    })
    if (res.code != 0) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
      return
    }
    Taro.showModal({
      title: '成功',
      content: '提交成功，耐心等待审核',
      showCancel: false,
      success: (res) => {
        Taro.redirectTo({
          url: '/pages/recycle/orders',
        })
      },
    })
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
