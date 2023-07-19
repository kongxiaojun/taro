import {
  Block,
  View,
  ScrollView,
  Swiper,
  SwiperItem,
  Image,
  Text,
  Button,
  Canvas,
} from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import WXAPI from '../../../apifm-wxapi'
const AUTH = require('../../../utils/auth.js')
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
import Poster from '../../../wxa-plugin-canvas/poster'
import './cps-taobao.scss'
@withWeapp({
  data: {
    beianPass: 0, // 0 未判断，1 未备案， 2 已备案
  },

  onLoad(e) {
    // e.id = 825894
    // 读取分享链接中的邀请人编号
    if (e && e.inviter_id) {
      Taro.setStorageSync('referrer', e.inviter_id)
    }
    // 读取小程序码中的邀请人编号
    if (e && e.scene) {
      const scene = decodeURIComponent(e.scene) // 处理扫码进商品详情页面的逻辑
      if (scene && scene.split(',').length >= 2) {
        e.id = scene.split(',')[0]
        Taro.setStorageSync('referrer', scene.split(',')[1])
      }
    }
    this.data.goodsId = e.id
    this.goodsDetail()
  },
  async goodsDetail() {
    const token = Taro.getStorageSync('token')
    const res = await WXAPI.goodsDetail(this.data.goodsId, token ? token : '')
    if (res.code == 0) {
      this.setData({
        goodsDetail: res.data,
      })
      this.cpsTaobaoGoodsDetail(res.data.basicInfo.yyId)
    }
  },
  async cpsTaobaoGoodsDetail(goodsId) {
    const token = Taro.getStorageSync('token')
    const res = await WXAPI.cpsTaobaoGoodsDetail({
      token,
      platform: 2,
      goodsIds: goodsId,
    })
    if (res.code == 0) {
      this.setData({
        cpsTaobaoGoodsDetail: res.data[0],
      })
    }
  },
  onShow() {
    AUTH.checkHasLogined().then((isLogined) => {
      if (isLogined) {
        this.goodsFavCheck()
      }
    })
  },
  async goodsFavCheck() {
    const res = await WXAPI.goodsFavCheck(
      Taro.getStorageSync('token'),
      this.data.goodsId
    )
    if (res.code == 0) {
      this.setData({
        faved: true,
      })
    } else {
      this.setData({
        faved: false,
      })
    }
  },
  async addFav() {
    AUTH.checkHasLogined().then((isLogined) => {
      this.setData({
        wxlogin: isLogined,
      })
      if (isLogined) {
        if (this.data.faved) {
          // 取消收藏
          WXAPI.goodsFavDeleteV2({
            token: Taro.getStorageSync('token'),
            goodsId: this.data.goodsId,
            type: 1,
          }).then((res) => {
            this.goodsFavCheck()
          })
        } else {
          const extJsonStr = {
            wxaurl: `/packageCps/pages/goods-details/cps-taobao?id=${this.data.goodsId}`,
            skuId: this.data.goodsId,
            pic: this.data.goodsDetail.basicInfo.pic,
            name: this.data.goodsDetail.basicInfo.name,

            // 加入收藏
          }
          WXAPI.goodsFavAdd({
            token: Taro.getStorageSync('token'),
            goodsId: this.data.goodsId,
            type: 1,
            extJsonStr: JSON.stringify(extJsonStr),
          }).then((res) => {
            this.goodsFavCheck()
          })
        }
      }
    })
  },
  goShopCar: function () {
    Taro.reLaunch({
      url: '/pages/shop-cart/index',
    })
  },
  toAddShopCar: function () {
    this.setData({
      shopType: 'addShopCar',
    })
    this.bindGuiGeTap()
  },
  async tobuy() {
    const token = Taro.getStorageSync('token')
    if (!token) {
      Taro.showToast({
        title: '请先登陆',
        icon: 'none',
      })
      return
    }
    const res = await WXAPI.cpsPddGoodsShotUrl(
      token,
      this.data.goodsDetail.basicInfo.yyIdStr
    )
    if (res.code != 0) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
      return
    }
    Taro.navigateToMiniProgram({
      appId: res.data.we_app_info.app_id,
      path: res.data.we_app_info.page_path,
    })
  },
  toPingtuan: function (e) {
    let pingtuanopenid = 0
    if (e.currentTarget.dataset.pingtuanopenid) {
      pingtuanopenid = e.currentTarget.dataset.pingtuanopenid
    }
    this.setData({
      shopType: 'toPingtuan',
      selectSizePrice: this.data.goodsDetail.basicInfo.pingtuanPrice,
      selectSizeOPrice: this.data.goodsDetail.basicInfo.originalPrice,
      pingtuanopenid: pingtuanopenid,
      hideShopPopup: false,
      skuGoodsPic: this.data.goodsDetail.basicInfo.pic,
    })
  },
  /**
   * 规格选择弹出框
   */
  bindGuiGeTap: function () {
    this.setData({
      hideShopPopup: false,
    })
  },
  /**
   * 规格选择弹出框隐藏
   */
  closePopupTap: function () {
    this.setData({
      hideShopPopup: true,
    })
  },
  stepChange(event) {
    this.setData({
      buyNumber: event.detail,
    })
  },
  /**
   * 选择商品规格
   */
  async labelItemTap(e) {
    const propertyindex = e.currentTarget.dataset.propertyindex
    const propertychildindex = e.currentTarget.dataset.propertychildindex
    const property = this.data.goodsDetail.properties[propertyindex]
    const child = property.childsCurGoods[propertychildindex]
    // 取消该分类下的子栏目所有的选中状态
    property.childsCurGoods.forEach((child) => {
      child.active = false
    })
    // 设置当前选中状态
    property.optionValueId = child.id
    child.active = true
    // 获取所有的选中规格尺寸数据
    const needSelectNum = this.data.goodsDetail.properties.length
    let curSelectNum = 0
    let propertyChildIds = ''
    let propertyChildNames = ''
    this.data.goodsDetail.properties.forEach((p) => {
      p.childsCurGoods.forEach((c) => {
        if (c.active) {
          curSelectNum++
          propertyChildIds = propertyChildIds + p.id + ':' + c.id + ','
          propertyChildNames = propertyChildNames + p.name + ':' + c.name + '  '
        }
      })
    })
    let canSubmit = false
    if (needSelectNum == curSelectNum) {
      canSubmit = true
    }
    let skuGoodsPic = this.data.skuGoodsPic
    if (
      this.data.goodsDetail.subPics &&
      this.data.goodsDetail.subPics.length > 0
    ) {
      const _subPic = this.data.goodsDetail.subPics.find((ele) => {
        return ele.optionValueId == child.id
      })
      if (_subPic) {
        skuGoodsPic = _subPic.pic
      }
    }
    this.setData({
      goodsDetail: this.data.goodsDetail,
      canSubmit,
      skuGoodsPic,
      propertyChildIds,
      propertyChildNames,
    })
    this.calculateGoodsPrice()
  },
  async calculateGoodsPrice() {
    // 计算最终的商品价格
    let price = this.data.goodsDetail.basicInfo.minPrice
    let originalPrice = this.data.goodsDetail.basicInfo.originalPrice
    let totalScoreToPay = this.data.goodsDetail.basicInfo.minScore
    let buyNumMax = this.data.goodsDetail.basicInfo.stores
    let buyNumber = this.data.goodsDetail.basicInfo.minBuyNumber
    if (this.data.shopType == 'toPingtuan') {
      price = this.data.goodsDetail.basicInfo.pingtuanPrice
    }
    // 计算 sku 价格
    if (this.data.canSubmit) {
      const token = Taro.getStorageSync('token')
      const res = await WXAPI.goodsPriceV2({
        token: token ? token : '',
        goodsId: this.data.goodsDetail.basicInfo.id,
        propertyChildIds: this.data.propertyChildIds,
      })
      if (res.code == 0) {
        price = res.data.price
        if (this.data.shopType == 'toPingtuan') {
          price = res.data.pingtuanPrice
        }
        originalPrice = res.data.originalPrice
        totalScoreToPay = res.data.score
        buyNumMax = res.data.stores
      }
    }
    // 计算配件价格
    if (this.data.goodsAddition) {
      this.data.goodsAddition.forEach((big) => {
        big.items.forEach((small) => {
          if (small.active) {
            price = (price * 100 + small.price * 100) / 100
          }
        })
      })
    }
    this.setData({
      selectSizePrice: price,
      selectSizeOPrice: originalPrice,
      totalScoreToPay: totalScoreToPay,
      buyNumMax,
      buyNumber: buyNumMax >= buyNumber ? buyNumber : 0,
    })
  },
  /**
   * 选择可选配件
   */
  async labelItemTap2(e) {
    const propertyindex = e.currentTarget.dataset.propertyindex
    const propertychildindex = e.currentTarget.dataset.propertychildindex
    const goodsAddition = this.data.goodsAddition
    const property = goodsAddition[propertyindex]
    const child = property.items[propertychildindex]
    if (child.active) {
      // 该操作为取消选择
      child.active = false
      this.setData({
        goodsAddition,
      })
      this.calculateGoodsPrice()
      return
    }
    // 单选配件取消所有子栏目选中状态
    if (property.type == 0) {
      property.items.forEach((child) => {
        child.active = false
      })
    }
    // 设置当前选中状态
    child.active = true
    this.setData({
      goodsAddition,
    })
    this.calculateGoodsPrice()
  },
  /**
   * 组建立即购买信息
   */
  buliduBuyNowInfo: function (shoptype) {
    var shopCarMap = {}
    shopCarMap.goodsId = this.data.goodsId
    shopCarMap.pic = this.data.imageDomain + this.data.price.pic
    shopCarMap.name = this.data.price.skuName
    shopCarMap.price = this.data.price.priceSale
    shopCarMap.left = ''
    shopCarMap.active = true
    shopCarMap.number = this.data.buyNumber
    var buyNowInfo = {}
    buyNowInfo.shopNum = 0
    buyNowInfo.shopList = [shopCarMap]
    return buyNowInfo
  },
  onShareAppMessage() {
    return {
      title: this.data.goodsDetail.basicInfo.name,
      path:
        '/packageCps/pages/goods-details/cps-taobao?id=' +
        this.data.goodsId +
        '&inviter_id=' +
        Taro.getStorageSync('uid'),
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      },
    }
  },
  onShareTimeline() {
    return {
      title: this.data.goodsDetail.basicInfo.name,
      query:
        'id=' + this.data.goodsId + '&inviter_id=' + Taro.getStorageSync('uid'),
      imageUrl: this.data.goodsDetail.basicInfo.pic,
    }
  },
  reputation: function (goodsId) {
    var that = this
    WXAPI.goodsReputation({
      goodsId: goodsId,
    }).then(function (res) {
      if (res.code == 0) {
        res.data.forEach((ele) => {
          if (ele.goods.goodReputation == 0) {
            ele.goods.goodReputation = 1
          } else if (ele.goods.goodReputation == 1) {
            ele.goods.goodReputation = 3
          } else if (ele.goods.goodReputation == 2) {
            ele.goods.goodReputation = 5
          }
        })
        that.setData({
          reputation: res.data,
        })
      }
    })
  },
  pingtuanList: function (goodsId) {
    var that = this
    WXAPI.pingtuanList({
      goodsId: goodsId,
      status: 0,
    }).then(function (res) {
      if (res.code == 0) {
        that.setData({
          pingtuanList: res.data.result,
        })
      }
    })
  },
  getVideoSrc: function (videoId) {
    var that = this
    WXAPI.videoDetail(videoId).then(function (res) {
      if (res.code == 0) {
        that.setData({
          videoMp4Src: res.data.fdMp4,
        })
      }
    })
  },
  joinKanjia() {
    AUTH.checkHasLogined().then((isLogined) => {
      if (isLogined) {
        this.doneJoinKanjia()
      } else {
        this.setData({
          wxlogin: false,
        })
      }
    })
  },
  doneJoinKanjia: function () {
    // 报名参加砍价活动
    const _this = this
    if (!_this.data.curGoodsKanjia) {
      return
    }
    Taro.showLoading({
      title: '加载中',
      mask: true,
    })
    WXAPI.kanjiaJoin(
      Taro.getStorageSync('token'),
      _this.data.curGoodsKanjia.id
    ).then(function (res) {
      Taro.hideLoading()
      if (res.code == 0) {
        _this.setData({
          kjJoinUid: Taro.getStorageSync('uid'),
          myHelpDetail: null,
        })
        _this.getGoodsDetailAndKanjieInfo(_this.data.goodsDetail.basicInfo.id)
      } else {
        Taro.showToast({
          title: res.msg,
          icon: 'none',
        })
      }
    })
  },
  joinPingtuan: function (e) {
    let pingtuanopenid = e.currentTarget.dataset.pingtuanopenid
    Taro.navigateTo({
      url:
        '/pages/to-pay-order/index?orderType=buyNow&pingtuanOpenId=' +
        pingtuanopenid,
    })
  },
  goIndex() {
    Taro.switchTab({
      url: '/pages/index/index',
    })
  },
  helpKanjia() {
    const _this = this
    AUTH.checkHasLogined().then((isLogined) => {
      _this.setData({
        wxlogin: isLogined,
      })
      if (isLogined) {
        _this.helpKanjiaDone()
      }
    })
  },
  helpKanjiaDone() {
    const _this = this
    WXAPI.kanjiaHelp(
      Taro.getStorageSync('token'),
      _this.data.kjId,
      _this.data.kjJoinUid,
      ''
    ).then(function (res) {
      if (res.code != 0) {
        Taro.showToast({
          title: res.msg,
          icon: 'none',
        })
        return
      }
      _this.setData({
        myHelpDetail: res.data,
      })
      Taro.showModal({
        title: '成功',
        content: '成功帮TA砍掉 ' + res.data.cutPrice + ' 元',
        showCancel: false,
      })
      _this.getGoodsDetailAndKanjieInfo(_this.data.goodsDetail.basicInfo.id)
    })
  },
  cancelLogin() {
    this.setData({
      wxlogin: true,
    })
  },
  closePop() {
    this.setData({
      posterShow: false,
    })
  },
  async drawSharePic() {
    const _this = this
    const qrcodeRes = await WXAPI.wxaQrcode({
      scene: _this.data.goodsId + ',' + Taro.getStorageSync('uid'),
      page: '/packageCps/pages/goods-details/cps-taobao',
      is_hyaline: true,
      autoColor: true,
      expireHours: 1,
    })
    if (qrcodeRes.code != 0) {
      Taro.showToast({
        title: qrcodeRes.msg,
        icon: 'none',
      })
      return
    }
    const qrcode = qrcodeRes.data
    const pic = _this.data.goodsDetail.basicInfo.pic
    Taro.getImageInfo({
      src: pic,
      success(res) {
        const height = (490 * res.height) / res.width
        _this.drawSharePicDone(height, qrcode)
      },
      fail(e) {
        console.error(e)
      },
    })
  },
  drawSharePicDone(picHeight, qrcode) {
    const _this = this
    const _baseHeight = 74 + (picHeight + 120)
    this.setData(
      {
        posterConfig: {
          width: 750,
          height: picHeight + 660,
          backgroundColor: '#fff',
          debug: false,
          blocks: [
            {
              x: 76,
              y: 74,
              width: 604,
              height: picHeight + 120,
              borderWidth: 2,
              borderColor: '#c2aa85',
              borderRadius: 8,
            },
          ],
          images: [
            {
              x: 133,
              y: 133,
              url: _this.data.goodsDetail.basicInfo.pic,
              // 商品图片
              width: 490,
              height: picHeight,
            },
            {
              x: 76,
              y: _baseHeight + 199,
              url: qrcode,
              // 二维码
              width: 222,
              height: 222,
            },
          ],
          texts: [
            {
              x: 375,
              y: _baseHeight + 80,
              width: 650,
              lineNum: 2,
              text: _this.data.goodsDetail.basicInfo.name,
              textAlign: 'center',
              fontSize: 40,
              color: '#333',
            },
            {
              x: 375,
              y: _baseHeight + 180,
              text: '￥' + _this.data.goodsDetail.basicInfo.minPrice,
              textAlign: 'center',
              fontSize: 50,
              color: '#e64340',
            },
            {
              x: 352,
              y: _baseHeight + 320,
              text: '长按识别小程序码',
              fontSize: 28,
              color: '#999',
            },
          ],
        },
      },
      () => {
        Poster.create()
      }
    )
  },
  onPosterSuccess(e) {
    console.log('success:', e)
    this.setData({
      posterImg: e.detail,
      showposterImg: true,
    })
  },
  onPosterFail(e) {
    console.error('fail:', e)
  },
  savePosterPic() {
    const _this = this
    Taro.saveImageToPhotosAlbum({
      filePath: this.data.posterImg,
      success: (res) => {
        Taro.showModal({
          content: '已保存到手机相册',
          showCancel: false,
          confirmText: '知道了',
          confirmColor: '#333',
        })
      },
      complete: () => {
        _this.setData({
          showposterImg: false,
        })
      },
      fail: (res) => {
        Taro.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 2000,
        })
      },
    })
  },
  previewImage(e) {
    const url = e.currentTarget.dataset.url
    Taro.previewImage({
      current: url,
      // 当前显示图片的http链接
      urls: [url], // 需要预览的图片http链接列表
    })
  },

  onTabsChange(e) {
    var index = e.detail.index
    this.setData({
      toView: this.data.tabs[index].view_id,
    })
  },
  backToHome() {
    Taro.switchTab({
      url: '/pages/index/index',
    })
  },
  async copyKouling() {
    const res = await WXAPI.cpsTaobaoGoodsKouling(
      Taro.getStorageSync('token'),
      this.data.goodsDetail.content
    )
    if (res.code != 0) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
      return
    }
    Taro.setClipboardData({
      data: res.data.model,
      success: () => {
        Taro.showToast({
          title: '淘口令已复制',
        })
      },
    })
  },
  async copyLink() {
    const res = await WXAPI.cpsTaobaoGoodsShotUrl(
      Taro.getStorageSync('token'),
      this.data.goodsDetail.content
    )
    if (res.code != 0) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
      return
    }
    Taro.setClipboardData({
      data: res.data[0].content,
      success: () => {
        Taro.showToast({
          title: '链接已复制',
        })
      },
    })
  },
})
class _C extends React.Component {
  render() {
    const {
      active,
      tabs,
      createTabs,
      toView,
      cpsJdGoodsDetail,
      goodsDetail,
      pingtuanList,
      goodsAddition,
      hasMoreSelect,
      goodsDetailSkuShowType,
      buyNumber,
      buyNumMin,
      buyNumMax,
      shopSubdetail,
      curGoodsKanjia,
      reputation,
      faved,
      shopType,
      canvasstyle,
      posterShow,
      wxlogin,
      posterConfig,
      showposterImg,
      posterImg,
      hideShopPopup,
      price,
      imageDomain,
      curAddressData,
      canPurchase,
    } = this.data
    return (
      <Block>
        <View className="container">
          {createTabs && (
            <VanSticky>
              <View id="tabs" className="tabs-container">
                <VanTabs
                  sticky
                  onClick={this.onTabsChange}
                  customClass
                  active={active}
                >
                  {tabs.map((item, index) => {
                    return (
                      <VanTab
                        title={item.tabs_name}
                        name={item.tabs_name}
                      ></VanTab>
                    )
                  })}
                </VanTabs>
              </View>
            </VanSticky>
          )}
          <ScrollView
            className="scroll-container"
            scrollIntoView={toView}
            scrollY="true"
            scrollWithAnimation="true"
            onScroll={this.bindscroll}
          >
            <View className="swiper-container" id="swiper-container">
              <Swiper
                className="swiper_box"
                indicatorDots="true"
                indicatorActiveColor="#fff"
                autoplay
                circular
              >
                {cpsJdGoodsDetail.imageInfo.imageList.map((item, index) => {
                  return (
                    <SwiperItem key={item.id}>
                      <Image
                        src={item.url}
                        className="slide-image"
                        mode="aspectFill"
                        lazyLoad="true"
                      ></Image>
                    </SwiperItem>
                  )
                })}
              </Swiper>
            </View>
            <View className="goods-info vcell">
              <View className="goods-info-top-container">
                <View className="goods-profile">
                  <View className="p">
                    <Text>¥</Text>
                    {goodsDetail.basicInfo.minPrice}
                  </View>
                  {goodsDetail.basicInfo.originalPrice &&
                    goodsDetail.basicInfo.originalPrice > 0 && (
                      <View
                        className="goods-price"
                        style="color:#aaa;text-decoration:line-through;padding: 15rpx 0rpx 0rpx 15rpx;"
                      >
                        <Text>¥</Text>
                        {goodsDetail.basicInfo.originalPrice}
                      </View>
                    )}
                </View>
                <View className="goods-info-fx">
                  <View className="item left">
                    <VanIcon name="share-o" size="24px"></VanIcon>
                    <View className="icon-title">分享</View>
                    <Button openType="share"></Button>
                  </View>
                  <View className="item" onClick={this.drawSharePic}>
                    <VanIcon name="qr" size="24px"></VanIcon>
                    <View className="icon-title">二维码</View>
                  </View>
                </View>
              </View>
              <View className="goods-title">{goodsDetail.basicInfo.name}</View>
              <View className="characteristic">
                {goodsDetail.basicInfo.characteristic}
              </View>
            </View>
            <View className="space"></View>
            {pingtuanList && (
              <View className="goods-des-info" style="margin-top:35rpx;">
                <View
                  className="label-title"
                  style="border-bottom:1px solid #eee;"
                >
                  {pingtuanList.length + '人在拼单，可直接参与'}
                </View>
                {pingtuanList.map((item, index) => {
                  return (
                    <View
                      className="goods-text"
                      style="margin-top:15rpx;border-bottom:1px solid #eee;overflow:hidden;"
                      key={item.id}
                    >
                      <View style="width:150rpx;float:left;">
                        <Image
                          style="width: 150rpx; height: 150rpx;"
                          src={item.apiExtUser.avatarUrl}
                        ></Image>
                        <View style="width:150rpx;text-align:center;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
                          {item.apiExtUser.nick}
                        </View>
                      </View>
                      <View style="width:500rpx;float:left;margin-left:35rpx;">
                        <View>
                          已有<Text style="color:red">{item.helpNumber}</Text>
                          人参与
                        </View>
                        <View style="color: #B0B0B0;font-size:24rpx;">
                          {'截止: ' + item.dateEnd}
                        </View>
                        <Button
                          type="warn"
                          size="mini"
                          data-pingtuanopenid={item.id}
                          onClick={this.toPingtuan}
                        >
                          去拼单
                        </Button>
                      </View>
                    </View>
                  )
                })}
              </View>
            )}
            {hasMoreSelect && goodsDetailSkuShowType == 0 && (
              <VanCell
                customClass="vw100"
                isLink
                onClick={this.bindGuiGeTap}
                renderTitle={
                  <Block>
                    <View>
                      请选择:
                      <Block>
                        {goodsDetail.properties.map((item, index) => {
                          return <Block key={item.id}>{item.name}</Block>
                        })}
                      </Block>
                      <Block>
                        {goodsAddition.map((item, index) => {
                          return <Block key={item.id}>{item.name}</Block>
                        })}
                      </Block>
                    </View>
                  </Block>
                }
              ></VanCell>
            )}
            {goodsDetailSkuShowType == 1 && (
              <View className="size-label-box2">
                <View className="label-title">选择商品规格</View>
                <View className="size-label-box">
                  {goodsDetail.properties.map((property, idx) => {
                    return (
                      <Block key={property.id}>
                        <View className="label">{property.name}</View>
                        <View className="label-item-box">
                          {property.childsCurGoods.map((item, index) => {
                            return (
                              <View
                                className={
                                  'label-item ' + (item.active ? 'active' : '')
                                }
                                key={item.id}
                                onClick={this.labelItemTap}
                                data-propertyindex={idx}
                                data-propertychildindex={index}
                              >
                                {item.name}
                              </View>
                            )
                          })}
                        </View>
                      </Block>
                    )
                  })}
                </View>
                <VanCell title="购买数量">
                  <View>
                    <VanStepper
                      value={buyNumber}
                      min={buyNumMin}
                      max={buyNumMax}
                      onChange={this.stepChange}
                    ></VanStepper>
                  </View>
                </VanCell>
              </View>
            )}
            {shopSubdetail && (
              <View className="shop-container">
                <Image mode="aspectFill" src={shopSubdetail.info.pic}></Image>
                <View className="info">
                  <View className="title">{shopSubdetail.info.name}</View>
                  <View className="address">{shopSubdetail.info.address}</View>
                </View>
              </View>
            )}
            <View className="goods-des-info" id="goods-des-info">
              <View className="label-title">
                <View className="left">商品详情</View>
              </View>
              <View className="goods-text">
                {cpsJdGoodsDetail.detailImagesArray.map((item, index) => {
                  return (
                    <Image key={item.id} mode="widthFix" src={item}></Image>
                  )
                })}
              </View>
            </View>
            {!curGoodsKanjia && reputation && (
              <VanCellGroup customClass="vw100" title="宝贝评价">
                {reputation.map((item, index) => {
                  return (
                    <Block key={item.id}>
                      <VanCell
                        customClass="reputation-cell"
                        icon={item.user.avatarUrl}
                        title={item.user.nick}
                        label={item.goods.dateReputation}
                        border={false}
                      >
                        <VanRate
                          value={item.goods.goodReputation}
                          color="#e64340"
                          readonly
                        ></VanRate>
                      </VanCell>
                      {item.goods.goodReputationRemark && (
                        <VanCell
                          titleClass="reputation-cell-reamrk"
                          title={item.goods.goodReputationRemark}
                        ></VanCell>
                      )}
                      {item.reputationPics && (
                        <View className="reputation-pics">
                          {item.reputationPics.map((picItem, index) => {
                            return (
                              <Image
                                src={picItem.pic}
                                mode="aspectFill"
                                onClick={this.previewImage}
                                data-url={picItem.pic}
                              ></Image>
                            )
                          })}
                        </View>
                      )}
                      {item.goods.goodReputationReply && (
                        <VanCell
                          titleClass="reputation-cell-reamrk"
                          title={'掌柜回复:' + item.goods.goodReputationReply}
                        ></VanCell>
                      )}
                    </Block>
                  )
                })}
              </VanCellGroup>
            )}
            {!curGoodsKanjia && (
              <VanGoodsAction>
                <VanGoodsActionIcon
                  icon="chat-o"
                  text="客服"
                  openType="contact"
                  sendMessageTitle={goodsDetail.basicInfo.name}
                  sendMessageImg={goodsDetail.basicInfo.pic}
                  sendMessagePath={
                    '/packageCps/pages/goods-details/cps-jd?id=' +
                    goodsDetail.basicInfo.id
                  }
                  showMessageCard={true}
                ></VanGoodsActionIcon>
                <VanGoodsActionIcon
                  icon={faved ? 'like' : 'like-o'}
                  text="收藏"
                  onClick={this.addFav}
                ></VanGoodsActionIcon>
                <VanGoodsActionButton
                  text="立即购买"
                  data-shopType={shopType}
                  onClick={this.tobuy}
                ></VanGoodsActionButton>
              </VanGoodsAction>
            )}
          </ScrollView>
        </View>
        {posterShow && (
          <Block>
            <View className="poster-mask"></View>
            <View className="poster">
              <Canvas
                className="canvas"
                style={canvasstyle}
                canvasId="firstCanvas"
              ></Canvas>
            </View>
            <View className="poster-btn">
              <Button type="primary" size="mini" onClick={this._saveToMobile}>
                保存图片
              </Button>
              <Button type="warn" size="mini" onClick={this.closePop}>
                关闭
              </Button>
            </View>
          </Block>
        )}
        <ApifmLoginTmpl
          data={{
            wxlogin: wxlogin,
          }}
        ></ApifmLoginTmpl>
        <Poster
          id="poster"
          config={posterConfig}
          onSuccess={this.onPosterSuccess}
          onFail={this.onPosterFail}
        ></Poster>
        {showposterImg && <View className="popup-mask"></View>}
        {showposterImg && (
          <View className="posterImg-box">
            <Image
              mode="widthFix"
              className="posterImg"
              src={posterImg}
            ></Image>
            <View className="btn-create" onClick={this.savePosterPic}>
              保存到相册
            </View>
          </View>
        )}
        <VanPopup
          show={!hideShopPopup}
          round
          closeable
          position="bottom"
          customStyle="padding-top:48rpx;max-height: 80%;"
          onClose={this.closePopupTap}
        >
          <VanCard
            centered
            price={price.priceSale}
            originPrice={price.priceJd ? price.priceJd : ''}
            title={price.skuName}
            thumb={imageDomain + price.pic}
          ></VanCard>
          <VanCell title="购买数量">
            <View>
              <VanStepper
                value={buyNumber}
                min={1}
                max={999}
                onChange={this.stepChange}
              ></VanStepper>
            </View>
          </VanCell>
          {curAddressData && (
            <VanCellGroup title="配送地址">
              <VanCell
                title={curAddressData.linkMan + ' ' + curAddressData.mobile}
                label={curAddressData.address}
                value="更换"
                isLink
                onClick={this.selectAddress}
              ></VanCell>
            </VanCellGroup>
          )}
          {!curAddressData && (
            <VanButton onClick={this.selectAddress} type="warning" block>
              添加收货地址
            </VanButton>
          )}
          {curAddressData && !canPurchase && (
            <VanButton type="warning" disabled block>
              该地区已售罄
            </VanButton>
          )}
          {curAddressData && canPurchase && shopType == 'addShopCar' && (
            <VanButton onClick={this.addShopCar} type="danger" block>
              加入购物车
            </VanButton>
          )}
          {curAddressData &&
            canPurchase &&
            (shopType == 'tobuy' || shopType == 'toPingtuan') && (
              <VanButton
                data-shopType={shopType}
                onClick={this.buyNow}
                type="danger"
                block
              >
                立即购买
              </VanButton>
            )}
        </VanPopup>
      </Block>
    )
  }
}
export default _C
