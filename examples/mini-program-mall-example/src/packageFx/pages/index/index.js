import { Block, View, Image, Canvas } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
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
import './index.scss'
import WXAPI from '../../../apifm-wxapi'
const AUTH = require('../../../utils/auth.js')
const ImageUtil = require('../../../utils/image.js')
const APP = Taro.getApp()
var sliderWidth = 96 // 需要设置slider的宽度，用于计算中间位置

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
  /**
   * 页面的初始数据
   */
  data: {
    balance: 0,
    freeze: 0,
    fxCommisionPaying: 0,
    score: 0,
    commisionData: {
      today: 0,
      yesday: 0,
      thisMonth: 0,
      lastMonth: 0,
      todayXiaoshou: 0,
      yesdayXiaoshou: 0,
      thisMonthXiaoshou: 0,
      lastMonthXiaoshou: 0,
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.setStorageSync('token', '4f02de6e-914f-4439-a128-a62a6bbdc3e4')
    this.adPosition()
  },
  onShow: function () {
    AUTH.checkHasLogined().then((isLogined) => {
      if (isLogined) {
        this.doneShow()
        this.doneShow2()
        this.getUserApiInfo()
      }
    })
  },
  async commision() {
    const uid = this.data.apiUserInfoMap.base.id
    var commisionData = this.data.commisionData
    const nowDate = new Date()
    console.log('今天', nowDate.format('yyyyMMdd'))
    console.log('本月', nowDate.format('yyyyMM'))
    const yestoday = new Date(nowDate.getTime() - 24 * 60 * 60 * 1000)
    console.log('昨天', yestoday.format('yyyyMMdd'))
    // 上个月
    let year = nowDate.getFullYear()
    let month = nowDate.getMonth() + 1
    if (month == 1) {
      month = 12
      year--
    } else {
      month--
    }
    const lastMonth = year + '' + (month < 10 ? '0' + month : month)
    console.log('上个月', lastMonth)
    let res = await WXAPI.siteStatisticsSaleroom({
      dateBegin: nowDate.format('yyyyMMdd'),
      dateEnd: nowDate.format('yyyyMMdd'),
      uid: uid,
    })
    if (res.code === 0) {
      commisionData.today = res.data[0].estimateCommission
      commisionData.todayXiaoshou = res.data[0].saleroom
    }
    res = await WXAPI.siteStatisticsSaleroom({
      dateBegin: yestoday.format('yyyyMMdd'),
      dateEnd: yestoday.format('yyyyMMdd'),
      uid: uid,
    })
    if (res.code === 0) {
      commisionData.yesday = res.data[0].estimateCommission
      commisionData.yesdayXiaoshou = res.data[0].saleroom
    }
    res = await WXAPI.siteStatisticsSaleroom({
      dateBegin: nowDate.format('yyyyMM'),
      dateEnd: nowDate.format('yyyyMM'),
      uid: uid,
    })
    if (res.code === 0) {
      commisionData.thisMonth = res.data[0].estimateCommission
      commisionData.thisMonthXiaoshou = res.data[0].saleroom
    }
    res = await WXAPI.siteStatisticsSaleroom({
      dateBegin: lastMonth,
      dateEnd: lastMonth,
      uid: uid,
    })
    if (res.code === 0) {
      commisionData.lastMonth = res.data[0].estimateCommission
      commisionData.lastMonthXiaoshou = res.data[0].saleroom
    }
    this.setData({
      commisionData: commisionData,
    })
  },
  getUserApiInfo: function () {
    var that = this
    WXAPI.userDetail(Taro.getStorageSync('token')).then(function (res) {
      if (res.code == 0) {
        let _data = {}
        _data.apiUserInfoMap = res.data
        that.setData(_data)
        that.commision()
        if (res.data.base.isSeller) {
          // 判断是否是市区合伙人
          that.fxCities()
        }
      }
    })
  },
  doneShow: function () {
    const _this = this
    const token = Taro.getStorageSync('token')
    if (!token) {
      return
    }
    WXAPI.userAmount(token).then(function (res) {
      if (res.code == 700) {
        Taro.showToast({
          title: '当前账户存在异常',
          icon: 'none',
        })
        return
      }
      if (res.code == 2000) {
        return
      }
      if (res.code == 0) {
        _this.setData({
          balance: res.data.balance.toFixed(2),
          freeze: res.data.freeze.toFixed(2),
          fxCommisionPaying: res.data.fxCommisionPaying.toFixed(2),
          totleConsumed: res.data.totleConsumed.toFixed(2),
          score: res.data.score,
        })
      }
    })
  },
  copyContent(e) {
    var data = e.currentTarget.dataset.id + ''
    Taro.setClipboardData({
      data: data,
    })
  },
  async doneShow2() {
    const _this = this
    const userDetail = await WXAPI.userDetail(Taro.getStorageSync('token'))
    WXAPI.fxApplyProgress(Taro.getStorageSync('token')).then((res) => {
      let applyStatus = userDetail.data.base.isSeller ? 2 : -1
      if (res.code == 2000) {
        return
      }
      if (res.code === 700) {
        _this.setData({
          applyStatus: applyStatus,
        })
      }
      if (res.code === 0) {
        if (userDetail.data.base.isSeller) {
          applyStatus = 2
        } else {
          applyStatus = res.data.status
        }
        _this.setData({
          applyStatus: applyStatus,
          applyInfo: res.data,
        })
      }
      if (applyStatus == 2) {
        _this.fetchQrcode()
      }
    })
  },
  fetchQrcode() {
    const _this = this
    Taro.showLoading({
      title: '加载中',
      mask: true,
    })
    WXAPI.wxaQrcode({
      scene: 'inviter_id=' + Taro.getStorageSync('uid'),
      page: 'pages/index/index',
      is_hyaline: true,
      autoColor: true,
      expireHours: 1,
    }).then((res) => {
      Taro.hideLoading()
      if (res.code == 41030) {
        Taro.showToast({
          title: '上线以后才可以获取二维码',
          icon: 'none',
        })
        return
      }
      if (res.code == 0) {
        _this.showCanvas(res.data)
      }
    })
  },
  showCanvas(qrcode) {
    const _this = this
    let ctx
    Taro.getImageInfo({
      src: qrcode,
      success: (res) => {
        const imageSize = ImageUtil.imageUtil(res.width, res.height)
        const qrcodeWidth = imageSize.windowWidth / 2
        _this.setData({
          canvasHeight: qrcodeWidth,
        })
        ctx = Taro.createCanvasContext('firstCanvas')
        ctx.setFillStyle('#FDF3E7')
        ctx.fillRect(
          0,
          0,
          imageSize.windowWidth,
          imageSize.imageHeight + qrcodeWidth
        )
        ctx.drawImage(res.path, 0, 0, qrcodeWidth, qrcodeWidth)
        setTimeout(function () {
          Taro.hideLoading()
          ctx.draw()
        }, 1000)
      },
    })
  },
  saveToMobile() {
    Taro.canvasToTempFilePath({
      canvasId: 'firstCanvas',
      success: function (res) {
        let tempFilePath = res.tempFilePath
        Taro.saveImageToPhotosAlbum({
          filePath: tempFilePath,
          success: (res) => {
            Taro.showModal({
              content: '二维码已保存到手机相册',
              showCancel: false,
              confirmText: '知道了',
              confirmColor: '#333',
            })
          },
          fail: (res) => {
            Taro.showToast({
              title: res.errMsg,
              icon: 'none',
            })
          },
        })
      },
    })
  },
  // 读取市区合伙人
  async fxCities() {
    const res = await WXAPI.fxCities(Taro.getStorageSync('token'))
    if (res.code == 0) {
      this.setData({
        fxCities: res.data,
      })
    }
  },
  // 读取广告位
  async adPosition() {
    const res = await WXAPI.adPosition('fx_index')
    if (res.code == 0) {
      this.setData({
        fxIndexAdPos: res.data,
      })
    }
  },
  goUrl(e) {
    const url = e.currentTarget.dataset.url
    if (url) {
      Taro.navigateTo({
        url: url,
      })
    }
  },
  onShareAppMessage() {
    return {
      title:
        '"' +
        Taro.getStorageSync('mallName') +
        '" ' +
        Taro.getStorageSync('share_profile'),
      path: '/pages/index/index?inviter_id=' + Taro.getStorageSync('uid'),
      imageUrl: Taro.getStorageSync('share_pic'),
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
      title:
        '"' +
        Taro.getStorageSync('mallName') +
        '" ' +
        Taro.getStorageSync('share_profile'),
      query: 'inviter_id=' + Taro.getStorageSync('uid'),
      imageUrl: this.data.goodsDetail.basicInfo.pic,
    }
  },
  goApply() {
    Taro.redirectTo({
      url: '/packageFx/pages/apply/index',
    })
  },
})
class _C extends React.Component {
  render() {
    const {
      apiUserInfoMap,
      fxCommisionPaying,
      freeze,
      balance,
      commisionData,
      fxIndexAdPos,
      canvasHeight,
      fxCities,
    } = this.data
    return (
      <Block>
        <View>
          <Image
            style="width:750rpx;height:486rpx"
            mode="aspectFit"
            src={require('../../images/index-top-bg.png')}
          ></Image>
        </View>
        {/*  如果当前用户是分销商  */}
        {apiUserInfoMap.base && apiUserInfoMap.base.isSeller && (
          <View>
            <View className="tabTop" style="margin-top:-420rpx">
              <View className="header-box">
                <Image
                  className="avatar"
                  src={apiUserInfoMap.base.avatarUrl}
                  mode="aspectFill"
                ></Image>
                <View className="r">
                  <View className="uid">
                    {'用户编号: ' + apiUserInfoMap.base.id}
                  </View>
                  <View style="display:flex">
                    <View className="nick">{apiUserInfoMap.base.nick}</View>
                  </View>
                </View>
              </View>
              <View className="header-box2"></View>
              <View className="line"></View>
              <View className="asset">
                <View
                  className="item"
                  onClick={this.goAsset}
                  style="width: 170rpx"
                >
                  <View className="Count">{fxCommisionPaying}</View>
                  <View>未结算金额</View>
                </View>
                <View
                  className="item"
                  onClick={this.goAsset}
                  style="width: 170rpx"
                >
                  <View className="Count">{freeze}</View>
                  <View>冻结金额</View>
                </View>
                <View
                  className="item right"
                  onClick={this.goAsset}
                  style="width: 170rpx"
                >
                  <View className="Count" style="color:#FF444A">
                    {balance}
                  </View>
                  <View>可用金额</View>
                </View>
              </View>
              <View className="line"></View>
              <View className="titleXS">我的业绩</View>
              <View className="asset">
                <View className="item">
                  <View className="Count">{commisionData.todayXiaoshou}</View>
                  <View>今日销售</View>
                  <View className="yjP">
                    {commisionData.today ? commisionData.today : 0}
                  </View>
                  <View className="yjT">（佣金）</View>
                </View>
                <View className="item right">
                  <View className="Count">{commisionData.yesdayXiaoshou}</View>
                  <View>昨天销售</View>
                  <View className="yjP">
                    {commisionData.yesday ? commisionData.yesday : 0}
                  </View>
                  <View className="yjT">（佣金）</View>
                </View>
                <View className="item right">
                  <View className="Count">
                    {commisionData.thisMonthXiaoshou}
                  </View>
                  <View>本月销售</View>
                  <View className="yjP">
                    {commisionData.thisMonth ? commisionData.thisMonth : 0}
                  </View>
                  <View className="yjT">（佣金）</View>
                </View>
                <View className="item right">
                  <View className="Count">
                    {commisionData.lastMonthXiaoshou}
                  </View>
                  <View>上月销售</View>
                  <View className="yjP">
                    {commisionData.lastMonth ? commisionData.lastMonth : 0}
                  </View>
                  <View className="yjT">（佣金）</View>
                </View>
              </View>
            </View>
            {apiUserInfoMap.referrer && (
              <View className="tuan" style="padding: 40rpx 40rpx 20rpx 40rpx;">
                <View>我的邀请人</View>
                <View className="line2"></View>
                <View style="display:flex">
                  <Image
                    style="width:80rpx;height:80rpx;margin:10px 20px 0px 0;border-radius:100%"
                    src={apiUserInfoMap.referrer.avatarUrl}
                  ></Image>
                  <View style="height:120rpx;line-height:120rpx;font-size:26rpx;">
                    {apiUserInfoMap.referrer.nick}
                  </View>
                </View>
              </View>
            )}
            {fxIndexAdPos && (
              <Image
                src={fxIndexAdPos.val}
                mode="widthFix"
                className="adpos"
                data-url={fxIndexAdPos.url}
                onClick={this.goUrl}
              ></Image>
            )}
            <VanCellGroup title="分销信息" customClass="cell-class">
              <VanField
                value={apiUserInfoMap.base.id}
                readonly
                center
                clearable
                label="我的邀请码"
                useButtonSlot
                renderButton={
                  <Block>
                    <VanButton
                      size="small"
                      type="info"
                      round
                      onClick={this.copyContent}
                      data-id={apiUserInfoMap.base.id}
                    >
                      复制
                    </VanButton>
                  </Block>
                }
              ></VanField>
              <VanCell
                title="我的团队"
                value="查看"
                isLink
                url="../myusers/index"
              ></VanCell>
              <VanCell
                title="推广订单"
                value="查看"
                isLink
                url="../commisionLog/index"
              ></VanCell>
              <VanCell
                title="账单明细"
                value="查看"
                isLink
                url="/pages/asset/index"
              ></VanCell>
            </VanCellGroup>
            {/*  团队长、副队长  */}
            {apiUserInfoMap.saleDistributionTeam &&
              (apiUserInfoMap.saleDistributionTeam.leader ==
                apiUserInfoMap.base.id ||
                apiUserInfoMap.saleDistributionTeam.deputyLeader ==
                  apiUserInfoMap.base.id) && (
                <VanCellGroup customClass="cell-class" title="我的团队">
                  <VanCell
                    title={apiUserInfoMap.saleDistributionTeam.name}
                  ></VanCell>
                  <VanCell
                    title="身份"
                    value={
                      apiUserInfoMap.saleDistributionTeam.leader ==
                      apiUserInfoMap.base.id
                        ? '队长'
                        : '副队长'
                    }
                  ></VanCell>
                  <VanCell
                    title="销售目标"
                    value={
                      '¥' +
                      apiUserInfoMap.saleDistributionTeam.standardSaleroom +
                      '/月'
                    }
                  ></VanCell>
                  <VanCell
                    title="本月销售"
                    value={
                      '¥' + apiUserInfoMap.saleDistributionTeam.curSaleroom
                    }
                  ></VanCell>
                  <VanCell
                    title="月度报表"
                    isLink
                    url={'../report/team?teamId=' + apiUserInfoMap.base.teamId}
                  ></VanCell>
                </VanCellGroup>
              )}
            {/*  城市合伙人  */}
            {fxCities.map((item, index) => {
              return (
                <VanCellGroup
                  key={item.id}
                  customClass="cell-class"
                  title={item.provinceName + item.cityName + '合伙人'}
                >
                  <VanCell
                    title="销售目标"
                    value={'¥' + item.standardSaleroom + '/月'}
                  ></VanCell>
                  <VanCell
                    title="本月销售"
                    value={'¥' + item.curSaleroom}
                  ></VanCell>
                  <VanCell
                    title="月度报表"
                    isLink
                    url={
                      '../report/city?provinceId=' +
                      item.provinceId +
                      '&cityId=' +
                      item.cityId
                    }
                  ></VanCell>
                </VanCellGroup>
              )
            })}
            <View
              className="noApply"
              style="padding-top:10px;padding-bottom:20px"
            >
              <View style="text-align:center;">
                <View className="canvas-box">
                  <Canvas
                    className="canvas"
                    style={
                      'width:' +
                      canvasHeight +
                      'px;height:' +
                      canvasHeight +
                      'px'
                    }
                    canvasId="firstCanvas"
                  ></Canvas>
                </View>
                <View
                  className="tzBtn"
                  onClick={this.saveToMobile}
                  style="margin-top:10px;background: #F5D795;padding: 0 16rpx;"
                >
                  保存到相册
                </View>
              </View>
            </View>
          </View>
        )}
        {/*  还不是分销商  */}
        {apiUserInfoMap.base && !apiUserInfoMap.base.isSeller && (
          <View className="tabTop" style="margin-top:-450rpx">
            <View className="header-box">
              <Image
                className="avatar"
                src={apiUserInfoMap.base.avatarUrl}
                mode="aspectFill"
              ></Image>
              <View className="r">
                <View className="uid">
                  {'用户ID: ' + apiUserInfoMap.base.id}
                </View>
                <View className="nick">{apiUserInfoMap.base.nick}</View>
              </View>
            </View>
            <View className="header-box2">您当前还不是分销商</View>
            <View className="line"></View>
            <View className="header-box2" onClick={this.goApply}>
              立即前往申请成为分销商 >
            </View>
          </View>
        )}
      </Block>
    )
  }
}
export default _C
