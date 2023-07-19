import { Block, View, Image, Input, Text, Button } from '@tarojs/components'
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
import './select.scss'
import WXAPI from '../../apifm-wxapi'
const AUTH = require('../../utils/auth.js')
const APP = Taro.getApp()
@withWeapp({
  /**
   * 页面的初始数据
   */
  data: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    Taro.getLocation({
      type: 'gcj02',
      //wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: (res) => {
        this.data.latitude = res.latitude
        this.data.longitude = res.longitude
        this.fetchShops(res.latitude, res.longitude, '')
      },
      fail(e) {
        console.error(e)
        AUTH.checkAndAuthorize('scope.userLocation')
      },
    })
  },
  async fetchShops(latitude, longitude, kw) {
    const res = await WXAPI.fetchShops({
      curlatitude: latitude,
      curlongitude: longitude,
      nameLike: kw,
    })
    if (res.code == 0) {
      res.data.forEach((ele) => {
        ele.distance = ele.distance.toFixed(3) // 距离保留3位小数
      })

      this.setData({
        shops: res.data,
      })
    } else {
      this.setData({
        shops: null,
      })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  searchChange(event) {
    this.setData({
      searchValue: event.detail.value,
    })
  },
  search(event) {
    console.log('search')
    this.setData({
      searchValue: event.detail.value,
    })
    this.fetchShops(this.data.latitude, this.data.longitude, event.detail.value)
  },
  goShop(e) {
    const idx = e.currentTarget.dataset.idx
    Taro.setStorageSync('shopInfo', this.data.shops[idx])
    Taro.setStorageSync('shopIds', this.data.shops[idx].id)
    Taro.setStorageSync('refreshIndex', 1)
    Taro.switchTab({
      url: '/pages/index/index',
    })
  },
})
class _C extends React.Component {
  render() {
    const { shops } = this.data
    return (
      <Block>
        <View className="search">
          <Image
            className="icon"
            src={require('../../images/icon/search.svg')}
          ></Image>
          <Input
            placeholder="搜索门店"
            onInput={this.searchChange}
            onConfirm={this.search}
          ></Input>
        </View>
        {shops.map((item, index) => {
          return (
            <View className="shops" key={item.id}>
              <View className="t">
                <View className="name">
                  <Image
                    src={
                      '/images/icon/' +
                      (index == 0 ? 'shop-on' : 'shop') +
                      '.svg'
                    }
                  ></Image>
                  <Text style={'color:' + (index == 0 ? '#FEB21C' : '#333333')}>
                    {item.name}
                  </Text>
                </View>
                {index == 0 && (
                  <View className="distance">
                    {item.distance}
                    <Text>km</Text>
                  </View>
                )}
              </View>
              <View className="p">
                <Image src={require('../../images/icon/pos-gray.svg')}></Image>
                <Text>{item.address}</Text>
              </View>
              <View className="p">
                <Image src={require('../../images/icon/time-gray.svg')}></Image>
                <Text>{item.openingHours}</Text>
              </View>
              <View className="p">
                <Image src={require('../../images/icon/tel-gray.svg')}></Image>
                <Text>{item.linkPhone}</Text>
              </View>
              {index > 0 && (
                <View
                  className="distance-black"
                  onClick={this.goShop}
                  data-idx={index}
                >
                  <Text className="d">{item.distance}</Text>
                  <Text className="u">km</Text>
                  <Image src={require('../../images/icon/next.svg')}></Image>
                </View>
              )}
              {index == 0 && (
                <Button
                  className="goHotel"
                  type="default"
                  onClick={this.goShop}
                  data-idx={index}
                >
                  进入门店
                </Button>
              )}
            </View>
          )
        })}
      </Block>
    )
  }
}
export default _C
