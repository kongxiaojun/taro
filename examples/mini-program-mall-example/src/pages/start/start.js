import {
  Block,
  Swiper,
  SwiperItem,
  Image,
  View,
  Button,
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
import './start.scss'
import WXAPI from '../../apifm-wxapi'
const CONFIG = require('../../config.js')
const AUTH = require('../../utils/auth.js')
@withWeapp({
  data: {
    banners: [],
    swiperMaxNumber: 0,
    swiperCurrent: 0,
  },
  onLoad(e) {
    // e.shopId = 6040 // 测试，测试完了注释掉
    this.data.shopId = e.shopId
    this.readConfigVal()
    // 补偿写法
    Taro.getApp().configLoadOK = () => {
      this.readConfigVal()
    }
  },
  onShow: function () {},
  async readConfigVal() {
    const mallName = Taro.getStorageSync('mallName')
    if (!mallName) {
      return
    }
    Taro.setNavigationBarTitle({
      title: Taro.getStorageSync('mallName'),
    })
    let shopMod = Taro.getStorageSync('shopMod')
    if (!shopMod) {
      shopMod = 0
    }
    const app_show_pic_version = Taro.getStorageSync('app_show_pic_version')
    if (app_show_pic_version && app_show_pic_version == CONFIG.version) {
      if (shopMod == 1) {
        this.goShopSelectPage()
      } else {
        Taro.switchTab({
          url: '/pages/index/index',
        })
      }
    } else {
      // 展示启动页
      const res = await WXAPI.banners({
        type: 'app',
      })
      if (res.code == 700) {
        if (shopMod == 1) {
          this.goShopSelectPage()
        } else {
          Taro.switchTab({
            url: '/pages/index/index',
          })
        }
      } else {
        this.setData({
          banners: res.data,
          swiperMaxNumber: res.data.length,
        })
      }
    }
  },
  swiperchange: function (e) {
    //console.log(e.detail.current)
    this.setData({
      swiperCurrent: e.detail.current,
    })
  },
  goToIndex: function (e) {
    let shopMod = Taro.getStorageSync('shopMod')
    if (!shopMod) {
      shopMod = 0
    }
    if (Taro.getApp().globalData.isConnected) {
      Taro.setStorage({
        key: 'app_show_pic_version',
        data: CONFIG.version,
      })
      if (shopMod == 1) {
        this.goShopSelectPage()
      } else {
        Taro.switchTab({
          url: '/pages/index/index',
        })
      }
    } else {
      Taro.showToast({
        title: '当前无网络',
        icon: 'none',
      })
    }
  },
  imgClick() {
    if (this.data.swiperCurrent + 1 != this.data.swiperMaxNumber) {
      Taro.showToast({
        title: '左滑进入',
        icon: 'none',
      })
    }
  },
  async goShopSelectPage() {
    if (!this.data.shopId) {
      Taro.redirectTo({
        url: '/pages/shop/select',
      })
      return
    }
    // 有传入门店ID
    const res = await WXAPI.shopSubdetail(this.data.shopId)
    if (res.code != 0) {
      Taro.redirectTo({
        url: '/pages/shop/select',
      })
      return
    }
    Taro.setStorageSync('shopInfo', res.data.info)
    Taro.setStorageSync('shopIds', res.data.info.id)
    Taro.switchTab({
      url: '/pages/index/index',
    })
  },
})
class _C extends React.Component {
  render() {
    const { banners, swiperCurrent, swiperMaxNumber } = this.data
    console.log("start render", banners)
    return (
      <Block>
        <Swiper
          className="swiper_box"
          style={{height: '100vh'}}
          onChange={this.swiperchange}
          indicatorDots="true"
          indicatorActiveColor="#fff"
        >
          {banners.map((item, index) => {
            return (
              <SwiperItem key={item.id}>
                <Image
                  mode="aspectFill"
                  onClick={this.imgClick}
                  style={{width: '100%', height: '100%'}}
                  src={item.picUrl}
                ></Image>
              </SwiperItem>
            )
          })}
        </Swiper>
        <View className="btn" style={{zIndex: 10}}>
          {swiperCurrent + 1 == swiperMaxNumber && (
            <Button type="primary" size="mini" onClick={this.goToIndex}>
              进入店铺
            </Button>
          )}
        </View>
      </Block>
    )
  }
}
export default _C
