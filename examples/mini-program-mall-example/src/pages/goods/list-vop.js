import { Block, View, Input, Image, Navigator, Text } from '@tarojs/components'
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
import goodsDetailPage from '../../imports/goodsDetailPage4.js'
import './list-vop.scss'
import WXAPI from '../../apifm-wxapi'
const AUTH = require('../../utils/auth.js')
@withWeapp({
  /**
   * 页面的初始数据
   */
  data: {
    listType: 1,
    // 1为1个商品一行，2为2个商品一行
    name: '',
    // 搜索关键词
    orderBy: '',
    // 排序规则
    page: 1, // 读取第几页
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      name: options.name,
      cid1: options.cid1,
      cid2: options.cid2,
    })
    this.search()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  async search() {
    if (!this.data.cid1 && !this.data.cid2) {
      return
    }
    Taro.showLoading({
      title: '加载中',
    })
    const _data = {
      sortType: this.data.orderBy,
      page: this.data.page,
      pageSize: 20,
    }
    if (this.data.name) {
      _data.keyword = this.data.name
    }
    if (this.data.cid1) {
      _data.cid1 = this.data.cid1
    }
    if (this.data.cid2) {
      _data.cid2 = this.data.cid2
    }
    const res = await WXAPI.jdvopGoodsList(_data)
    Taro.hideLoading()
    if (res.code == 0) {
      res.data.result.forEach((ele) => {
        ele.pic = res.data.imageDomain + ele.pic
      })
      if (this.data.page == 1) {
        this.setData({
          goods: res.data.result,
        })
      } else {
        this.setData({
          goods: this.data.goods.concat(res.data.result),
        })
      }
    } else {
      if (this.data.page == 1) {
        this.setData({
          goods: null,
        })
      } else {
        Taro.showToast({
          title: '没有更多了',
          icon: 'none',
        })
      }
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
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1,
    })
    this.search()
  },
  changeShowType() {
    if (this.data.listType == 1) {
      this.setData({
        listType: 2,
      })
    } else {
      this.setData({
        listType: 1,
      })
    }
  },
  bindinput(e) {
    this.setData({
      name: e.detail.value,
    })
  },
  bindconfirm(e) {
    this.setData({
      page: 1,
      name: e.detail.value,
    })
    this.search()
  },
  filter(e) {
    this.setData({
      page: 1,
      orderBy: e.currentTarget.dataset.val,
    })
    this.search()
  },
  async addShopCar(e) {
    const curGood = this.data.goods.find((ele) => {
      return ele.id == e.currentTarget.dataset.id
    })
    if (!curGood) {
      return
    }
    if (curGood.stores <= 0) {
      Taro.showToast({
        title: '已售罄~',
        icon: 'none',
      })
      return
    }
    this.addShopCarCheck({
      goodsId: curGood.id,
      buyNumber: 1,
      sku: [],
    })
  },
  async addShopCarCheck(options) {
    AUTH.checkHasLogined().then((isLogined) => {
      this.setData({
        wxlogin: isLogined,
      })
      if (isLogined) {
        // 处理加入购物车的业务逻辑
        this.addShopCarDone(options)
      }
    })
  },
  async addShopCarDone(options) {
    const res = await WXAPI.shippingCarInfoAddItem(
      Taro.getStorageSync('token'),
      options.goodsId,
      options.buyNumber,
      options.sku
    )
    if (res.code == 30002) {
      // 需要选择规格尺寸
      const skuCurGoodsRes = await WXAPI.goodsDetail(options.goodsId)
      if (skuCurGoodsRes.code != 0) {
        Taro.showToast({
          title: skuCurGoodsRes.msg,
          icon: 'none',
        })
        return
      }
      const skuCurGoods = skuCurGoodsRes.data
      skuCurGoods.basicInfo.storesBuy = 1
      this.setData({
        skuCurGoods,
      })
      return
    }
    if (res.code != 0) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
      return
    }
    Taro.showToast({
      title: '加入成功',
      icon: 'success',
    })
    this.setData({
      skuCurGoods: null,
    })
  },
  storesJia() {
    const skuCurGoods = this.data.skuCurGoods
    if (skuCurGoods.basicInfo.storesBuy < skuCurGoods.basicInfo.stores) {
      skuCurGoods.basicInfo.storesBuy++
      this.setData({
        skuCurGoods,
      })
    }
  },
  storesJian() {
    const skuCurGoods = this.data.skuCurGoods
    if (skuCurGoods.basicInfo.storesBuy > 1) {
      skuCurGoods.basicInfo.storesBuy--
      this.setData({
        skuCurGoods,
      })
    }
  },
  closeSku() {
    this.setData({
      skuCurGoods: null,
    })
    Taro.showTabBar()
  },
  skuSelect(e) {
    const pid = e.currentTarget.dataset.pid
    const id = e.currentTarget.dataset.id
    // 处理选中
    const skuCurGoods = this.data.skuCurGoods
    const property = skuCurGoods.properties.find((ele) => {
      return ele.id == pid
    })
    property.childsCurGoods.forEach((ele) => {
      if (ele.id == id) {
        ele.active = true
      } else {
        ele.active = false
      }
    })
    this.setData({
      skuCurGoods,
    })
  },
  addCarSku() {
    const skuCurGoods = this.data.skuCurGoods
    const propertySize = skuCurGoods.properties.length // 有几组SKU
    const sku = []
    skuCurGoods.properties.forEach((p) => {
      const o = p.childsCurGoods.find((ele) => {
        return ele.active
      })
      if (!o) {
        return
      }
      sku.push({
        optionId: o.propertyId,
        optionValueId: o.id,
      })
    })
    if (sku.length != propertySize) {
      Taro.showToast({
        title: '请选择规格',
        icon: 'none',
      })
      return
    }
    const options = {
      goodsId: skuCurGoods.basicInfo.id,
      buyNumber: skuCurGoods.basicInfo.storesBuy,
      sku,
    }
    this.addShopCarDone(options)
  },
})
class _C extends React.Component {
  render() {
    const { name, listType, orderBy, goods, show_seller_number, skuCurGoods } =
      this.data
    return (
      <Block>
        <VanSticky>
          <View className="header">
            <View className="search">
              <Input
                type="text"
                placeholder="输入搜索关键词"
                value={name}
                onInput={this.bindinput}
                onConfirm={this.bindconfirm}
              ></Input>
              <Image
                src={require('../../images/icon/search.svg')}
                onClick={this.search}
              ></Image>
            </View>
            <Image
              className="show-type"
              src={'/images/icon/list' + listType + '.svg'}
              onClick={this.changeShowType}
            ></Image>
          </View>
          <View className="filters">
            <View
              className={'item ' + (orderBy == '' ? 'active' : '')}
              data-val
              onClick={this.filter}
            >
              综合
            </View>
            <View
              className={'item ' + (orderBy == 'addedDown' ? 'active' : '')}
              data-val="addedDown"
              onClick={this.filter}
            >
              新品
            </View>
            <View
              className={'item ' + (orderBy == 'ordersDown' ? 'active' : '')}
              data-val="ordersDown"
              onClick={this.filter}
            >
              销量
            </View>
            <View
              className={'item ' + (orderBy == 'priceUp' ? 'active' : '')}
              data-val="priceUp"
              onClick={this.filter}
            >
              价格
            </View>
          </View>
        </VanSticky>
        {(!goods || goods.length == 0) && (
          <VanEmpty description="暂无商品"></VanEmpty>
        )}
        {listType == 1 && (
          <Block>
            {goods.map((item, index) => {
              return (
                <View className="list1" key={item.id}>
                  <Navigator url={goodsDetailPage.url(item)}>
                    <Image
                      className="img"
                      mode="aspectFill"
                      src={item.pic}
                    ></Image>
                  </Navigator>
                  <View className="goods-info">
                    <View className="title ellipsis">
                      <Navigator url={goodsDetailPage.url(item)}>
                        {item.name}
                      </Navigator>
                    </View>
                    {item.characteristic && (
                      <View
                        className="characteristic van-multi-ellipsis--l2"
                        style="padding:0;-webkit-line-clamp: 1;"
                      >
                        {item.characteristic}
                      </View>
                    )}
                    <View className="price">
                      {'¥ ' + item.minPrice}
                      {item.originalPrice && item.originalPrice > 0 && (
                        <Text className="originalPrice">
                          {'¥ ' + item.originalPrice}
                        </Text>
                      )}
                    </View>
                    <View className="buy-info">
                      {show_seller_number == '1' && (
                        <View className="num">
                          {'已售出' + item.numberSells + '件'}
                        </View>
                      )}
                      {item.propertyIds || item.hasAddition ? (
                        <VanIcon
                          className="car"
                          name="add"
                          color="#e64340"
                          size="48rpx"
                          data-id={item.id}
                          onClick={this.addShopCar}
                        ></VanIcon>
                      ) : (
                        <VanIcon
                          className="car"
                          name="shopping-cart-o"
                          color="#e64340"
                          size="48rpx"
                          data-id={item.id}
                          onClick={this.addShopCar}
                        ></VanIcon>
                      )}
                    </View>
                  </View>
                </View>
              )
            })}
          </Block>
        )}
        {listType == 2 && (
          <View className="list2-box">
            {goods.map((item, index) => {
              return (
                <View className="list2" key={item.id}>
                  <Navigator url={goodsDetailPage.url(item)}>
                    <Image
                      className="img"
                      mode="aspectFill"
                      src={item.pic}
                    ></Image>
                  </Navigator>
                  <View className="goods-info">
                    <View className="title van-multi-ellipsis--l2">
                      <Navigator url={goodsDetailPage.url(item)}>
                        {item.name}
                      </Navigator>
                    </View>
                    {item.characteristic && (
                      <View
                        className="characteristic van-multi-ellipsis--l2"
                        style="padding:0;-webkit-line-clamp: 1;"
                      >
                        {item.characteristic}
                      </View>
                    )}
                    <View className="price">
                      {'¥ ' + item.minPrice}
                      {item.originalPrice && item.originalPrice > 0 && (
                        <Text className="originalPrice">
                          {'¥ ' + item.originalPrice}
                        </Text>
                      )}
                    </View>
                    <View className="buy-info">
                      {show_seller_number == '1' && (
                        <View className="num">
                          {item.numberOrders +
                            '人已购' +
                            item.numberSells +
                            '件'}
                        </View>
                      )}
                      {/*  <image class="car" src="/images/icon/car.svg" data-id="{{item.id}}" bindtap="addShopCar"></image>  */}
                      {item.propertyIds || item.hasAddition ? (
                        <VanIcon
                          className="car"
                          name="add"
                          color="#e64340"
                          size="48rpx"
                          data-id={item.id}
                          onClick={this.addShopCar}
                        ></VanIcon>
                      ) : (
                        <VanIcon
                          className="car"
                          name="shopping-cart-o"
                          color="#e64340"
                          size="48rpx"
                          data-id={item.id}
                          onClick={this.addShopCar}
                        ></VanIcon>
                      )}
                    </View>
                  </View>
                </View>
              )
            })}
          </View>
        )}
        <GoodsPop skuCurGoodsBaseInfo={skuCurGoods}></GoodsPop>
      </Block>
    )
  }
}
export default _C
