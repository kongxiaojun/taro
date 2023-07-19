import {
  Block,
  LivePusher,
  CoverView,
  CoverImage,
  Button,
  Input,
} from '@tarojs/components'
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
const CONFIG = require('../../../config.js')
import WXAPI from '../../../apifm-wxapi'

// websocket 第一步
let socketOpen = false
let socketMsgQueue = []
let that
@withWeapp({
  /**
   * 页面的初始数据
   */
  data: {
    beauty: 0,
    // 美颜，取值范围 0-9 ，0 表示关闭
    onlineNumber: 1,
    // 在线人数
    barrageList: [],
    // 用户聊天记录
    focus: false,
    firstTap: false,
    goodsList: [],
    pageIndex: 1,
    pageSize: 10,
    hasMore: true,
    showGoodsInfo: false,
    showEmpty: false,
    // 是否展示缺省提示
    ids: '',
    // 已经选中的商品id
    online_people: '',
    // 观看人数
    pusherUrl: '',
    roomId: undefined,
    showSetInfo: false,
  },
  // 某人加入房间、离开房间
  showTips(avatarurl, msg) {
    this.setData({
      showTips: true,
      showTipsAvatarUrl: avatarurl,
      showTipsMsg: msg,
    })
    if (!this.data.focus) {
      this.setScrollTop()
    }
    setTimeout(() => {
      this.setData({
        showTips: false,
      })
    }, 3000)
  },
  setScrollTop() {
    var query = Taro.createSelectorQuery(),
      e = that
    Taro.createSelectorQuery()
      .in(e)
      .select('.barrage')
      .boundingClientRect(function (res) {
        console.log(res)
        e.setData({
          chatbottom: res.bottom,
        })
      })
      .exec()
    query
      .in(e)
      .select('.item-outer')
      .boundingClientRect(function (res) {
        if (res.bottom > e.data.chatbottom) {
          let temp = Math.ceil(
            parseInt(res.bottom) - parseInt(e.data.chatbottom)
          )
          e.setData({
            scrollTop: temp, // 如此保证scrollTop的值 让滚动条一直滚动到最后 9999 开发工具可以设置为辞职 苹果真机不行
          })
        }
      })
      .exec()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // options.id = 13
    this.data.id = options.id
    // 读取自定义头高度
    const systemInfo = Taro.getSystemInfoSync()
    const custom = Taro.getMenuButtonBoundingClientRect()
    this.setData({
      systemInfo,
      customBarHeight: custom.bottom + custom.top - systemInfo.statusBarHeight,
    })
    this.getUserInfo()
    this.myLiveRoomsInfo()
    this.initWebSocket()
    // 设置屏幕常亮 兼容ios
    Taro.setKeepScreenOn({
      keepScreenOn: true,
    })
    // 设置屏幕亮度 0-1范围 设置了 用户自己去设置调节屏幕的亮度
    // wx.setScreenBrightness({ value: .6 })

    this.ctx = Taro.createLivePusherContext('pusher')
    let query = Taro.createSelectorQuery()
    query
      .select('.barrage')
      .boundingClientRect(function (rect) {
        // console.log(rect)
      })
      .exec()
  },
  // 主推商品详情
  async toDetail(e) {
    const id = e.currentTarget.dataset.id
    const res = await WXAPI.goodsDetail(id, Taro.getStorageSync('token'))
    if (res.code != 0) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
      return
    }
    if (res.data.basicInfo.supplyType == 'cps_jd') {
      Taro.navigateTo({
        url: `/packageCps/pages/goods-details/cps-jd?id=${id}`,
      })
    } else if (res.data.basicInfo.supplyType == 'cps_pdd') {
      Taro.navigateTo({
        url: `/packageCps/pages/goods-details/cps-pdd?id=${id}`,
      })
    } else if (res.data.basicInfo.supplyType == 'cps_taobao') {
      Taro.navigateTo({
        url: `/packageCps/pages/goods-details/cps-taobao?id=${id}`,
      })
    } else if (res.data.basicInfo.supplyType == 'vop_jd') {
      Taro.navigateTo({
        url: `/pages/goods-details/vop?id=${res.data.basicInfo.yyId}&goodsId=${res.data.basicInfo.id}`,
      })
    } else {
      Taro.navigateTo({
        url: `/pages/goods-details/index?id=${id}`,
      })
    }
  },
  preventDefault() {
    return
  },
  bindInput(e) {
    this.setData({
      inputVal: e.detail.value,
    })
  },
  /**
   * 发送弹幕问题
   */
  onComment() {
    const inputVal = this.data.inputVal
    if (!inputVal) {
      Taro.showToast({
        title: '内容不能为空',
        icon: 'none',
      })
      return
    }
    this.sendSocketMessage(inputVal)
    this.setData({
      inputVal: '',
      showInput: false,
    })
  },
  handleInteractionTap() {
    let data = this.data
    let temp
    if (!data.showInput) {
      temp = data.fullScreenHeight - 50
    } else {
      temp = app.globalData.screenH
    }
    this.setData({
      //showInput: !this.data.showInput,
      fullScreenHeight: temp,
      showInput: true,
      focus: true,
    })
  },
  navCart() {
    let url = `/pages/cart/cart`
    Taro.navigateTo({
      url,
    })
  },
  // 设置为主推商品
  async navPurchase(e) {
    const mainlyGoods =
      this.data.liveRoomsInfo.goodsList[e.currentTarget.dataset.idx]
    this.sendSocketMessage('act:mainlyGoods:' + mainlyGoods.id)
    const res = await WXAPI.liveRoomGoodsMainly({
      token: Taro.getStorageSync('token'),
      roomId: this.data.id,
      goodsId: mainlyGoods.id,
    })
  },
  hideGoods() {
    this.setData({
      showGoodsInfo: false,
      showInput: false,
    })
  },
  hidePeoples() {
    //隐藏人员信息
    console.log(1)
    this.hideGoods()
    this.setData({
      showPeopleInfo: false,
    })
  },
  hideSet() {
    this.setData({
      showSetInfo: false,
    })
  },
  async showPeoples() {
    //显示直播间人员
    Taro.showLoading({
      title: '',
    })
    const res = await WXAPI.liveRoomOnlineUsers(
      Taro.getStorageSync('token'),
      this.data.id
    )
    Taro.hideLoading()
    if (res.code != 0) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
      this.setData({
        showPeopleInfo: false,
        peoplelist: null,
      })
    } else {
      this.setData({
        showPeopleInfo: true,
        peoplelist: res.data,
      })
    }
  },
  lahei(e) {
    //拉黑用户
    let uid = e.currentTarget.dataset.uid
    const that = this
    Taro.showModal({
      title: '确认拉黑',
      content: '拉黑会强制该用户退出直播间',
      success(res) {
        if (res.confirm) {
          //console.log('用户点击确定')
          Taro.showLoading({
            title: '加载中',
          })
          WXAPI.liveRoomKickOutUser(
            Taro.getStorageSync('token'),
            that.data.id,
            uid
          ).then((res) => {
            that.showPeoples()
          })
        } else if (res.cancel) {
          //console.log('用户点击取消')
        }
      },
    })
  },
  showGoods() {
    let data = this.data
    if (!data.firstTap) {
      this.setData({
        firstTap: true,
      })
    }
    this.setData({
      showGoodsInfo: true,
      showEmpty: true,
    })
  },
  onReady(res) {
    this.ctx = Taro.createLivePusherContext('pusher')
  },
  // 旋转相机
  rotateTap() {
    this.ctx.switchCamera({
      success: (res) => {
        console.log('switchCamera success')
      },
      fail: (res) => {
        console.log('switchCamera fail')
      },
    })
  },
  backTap() {
    this.ctx.pause()
    Taro.navigateBack()
  },
  exit() {
    Taro.showModal({
      title: '提示',
      content: '确定结束本场直播吗？',
      success: (res) => {
        if (res.confirm) {
          this.ctx.stop({
            success: (res) => {
              console.log('stop success')
            },
            fail: (res) => {
              console.log('stop fail')
            },
          })
          Taro.navigateBack({
            delta: 2,
          })
          app.closeSocket()
        }
      },
    })
  },
  onUnload() {
    Taro.onSocketClose((res) => {
      console.log('WebSocket 已关闭！')
    })
  },
  onShow() {
    //进入页面链接
    console.log('app.globalData.socketStatus', app.globalData.socketStatus)
    if (app.globalData.socketStatus == 'closed') {
      // websocket方式
      app.openSocket(this.data.roomId, this, 'author')
    }
  },
  // 主播分享自己的直播间
  onShareAppMessage: function () {
    return {
      title: '快来我的直播间看看吧~',
      imageUrl: this.data.liveRoomsInfo.roomInfo.coverImage,
      path: `/packageStreamMedia/pages/live-client/client?id=${this.data.id}`,
    }
  },
  async getUserInfo() {
    const res = await WXAPI.userDetail(Taro.getStorageSync('token'))
    if (res.code == 0) {
      this.setData({
        apiUserInfoMap: res.data,
      })
    }
  },
  showBeautySelect() {
    this.setData({
      showSelect09: true,
    })
  },
  select09(e) {
    const num = e.currentTarget.dataset.num
    this.setData({
      beauty: num,
      showSelect09: false,
    })
  },
  async myLiveRoomsInfo() {
    const res = await WXAPI.myLiveRoomsInfo(
      Taro.getStorageSync('token'),
      this.data.id
    )
    if (res.code != 0) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
      Taro.navigateBack()
      return
    }
    let mainlyGoods = null
    if (res.data.mainlyGoodsId) {
      mainlyGoods = res.data.goodsList.find((ele) => {
        return ele.id == res.data.mainlyGoodsId
      })
    }
    this.setData({
      liveRoomsInfo: res.data,
      mainlyGoods,
    })
  },
  bindstatechange(e) {
    console.log(e)
  },
  // webscoket 第二步， 增加下面方法
  connectSocket() {
    Taro.connectSocket({
      url:
        'wss://api.it120.cc/websocket/liveRoom/' +
        this.data.id +
        '/' +
        Taro.getStorageSync('token'),
    })
  },
  initWebSocket() {
    this.connectSocket()
    Taro.onSocketOpen((res) => {
      console.log(res)
      socketOpen = true
      for (let i = 0; i < socketMsgQueue.length; i++) {
        sendSocketMessage(socketMsgQueue[i])
      }
      socketMsgQueue = []
    })
    Taro.onSocketClose((res) => {
      console.log(res)
      // 关闭，重连
      socketOpen = false
      if (res.code == 1004 && res.reason == 'kickOut') {
        Taro.reLaunch({
          url: '/pages/index/index',
        })
        return
      }
      Taro.showToast({
        title: res.code + ':' + res.reason,
        icon: 'none',
      })
      setTimeout(() => {
        this.connectSocket()
      }, 3000)
    })
    Taro.onSocketMessage((res) => {
      // 接收服务器推送的消息
      if (res.code != 0) {
        Taro.showToast({
          title: resJson.msg,
          icon: 'none',
        })
        return
      }
      const resJson = JSON.parse(res.data)
      this.processSocketMessage(resJson.data)
    })
  },
  sendSocketMessage(msg) {
    // 向 websocket 发送消息
    if (socketOpen) {
      Taro.sendSocketMessage({
        data: msg,
      })
    } else {
      socketMsgQueue.push(msg)
    }
  },
  processSocketMessage(res) {
    // 接收到服务器推送到消息
    console.log(res)
    if (res.act == 'onlineNumber') {
      this.setData({
        onlineNumber: res.data,
      })
    }
    if (res.act == 'userComing') {
      this.showTips(res.avatarUrl, `${res.nick}进入直播间`)
    }
    if (res.act == 'msg') {
      if (res.msg.indexOf('act:mainlyGoods:') == 0) {
        const goodsId = res.msg.replace('act:mainlyGoods:', '')
        console.log(goodsId)
        const mainlyGoods = this.data.liveRoomsInfo.goodsList.find((ele) => {
          return ele.id == goodsId
        })
        this.setData({
          mainlyGoods,
        })
        return
      }
      if (res.msg == 'act:like') {
        return
      }
      const barrageList = this.data.barrageList
      barrageList.push({
        nick: res.nick,
        avatarUrl: res.avatarUrl,
        msg: res.msg,
        color: this.getRandomFontColor(),
      })
      this.setData({
        barrageList:
          barrageList.length > 100 ? barrageList.slice(50) : barrageList,
      })
      if (this.data.focus) {
        return
      }
      this.setScrollTop()
    }
  },
  getRandomFontColor() {
    // 随机颜色
    let red = Math.floor(Math.random() * 266)
    let green = Math.floor(Math.random() * 266)
    let blue = Math.floor(Math.random() * 266)
    return 'rgb(' + red + ',' + green + ' , ' + blue + ')'
  },
})
class _C extends React.Component {
  render() {
    const {
      beauty,
      liveRoomsInfo,
      customBarHeight,
      apiUserInfoMap,
      onlineNumber,
      mainlyGoods,
      showTipsAvatarUrl,
      showTipsMsg,
      showTips,
      scrollTop,
      barrageList,
      systemInfo,
      showInput,
      focus,
      inputVal,
      showPeopleInfo,
      peoplelist,
      showGoodsInfo,
      showSelect09,
    } = this.data
    return (
      <Block>
        <LivePusher
          id="pusher"
          beauty={beauty}
          url={liveRoomsInfo.roomInfo.pushUrl}
          mode="FHD"
          autopush="true"
          style="width:100vw;height:100vh"
          waitingImage="https://mc.qcloudimg.com/static/img/daeed8616ac5df256c0591c22a65c4d3/pause_publish.jpg"
        ></LivePusher>
        <CoverView
          style="width:100vw;height:100vh"
          className="outer"
          onClick={this.privateStopNoop.bind(this, this.hidePeoples)}
        >
          <CoverView
            style={'height:' + customBarHeight + 'px'}
            className="back"
          >
            <CoverView className="icon" onClick={this.backTap}>
              <CoverImage
                src={require('../../images/back.png')}
                className="back-icon"
              ></CoverImage>
            </CoverView>
          </CoverView>
          {/*  直播信息  */}
          <CoverView className="anchor-info">
            <CoverView className="left">
              {apiUserInfoMap.base.avatarUrl && (
                <CoverImage
                  src={apiUserInfoMap.base.avatarUrl}
                  className="avatar"
                ></CoverImage>
              )}
              <CoverView className="mid">
                <CoverView>{apiUserInfoMap.base.nick}</CoverView>
                {/*  <cover-view>{{ apiUserInfoMap.base.province}} {{ apiUserInfoMap.base.city}}</cover-view>  */}
              </CoverView>
              <CoverView className="ops flex" onClick>
                <CoverImage
                  src={require('../../images/rotate.png')}
                  className="c-img"
                  onClick={this.privateStopNoop.bind(this, this.rotateTap)}
                ></CoverImage>
                <CoverImage
                  src={require('../../images/meiyan2.png')}
                  className="c-img"
                  onClick={this.privateStopNoop.bind(
                    this,
                    this.showBeautySelect
                  )}
                ></CoverImage>
              </CoverView>
            </CoverView>
            <CoverView className="right">
              <CoverView className="txt">
                {'房间号: ' + liveRoomsInfo.roomInfo.id}
              </CoverView>
            </CoverView>
          </CoverView>
          {/*  在线人数  */}
          <CoverView className="watcher">
            {'在线人数: ' + onlineNumber}
          </CoverView>
          {/*  主推商品  */}
          {mainlyGoods && (
            <CoverView
              className="main-goods"
              onClick={this.privateStopNoop.bind(this, this.toDetail)}
              data-id={mainlyGoods.id}
            >
              <CoverImage
                src={mainlyGoods.pic}
                style="width:168rpx;height:168rpx;border-radius:15rpx;"
              ></CoverImage>
            </CoverView>
          )}
          {/*  提示进入直播间  */}
          {showTips && (
            <CoverView className="tips">
              <CoverImage
                src={showTipsAvatarUrl}
                className="avatar-img"
              ></CoverImage>
              <CoverView>{showTipsMsg}</CoverView>
            </CoverView>
          )}
          {/*  弹幕  */}
          <CoverView
            className="barrage"
            onTouchMove={this.privateStopNoop.bind(this, this.preventDefault)}
            scrollTop={scrollTop}
          >
            <CoverView className="item-outer">
              {barrageList.map((item, index) => {
                return (
                  <Block key={item.index}>
                    <CoverView className="barrage-item">
                      <CoverView className="item-wrap">
                        {item.avatarUrl && (
                          <CoverImage
                            src={item.avatarUrl}
                            className="avatar"
                          ></CoverImage>
                        )}
                        <CoverView
                          className="item-nickname"
                          style={
                            'top:' +
                            (systemInfo.platform == 'android' ? 2 : 0) +
                            'px;color:' +
                            item.color +
                            ';vertical-align:' +
                            (systemInfo.platform == 'android'
                              ? 'bottom'
                              : 'middle')
                          }
                        >
                          {item.nick}
                        </CoverView>
                        <CoverView
                          className="item-words"
                          style={
                            'vertical-align:' +
                            (systemInfo.platform == 'android'
                              ? 'bottom'
                              : 'middle')
                          }
                        >
                          {item.msg}
                        </CoverView>
                      </CoverView>
                    </CoverView>
                  </Block>
                )
              })}
            </CoverView>
          </CoverView>
          {!showInput && (
            <CoverView className="footer">
              <CoverView
                className="item0"
                onClick={this.privateStopNoop.bind(this, this.showGoods)}
              >
                <CoverImage
                  src={require('../../images/goods.png')}
                  className="goods"
                ></CoverImage>
                {/*  <cover-view class="txt">宝贝</cover-view>  */}
              </CoverView>
              <CoverView
                className="item1"
                onClick={this.privateStopNoop.bind(
                  this,
                  this.handleInteractionTap
                )}
              >
                <CoverImage
                  className="cmt-icon"
                  src={require('../../images/chat.png')}
                ></CoverImage>
                <CoverView className="txt">跟大家互动吧...</CoverView>
              </CoverView>
              <CoverView className="item2">
                <Button className="icon-wrap" openType="share">
                  <CoverImage
                    src={require('../../images/forward.png')}
                    className="icons"
                  ></CoverImage>
                </Button>
                {/*  <cover-view class="txt">分享</cover-view>  */}
              </CoverView>
              <CoverView
                className="item2"
                onClick={this.privateStopNoop.bind(this, this.showPeoples)}
              >
                <CoverView className="icon-wrap" style="background: #B17068">
                  <CoverImage
                    src={require('../../images/people.png')}
                    className="icons"
                  ></CoverImage>
                </CoverView>
                {/*  <cover-view class="txt">人员</cover-view>  */}
              </CoverView>
              {/*  <cover-view class="item2 item3" catchtap="showSet">
                  <cover-view class="icon-wrap"  style="background: #17abe3">
                    <cover-image src="/images/shezhi.png" class="icons"></cover-image>
                  </cover-view>
                  <cover-view class="txt">设置</cover-view>
                </cover-view>  */}
            </CoverView>
          )}
        </CoverView>
        {/*  输入  */}
        {/*  发送弹幕的icon  */}
        {showInput && (
          <CoverView className="left-input">
            <CoverImage
              className="icon"
              src={require('../../images/chat02.png')}
            ></CoverImage>
          </CoverView>
        )}
        {/*  line  */}
        {showInput && (
          <CoverView className="line-wrap">
            <CoverImage
              className="line-icon"
              src={require('../../images/line.png')}
            ></CoverImage>
          </CoverView>
        )}
        {/*  send barrage  */}
        {showInput && (
          <Input
            cursorSpacing="0"
            onKeyboardheightchange={this.keyboardEvent}
            focus={focus}
            placeholderClass="holder-class"
            placeholder="说点什么吧..."
            value={inputVal}
            className="send-barrage"
            confirmType="send"
            onConfirm={this.onComment}
            onInput={this.bindInput}
          ></Input>
        )}
        {/*  <cover-view wx:if='{{ showInput }}' class="send-btn" catchtap="onComment">
            发送
          </cover-view>  */}
        {/*  点击人员列表  */}
        <CoverView
          className={'goods-list ' + (showPeopleInfo ? 'open' : 'close')}
        >
          <CoverView className="title flex-between">
            <CoverView>全部人员</CoverView>
            <CoverImage
              src={require('../../images/people.png')}
              className="img"
              onClick
            ></CoverImage>
          </CoverView>
          <CoverView className="item-list">
            {peoplelist.map((item, index) => {
              return (
                <Block key={item.id}>
                  <CoverView className="item flex">
                    {item.avatarUrl && (
                      <CoverImage
                        src={item.avatarUrl}
                        className="goods-img"
                      ></CoverImage>
                    )}
                    <CoverView className="info flex">
                      <CoverView>{item.nick}</CoverView>
                      <CoverView>{item.ip}</CoverView>
                      <CoverView>{item.ip}</CoverView>
                    </CoverView>
                    <Button
                      className="btn"
                      onClick={this.privateStopNoop.bind(this, this.lahei)}
                      data-uid={item.uid}
                    >
                      踢出
                    </Button>
                  </CoverView>
                </Block>
              )
            })}
          </CoverView>
        </CoverView>
        {/*  点击宝贝弹出的商品列表  */}
        <CoverView
          className={'goods-list ' + (showGoodsInfo ? 'open' : 'close')}
        >
          <CoverView className="title flex-between">
            <CoverView>全部商品</CoverView>
          </CoverView>
          <CoverView className="item-list">
            {liveRoomsInfo.goodsList.map((item, index) => {
              return (
                <Block key={item.id}>
                  <CoverView className="item flex">
                    <CoverImage
                      src={item.pic}
                      className="goods-img"
                    ></CoverImage>
                    <CoverView className="info flex">
                      <CoverView className="goods-title">{item.name}</CoverView>
                      <CoverView className="price">
                        {'￥' + item.minPrice}
                      </CoverView>
                    </CoverView>
                    <Button
                      className="btn"
                      onClick={this.privateStopNoop.bind(
                        this,
                        this.navPurchase
                      )}
                      data-idx={index}
                    >
                      主推
                    </Button>
                  </CoverView>
                </Block>
              )
            })}
          </CoverView>
          {!liveRoomsInfo.goodsList && (
            <CoverView className="goods-empty">暂无商品~</CoverView>
          )}
        </CoverView>
        {showSelect09 && (
          <CoverView className="beauty-select">
            {(10).map((item, index) => {
              return (
                <CoverView
                  className="item"
                  key={item}
                  data-num={item}
                  onClick={this.select09}
                >
                  {item}
                </CoverView>
              )
            })}
          </CoverView>
        )}
      </Block>
    )
  }
}
export default _C
