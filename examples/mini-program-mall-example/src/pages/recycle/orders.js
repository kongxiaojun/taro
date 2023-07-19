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
import './orders.scss'
import WXAPI from '../../apifm-wxapi'
@withWeapp({
  data: {},
  onLoad(e) {
    this.recycleOrders()
  },
  onShow() {},
  async recycleOrders() {
    Taro.showLoading({
      title: '',
    })
    const res = await WXAPI.recycleOrders({
      token: Taro.getStorageSync('token'),
    })
    Taro.hideLoading()
    if (res.code == 0) {
      this.setData({
        list: res.data.result,
      })
    }
  },
  onPullDownRefresh() {
    this.recycleOrders()
    Taro.stopPullDownRefresh()
  },
  detail(e) {
    const id = e.currentTarget.dataset.id
    Taro.navigateTo({
      url: `/pages/recycle/order-detail?id=${id}`,
    })
  },
  async recycleOrderClose(e) {
    Taro.showModal({
      title: '提示',
      content: '确认要取消该订单吗？',
      success: (res) => {
        if (res.confirm) {
          this._recycleOrderClose(e)
        }
      },
    })
  },
  async _recycleOrderClose(e) {
    const id = e.currentTarget.dataset.id
    const res = await WXAPI.recycleOrderClose(Taro.getStorageSync('token'), id)
    if (res.code != 0) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
      return
    }
    Taro.showToast({
      title: '已取消',
    })
    this.recycleOrders()
  },
  async recycleOrderDelete(e) {
    Taro.showModal({
      title: '提示',
      content: '确认要删除该订单吗？',
      success: (res) => {
        if (res.confirm) {
          this._recycleOrderDelete(e)
        }
      },
    })
  },
  async _recycleOrderDelete(e) {
    const id = e.currentTarget.dataset.id
    const res = await WXAPI.recycleOrderDelete(Taro.getStorageSync('token'), id)
    if (res.code != 0) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
      return
    }
    Taro.showToast({
      title: '删除成功',
    })
    this.recycleOrders()
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
        {shops && <VanCellGroup title="回收点">
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
        </VanCellGroup>}
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
