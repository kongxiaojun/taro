import { Block, View, ScrollView, Image, Navigator } from '@tarojs/components'
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
import goodsDetailPage from '../../imports/goodsDetailPage2.js'
import './category.scss'
import WXAPI from '../../apifm-wxapi'
const AUTH = require('../../utils/auth.js')
const TOOLS = require('../../utils/tools.js') // TOOLS.showTabBarBadge();
@withWeapp({
  /**
   * 页面的初始数据
   */
  data: {
    categories: [],
    activeCategory: 0,
    categorySelected: {
      name: '',
      id: '',
    },
    currentGoods: [],
    onLoadStatus: true,
    scrolltop: 0,
    skuCurGoods: undefined,
    page: 1,
    pageSize: 20,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // Taro.showShareMenu({
    //   withShareTicket: true,
    // })
    this.setData({
      categoryMod: Taro.getStorageSync('categoryMod'),
    })
    this.categories()
  },
  async categories() {
    Taro.showLoading({
      title: '',
    })
    const res = await WXAPI.goodsCategory()
    Taro.hideLoading()
    let activeCategory = 0
    let categorySelected = this.data.categorySelected
    if (res.code == 0) {
      const categories = res.data.filter((ele) => {
        return !ele.vopCid1 && !ele.vopCid2
      })
      categories.forEach((p) => {
        p.childs = categories.filter((ele) => {
          return p.id == ele.pid
        })
      })
      const firstCategories = categories.filter((ele) => {
        return ele.level == 1
      })
      if (this.data.categorySelected.id) {
        activeCategory = firstCategories.findIndex((ele) => {
          return ele.id == this.data.categorySelected.id
        })
        categorySelected = firstCategories[activeCategory]
      } else {
        categorySelected = firstCategories[0]
      }
      const resAd = await WXAPI.adPosition('category_' + categorySelected.id)
      let adPosition = null
      if (resAd.code === 0) {
        adPosition = resAd.data
      }
      this.setData({
        page: 1,
        activeCategory,
        categories,
        firstCategories,
        categorySelected,
        adPosition,
      })
      this.getGoodsList()
    }
  },
  async getGoodsList() {
    if (this.data.categoryMod == 2) {
      return
    }
    Taro.showLoading({
      title: '',
    })
    // secondCategoryId
    let categoryId = ''
    if (this.data.secondCategoryId) {
      categoryId = this.data.secondCategoryId
    } else if (this.data.categorySelected.id) {
      categoryId = this.data.categorySelected.id
    }
    // https://www.yuque.com/apifm/nu0f75/wg5t98
    const res = await WXAPI.goodsv2({
      categoryId,
      page: this.data.page,
      pageSize: this.data.pageSize,
    })
    Taro.hideLoading()
    if (res.code == 700) {
      if (this.data.page == 1) {
        this.setData({
          currentGoods: null,
        })
      } else {
        Taro.showToast({
          title: '没有更多了',
          icon: 'none',
        })
      }
      return
    }
    if (res.code != 0) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
      return
    }
    if (this.data.page == 1) {
      this.setData({
        currentGoods: res.data.result,
      })
    } else {
      this.setData({
        currentGoods: this.data.currentGoods.concat(res.data.result),
      })
    }
  },
  async onCategoryClick(e) {
    const idx = e.target.dataset.idx
    if (idx == this.data.activeCategory) {
      this.setData({
        scrolltop: 0,
      })
      return
    }
    const categorySelected = this.data.firstCategories[idx]
    const res = await WXAPI.adPosition('category_' + categorySelected.id)
    let adPosition = null
    if (res.code === 0) {
      adPosition = res.data
    }
    this.setData({
      page: 1,
      secondCategoryId: '',
      activeCategory: idx,
      categorySelected,
      scrolltop: 0,
      adPosition,
    })
    this.getGoodsList()
  },
  onSecondCategoryClick(e) {
    const idx = e.detail.index
    let secondCategoryId = ''
    if (idx) {
      // 点击了具体的分类
      secondCategoryId = this.data.categorySelected.childs[idx - 1].id
    }
    this.setData({
      page: 1,
      secondCategoryId,
    })
    this.getGoodsList()
  },
  bindconfirm(e) {
    this.setData({
      inputVal: e.detail,
    })
    Taro.navigateTo({
      url: '/pages/goods/list?name=' + this.data.inputVal,
    })
  },
  onShareAppMessage() {
    return {
      title:
        '"' +
        Taro.getStorageSync('mallName') +
        '" ' +
        Taro.getStorageSync('share_profile'),
      path: '/pages/index/index?inviter_id=' + Taro.getStorageSync('uid'),
    }
  },
  onShareTimeline() {
    return {
      title:
        '"' +
        Taro.getStorageSync('mallName') +
        '" ' +
        Taro.getStorageSync('share_profile'),
      query: '',
      imageUrl: this.data.goodsDetail.basicInfo.pic,
    }
  },
  onShow() {
    AUTH.checkHasLogined().then((isLogined) => {
      if (isLogined) {
        this.setData({
          wxlogin: isLogined,
        })
        TOOLS.showTabBarBadge() // 获取购物车数据，显示TabBarBadge
      }
    })

    const _categoryId = Taro.getStorageSync('_categoryId')
    Taro.removeStorageSync('_categoryId')
    if (_categoryId) {
      this.data.categorySelected.id = _categoryId
      this.categories()
    }
  },
  async addShopCar(e) {
    const curGood = this.data.currentGoods.find((ele) => {
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
  goodsGoBottom() {
    this.data.page++
    this.getGoodsList()
  },
  adPositionClick(e) {
    const url = e.target.dataset.url
    if (url) {
      Taro.navigateTo({
        url: url,
      })
    }
  },
  searchscan() {
    Taro.scanCode({
      scanType: ['barCode', 'qrCode', 'datamatrix', 'pdf417'],
      success: (res) => {
        this.setData({
          inputVal: res.result,
        })
        Taro.navigateTo({
          url: '/pages/goods/list?name=' + res.result,
        })
      },
    })
  },
})
class _C extends React.Component {
  render() {
    const {
      name,
      activeCategory,
      item,
      aaa,
      firstCategories,
      scrolltop,
      categoryMod,
      categorySelected,
      currentGoods,
      adPosition,
      onLoadStatus,
      skuCurGoods,
    } = this.data
    return (
      <Block>
        <VanSearch
          value={name}
          placeholder="请输入搜索关键词"
          shape="round"
          onSearch={this.bindconfirm}
          useRightIconSlot
          renderRighticon={
            <Block>
              <VanIcon name="scan" onClick={this.searchscan}></VanIcon>
            </Block>
          }
        ></VanSearch>
        <View className="main">
          <ScrollView
            className="category-container"
            scrollY={true}
            scrollWithAnimation={true}
            scrollIntoView={aaa}
          >
            {firstCategories &&  (
                <VanSidebar customClass="sidebar-l" activeKey={activeCategory}>
                  {firstCategories.map((item, index) => {
                    return item.level === 1 && (
                        <VanSidebarItem
                            id={'category' + item.id}
                            key={item.id}
                            data-idx={index}
                            onClick={this.onCategoryClick}
                            title={item.name}
                        ></VanSidebarItem>
                    )
                  })}
                </VanSidebar>
              )}
          </ScrollView>
          {onLoadStatus && (
            <ScrollView
              className="goods-container"
              scrollY="true"
              scrollTop={scrolltop}
              onScrollToLower={this.goodsGoBottom}
            >
              {categoryMod != 2 &&
                categorySelected.childs &&
                categorySelected.childs.length > 0 && (
                  <VanTabs
                    customClass="llargada"
                    onChange={this.onSecondCategoryClick}
                    ellipsis={false}
                  >
                    <VanTab title="全部"></VanTab>
                    {categorySelected.childs.map((item, index) => {
                      return <VanTab key={item.id} title={item.name}></VanTab>
                    })}
                  </VanTabs>
                )}
              {categoryMod != 2 && !currentGoods && (
                <VanEmpty description="暂无商品"></VanEmpty>
              )}
              {categoryMod == 2 && (
                <Block>
                  <VanCell
                    title={categorySelected.name}
                    isLink
                    url={'/pages/goods/list?categoryId=' + categorySelected.id}
                  ></VanCell>
                  {adPosition && (
                    <Image
                      className="adPosition"
                      mode="aspectFill"
                      src={adPosition.val}
                      mode="widthFix"
                      data-url={adPosition.url}
                      onClick={this.adPositionClick}
                    ></Image>
                  )}
                  <View className="small-category-box">
                    {categorySelected.childs && categorySelected.childs.map((item, index) => {
                      return (
                        <Navigator
                          key={item.id}
                          url={'/pages/goods/list?categoryId=' + item.id}
                        >
                          <View className="small-category">
                            <Image
                              mode="aspectFill"
                              src={item.icon}
                              mode="aspectFill"
                            ></Image>
                            <View>{item.name}</View>
                          </View>
                        </Navigator>
                      )
                    })}
                  </View>
                </Block>
              )}
              {/*  三级级分类展示  */}
              {/*  <view wx:for="{{categories}}" wx:key="id" wx:if="{{item.pid==c ategorySelected.id}}">
                  <navigator url="/pages/goods/list?categoryId={{item.id}}">
                    <view class="no-data medium-category">
                      <view class="line"></view>
                      <view class="txt">{{item.name}}</view>
                      <view class="line"></view>
                    </view>
                  </navigator>
                  <view class="small-category-box">
                    <navigator wx:for="{{categories}}" wx:for-item="small" wx:key="id" wx:if="{{small.pid == item.id}}" url="/pages/goods/list?categoryId={{small.id}}">
                      <view class="small-category">
                        <image mode="aspectFill" src="{{small.icon}}"></image>
                        <view>{{small.name}}</view>
                      </view>
                    </navigator>
                  </view>
                </view>  */}
              {/*  显示右侧商品  */}
              {currentGoods && currentGoods.map((item, index) => {
                return (
                  <VanCard
                    key={item.id}
                    price={item.minPrice}
                    desc={item.numberSells ? '已售' + item.numberSells : ''}
                    tag={item.gotScore ? item.gotScore + '积分' : ''}
                    title={item.name}
                    thumb={item.pic}
                    thumbLink={goodsDetailPage.url(item)}
                    renderFooter={
                      <Block>
                        <View className="goods-btn">
                          {item.propertyIds || item.hasAddition ? (
                            <VanIcon
                              name="add"
                              color="#e64340"
                              size="48rpx"
                              data-id={item.id}
                              onClick={this.addShopCar}
                            ></VanIcon>
                          ) : (
                            <VanIcon
                              name="shopping-cart-o"
                              color="#e64340"
                              size="48rpx"
                              data-id={item.id}
                              onClick={this.addShopCar}
                            ></VanIcon>
                          )}
                        </View>
                      </Block>
                    }
                  ></VanCard>
                )
              })}
            </ScrollView>
          )}
        </View>
        <GoodsPop skuCurGoodsBaseInfo={skuCurGoods}></GoodsPop>
      </Block>
    )
  }
}
export default _C
