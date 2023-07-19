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
const app = Taro.getApp()
import WXAPI from '../../../apifm-wxapi'
const AUTH = require('../../../utils/auth.js')
const wxpay = require('../../../utils/pay.js')
const ImageUtil = require('../../../utils/image.js')
const APP = Taro.getApp()
// fixed首次打开不显示标题的bug

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
    wxlogin: true,
    balance: 0,
    freeze: 0,
    score: 0,
    score_sign_continuous: 0,
    cashlogs: undefined,
    tabs: ['资金明细', '提现记录', '押金记录'],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    withDrawlogs: undefined,
    depositlogs: undefined,
    rechargeOpen: false,
    // 是否开启充值[预存]功能
    TzCount: 0,
    //团长数
    TyCount: 0,
    //团员数
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
    tzid: '',
    //团长id
    originShow: false, //显示固定得二维码 不带参数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    Taro.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft:
            (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset:
            (res.windowWidth / that.data.tabs.length) * that.data.activeIndex,
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      navHeight: APP.globalData.navHeight,
      navTop: APP.globalData.navTop,
      windowHeight: APP.globalData.windowHeight,
      menuButtonObject: APP.globalData.menuButtonObject, //小程序胶囊信息
    })

    AUTH.checkHasLogined().then((isLogined) => {
      this.setData({
        wxlogin: isLogined,
      })
      if (isLogined) {
        this.doneShow()
        this.getUserApiInfo()
        this.getTz(1)
        this.getTy(2)
        this.getfxMoney()
        this.fxMembers()
        this.getMembersStatistics()
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
      commisionData.today = res.data[0].amount
      commisionData.todayXiaoshou = res.data[0].saleroom
    }
    res = await WXAPI.siteStatisticsSaleroom({
      dateBegin: yestoday.format('yyyyMMdd'),
      dateEnd: yestoday.format('yyyyMMdd'),
      uid: uid,
    })
    if (res.code === 0) {
      commisionData.yesday = res.data[0].amount
      commisionData.yesdayXiaoshou = res.data[0].saleroom
    }
    res = await WXAPI.siteStatisticsSaleroom({
      dateBegin: nowDate.format('yyyyMM'),
      dateEnd: nowDate.format('yyyyMM'),
      uid: uid,
    })
    if (res.code === 0) {
      commisionData.thisMonth = res.data[0].amount
      commisionData.thisMonthXiaoshou = res.data[0].saleroom
    }
    res = await WXAPI.siteStatisticsSaleroom({
      dateBegin: lastMonth,
      dateEnd: lastMonth,
      uid: uid,
    })
    if (res.code === 0) {
      commisionData.lastMonth = res.data[0].amount
      commisionData.lastMonthXiaoshou = res.data[0].saleroom
    }
    this.setData({
      commisionData: commisionData,
    })
  },
  backto() {
    Taro.navigateBack()
  },
  getUserApiInfo: function () {
    var that = this
    WXAPI.userDetail(Taro.getStorageSync('token')).then(function (res) {
      if (res.code == 0) {
        let _data = {}
        _data.apiUserInfoMap = res.data
        if (res.data.base.mobile) {
          _data.userMobile = res.data.base.mobile
        }
        if (
          that.data.order_hx_uids &&
          that.data.order_hx_uids.indexOf(res.data.base.id) != -1
        ) {
          _data.canHX = true // 具有扫码核销的权限
        }

        const adminUserIds = Taro.getStorageSync('adminUserIds')
        if (adminUserIds && adminUserIds.indexOf(res.data.base.id) != -1) {
          _data.isAdmin = true
        }
        if (res.data.peisongMember && res.data.peisongMember.status == 1) {
          _data.memberChecked = false
        } else {
          _data.memberChecked = true
        }
        that.setData(_data)
        that.commision()
        if (res.data.base.isTeamLeader || res.data.partnerInfo) {
          that.fetchQrcode(false)
        }
      }
    })
  },
  doneShow: function () {
    const _this = this
    const token = Taro.getStorageSync('token')
    if (!token) {
      this.setData({
        wxlogin: false,
      })
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
        this.setData({
          wxlogin: false,
        })
        return
      }
      if (res.code == 0) {
        _this.setData({
          balance: res.data.balance.toFixed(2),
          freeze: res.data.freeze.toFixed(2),
          totleConsumed: res.data.totleConsumed.toFixed(2),
          score: res.data.score,
        })
      }
    })
    this.fetchTabData(this.data.activeIndex)
  },
  async getfxMoney() {
    const res = await WXAPI.partnerSetting()
    console.log('getfxMoney', res)
    if (res.code == 0) {
      this.setData({
        fxData: res.data,
      })
    }
  },
  async payFx() {
    var money = this.data.fxData.priceLeader
    wxpay.wxpay('payTz', money, '', '/pages/packageA/pages/vip/index')
  },
  fetchTabData(activeIndex) {
    if (activeIndex == 0) {
      this.cashLogs()
    }
    if (activeIndex == 1) {
      this.withDrawlogs()
    }
    if (activeIndex == 2) {
      this.depositlogs()
    }
  },
  cashLogs() {
    const _this = this
    WXAPI.cashLogsV2({
      token: Taro.getStorageSync('token'),
      page: 1,
      pageSize: 50,
    }).then((res) => {
      if (res.code == 0) {
        _this.setData({
          cashlogs: res.data.result,
        })
      }
    })
  },
  withDrawlogs() {
    const _this = this
    WXAPI.withDrawLogs({
      token: Taro.getStorageSync('token'),
      page: 1,
      pageSize: 50,
    }).then((res) => {
      if (res.code == 0) {
        _this.setData({
          withDrawlogs: res.data,
        })
      }
    })
  },
  depositlogs() {
    const _this = this
    WXAPI.depositList({
      token: Taro.getStorageSync('token'),
      page: 1,
      pageSize: 50,
    }).then((res) => {
      if (res.code == 0) {
        _this.setData({
          depositlogs: res.data.result,
        })
      }
    })
  },
  recharge: function (e) {
    Taro.navigateTo({
      url: '/pages/recharge/index',
    })
  },
  withdraw: function (e) {
    Taro.navigateTo({
      url: '/pages/withdraw/index',
    })
  },
  payDeposit: function (e) {
    Taro.navigateTo({
      url: '/pages/deposit/pay',
    })
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
    })
    this.fetchTabData(e.currentTarget.id)
  },
  cancelLogin() {
    Taro.switchTab({
      url: '/pages/my/index',
    })
  },
  processLogin(e) {
    if (!e.detail.userInfo) {
      Taro.showToast({
        title: '已取消',
        icon: 'none',
      })
      return
    }
    AUTH.register(this)
  },
  async getcashLogJD() {
    //获取金豆
    const _this = this
    await WXAPI.cashLogsV2({
      token: Taro.getStorageSync('token'),
      page: 1,
      pageSize: 50000,
      type: 7,
    }).then((res) => {
      if (res.code == 0) {
        _this.setData({
          cashLogJD: res.data,
        })
        _this.setData({
          invite_count: res.data.totalRow,
          getJD: res.data.totalRow,
        })
      } else {
        _this.setData({
          invite_count: 0,
          getJD: 0,
        })
      }
    })
  },
  async getcashLogJDtx() {
    //获取金豆(已提现)
    const _this = this
    await WXAPI.cashLogsV2({
      token: Taro.getStorageSync('token'),
      page: 1,
      pageSize: 50000,
      type: 1,
    }).then((res) => {
      if (res.code == 0) {
        _this.setData({
          txJD: res.data.totalRow,
        })
      } else {
        _this.setData({
          txJD: 0,
        })
      }
    })
  },
  copyContent(e) {
    console.log('1')
    var data = e.currentTarget.dataset.id + ''
    Taro.setClipboardData({
      data: data,
      success(res) {
        Taro.getClipboardData({
          success(res) {
            console.log(res.data) // data
          },
        })
      },
    })
  },

  async getMembersStatistics() {
    //团队情况
    const res = await WXAPI.partnerMembersStatistics(
      Taro.getStorageSync('token')
    )
    if (res.code == 0) {
      this.setData({
        membersStatistics: res.data,
      })
    }
  },
  async getTz(name) {
    //团长
    const res = await WXAPI.fxMembers({
      token: Taro.getStorageSync('token'),
      page: 1,
      pageSize: 50,
      level: name,
      // "不填全部，1为团队长，2为团员"
      statisticsDay: '2021',
    })
    if (res.code == 0) {
      this.setData({
        TzCount: res.data.result.length,
      })
    }
  },
  async getTy(name) {
    //团员
    const res = await WXAPI.fxMembers({
      token: Taro.getStorageSync('token'),
      page: 1,
      pageSize: 50,
      level: name,
      // "不填全部，1为团队长，2为团员"
      statisticsDay: '2021',
    })
    if (res.code == 0) {
      this.setData({
        TyCount: res.data.result.length,
      })
    }
  },
  async fxMembers() {
    const res = await WXAPI.fxMembers({
      token: Taro.getStorageSync('token'),
    })
    console.log('fxmenber', res)
  },
  goFxmem(e) {
    var level = e.currentTarget.dataset.level
    Taro.navigateTo({
      url: 'fxmember?level=' + level,
    })
  },
  goCommision() {
    Taro.navigateTo({
      url: '../commisionLog/index',
    })
  },
  async partnerBindTeamLeader() {
    var uid = this.data.tzid
    const res = await WXAPI.partnerBindTeamLeader(
      Taro.getStorageSync('token'),
      uid
    )
    if (res.code != 0) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
    } else if (res.code == 0) {
      Taro.showToast({
        title: '设置团长成功',
      })
      setTimeout(() => {
        this.onShow()
      }, 1000)
    }
  },
  onChange(e) {
    this.setData({
      tzid: e.detail,
    })
  },
  fetchQrcode(test) {
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
      check_path: test ? false : true,
    }).then((res) => {
      Taro.hideLoading()
      if (res.code == 41030) {
        _this.fetchQrcode(true)
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
        const qrcodeWidth = 160
        console.log('imageSize', imageSize)
        _this.setData({
          canvasHeight: qrcodeWidth,
        })
        ctx = Taro.createCanvasContext('firstCanvas')
        ctx.setFillStyle('#fff')
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
  // =====================保存推荐二维码图片到手机==========================
  saveToMobile() {
    //下载二维码到手机
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
              duration: 2000,
            })
          },
        })
      },
    })
  },
  // =====================保存固定二维码图片到手机==========================
  saveOri() {
    let that = this
    //若二维码未加载完毕，加个动画提高用户体验
    Taro.showToast({
      icon: 'loading',
      title: '正在保存图片',
      duration: 1000,
    })
    //判断用户是否授权"保存到相册"
    Taro.getSetting({
      success(res) {
        //没有权限，发起授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          Taro.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              //用户允许授权，保存图片到相册
              that.savePhoto()
            },
            fail() {
              //用户点击拒绝授权，跳转到设置页，引导用户授权
              Taro.openSetting({
                success() {
                  Taro.authorize({
                    scope: 'scope.writePhotosAlbum',
                    success() {
                      that.savePhoto()
                    },
                  })
                },
              })
            },
          })
        } else {
          //用户已授权，保存到相册
          that.savePhoto()
        }
      },
    })
  },
  //保存图片到相册，提示保存成功
  savePhoto() {
    let that = this
    Taro.downloadFile({
      url: 'https://dcdn.it120.cc/2021/01/24/928782d2-062c-4a45-9911-b331fdf38ed9.jpg',
      success: function (res) {
        Taro.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            Taro.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 1000,
            })
          },
        })
      },
    })
  },
})
class _C extends React.Component {
  render() {
    const {
      apiUserInfoMap,
      freeze,
      balance,
      commisionData,
      membersStatistics,
      tzid,
      fxData,
      wxlogin,
    } = this.data
    return (
      <Block>
        <View>
          <Image
            style="width:750rpx;height:200rpx"
            mode="scaleToFill"
            src="https://dcdn.it120.cc/2021/01/13/3bb7207c-de68-476e-a5f8-8a2bfb7f1f09.png"
          ></Image>
        </View>
        {apiUserInfoMap.base.isTeamMember ||
        apiUserInfoMap.base.isTeamLeader ||
        apiUserInfoMap.partnerInfo ? (
          <View>
            <View className="tabTop" style="margin-top:-88rpx">
              {apiUserInfoMap && (
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
                    <View style="display:flex">
                      <View className="nick">{apiUserInfoMap.base.nick}</View>
                      {apiUserInfoMap.partnerInfo ? (
                        <View
                          className="nick"
                          style="padding:2rpx 10rpx;background-color:#FFAF32;color:white;border-radius:10rpx;font-size:14px;margin-left:10px"
                        >
                          合伙人
                        </View>
                      ) : (
                        apiUserInfoMap.base.isTeamLeader && (
                          <View
                            className="nick"
                            style="padding:2rpx 10rpx;background-color:#FFAF32;color:white;border-radius:10rpx;font-size:14px;margin-left:10px"
                          >
                            团长
                          </View>
                        )
                      )}
                    </View>
                  </View>
                </View>
              )}
              <View className="header-box2"></View>
              <View className="line"></View>
              <View className="asset">
                <View className="item">
                  <View className="Count">{freeze}</View>
                  <View>冻结金额</View>
                </View>
                <View className="item right">
                  <View className="Count" style="color:#FF444A">
                    {balance}
                  </View>
                  <View>可用金额</View>
                </View>
                <View
                  className="txBtn"
                  onClick={this.withdraw}
                  style="margin-top:20px;background: #F5D795;"
                >
                  立即提现
                </View>
              </View>
              <View className="line"></View>
              <View className="titleXS">我的销售额</View>
              <View className="asset">
                <View className="item">
                  <View className="Count">{commisionData.todayXiaoshou}</View>
                  <View>今日销售</View>
                  <View className="yjP">{commisionData.today}</View>
                  <View className="yjT">（佣金）</View>
                </View>
                <View className="item right">
                  <View className="Count">{commisionData.yesdayXiaoshou}</View>
                  <View>昨天销售</View>
                  <View className="yjP">{commisionData.yesday}</View>
                  <View className="yjT">（佣金）</View>
                </View>
                <View className="item right" onClick={this.goScore}>
                  <View className="Count">
                    {commisionData.thisMonthXiaoshou}
                  </View>
                  <View>本月销售</View>
                  <View className="yjP">{commisionData.thisMonth}</View>
                  <View className="yjT">（佣金）</View>
                </View>
                <View className="item right">
                  <View className="Count">
                    {commisionData.lastMonthXiaoshou}
                  </View>
                  <View>上月销售</View>
                  <View className="yjP">{commisionData.lastMonth}</View>
                  <View className="yjT">（佣金）</View>
                </View>
              </View>
            </View>
            {apiUserInfoMap.partnerInfo ? (
              <View>
                {apiUserInfoMap.partnerInfo && (
                  <View className="tuan">
                    <View>我的团队</View>
                    <View className="line2"></View>
                    <View style="display:flex">
                      <View
                        className="tuanItem"
                        onClick={this.goFxmem}
                        data-level="0"
                      >
                        <View className="tI1">
                          {membersStatistics.leaders + '人'}
                        </View>
                        <View className="tI2">团队长</View>
                      </View>
                      <View
                        className="tuanItem"
                        onClick={this.goFxmem}
                        data-level="1"
                      >
                        <View className="tI1">
                          {membersStatistics.members + '人'}
                        </View>
                        <View className="tI2">团员</View>
                      </View>
                    </View>
                  </View>
                )}
                <View
                  className="tuan2"
                  style="margin-top:10px;display:flex;justify-content: space-between;margin-bottom:10px"
                  onClick={this.goCommision}
                >
                  <View className="tL" style="display:flex;align-items:center">
                    <View>推广订单</View>
                    <Image
                      className="next"
                      src={require('../../../images/icon/next.png')}
                    ></Image>
                  </View>
                </View>
                <View
                  className="tuan2"
                  style="margin-top:10px;display:flex;justify-content: space-between;"
                >
                  <View className="tL" style="display:flex;align-items:center">
                    <View>我的邀请码</View>
                    <View className="yqCode">{apiUserInfoMap.base.id}</View>
                  </View>
                  <View
                    className="cybtn"
                    onClick={this.copyContent}
                    data-id={apiUserInfoMap.base.id}
                  >
                    复制
                  </View>
                </View>
              </View>
            ) : apiUserInfoMap.base.isTeamLeader ? (
              <View>
                {apiUserInfoMap.parentPartnerInfo && (
                  <View
                    className="tuan"
                    style="padding: 40rpx 40rpx 20rpx 40rpx;margin-bottom:10px"
                  >
                    <View>我的合伙人</View>
                    <View className="line2"></View>
                    <View style="display:flex">
                      <Image
                        style="width:80rpx;height:80rpx;margin:10px 20px 0px 0;border-radius:100%"
                        src={apiUserInfoMap.parentPartnerInfo.avatarUrl}
                      ></Image>
                      <View style="height:120rpx;line-height:120rpx">
                        {apiUserInfoMap.parentPartnerInfo.nick}
                      </View>
                    </View>
                  </View>
                )}
                <View
                  className="tuan2"
                  style="margin-top:10px;display:flex;justify-content: space-between;margin-bottom:10px"
                  onClick={this.goFxmem}
                  data-level="1"
                >
                  <View className="tL" style="display:flex;align-items:center">
                    <View>我的团员</View>
                    <Image
                      className="next"
                      src={require('../../../images/icon/next.png')}
                    ></Image>
                  </View>
                </View>
                <View
                  className="tuan2"
                  style="margin-top:10px;display:flex;justify-content: space-between;margin-bottom:10px"
                  onClick={this.goCommision}
                >
                  <View className="tL" style="display:flex;align-items:center">
                    <View>推广订单</View>
                    <Image
                      className="next"
                      src={require('../../../images/icon/next.png')}
                    ></Image>
                  </View>
                </View>
                <View
                  className="tuan2"
                  style="margin-top:10px;display:flex;justify-content: space-between;margin-bottom:10px"
                >
                  <View className="tL" style="display:flex;align-items:center">
                    <View>我的邀请码</View>
                    <View className="yqCode">{apiUserInfoMap.base.id}</View>
                  </View>
                  <View
                    className="cybtn"
                    onClick={this.copyContent}
                    data-id={apiUserInfoMap.base.id}
                  >
                    复制
                  </View>
                </View>
              </View>
            ) : (
              apiUserInfoMap.base.isTeamMember && (
                <View>
                  {apiUserInfoMap.parentTeamLeaderInfo ? (
                    <View
                      className="tuan"
                      style="padding: 40rpx 40rpx 20rpx 40rpx;"
                    >
                      <View>我的团长</View>
                      <View className="line2"></View>
                      <View style="display:flex">
                        <Image
                          style="width:80rpx;height:80rpx;margin:10px 20px 0px 0;border-radius:100%"
                          src={apiUserInfoMap.parentTeamLeaderInfo.avatarUrl}
                        ></Image>
                        <View style="height:120rpx;line-height:120rpx">
                          {apiUserInfoMap.parentTeamLeaderInfo.nick}
                        </View>
                      </View>
                    </View>
                  ) : (
                    <View
                      className="tuan"
                      style="padding: 40rpx 40rpx 20rpx 40rpx;"
                    >
                      <View>绑定团长</View>
                      <View className="line2"></View>
                      <VanField
                        value={tzid}
                        placeholder="请输入团长邀请码，立即成为会员"
                        border={false}
                        onChange={this.onChange}
                        clearable
                        inputAlign="center"
                      ></VanField>
                      <View style="text-align:center">
                        <View
                          className="tzBtn"
                          onClick={this.partnerBindTeamLeader}
                          style="margin-top:20px;background: #F5D795;"
                        >
                          立即绑定
                        </View>
                      </View>
                    </View>
                  )}
                  <View className="tuan" style="margin-top:10px">
                    <View>我的团队</View>
                    <View className="line2"></View>
                    <View style="width:100%;text-align:center">
                      <View className="textsjtz">
                        您还不是团长，支付
                        <Span style="color: #FF444A;">
                          {fxData.priceLeader}
                        </Span>
                        立即升级
                      </View>
                    </View>
                    <View style="text-align:center">
                      {fxData.isOpen && !apiUserInfoMap.base.isTeamLeader && (
                        <View
                          className="tzBtn"
                          style="margin-top:20px;background: #F5D795;"
                          onClick={this.payFx}
                        >
                          立即升级
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              )
            )}
            {(apiUserInfoMap.base.isTeamLeader ||
              apiUserInfoMap.partnerInfo) && (
              <View
                className="noApply"
                style="padding-top:10px;padding-bottom:20px"
              >
                <View style="text-align:center">
                  <Canvas
                    className="canvas"
                    style="height:160px;width:160px;margin:0 auto"
                    canvasId="firstCanvas"
                  ></Canvas>
                  <View
                    className="tzBtn"
                    onClick={this.saveToMobile}
                    style="margin-top:10px;background: #F5D795;"
                  >
                    保存到相册
                  </View>
                </View>
              </View>
            )}
          </View>
        ) : (
          <View className="tabTop" style="margin-top:-88rpx">
            {apiUserInfoMap && (
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
            )}
            <View className="header-box2">您当前还不是分销商</View>
            <View className="line"></View>
            <View style="padding:20px">
              <VanCellGroup>
                <VanField
                  value={tzid}
                  placeholder="请输入团长邀请码，立即成为分销商"
                  onChange={this.onChange}
                ></VanField>
              </VanCellGroup>
            </View>
            <View style="text-align:center">
              <View
                className="tzBtn"
                onClick={this.partnerBindTeamLeader}
                style="margin-top:20px;background: #F5D795;"
              >
                立即加入
              </View>
            </View>
          </View>
        )}
        <ApifmLoginTmpl
          data={{
            wxlogin: wxlogin,
          }}
        ></ApifmLoginTmpl>
        {/*  <float-menu /> */}
      </Block>
    )
  }
}
export default _C
