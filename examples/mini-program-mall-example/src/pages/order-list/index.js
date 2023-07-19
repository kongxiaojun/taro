import {
  Block,
  View,
  ScrollView,
  Navigator,
  Image,
  Text,
} from '@tarojs/components'
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
import goodsDetailPage from '../../imports/goodsDetailPage8.js'
import './index.scss'
const wxpay = require('../../utils/pay.js')
import WXAPI from '../../apifm-wxapi'
import AtTabs from "../../at-tabs/AtTabs";
import AtTabsPane from "../../at-tabs/AtTabsPane";
const AUTH = require('../../utils/auth.js')
@withWeapp({
  data: {
    page: 1,
    tabIndex: 0,
    statusType: [
      {
        status: 9999,
        title: '全部',
      },
      {
        status: 0,
        title: '待付款',
      },
      {
        status: 1,
        title: '待发货',
      },
      {
        status: 2,
        title: '待收货',
      },
      {
        status: 3,
        title: '待评价',
      },
    ],
    status: 9999,
    hasRefund: false,
    badges: [0, 0, 0, 0, 0],
  },
  statusTap: function (index) {
    const status = this.data.statusType[index].status
    this.setData({
      page: 1,
      status,
      tabIndex: index
    })
    this.orderList()
  },
  cancelOrderTap: function (e) {
    const that = this
    const orderId = e.currentTarget.dataset.id
    Taro.showModal({
      title: '确定要取消该订单吗？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          WXAPI.orderClose(Taro.getStorageSync('token'), orderId).then(
            function (res) {
              if (res.code == 0) {
                that.data.page = 1
                that.orderList()
                that.getOrderStatistics()
              }
            }
          )
        }
      },
    })
  },
  refundApply(e) {
    // 申请售后
    const orderId = e.currentTarget.dataset.id
    const amount = e.currentTarget.dataset.amount
    Taro.navigateTo({
      url: '/pages/order/refundApply?id=' + orderId + '&amount=' + amount,
    })
  },
  toPayTap: function (e) {
    // 防止连续点击--开始
    if (this.data.payButtonClicked) {
      Taro.showToast({
        title: '休息一下~',
        icon: 'none',
      })
      return
    }
    this.data.payButtonClicked = true
    setTimeout(() => {
      this.data.payButtonClicked = false
    }, 3000) // 可自行修改时间间隔（目前是3秒内只能点击一次支付按钮）
    // 防止连续点击--结束
    const that = this
    const orderId = e.currentTarget.dataset.id
    let money = e.currentTarget.dataset.money
    const needScore = e.currentTarget.dataset.score
    WXAPI.userAmount(Taro.getStorageSync('token')).then(function (res) {
      if (res.code == 0) {
        const order_pay_user_balance = Taro.getStorageSync(
          'order_pay_user_balance'
        )
        if (order_pay_user_balance != '1') {
          res.data.balance = 0
        }
        // 增加提示框
        if (res.data.score < needScore) {
          Taro.showToast({
            title: '您的积分不足，无法支付',
            icon: 'none',
          })
          return
        }
        let _msg = '订单金额: ' + money + ' 元'
        if (res.data.balance > 0) {
          _msg += ',可用余额为 ' + res.data.balance + ' 元'
          if (money - res.data.balance > 0) {
            _msg +=
              ',仍需微信支付 ' + (money - res.data.balance).toFixed(2) + ' 元'
          }
        }
        if (needScore > 0) {
          _msg += ',并扣除 ' + needScore + ' 积分'
        }
        money = money - res.data.balance
        Taro.showModal({
          title: '请确认支付',
          content: _msg,
          confirmText: '确认支付',
          cancelText: '取消支付',
          success: function (res) {
            console.log(res)
            if (res.confirm) {
              that._toPayTap(orderId, money)
            } else {
              console.log('用户点击取消支付')
            }
          },
        })
      } else {
        Taro.showModal({
          title: '错误',
          content: '无法获取用户资金信息',
          showCancel: false,
        })
      }
    })
  },
  async wxSphGetpaymentparams(e) {
    const orderId = e.currentTarget.dataset.id
    const res = await WXAPI.wxSphGetpaymentparams(
      Taro.getStorageSync('token'),
      orderId
    )
    if (res.code != 0) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
      return
    }
    // 发起支付
    Taro.requestPayment({
      timeStamp: res.data.timeStamp,
      nonceStr: res.data.nonceStr,
      package: res.data.package,
      signType: res.data.signType,
      paySign: res.data.paySign,
      fail: (aaa) => {
        console.error(aaa)
        Taro.showToast({
          title: '支付失败:' + aaa,
        })
      },
      success: () => {
        // 提示支付成功
        Taro.showToast({
          title: '支付成功',
        })
        this.orderList()
      },
    })
  },
  _toPayTap: function (orderId, money) {
    const _this = this
    if (money <= 0) {
      // 直接使用余额支付
      WXAPI.orderPay(Taro.getStorageSync('token'), orderId).then(function (
        res
      ) {
        _this.data.page = 1
        _this.orderList()
        _this.getOrderStatistics()
      })
    } else {
      wxpay.wxpay('order', money, orderId, '/pages/order-list/index')
    }
  },
  onLoad: function (options) {
    if (options && options.type) {
      if (options.type == 99) {
        this.setData({
          hasRefund: true,
        })
      } else {
        const tabIndex = this.data.statusType.findIndex((ele) => {
          return ele.status == options.type
        })
        this.setData({
          status: options.type,
          tabIndex,
        })
      }
    }
    this.getOrderStatistics()
    this.orderList()
    this.setData({
      sphpay_open: Taro.getStorageSync('sphpay_open'),
    })
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
  },
  getOrderStatistics() {
    WXAPI.orderStatistics(Taro.getStorageSync('token')).then((res) => {
      if (res.code == 0) {
        const badges = this.data.badges
        badges[1] = res.data.count_id_no_pay
        badges[2] = res.data.count_id_no_transfer
        badges[3] = res.data.count_id_no_confirm
        badges[4] = res.data.count_id_no_reputation
        this.setData({
          badges,
        })
      }
    })
  },
  onShow: function () {},
  onPullDownRefresh: function () {
    this.data.page = 1
    this.getOrderStatistics()
    this.orderList()
    Taro.stopPullDownRefresh()
  },
  onReachBottom() {
    this.setData({
      page: this.data.page + 1,
    })
    this.orderList()
  },
  async orderList() {
    Taro.showLoading({
      title: '',
    })
    var postData = {
      page: this.data.page,
      pageSize: 20,
      token: Taro.getStorageSync('token'),
    }
    if (this.data.hasRefund) {
      postData.hasRefund = true
    }
    if (!postData.hasRefund) {
      postData.status = this.data.status
    }
    if (postData.status == 9999) {
      postData.status = ''
    }
    const res = await WXAPI.orderList(postData)
    Taro.hideLoading()
    if (res.code == 0) {
      if (this.data.page == 1) {
        this.setData({
          orderList: res.data.orderList,
          logisticsMap: res.data.logisticsMap,
          goodsMap: res.data.goodsMap,
        })
      } else {
        this.setData({
          orderList: this.data.orderList.concat(res.data.orderList),
          logisticsMap: Object.assign(
            this.data.logisticsMap,
            res.data.logisticsMap
          ),
          goodsMap: Object.assign(this.data.goodsMap, res.data.goodsMap),
        })
      }
    } else {
      if (this.data.page == 1) {
        this.setData({
          orderList: null,
          logisticsMap: {},
          goodsMap: {},
        })
      } else {
        Taro.showToast({
          title: '没有更多了',
          icon: 'none',
        })
      }
    }
  },
})
class _C extends React.Component {
  render() {
    const {
      tabIndex,
      badges,
      hasRefund,
      statusType,
      orderList,
      goodsMap,
      sphpay_open,
    } = this.data
    return (
      <Block>
        <VanSticky>
          {!hasRefund && statusType && (
              <AtTabs current={this.data.tabIndex} tabList={statusType} onClick={this.statusTap}>
              </AtTabs>

            // <VanTabs active={tabIndex} onChange={this.statusTap}>
            //   {statusType.map((item, index) => {
            //     return (
            //       <VanTab
            //         key={index}
            //         title={item.title}
            //         info={badges[index] ? badges[index] : ''}
            //       ></VanTab>
            //     )
            //   })}
            // </VanTabs>
          )}
        </VanSticky>
        <View className="container">
          {!orderList && <VanEmpty description="暂无订单"></VanEmpty>}
          {!(orderList ? false : true) && (
            <View className="order-list">
              {orderList.map((item, index) => {
                return (
                  <View className="a-order" key={item.index}>
                    <VanCell
                      title={item.orderNumber}
                      value={item.statusStr}
                      isLink
                      url={'/pages/order-details/index?id=' + item.id}
                    ></VanCell>
                    <ScrollView className="goods-img-container" scrollX="true">
                      {goodsMap[item.id].map((item, index) => {
                        return (
                          <View className="img-box" key={item.index}>
                            <Navigator url={goodsDetailPage.url(item)}>
                              <Image
                                src={item.pic}
                                className="goods-img"
                              ></Image>
                            </Navigator>
                          </View>
                        )
                      })}
                    </ScrollView>
                    <View className="goods-price">
                      {'共 ' + item.goodsNumber + ' 件商品 合计：'}
                      {item.score <= 0 && (
                        <Text className="p">{'¥ ' + item.amountReal}</Text>
                      )}
                      {item.score > 0 && (
                        <Text className="p">
                          {'¥ ' +
                            item.amountReal +
                            ' + ' +
                            item.score +
                            ' 积分'}
                        </Text>
                      )}
                    </View>
                    <View className="goods-info">
                      <View className="goods-des">
                        {item.remark && item.remark != '' && (
                          <View className="remark">{item.remark}</View>
                        )}
                        <View>{item.dateAdd}</View>
                      </View>
                    </View>
                    <View className="price-box">
                      {!(item.status == 0 ? false : true) && (
                        <View
                          className="btn"
                          onClick={this.cancelOrderTap}
                          data-id={item.id}
                        >
                          取消订单
                        </View>
                      )}
                      {!(item.status == 0 ? false : true) && (
                        <View
                          className="btn active"
                          onClick={this.toPayTap}
                          data-id={item.id}
                          data-money={item.amountReal}
                          data-score={item.score}
                        >
                          马上付款
                        </View>
                      )}
                      {item.status == 0 && sphpay_open == '1' && (
                        <View
                          className="btn active"
                          onClick={this.wxSphGetpaymentparams}
                          data-id={item.id}
                          data-money={item.amountReal}
                          data-score={item.score}
                        >
                          视频号支付
                        </View>
                      )}
                      {!(item.status == 0 || item.status == -1
                        ? true
                        : false) && (
                        <View
                          className="btn active"
                          onClick={this.refundApply}
                          data-id={item.id}
                          data-amount={item.amountReal}
                        >
                          退换货
                        </View>
                      )}
                    </View>
                  </View>
                )
              })}
            </View>
          )}
          <View className="safeAreaOldMarginBttom safeAreaNewMarginBttom"></View>
        </View>
      </Block>
    )
  }
}
export default _C
