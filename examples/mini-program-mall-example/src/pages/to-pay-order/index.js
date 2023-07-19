import {
  Block,
  View,
  Image,
  Picker,
  RadioGroup,
  Label,
  Radio,
  Input,
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
import './index.scss'
const app = Taro.getApp()
const CONFIG = require('../../config.js')
import WXAPI from '../../apifm-wxapi'
const AUTH = require('../../utils/auth.js')
const wxpay = require('../../utils/pay.js')
Date.prototype.format = function (format) {
  var date = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    'S+': this.getMilliseconds(),
  }
  if (/(y+)/i.test(format)) {
    format = format.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (var k in date) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1
          ? date[k]
          : ('00' + date[k]).substr(('' + date[k]).length)
      )
    }
  }
  return format
}
@withWeapp({
  data: {
    totalScoreToPay: 0,
    goodsList: [],
    isNeedLogistics: 0,
    // 是否需要物流信息
    yunPrice: 0,
    allGoodsAndYunPrice: 0,
    goodsJsonStr: '',
    orderType: '',
    //订单类型，购物车下单或立即支付下单，默认是购物车， buyNow 说明是立即购买
    pingtuanOpenId: undefined,
    //拼团的话记录团号

    hasNoCoupons: true,
    coupons: [],
    couponAmount: 0,
    //优惠券金额
    curCoupon: null,
    // 当前选择使用的优惠券
    curCouponShowText: '请选择使用优惠券',
    // 当前选择使用的优惠券
    peisongType: 'kd',
    // 配送方式 kd,zq 分别表示快递/到店自取
    remark: '',
    shopIndex: -1,
    pageIsEnd: false,
    bindMobileStatus: 0,
    // 0 未判断 1 已绑定手机号码 2 未绑定手机号码
    userScore: 0,
    // 用户可用积分
    deductionScore: '-1',
    // 本次交易抵扣的积分数， -1 为不抵扣，0 为自动抵扣，其他金额为抵扣多少积分
    shopCarType: 0,
    //0自营购物车，1云货架购物车
    dyopen: 0,
    // 是否开启订阅
    dyunit: 0,
    // 按天
    dyduration: 1,
    // 订阅间隔
    dytimes: 1,
    // 订阅次数
    dateStart: undefined,
    // 订阅首次扣费时间
    minDate: new Date().getTime(),
    maxDate: new Date(2030, 10, 1).getTime(),
    currentDate: new Date().getTime(),
    formatter: (type, value) => {
      if (type === 'year') {
        return `${value}年`
      }
      if (type === 'month') {
        return `${value}月`
      }
      if (type === 'day') {
        return `${value}日`
      }
      if (type === 'hour') {
        return `${value}点`
      }
      if (type === 'minute') {
        return `${value}分`
      }
      return value
    },
    cardId: '0', // 使用的次卡ID
  },

  onShow() {
    if (this.data.pageIsEnd) {
      return
    }
    AUTH.checkHasLogined().then((isLogined) => {
      if (isLogined) {
        this.doneShow()
      } else {
        AUTH.authorize().then((res) => {
          if (CONFIG.bindSeller) {
            AUTH.bindSeller()
          }
          this.doneShow()
        })
      }
    })
  },
  async doneShow() {
    let goodsList = []
    let shopList = []
    const token = Taro.getStorageSync('token')
    //立即购买下单
    if ('buyNow' == this.data.orderType) {
      var buyNowInfoMem = Taro.getStorageSync('buyNowInfo')
      this.data.kjId = buyNowInfoMem.kjId
      if (buyNowInfoMem && buyNowInfoMem.shopList) {
        goodsList = buyNowInfoMem.shopList
      }
    } else {
      //购物车下单
      if (this.data.shopCarType == 0) {
        //自营购物车
        var res = await WXAPI.shippingCarInfo(token)
        shopList = res.data.shopList
      } else if (this.data.shopCarType == 1) {
        //云货架购物车
        var res = await WXAPI.jdvopCartInfo(token)
        shopList = [
          {
            id: 0,
            name: '其他',
            hasNoCoupons: true,
            serviceDistance: 99999999,
          },
        ]
      }
      if (res.code == 0) {
        goodsList = res.data.items.filter((ele) => {
          return ele.selected
        })
        const shopIds = []
        goodsList.forEach((ele) => {
          if (this.data.shopCarType == 1) {
            ele.shopId = 0
          }
          shopIds.push(ele.shopId)
        })
        shopList = shopList.filter((ele) => {
          return shopIds.includes(ele.id)
        })
      }
    }
    shopList.forEach((ele) => {
      ele.hasNoCoupons = true
    })
    this.setData({
      shopList,
      goodsList,
      peisongType: this.data.peisongType,
    })
    this.initShippingAddress()
    this.userAmount()
  },
  onLoad(e) {
    const nowDate = new Date()
    let _data = {
      isNeedLogistics: 1,
      dateStart: nowDate.format('yyyy-MM-dd h:m:s'),
      orderPeriod_open: Taro.getStorageSync('orderPeriod_open'),
      order_pay_user_balance: Taro.getStorageSync('order_pay_user_balance'),
    }
    if (e.orderType) {
      _data.orderType = e.orderType
    }
    if (e.pingtuanOpenId) {
      _data.pingtuanOpenId = e.pingtuanOpenId
    }
    if (e.shopCarType) {
      _data.shopCarType = e.shopCarType
    }
    this.setData(_data)
    this.getUserApiInfo()
    this.cardMyList()
  },
  async userAmount() {
    const res = await WXAPI.userAmount(Taro.getStorageSync('token'))
    const order_pay_user_balance = Taro.getStorageSync('order_pay_user_balance')
    if (res.code == 0) {
      this.setData({
        balance: order_pay_user_balance == '1' ? res.data.balance : 0,
        userScore: res.data.score,
      })
    }
  },
  getDistrictId: function (obj, aaa) {
    if (!obj) {
      return ''
    }
    if (!aaa) {
      return ''
    }
    return aaa
  },
  remarkChange(e) {
    this.data.remark = e.detail.value
  },
  async goCreateOrder() {
    this.setData({
      btnLoading: true,
    })
    // 检测实名认证状态
    if (Taro.getStorageSync('needIdCheck') == 1) {
      const res = await WXAPI.userDetail(Taro.getStorageSync('token'))
      if (res.code == 0 && !res.data.base.isIdcardCheck) {
        Taro.navigateTo({
          url: '/pages/idCheck/index',
        })
        this.setData({
          btnLoading: false,
        })
        return
      }
    }
    const subscribe_ids = Taro.getStorageSync('subscribe_ids')
    if (subscribe_ids) {
      Taro.requestSubscribeMessage({
        tmplIds: subscribe_ids.split(','),
        success(res) {},
        fail(e) {
          console.error(e)
        },
        complete: (e) => {
          this.createOrder(true)
        },
      })
    } else {
      this.createOrder(true)
    }
  },
  async createOrder(e) {
    // shopCarType: 0 //0自营购物车，1云货架购物车
    const loginToken = Taro.getStorageSync('token') // 用户登录 token
    const postData = {
      token: loginToken,
      goodsJsonStr: this.data.goodsJsonStr,
      remark: this.data.remark,
      peisongType: this.data.peisongType,
      goodsType: this.data.shopCarType,
      cardId: this.data.cardId,
    }
    if (this.data.deductionScore != '-1') {
      postData.deductionScore = this.data.deductionScore
    }
    if (this.data.cardId == '0') {
      postData.cardId = ''
    }
    if (this.data.dyopen == 1) {
      const orderPeriod = {
        unit: this.data.dyunit,
        duration: this.data.dyduration,
        dateStart: this.data.dateStart,
        times: this.data.dytimes,
        autoPay: true,
      }
      postData.orderPeriod = JSON.stringify(orderPeriod)
    }
    if (this.data.kjId) {
      postData.kjid = this.data.kjId
    }
    if (this.data.pingtuanOpenId) {
      postData.pingtuanOpenId = this.data.pingtuanOpenId
    }
    if (
      postData.peisongType == 'kd' &&
      this.data.curAddressData &&
      this.data.curAddressData.provinceId
    ) {
      postData.provinceId = this.data.curAddressData.provinceId
    }
    if (
      postData.peisongType == 'kd' &&
      this.data.curAddressData &&
      this.data.curAddressData.cityId
    ) {
      postData.cityId = this.data.curAddressData.cityId
    }
    if (
      postData.peisongType == 'kd' &&
      this.data.curAddressData &&
      this.data.curAddressData.districtId
    ) {
      postData.districtId = this.data.curAddressData.districtId
    }
    if (
      postData.peisongType == 'kd' &&
      this.data.curAddressData &&
      this.data.curAddressData.streetId
    ) {
      postData.streetId = this.data.curAddressData.streetId
    }
    if (this.data.shopCarType == 1) {
      // vop 需要地址来计算运费
      postData.address = this.data.curAddressData.address
      postData.linkMan = this.data.curAddressData.linkMan
      postData.mobile = this.data.curAddressData.mobile
      postData.code = this.data.curAddressData.code
    }
    if (e && this.data.isNeedLogistics > 0 && postData.peisongType == 'kd') {
      if (!this.data.curAddressData) {
        Taro.hideLoading()
        Taro.showToast({
          title: '请设置收货地址',
          icon: 'none',
        })
        this.setData({
          btnLoading: false,
        })
        return
      }
      if (postData.peisongType == 'kd') {
        postData.address = this.data.curAddressData.address
        postData.linkMan = this.data.curAddressData.linkMan
        postData.mobile = this.data.curAddressData.mobile
        postData.code = this.data.curAddressData.code
      }
    }
    if (this.data.curCoupon) {
      postData.couponId = this.data.curCoupon.id
    }
    if (!e) {
      postData.calculate = 'true'
    } else {
      if (
        postData.peisongType == 'zq' &&
        this.data.shops &&
        this.data.shopIndex == -1
      ) {
        Taro.showToast({
          title: '请选择自提门店',
          icon: 'none',
        })
        this.setData({
          btnLoading: false,
        })
        return
      }
      const extJsonStr = {}
      if (postData.peisongType == 'zq') {
        if (!this.data.name) {
          Taro.showToast({
            title: '请填写联系人',
            icon: 'none',
          })
          this.setData({
            btnLoading: false,
          })
          return
        }
        if (!this.data.mobile) {
          Taro.showToast({
            title: '请填写联系电话',
            icon: 'none',
          })
          this.setData({
            btnLoading: false,
          })
          return
        }
        extJsonStr['联系人'] = this.data.name
        extJsonStr['联系电话'] = this.data.mobile
      }
      if (postData.peisongType == 'zq' && this.data.shops) {
        postData.shopIdZt = this.data.shops[this.data.shopIndex].id
        postData.shopNameZt = this.data.shops[this.data.shopIndex].name
      }
      postData.extJsonStr = JSON.stringify(extJsonStr)
    }
    const shopList = this.data.shopList
    let totalRes = {
      code: 0,
      msg: 'success',
      data: {
        score: 0,
        amountReal: 0,
        orderIds: [],
      },
    }
    if (shopList && shopList.length > 1) {
      // 多门店的商品下单
      let totalScoreToPay = 0
      let isNeedLogistics = false
      let allGoodsAndYunPrice = 0
      let yunPrice = 0
      let deductionMoney = 0
      let couponAmount = 0
      for (let index = 0; index < shopList.length; index++) {
        const curShop = shopList[index]
        console.log(curShop)
        postData.filterShopId = curShop.id
        if (curShop.curCoupon) {
          postData.couponId = curShop.curCoupon.id
        } else {
          postData.couponId = ''
        }
        const res = await WXAPI.orderCreate(postData)
        this.data.pageIsEnd = true
        if (res.code != 0) {
          this.data.pageIsEnd = false
          Taro.showModal({
            title: '错误',
            content: res.msg,
            showCancel: false,
          })
          this.setData({
            btnLoading: false,
          })
          return
        }
        totalRes.data.score += res.data.score
        totalRes.data.amountReal += res.data.amountReal
        totalRes.data.orderIds.push(res.data.id)
        console.log('e:', e)
        if (!e) {
          curShop.hasNoCoupons = true
          console.log(curShop)
          if (res.data.couponUserList) {
            curShop.hasNoCoupons = false
            res.data.couponUserList.forEach((ele) => {
              let moneyUnit = '元'
              if (ele.moneyType == 1) {
                moneyUnit = '%'
              }
              if (ele.moneyHreshold) {
                ele.nameExt =
                  ele.name +
                  ' [面值' +
                  ele.money +
                  moneyUnit +
                  '，满' +
                  ele.moneyHreshold +
                  '元可用]'
              } else {
                ele.nameExt = ele.name + ' [面值' + ele.money + moneyUnit + ']'
              }
            })
            curShop.curCouponShowText = '请选择使用优惠券'
            curShop.coupons = res.data.couponUserList
            if (res.data.couponId && res.data.couponId.length > 0) {
              curShop.curCoupon = curShop.coupons.find((ele) => {
                return ele.id == res.data.couponId[0]
              })
              curShop.curCouponShowText = curShop.curCoupon.nameExt
            }
          }
          shopList.splice(index, 1, curShop)
          // 计算积分抵扣规则 userScore
          let scoreDeductionRules = res.data.scoreDeductionRules
          if (scoreDeductionRules) {
            // 如果可叠加，计算可抵扣的最大积分数
            scoreDeductionRules.forEach((ele) => {
              if (ele.loop) {
                let loopTimes = Math.floor(this.data.userScore / ele.score) // 按剩余积分取最大
                let loopTimesMax = Math.floor(
                  (res.data.amountTotle + res.data.deductionMoney) / ele.money
                ) // 按金额取最大
                if (loopTimes > loopTimesMax) {
                  loopTimes = loopTimesMax
                }
                ele.score = ele.score * loopTimes
                ele.money = ele.money * loopTimes
              }
            })
            // 剔除积分数为0的情况
            scoreDeductionRules = scoreDeductionRules.filter((ele) => {
              return ele.score > 0
            })
            curShop.scoreDeductionRules = scoreDeductionRules
            shopList.splice(index, 1, curShop)
          }
          totalScoreToPay += res.data.score
          if (res.data.isNeedLogistics) {
            isNeedLogistics = true
          }
          allGoodsAndYunPrice += res.data.amountReal
          yunPrice += res.data.amountLogistics
          deductionMoney += res.data.deductionMoney
          couponAmount += res.data.couponAmount
        }
      }
      this.setData({
        shopList,
        totalScoreToPay,
        isNeedLogistics,
        allGoodsAndYunPrice,
        yunPrice,
        hasNoCoupons: true,
        deductionMoney,
        couponAmount,
      })
    } else {
      // 单门店单商品下单
      if (shopList && shopList.length == 1) {
        if (shopList[0].curCoupon) {
          postData.couponId = shopList[0].curCoupon.id
        } else {
          postData.couponId = ''
        }
      }
      const res = await WXAPI.orderCreate(postData)
      this.data.pageIsEnd = true
      if (res.code != 0) {
        this.data.pageIsEnd = false
        Taro.showModal({
          title: '错误',
          content: res.msg,
          showCancel: false,
        })
        this.setData({
          btnLoading: false,
        })
        return
      }
      totalRes = res
      if (!e) {
        let hasNoCoupons = true
        let coupons = null
        if (res.data.couponUserList) {
          hasNoCoupons = false
          res.data.couponUserList.forEach((ele) => {
            let moneyUnit = '元'
            if (ele.moneyType == 1) {
              moneyUnit = '%'
            }
            if (ele.moneyHreshold) {
              ele.nameExt =
                ele.name +
                ' [面值' +
                ele.money +
                moneyUnit +
                '，满' +
                ele.moneyHreshold +
                '元可用]'
            } else {
              ele.nameExt = ele.name + ' [面值' + ele.money + moneyUnit + ']'
            }
          })
          coupons = res.data.couponUserList
          if (shopList && shopList.length == 1 && !hasNoCoupons) {
            hasNoCoupons = true
            const curShop = shopList[0]
            curShop.hasNoCoupons = false
            curShop.curCouponShowText = '请选择使用优惠券'
            curShop.coupons = res.data.couponUserList
            if (res.data.couponId && res.data.couponId.length > 0) {
              curShop.curCoupon = curShop.coupons.find((ele) => {
                return ele.id == res.data.couponId[0]
              })
              curShop.curCouponShowText = curShop.curCoupon.nameExt
            }
            shopList[0] = curShop
          }
        }
        // 计算积分抵扣规则 userScore
        let scoreDeductionRules = res.data.scoreDeductionRules
        if (scoreDeductionRules) {
          // 如果可叠加，计算可抵扣的最大积分数
          scoreDeductionRules.forEach((ele) => {
            if (ele.loop) {
              let loopTimes = Math.floor(this.data.userScore / ele.score) // 按剩余积分取最大
              let loopTimesMax = Math.floor(
                (res.data.amountTotle + res.data.deductionMoney) / ele.money
              ) // 按金额取最大
              if (loopTimes > loopTimesMax) {
                loopTimes = loopTimesMax
              }
              ele.score = ele.score * loopTimes
              ele.money = ele.money * loopTimes
            }
          })
          // 剔除积分数为0的情况
          scoreDeductionRules = scoreDeductionRules.filter((ele) => {
            return ele.score > 0
          })
        }
        this.setData({
          shopList,
          totalScoreToPay: res.data.score,
          isNeedLogistics: res.data.isNeedLogistics,
          allGoodsAndYunPrice: res.data.amountReal,
          yunPrice: res.data.amountLogistics,
          hasNoCoupons,
          coupons,
          deductionMoney: res.data.deductionMoney,
          couponAmount: res.data.couponAmount,
          scoreDeductionRules,
        })
      }
    }
    if (!e) {
      this.data.pageIsEnd = false
      return
    }
    if (e && 'buyNow' != this.data.orderType) {
      // 清空购物车数据
      const keyArrays = []
      this.data.goodsList.forEach((ele) => {
        keyArrays.push(ele.key)
      })
      if (this.data.shopCarType == 0) {
        //自营购物车
        WXAPI.shippingCarInfoRemoveItem(loginToken, keyArrays.join())
      } else if (this.data.shopCarType == 1) {
        //云货架购物车
        WXAPI.jdvopCartRemove(loginToken, keyArrays.join())
      }
    }
    this.processAfterCreateOrder(totalRes)
  },
  async processAfterCreateOrder(res) {
    this.setData({
      btnLoading: false,
    })
    if (res.data.status != 0) {
      Taro.redirectTo({
        url: '/pages/order-list/index',
      })
      return
    }
    let orderId = ''
    if (res.data.orderIds && res.data.orderIds.length > 0) {
      orderId = res.data.orderIds.join()
    } else {
      orderId = res.data.id
    }
    // 直接弹出支付，取消支付的话，去订单列表
    const balance = this.data.balance
    const userScore = this.data.userScore
    if (userScore < res.data.score) {
      Taro.showModal({
        title: '提示',
        content: '您当前可用积分不足，请稍后前往订单管理进行支付',
        showCancel: false,
        success: (res2) => {
          Taro.redirectTo({
            url: '/pages/order-list/index',
          })
        },
      })
      return
    }
    if (balance || res.data.amountReal * 1 == 0) {
      // 有余额
      const money = (res.data.amountReal * 1 - balance * 1).toFixed(2)
      if (money <= 0) {
        // 余额足够
        Taro.showModal({
          title: '请确认支付',
          content: `您当前可用余额¥${balance}，使用余额支付¥${res.data.amountReal}？`,
          confirmText: '确认支付',
          cancelText: '暂不付款',
          success: (res2) => {
            if (res2.confirm) {
              // 使用余额支付
              WXAPI.orderPay(Taro.getStorageSync('token'), orderId).then(
                (res3) => {
                  if (res3.code != 0) {
                    Taro.showToast({
                      title: res3.msg,
                      icon: 'none',
                    })
                    return
                  }
                  Taro.redirectTo({
                    url: '/pages/order-list/index',
                  })
                }
              )
            } else {
              Taro.redirectTo({
                url: '/pages/order-list/index',
              })
            }
          },
        })
      } else {
        // 余额不够
        Taro.showModal({
          title: '请确认支付',
          content: `您当前可用余额¥${balance}，仍需支付¥${money}`,
          confirmText: '确认支付',
          cancelText: '暂不付款',
          success: (res2) => {
            if (res2.confirm) {
              // 使用余额支付
              wxpay.wxpay('order', money, orderId, '/pages/order-list/index')
            } else {
              Taro.redirectTo({
                url: '/pages/order-list/index',
              })
            }
          },
        })
      }
    } else {
      // 没余额
      wxpay.wxpay(
        'order',
        res.data.amountReal,
        orderId,
        '/pages/order-list/index'
      )
    }
  },
  async initShippingAddress() {
    const res = await WXAPI.defaultAddress(Taro.getStorageSync('token'))
    if (res.code == 0) {
      this.setData({
        curAddressData: res.data.info,
      })
    } else {
      this.setData({
        curAddressData: null,
      })
    }
    this.processYunfei()
  },
  processYunfei() {
    var goodsList = this.data.goodsList
    if (goodsList.length == 0) {
      return
    }
    const goodsJsonStr = []
    var isNeedLogistics = 0
    let inviter_id = 0
    let inviter_id_storge = Taro.getStorageSync('referrer')
    if (inviter_id_storge) {
      inviter_id = inviter_id_storge
    }
    for (let i = 0; i < goodsList.length; i++) {
      let carShopBean = goodsList[i]
      if (carShopBean.logistics || carShopBean.logisticsId) {
        isNeedLogistics = 1
      }
      const _goodsJsonStr = {
        propertyChildIds: carShopBean.propertyChildIds,
      }
      if (carShopBean.sku && carShopBean.sku.length > 0) {
        let propertyChildIds = ''
        carShopBean.sku.forEach((option) => {
          propertyChildIds =
            propertyChildIds +
            ',' +
            option.optionId +
            ':' +
            option.optionValueId
        })
        _goodsJsonStr.propertyChildIds = propertyChildIds
      }
      if (carShopBean.additions && carShopBean.additions.length > 0) {
        let goodsAdditionList = []
        carShopBean.additions.forEach((option) => {
          goodsAdditionList.push({
            pid: option.pid,
            id: option.id,
          })
        })
        _goodsJsonStr.goodsAdditionList = goodsAdditionList
      }
      _goodsJsonStr.goodsId = carShopBean.goodsId
      _goodsJsonStr.number = carShopBean.number
      _goodsJsonStr.logisticsType = 0
      _goodsJsonStr.inviter_id = inviter_id
      goodsJsonStr.push(_goodsJsonStr)
    }
    if (this.data.shopCarType == 1) {
      // vop 商品必须快递
      isNeedLogistics = 1
    }
    this.setData({
      isNeedLogistics: isNeedLogistics,
      goodsJsonStr: JSON.stringify(goodsJsonStr),
    })
    this.createOrder()
  },
  addAddress: function () {
    Taro.navigateTo({
      url: '/pages/address-add/index',
    })
  },
  selectAddress: function () {
    Taro.navigateTo({
      url: '/pages/select-address/index',
    })
  },
  bindChangeCoupon: function (e) {
    const selIndex = e.detail.value
    this.setData({
      curCoupon: this.data.coupons[selIndex],
      curCouponShowText: this.data.coupons[selIndex].nameExt,
    })
    this.processYunfei()
  },
  bindChangeCouponShop: function (e) {
    const selIndex = e.detail.value
    const shopIndex = e.currentTarget.dataset.sidx
    const shopList = this.data.shopList
    const curshop = shopList[shopIndex]
    curshop.curCoupon = curshop.coupons[selIndex]
    curshop.curCouponShowText = curshop.coupons[selIndex].nameExt
    shopList.splice(shopIndex, 1, curshop)
    this.setData({
      shopList,
    })
    this.processYunfei()
  },
  radioChange(e) {
    this.setData({
      peisongType: e.detail.value,
    })
    this.processYunfei()
    if (e.detail.value == 'zq') {
      this.fetchShops()
    }
  },
  dyChange(e) {
    this.setData({
      dyopen: e.detail.value,
    })
  },
  dyunitChange(e) {
    this.setData({
      dyunit: e.detail.value,
    })
  },
  cancelLogin() {
    Taro.navigateBack()
  },
  async fetchShops() {
    const res = await WXAPI.fetchShops()
    if (res.code == 0) {
      let shopIndex = this.data.shopIndex
      const shopInfo = Taro.getStorageSync('shopInfo')
      if (shopInfo) {
        shopIndex = res.data.findIndex((ele) => {
          return ele.id == shopInfo.id
        })
      }
      this.setData({
        shops: res.data,
        shopIndex,
      })
    }
  },
  shopSelect(e) {
    this.setData({
      shopIndex: e.detail.value,
    })
  },
  goMap() {
    const _this = this
    const shop = this.data.shops[this.data.shopIndex]
    const latitude = shop.latitude
    const longitude = shop.longitude
    Taro.openLocation({
      latitude,
      longitude,
      scale: 18,
    })
  },
  callMobile() {
    const shop = this.data.shops[this.data.shopIndex]
    Taro.makePhoneCall({
      phoneNumber: shop.linkPhone,
    })
  },
  async getUserApiInfo() {
    const res = await WXAPI.userDetail(Taro.getStorageSync('token'))
    if (res.code == 0) {
      this.setData({
        bindMobileStatus: res.data.base.mobile ? 1 : 2,
        // 账户绑定的手机号码状态
        mobile: res.data.base.mobile,
      })
    }
  },
  async getPhoneNumber(e) {
    if (!e.detail.errMsg || e.detail.errMsg != 'getPhoneNumber:ok') {
      Taro.showToast({
        title: e.detail.errMsg,
        icon: 'none',
      })
      return
    }
    let res
    const extConfigSync = Taro.getExtConfigSync()
    if (extConfigSync.subDomain) {
      // 服务商模式
      res = await WXAPI.wxappServiceBindMobile({
        token: Taro.getStorageSync('token'),
        code: this.data.code,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
      })
    } else {
      res = await WXAPI.bindMobileWxappV2(
        Taro.getStorageSync('token'),
        e.detail.code
      )
    }
    if (res.code == 0) {
      Taro.showToast({
        title: '读取成功',
        icon: 'success',
      })
      this.setData({
        mobile: res.data,
        bindMobileStatus: 1,
      })
    } else {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
    }
  },
  deductionScoreChange(event) {
    this.setData({
      deductionScore: event.detail,
    })
    this.processYunfei()
  },
  deductionScoreClick(event) {
    const { name } = event.currentTarget.dataset
    this.setData({
      deductionScore: name,
    })
    this.processYunfei()
  },
  cardChange(event) {
    this.setData({
      cardId: event.detail,
    })
    this.processYunfei()
  },
  cardClick(event) {
    const { name } = event.currentTarget.dataset
    this.setData({
      cardId: name,
    })
    this.processYunfei()
  },
  dateStartclick(e) {
    this.setData({
      dateStartpop: true,
    })
  },
  dateStartconfirm(e) {
    const d = new Date(e.detail)
    this.setData({
      dateStart: d.format('yyyy-MM-dd h:m:s'),
      dateStartpop: false,
    })
    console.log(e)
  },
  dateStartcancel(e) {
    this.setData({
      dateStartpop: false,
    })
  },
  async cardMyList() {
    const res = await WXAPI.cardMyList(Taro.getStorageSync('token'))
    if (res.code == 0) {
      const myCards = res.data.filter((ele) => {
        return ele.status == 0 && ele.amount > 0 && ele.cardInfo.refs
      })
      if (myCards.length > 0) {
        this.setData({
          myCards: res.data,
        })
      }
    }
  },
})
class _C extends React.Component {
  render() {
    const {
      bindMobileStatus,
      orderType,
      shopList,
      goodsList,
      peisongType,
      shopCarType,
      isNeedLogistics,
      shops,
      curAddressData,
      name,
      mobile,
      dyopen,
      orderPeriod_open,
      dyunit,
      dyduration,
      dytimes,
      dateStart,
      hasNoCoupons,
      coupons,
      curCouponShowText,
      scoreDeductionRules,
      deductionScore,
      myCards,
      cardId,
      yunPrice,
      deductionMoney,
      couponAmount,
      balance,
      order_pay_user_balance,
      allGoodsAndYunPrice,
      totalScoreToPay,
      btnLoading,
      dateStartpop,
      currentDate,
      minDate,
      maxDate,
      formatter,
    } = this.data
    return (
      <Block>
        {bindMobileStatus == 2 && (
          <Block>
            <View className="login-box">
              <Image
                className="logo"
                src={require('../../images/wx.jpg')}
                mode="widthFix"
              ></Image>
              <View className="line"></View>
              <View className="title">申请获取以下权限</View>
              <View className="profile">授权绑定手机号码</View>
              <View className="btn">
                <VanButton
                  type="primary"
                  block
                  round
                  openType="getPhoneNumber"
                  onGetphonenumber={this.getPhoneNumber}
                >
                  绑定手机号码
                </VanButton>
              </View>
            </View>
          </Block>
        )}
        {bindMobileStatus == 1 && (
          <Block>
            {orderType != 'buyNow' ? (
              <Block>
                {shopList.map((shop, shopIndex) => {
                  return (
                    <VanCellGroup key={shop.id} title={shop.name}>
                      {item.shopId == shop.id && (
                        <Block>
                          {goodsList.map((item, index) => {
                            return (
                              <VanCard
                                key={item.index}
                                num={item.number}
                                price={item.price}
                                title={item.name}
                                thumb={item.pic}
                                centered
                                renderDesc={
                                  <Block>
                                    <View>
                                      {item.label}
                                      {item.sku.map((option, index) => {
                                        return (
                                          <Block key={option.index}>
                                            {option.optionName +
                                              ':' +
                                              option.optionValueName}
                                          </Block>
                                        )
                                      })}
                                      {item.additions.map((option, index) => {
                                        return (
                                          <Block key={option.index}>
                                            {option.pname + ':' + option.name}
                                          </Block>
                                        )
                                      })}
                                    </View>
                                  </Block>
                                }
                              ></VanCard>
                            )
                          })}
                        </Block>
                      )}
                      {!shop.hasNoCoupons && (
                        <View className="peisong-way">
                          <View className="row-box" style="border-bottom:none;">
                            <View className="row-label t">使用优惠券</View>
                          </View>
                          <Picker
                            data-sidx={shopIndex}
                            onChange={this.bindChangeCouponShop}
                            range={shop.coupons}
                            rangeKey="nameExt"
                          >
                            <View
                              className="row-box"
                              style="border-bottom:none;"
                            >
                              <View className="row-label">
                                {shop.curCouponShowText}
                              </View>
                              <Image
                                className="next"
                                src={require('../../images/icon/next.png')}
                              ></Image>
                            </View>
                          </Picker>
                        </View>
                      )}
                    </VanCellGroup>
                  )
                })}
              </Block>
            ) : (
              <Block>
                {goodsList.map((item, index) => {
                  return (
                    <VanCard
                      key={item.index}
                      num={item.number}
                      price={item.price}
                      title={item.name}
                      thumb={item.pic}
                      centered
                      renderDesc={
                        <Block>
                          <View>
                            {item.label}
                            {item.sku.map((option, index) => {
                              return (
                                <Block key={option.index}>
                                  {option.optionName +
                                    ':' +
                                    option.optionValueName}
                                </Block>
                              )
                            })}
                            {item.additions.map((option, index) => {
                              return (
                                <Block key={option.index}>
                                  {option.pname + ':' + option.name}
                                </Block>
                              )
                            })}
                          </View>
                        </Block>
                      }
                    ></VanCard>
                  )
                })}
              </Block>
            )}
            <View className="container-box cell-group">
              <View className="peisong-way">
                {shopCarType == 0 && isNeedLogistics > 0 && (
                  <VanCell
                    title="配送方式"
                    renderTestSlot={
                      <Block>
                        <View>
                          <RadioGroup onChange={this.radioChange}>
                            <Label className="radio">
                              <Radio
                                value="kd"
                                checked={peisongType == 'kd'}
                              ></Radio>
                              快递
                            </Label>
                            <Label className="radio">
                              <Radio
                                value="zq"
                                checked={peisongType == 'zq'}
                              ></Radio>
                              到店自取
                            </Label>
                          </RadioGroup>
                        </View>
                      </Block>
                    }
                  ></VanCell>
                )}
                {shopCarType == 1 && <VanCell title="配送地址"></VanCell>}
                {peisongType == 'zq' && shops && (
                  <Picker
                    onChange={this.shopSelect}
                    value={shopIndex}
                    range={shops}
                    rangeKey="name"
                  >
                    <VanCell
                      title="选择自提门店"
                      value={shopIndex == -1 ? '请选择' : shops[shopIndex].name}
                      required
                      isLink
                    ></VanCell>
                  </Picker>
                )}
                {peisongType == 'zq' && shopIndex != -1 && (
                  <VanCell
                    title="电话"
                    value={shops[shopIndex].linkPhone}
                    isLink
                    onClick={this.callMobile}
                  ></VanCell>
                )}
                {peisongType == 'zq' && shopIndex != -1 && (
                  <VanCell
                    title="地址"
                    titleWidth="64rpx"
                    value={shops[shopIndex].address}
                    isLink
                    onClick={this.goMap}
                  ></VanCell>
                )}
                {peisongType == 'kd' && isNeedLogistics > 0 && (
                  <View className="address-box">
                    {!curAddressData && (
                      <VanCell
                        icon="add-o"
                        title="新增收货地址"
                        isLink
                        onClick={this.addAddress}
                      ></VanCell>
                    )}
                    {!!curAddressData && (
                      <View
                        className="show-address"
                        onClick={this.selectAddress}
                      >
                        <View className="l">
                          <View className="name-tel">
                            {curAddressData.linkMan +
                              ' ' +
                              curAddressData.mobile}
                          </View>
                          <View className="addr-text">
                            {curAddressData.address}
                          </View>
                        </View>
                        <View className="r">
                          <Image
                            className="next"
                            src={require('../../images/icon/next.png')}
                          ></Image>
                        </View>
                      </View>
                    )}
                  </View>
                )}
                {peisongType == 'zq' && (
                  <VanField
                    size="large"
                    modelValue={name}
                    label="联系人"
                    focus
                    clearable
                    required
                    placeholder="请输入联系人"
                  ></VanField>
                )}
                {peisongType == 'zq' && (
                  <VanField
                    size="large"
                    modelValue={mobile}
                    label="联系电话"
                    type="number"
                    clearable
                    required
                    placeholder="请输入手机号码"
                    renderButton={
                      <Block>
                        <VanButton
                          size="small"
                          type="danger"
                          openType="getPhoneNumber"
                          onGetphonenumber={this.getPhoneNumber}
                        >
                          自动获取
                        </VanButton>
                      </Block>
                    }
                  ></VanField>
                )}
                {shopCarType == 0 && (
                  <View className="row-box">
                    <View className="row-label">备注</View>
                    <View className="right-text">
                      <Input
                        onInput={this.remarkChange}
                        type="text"
                        className="liuyan"
                        placeholder="如需备注请输入"
                      ></Input>
                    </View>
                  </View>
                )}
                {orderPeriod_open == 1 && (
                  <VanCell
                    title="订阅"
                    renderTestSlot={
                      <Block>
                        <View>
                          <RadioGroup onChange={this.dyChange}>
                            <Label className="radio">
                              <Radio value="1" checked={dyopen == 1}></Radio>
                              开启
                            </Label>
                            <Label className="radio">
                              <Radio value="0" checked={dyopen == 0}></Radio>
                              关闭
                            </Label>
                          </RadioGroup>
                        </View>
                      </Block>
                    }
                  ></VanCell>
                )}
                {dyopen == 1 && (
                  <VanCell
                    title="订阅周期"
                    renderTestSlot={
                      <Block>
                        <View>
                          <RadioGroup onChange={this.dyunitChange}>
                            <Label className="radio">
                              <Radio value="0" checked={dyunit == 0}></Radio>天
                            </Label>
                            <Label className="radio">
                              <Radio value="1" checked={dyunit == 1}></Radio>月
                            </Label>
                            <Label className="radio">
                              <Radio value="2" checked={dyunit == 2}></Radio>年
                            </Label>
                          </RadioGroup>
                        </View>
                      </Block>
                    }
                  ></VanCell>
                )}
                {dyopen == 1 && (
                  <VanField
                    label="订阅间隔"
                    modelValue={dyduration}
                    type="number"
                    placeholder="请输入数字"
                    inputAlign="right"
                    useButtonSlot
                    renderButton={
                      <Block>
                        <View>
                          {(dyunit == 0 ? '天' : '') +
                            ' ' +
                            (dyunit == 1 ? '月' : '') +
                            ' ' +
                            (dyunit == 2 ? '年' : '')}
                        </View>
                      </Block>
                    }
                  ></VanField>
                )}
                {dyopen == 1 && (
                  <VanField
                    label="订阅次数"
                    modelValue={dytimes}
                    type="number"
                    placeholder="请输入数字"
                    inputAlign="right"
                    useButtonSlot
                    renderButton={
                      <Block>
                        <View>次</View>
                      </Block>
                    }
                  ></VanField>
                )}
                {dyopen == 1 && (
                  <VanField
                    label="首次扣费"
                    isLink
                    readonly
                    value={dateStart}
                    type="number"
                    placeholder="请输入数字"
                    inputAlign="right"
                    onClickInput={this.dateStartclick}
                  ></VanField>
                )}
              </View>
              {!hasNoCoupons && (
                <View className="peisong-way">
                  <View className="row-box" style="border-bottom:none;">
                    <View className="row-label t">使用优惠券</View>
                  </View>
                  <Picker
                    onChange={this.bindChangeCoupon}
                    range={coupons}
                    rangeKey="nameExt"
                  >
                    <View className="row-box" style="border-bottom:none;">
                      <View className="row-label">{curCouponShowText}</View>
                      <Image
                        className="next"
                        src={require('../../images/icon/next.png')}
                      ></Image>
                    </View>
                  </Picker>
                </View>
              )}
            </View>
            {/*  选择积分抵扣  */}
            {scoreDeductionRules && scoreDeductionRules.length > 0 && (
              <VanRadioGroup
                value={deductionScore}
                onChange={this.deductionScoreChange}
              >
                <VanCellGroup title="积分抵扣">
                  <VanCell
                    title="不使用积分"
                    clickable
                    data-name="-1"
                    onClick={this.deductionScoreClick}
                    renderRighticon={
                      <Block>
                        <VanRadio name="-1"></VanRadio>
                      </Block>
                    }
                  ></VanCell>
                  <VanCell
                    title="自动抵扣"
                    clickable
                    data-name="0"
                    onClick={this.deductionScoreClick}
                    renderRighticon={
                      <Block>
                        <VanRadio name="0"></VanRadio>
                      </Block>
                    }
                  ></VanCell>
                  {scoreDeductionRules.map((item, index) => {
                    return (
                      <VanCell
                        key={item.id}
                        title={'使用' + item.score + '积分抵扣¥' + item.money}
                        clickable
                        data-name={item.score}
                        onClick={this.deductionScoreClick}
                        renderRighticon={
                          <Block>
                            <VanRadio name={item.score}></VanRadio>
                          </Block>
                        }
                      ></VanCell>
                    )
                  })}
                </VanCellGroup>
              </VanRadioGroup>
            )}
            {myCards && (
              <VanRadioGroup value={cardId} onChange={this.cardChange}>
                <VanCellGroup title="使用水卡支付">
                  <VanCell
                    title="不使用水卡"
                    clickable
                    data-name="0"
                    onClick={this.cardClick}
                    renderRighticon={
                      <Block>
                        <VanRadio name="0"></VanRadio>
                      </Block>
                    }
                  ></VanCell>
                  {myCards.map((item, index) => {
                    return (
                      <VanCell
                        key={item.id}
                        title={
                          item.cardInfo.name + ' - 剩余：' + item.amount + '桶'
                        }
                        clickable
                        data-name={item.id}
                        onClick={this.cardClick}
                        renderRighticon={
                          <Block>
                            <VanRadio name={item.id}></VanRadio>
                          </Block>
                        }
                      ></VanCell>
                    )
                  })}
                </VanCellGroup>
              </VanRadioGroup>
            )}
            {(yunPrice || deductionMoney || couponAmount || balance) && (
              <VanCellGroup title="小计">
                {yunPrice && (
                  <VanCell title="运费" value={'¥' + yunPrice}></VanCell>
                )}
                {deductionMoney && (
                  <VanCell
                    title="积分抵扣"
                    value={'-¥' + deductionMoney}
                  ></VanCell>
                )}
                {couponAmount && (
                  <VanCell
                    title="优惠金额"
                    value={'-¥' + couponAmount}
                  ></VanCell>
                )}
                {order_pay_user_balance == '1' && balance && (
                  <VanCell title="账户余额" value={'¥' + balance}></VanCell>
                )}
              </VanCellGroup>
            )}
            <View className="bottom-box"></View>
            <VanSubmitBar
              price={allGoodsAndYunPrice * 100}
              suffixLabel={
                totalScoreToPay ? '+' + totalScoreToPay + ' 积分' : ''
              }
              buttonText="提交订单"
              loading={btnLoading}
              onSubmit={this.goCreateOrder}
            ></VanSubmitBar>
          </Block>
        )}
        <VanPopup show={dateStartpop} position="bottom">
          <VanDatetimePicker
            type="datetime"
            value={currentDate}
            minDate={minDate}
            maxDate={maxDate}
            formatter={formatter}
            onConfirm={this.dateStartconfirm}
            onCancel={this.dateStartcancel}
          ></VanDatetimePicker>
        </VanPopup>
      </Block>
    )
  }
}
export default _C
