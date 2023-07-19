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
import goodsDetailPage from '../../imports/goodsDetailPage3.js'
import './list.scss'
import WXAPI from '../../apifm-wxapi'
const AUTH = require('../../utils/auth.js')
const TOOLS = require('../../utils/tools.js') // TOOLS.showTabBarBadge();
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
      categoryId: options.categoryId,
    })
    this.search()
    this.readConfigVal()
    // 补偿写法
    Taro.getApp().configLoadOK = () => {
      this.readConfigVal()
    }
  },
  onShow: function () {},
  readConfigVal() {
    const show_seller_number = Taro.getStorageSync('show_seller_number')
    const goods_search_show_type = Taro.getStorageSync('goods_search_show_type')
    let listType = 1
    if (goods_search_show_type == 2) {
      listType = 2
    }
    this.setData({
      show_seller_number,
      listType,
    })
  },
  async search() {
    Taro.showLoading({
      title: '加载中',
    })
    const _data = {
      orderBy: this.data.orderBy,
      page: this.data.page,
      pageSize: 20,
    }
    if (this.data.name) {
      _data.k = this.data.name
    }
    if (this.data.categoryId) {
      _data.categoryId = this.data.categoryId
    }
    const res = await WXAPI.goodsv2(_data)
    Taro.hideLoading()
    if (res.code == 0) {
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
  onReachBottom() {
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
    if (!curGood.propertyIds && !curGood.hasAddition) {
      // 直接调用加入购物车方法
      const res = await WXAPI.shippingCarInfoAddItem(
        Taro.getStorageSync('token'),
        curGood.id,
        1,
        []
      )
      if (res.code == 30002) {
        // 需要选择规格尺寸
        this.setData({
          skuCurGoods: curGood,
        })
      } else if (res.code == 0) {
        Taro.showToast({
          title: '加入成功',
          icon: 'success',
        })
        Taro.showTabBar()
        TOOLS.showTabBarBadge() // 获取购物车数据，显示TabBarBadge
      } else {
        Taro.showToast({
          title: res.msg,
          icon: 'none',
        })
      }
    } else {
      // 需要选择 SKU 和 可选配件
      this.setData({
        skuCurGoods: curGood,
      })
    }
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
