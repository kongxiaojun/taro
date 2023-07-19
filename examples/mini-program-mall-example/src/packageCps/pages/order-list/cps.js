import { Block, View } from '@tarojs/components'
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
import './cps.scss'
import WXAPI from '../../../apifm-wxapi'
@withWeapp({
  data: {
    tabIndex: 0,
    page: 1,
  },
  onLoad(e) {
    this.cpsJdOrders()
  },
  onShow() {},
  tabChange(e) {
    this.setData({
      page: 1,
      tabIndex: e.detail.index,
    })
    if (e.detail.index == 0) {
      this.cpsJdOrders()
    }
    if (e.detail.index == 1) {
      this.cpsPddOrders()
    }
  },
  async cpsJdOrders() {
    Taro.showLoading({
      title: '',
    })
    const res = await WXAPI.cpsJdOrders({
      token: Taro.getStorageSync('token'),
    })
    Taro.hideLoading()
    if (res.code == 0) {
      this.setData({
        list: res.data.result,
      })
    }
  },
  async cpsPddOrders() {
    Taro.showLoading({
      title: '',
    })
    const res = await WXAPI.cpsPddOrders({
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
    this.setData({
      page: 1,
    })
    if (this.data.tabIndex == 0) {
      this.cpsJdOrders()
    }
    if (this.data.tabIndex == 1) {
      this.cpsPddOrders()
    }
    Taro.stopPullDownRefresh()
  },
  huishou(e) {
    console.log(e)
    const type = e.currentTarget.dataset.type
    const orderId = e.currentTarget.dataset.orderid
    const platform = e.currentTarget.dataset.platform
    Taro.navigateTo({
      url: `/pages/recycle/index?type=${type}&orderId=${orderId}&platform=${platform}`,
    })
  },
})
class _C extends React.Component {
  render() {
    const { tabIndex, list } = this.data
    return (
      <Block>
        <VanSticky>
          <VanTabs active={tabIndex} onChange={this.tabChange}>
            <VanTab title="京东"></VanTab>
            <VanTab title="拼多多"></VanTab>
          </VanTabs>
        </VanSticky>
        {!list && <VanEmpty description="暂无订单"></VanEmpty>}
        {tabIndex == 0 && (
          <Block>
            {list && list.map((item, index) => {
              return (
                <VanCard
                  key={item.id}
                  num={item.skuNum}
                  price={item.estimateCosPrice}
                  title={item.skuName}
                  thumb={item.imageUrl}
                  tag={item.validCodeStr}
                  centered
                  renderDesc={
                    <Block>
                      <View>
                        <View>{'订单号 ' + item.orderId}</View>
                        <View>{'商品编号 ' + item.skuId}</View>
                        <View>{'下单时间 ' + item.orderTime}</View>
                      </View>
                    </Block>
                  }
                  renderFooter={
                    <Block>
                      <View>
                        {item.validCode == 17 && !item.recycleOrderId && (
                          <VanButton
                            type="danger"
                            size="mini"
                            data-type="1"
                            data-orderid={item.id}
                            data-platform="jd"
                            onClick={this.huishou}
                          >
                            回收
                          </VanButton>
                        )}
                      </View>
                    </Block>
                  }
                ></VanCard>
              )
            })}
          </Block>
        )}
        {tabIndex == 1 && (
          <Block>
            {list && list.map((item, index) => {
              return (
                <VanCard
                  key={item.id}
                  num={item.goodsNum}
                  price={item.orderAmount}
                  title={item.goodsName}
                  thumb={item.imageUrl}
                  tag={item.statusStr}
                  centered
                  renderDesc={
                    <Block>
                      <View>
                        <View>{'订单号 ' + item.orderSn}</View>
                        <View>{'商品编号 ' + item.goodsId}</View>
                        <View>{'下单时间 ' + item.datePay}</View>
                      </View>
                    </Block>
                  }
                  renderFooter={
                    <Block>
                      <View>
                        {(item.status == 2 ||
                          item.status == 3 ||
                          item.status == 5) &&
                          !item.recycleOrderId && (
                            <VanButton
                              type="danger"
                              size="mini"
                              data-type="1"
                              data-orderid={item.id}
                              data-platform="pdd"
                              onClick={this.huishou}
                            >
                              回收
                            </VanButton>
                          )}
                      </View>
                    </Block>
                  }
                ></VanCard>
              )
            })}
          </Block>
        )}
      </Block>
    )
  }
}
export default _C
