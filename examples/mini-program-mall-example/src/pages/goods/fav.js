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
import goodsDetailPage from '../../imports/goodsDetailPage5.js'
import './fav.scss'
import WXAPI from '../../apifm-wxapi'
const AUTH = require('../../utils/auth.js')
@withWeapp({
  data: {},
  onLoad: function (options) {},
  onShow: function () {
    AUTH.checkHasLogined().then((isLogined) => {
      this.setData({
        wxlogin: isLogined,
      })
      if (isLogined) {
        this.goodsFavList()
      }
    })
  },
  async goodsFavList() {
    // 搜索商品
    Taro.showLoading({
      title: '加载中',
    })
    const _data = {
      token: Taro.getStorageSync('token'),
      page: 1,
      pageSize: 10000,
    }
    const res = await WXAPI.goodsFavList(_data)
    Taro.hideLoading()
    if (res.code == 0) {
      res.data.forEach((ele) => {
        if (ele.type == 1 && ele.json) {
          ele.json = JSON.parse(ele.json)
        }
      })
      this.setData({
        goods: res.data,
      })
    } else {
      this.setData({
        goods: null,
      })
    }
  },
  async removeFav(e) {
    const idx = e.currentTarget.dataset.idx
    const fav = this.data.goods[idx]
    const res = await WXAPI.goodsFavDeleteV2({
      token: Taro.getStorageSync('token'),
      goodsId: fav.goodsId,
      type: fav.type,
    })
    if (res.code == 0) {
      Taro.showToast({
        title: '取消收藏',
        icon: 'success',
      })
      this.goodsFavList()
    } else {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
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
