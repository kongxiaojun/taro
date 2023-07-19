import { Block, View, Radio, Image, Input, Navigator } from '@tarojs/components'
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
import CartGoodsListTmpl from '../../imports/CartGoodsListTmpl.js'
import NoGoodsTmpl from '../../imports/NoGoodsTmpl.js'
import './index.scss'
import WXAPI from '../../apifm-wxapi'
const TOOLS = require('../../utils/tools.js')
const AUTH = require('../../utils/auth.js')
const app = Taro.getApp()
@withWeapp({
  data: {
    shopCarType: 0,
    //0自营 1云货架
    saveHidden: true,
    allSelect: true,
    delBtnWidth: 120, //删除按钮宽度单位（rpx）
  },

  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0
    try {
      var res = Taro.getSystemInfoSync().windowWidth
      var scale = 750 / 2 / (w / 2)
      // console.log(scale);
      real = Math.floor(res / scale)
      return real
    } catch (e) {
      return false
      // Do something when catch error
    }
  },

  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth)
    this.setData({
      delBtnWidth: delBtnWidth,
    })
  },
  onLoad: function () {
    this.initEleWidth()
    this.onShow()
    this.setData({
      shopping_cart_vop_open: Taro.getStorageSync('shopping_cart_vop_open'),
    })
  },
  onShow: function () {
    this.shippingCarInfo()
  },
  async shippingCarInfo() {
    const token = Taro.getStorageSync('token')
    if (!token) {
      return
    }
    if (this.data.shopCarType == 0) {
      //自营购物车
      var res = await WXAPI.shippingCarInfo(token)
    } else if (this.data.shopCarType == 1) {
      //云货架购物车
      var res = await WXAPI.jdvopCartInfo(token)
    }
    if (res.code == 0) {
      if (this.data.shopCarType == 0) {
        //自营商品
        res.data.items.forEach((ele) => {
          if (!ele.stores || ele.status == 1) {
            ele.selected = false
          }
        })
      }
      this.setData({
        shippingCarInfo: res.data,
      })
    } else {
      this.setData({
        shippingCarInfo: null,
      })
    }
  },
  toIndexPage: function () {
    Taro.switchTab({
      url: '/pages/index/index',
    })
  },
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        startX: e.touches[0].clientX,
      })
    }
  },
  touchM: function (e) {
    const index = e.currentTarget.dataset.index
    if (e.touches.length == 1) {
      var moveX = e.touches[0].clientX
      var disX = this.data.startX - moveX
      var delBtnWidth = this.data.delBtnWidth
      var left = ''
      if (disX == 0 || disX < 0) {
        //如果移动距离小于等于0，container位置不变
        left = 'margin-left:0px'
      } else if (disX > 0) {
        //移动距离大于0，container left值等于手指移动距离
        left = 'margin-left:-' + disX + 'px'
        if (disX >= delBtnWidth) {
          left = 'left:-' + delBtnWidth + 'px'
        }
      }
      this.data.shippingCarInfo.items[index].left = left
      this.setData({
        shippingCarInfo: this.data.shippingCarInfo,
      })
    }
  },
  touchE: function (e) {
    var index = e.currentTarget.dataset.index
    if (e.changedTouches.length == 1) {
      var endX = e.changedTouches[0].clientX
      var disX = this.data.startX - endX
      var delBtnWidth = this.data.delBtnWidth
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var left =
        disX > delBtnWidth / 2
          ? 'margin-left:-' + delBtnWidth + 'px'
          : 'margin-left:0px'
      this.data.shippingCarInfo.items[index].left = left
      this.setData({
        shippingCarInfo: this.data.shippingCarInfo,
      })
    }
  },
  async delItem(e) {
    const key = e.currentTarget.dataset.key
    this.delItemDone(key)
  },
  async delItemDone(key) {
    const token = Taro.getStorageSync('token')
    if (this.data.shopCarType == 0) {
      var res = await WXAPI.shippingCarInfoRemoveItem(token, key)
    }
    if (this.data.shopCarType == 1) {
      var res = await WXAPI.jdvopCartRemove(token, key)
    }
    if (res.code != 0 && res.code != 700) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
    } else {
      this.shippingCarInfo()
      TOOLS.showTabBarBadge()
    }
  },
  async jiaBtnTap(e) {
    const index = e.currentTarget.dataset.index
    const item = this.data.shippingCarInfo.items[index]
    const number = item.number + 1
    const token = Taro.getStorageSync('token')
    if (this.data.shopCarType == 0) {
      var res = await WXAPI.shippingCarInfoModifyNumber(token, item.key, number)
    } else if (this.data.shopCarType == 1) {
      var res = await WXAPI.jdvopCartModifyNumber(token, item.key, number)
    }
    this.shippingCarInfo()
  },
  async jianBtnTap(e) {
    const index = e.currentTarget.dataset.index
    const item = this.data.shippingCarInfo.items[index]
    const number = item.number - 1
    if (number <= 0) {
      // 弹出删除确认
      Taro.showModal({
        content: '确定要删除该商品吗？',
        success: (res) => {
          if (res.confirm) {
            this.delItemDone(item.key)
          }
        },
      })
      return
    }
    const token = Taro.getStorageSync('token')
    if (this.data.shopCarType == 0) {
      var res = await WXAPI.shippingCarInfoModifyNumber(token, item.key, number)
    }
    if (this.data.shopCarType == 1) {
      var res = await WXAPI.jdvopCartModifyNumber(token, item.key, number)
    }
    this.shippingCarInfo()
  },
  changeCarNumber(e) {
    const key = e.currentTarget.dataset.key
    const num = e.detail.value
    const token = Taro.getStorageSync('token')
    if (this.data.shopCarType == 0) {
      WXAPI.shippingCarInfoModifyNumber(token, key, num).then((res) => {
        this.shippingCarInfo()
      })
    } else if (this.data.shopCarType == 1) {
      WXAPI.jdvopCartModifyNumber(token, key, num).then((res) => {
        this.shippingCarInfo()
      })
    }
  },
  async radioClick(e) {
    var index = e.currentTarget.dataset.index
    var item = this.data.shippingCarInfo.items[index]
    const token = Taro.getStorageSync('token')
    if (this.data.shopCarType == 0) {
      //自营购物车
      if (!item.stores || item.status == 1) {
        return
      }
      var res = await WXAPI.shippingCartSelected(
        token,
        item.key,
        !item.selected
      )
    } else if (this.data.shopCarType == 1) {
      //云货架购物车
      var res = await WXAPI.jdvopCartSelect(token, item.key, !item.selected)
    }
    this.shippingCarInfo()
  },
  onChange(event) {
    this.setData({
      shopCarType: event.detail.name,
    })
    this.shippingCarInfo()
  },
})
class _C extends React.Component {
  render() {
    const {
      shopCarType,
      shippingCarInfo,
      saveHidden,
      allSelect,
      noSelect,
      shopping_cart_vop_open,
    } = this.data
    return (
      <View className="container">
        {shopping_cart_vop_open == 1 ? (
          <VanTabs
            customClass="vtabs"
            shopCarType={shopCarType}
            onChange={this.onChange}
          >
            <VanTab title="自营商品">
              <Block>
                {(shippingCarInfo && shippingCarInfo.items.length > 0) ? (
                  <CartGoodsListTmpl
                    data={
                      (shippingCarInfo,
                      saveHidden,
                      allSelect,
                      noSelect,
                      shopCarType)
                    }
                  ></CartGoodsListTmpl>
                ) : (
                  <NoGoodsTmpl
                    data={
                      (shippingCarInfo,
                      saveHidden,
                      allSelect,
                      noSelect,
                      shopCarType)
                    }
                  ></NoGoodsTmpl>
                )}
              </Block>
            </VanTab>
            <VanTab title="云货架">
              <Block>
                {(shippingCarInfo && shippingCarInfo.items.length > 0) ? (
                  <CartGoodsListTmpl
                    data={
                      (shippingCarInfo,
                      saveHidden,
                      allSelect,
                      noSelect,
                      shopCarType)
                    }
                  ></CartGoodsListTmpl>
                ) : (
                  <NoGoodsTmpl
                    data={
                      (shippingCarInfo,
                      saveHidden,
                      allSelect,
                      noSelect,
                      shopCarType)
                    }
                  ></NoGoodsTmpl>
                )}
              </Block>
            </VanTab>
          </VanTabs>
        ) : (
          <Block>
            {(shippingCarInfo && shippingCarInfo.items.length > 0) ? (
              <CartGoodsListTmpl
                data={
                  (shippingCarInfo,
                  saveHidden,
                  allSelect,
                  noSelect,
                  shopCarType)
                }
              ></CartGoodsListTmpl>
            ) : (
              <NoGoodsTmpl
                data={
                  (shippingCarInfo,
                  saveHidden,
                  allSelect,
                  noSelect,
                  shopCarType)
                }
              ></NoGoodsTmpl>
            )}
          </Block>
        )}
      </View>
    )
  }
}
export default _C
