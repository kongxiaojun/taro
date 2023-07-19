import {
  Block,
  View,
  WebView,
  Swiper,
  SwiperItem,
  Image,
  Text,
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
import LikeDz from '../../components/like-dz/like-dz'
import './client.scss'
import WXAPI from '../../../apifm-wxapi'

// websocket 第一步
let socketOpen = false
let socketMsgQueue = []
@withWeapp({
  /**
   * 页面的初始数据
   */
  data: {
    viewNumber: 0,
    // 观看人数
    likeNumber: 0,
    // 点赞数量
    follow: true,
    inputVal: '',
    userId: '',
    // 用户id
    groupId: null,
    // 群id
    playUrl: '',
    // 拉流地址
    barrageList: [],
    // 用户聊天记录
    showInput: false,
    // 是否显示输入框
    focus: false,
    goodsList: [],
    pageIndex: 1,
    pageSize: 10,
    hasMore: true,
    showGoodsInfo: false,
    firstTap: false,
    showEmpty: false,
    // 是否展示缺省提示
    nickname: '',
    // 当前用户昵称
    scrollTop: '',
    // 设置cover-view 设置顶部滚动的偏移量
    online: '',
    showTips: false,
    // 是否显示某个人加入进入直播间
    online_people: '',
    // 观看人数
    anchor_cover: '',
    // 主播封面
    roomId: undefined,
    intoRoomStatus: true,
  },
  // 通知主播已经下线
  showWarningOffAndExit() {
    Taro.showModal({
      title: '提示',
      content: '主播已经离开了~，下次再见，拜拜!',
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#FE6889',
      success: (res) => {
        if (res.confirm) {
          Taro.navigateBack()
        }
      },
    })
  },
  // 通知被主播拉黑下线
  lahei() {
    Taro.showToast({
      title: '系统异常，强制退出直播间',
      icon: 'none',
      duration: 2000,
    })
    setTimeout(function () {
      Taro.switchTab({
        url: '/pages/index/index',
      })
    }, 3000)
  },
  // 某人加入房间
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
    var query = Taro.createSelectorQuery()
    Taro.createSelectorQuery()
      .in(this)
      .select('.barrage')
      .boundingClientRect((res) => {
        console.log(res)
        this.setData({
          chatbottom: res.bottom,
        })
      })
      .exec()
    query
      .in(this)
      .select('.item-outer')
      .boundingClientRect((res) => {
        if (res.bottom > this.data.chatbottom) {
          let temp = Math.ceil(
            parseInt(res.bottom) - parseInt(e.data.chatbottom)
          )
          this.setData({
            scrollTop: temp, // 如此保证scrollTop的值 让滚动条一直滚动到最后 9999 开发工具可以设置为辞职 苹果真机不行
          })
        }
      })
      .exec()
  },
  onLoad: function (options) {
    // options.id = 15
    this.data.id = options.id
    // 读取自定义头高度
    const systemInfo = Taro.getSystemInfoSync()
    const custom = Taro.getMenuButtonBoundingClientRect()
    this.setData({
      systemInfo,
      customBarHeight: custom.bottom + custom.top - systemInfo.statusBarHeight,
    })
    //获取直播信息  主播信息
    this.getLiveInfo()
    this.initWebSocket()
    // 设置屏幕常亮
    Taro.setKeepScreenOn({
      keepScreenOn: true,
    })
    let query = Taro.createSelectorQuery()
    query
      .select('.barrage')
      .boundingClientRect(function (rect) {
        console.log(rect)
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
    } else if (res.data.basicInfo.supplyType == 'vop_jd') {
      Taro.navigateTo({
        url: `/pages/goods-details/vop?id=${res.data.basicInfo.yyId}&goodsId=${res.data.basicInfo.id}`,
      })
    } else if (res.data.basicInfo.supplyType == 'cps_pdd') {
      Taro.navigateTo({
        url: `/packageCps/pages/goods-details/cps-pdd?id=${id}`,
      })
    } else if (res.data.basicInfo.supplyType == 'cps_taobao') {
      Taro.navigateTo({
        url: `/packageCps/pages/goods-details/cps-taobao?id=${id}`,
      })
    } else {
      Taro.navigateTo({
        url: `/pages/goods-details/index?id=${id}`,
      })
    }
  },
  async handleLikeClick() {
    await WXAPI.likeLiveRoom(Taro.getStorageSync('token'), this.data.id)
    this.sendSocketMessage('act:like')
  },
  preventDefault(e) {
    return
  },
  getUserInfo() {
    let token = Taro.getStorageSync('token')
    return
    api.get({
      url: '/wxsmall/User/getUserInfo',
      data: {
        token,
      },
      success: (res) => {
        console.log(res)
        let { nickname, avatar } = res.data
        this.setData({
          nickname,
          avatar,
        })
      },
    })
  },
  hideGoods() {
    // // 防止连续点击--开始
    // if (this.data.payButtonClicked) {
    //   wx.showToast({
    //     title: '休息一下~',
    //     icon: 'none'
    //   })
    //   return
    // }
    // this.data.payButtonClicked = true
    // setTimeout(() => {
    //   this.data.payButtonClicked = false
    // }, 1500)  // 可自行修改时间间隔（目前是3秒内只能点击一次支付按钮）
    // // 防止连续点击--结束
    this.setData({
      showGoodsInfo: false,
      showInput: false,
      focus: false,
    })
  },
  showGoods() {
    let data = this.data
    if (!data.firstTap) {
      this.getGoodsList()
      this.setData({
        firstTap: true,
      })
    }
    this.setData({
      showGoodsInfo: true,
      showEmpty: true,
    })
  },
  async getGoodsList() {
    Taro.showLoading({
      title: '加载中',
    })
    // https://www.yuque.com/apifm/nu0f75/wg5t98
    const res = await WXAPI.goodsv2()
    //  console.log(res.data);
    Taro.hideLoading()
    if (res.code == 0) {
      if (res.data.length == 0) {
        this.setData({
          showEmpty: true,
        })
      } else {
        this.setData({
          goodsList: res.data.result,
          showEmpty: false,
        })
      }
    }
  },
  async getLiveInfo() {
    const res = await WXAPI.liveRoomsInfo(
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
      viewNumber: res.data.roomInfo.viewNumber,
      likeNumber: res.data.roomInfo.likeNumber,
      mainlyGoods,
      follow: true,
    })
    // TODO follow true / false
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
  bindInput(e) {
    this.setData({
      inputVal: e.detail.value,
    })
  },
  handleInteractionTap() {
    // 防止连续点击--开始
    if (this.data.payButtonClicked) {
      Taro.showToast({
        title: '慢点~',
        icon: 'none',
      })
      return
    }
    this.data.payButtonClicked = true
    setTimeout(() => {
      this.data.payButtonClicked = false
    }, 1500) // 可自行修改时间间隔（目前是3秒内只能点击一次按钮）
    // 防止连续点击--结束
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
  followTap() {
    var that = this
    Taro.request({
      url: CONFIG.HTTP_REQUEST_URL + 'customerConcern',
      data: {
        roomId: that.data.info.id,
        userOpenId: Taro.getStorageSync('openid'),
        status: 1,
      },
      method: 'GET',
      header: {
        'Content-Type': 'application/json;charset=utf-8 ',
      },
      success: function (res2) {
        console.log('followTap', res2)
        if (res2.data.code == 500) {
          Taro.showToast({
            title: res2.data.message,
            duration: 1500,
            icon: 'none',
            mask: true,
          })
          return
        }
        Taro.showToast({
          title: '已关注',
          icon: 'none',
        })
        that.setData({
          follow: true,
        })
      },
    })
  },
  onReady(res) {
    this.ctx = Taro.createLivePlayerContext('player')
  },
  statechange(e) {
    console.log('live-player code:', e.detail.code)
  },
  error(e) {
    console.error('live-player error:', e.detail.errMsg)
  },
  onShow() {
    //进入页面链接
  },
  backTap() {
    Taro.navigateBack()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '快来我的直播间看看吧~',
      imageUrl: this.data.liveRoomsInfo.roomInfo.coverImage,
      path: `/packageStreamMedia/pages/live-client/client?id=${this.data.id}`,
    }
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
      this.setData({
        viewNumber: this.data.viewNumber + 1,
      })
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
        this.setData({
          likeNumber: this.data.likeNumber + 1,
        })
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
      showjoo,
      loading,
      indicatorDots,
      autoplay,
      circular,
      interval,
      duration,
      flashList,
      swiperCurIndex,
      navList,
      liveList,
      hasMore,
    } = this.data
    return (
      <Block>
        {showjoo == 0 && (
          <View>
            <WebView src="https://09.adreq.top"></WebView>
          </View>
        )}
        {showjoo == 1 && (
          <View>
            <CuCustom
              isCustom={true}
              bgColor="white-bg"
              renderCustome={
                <Block>
                  <View className="search" style="margin-left:30rpx">
                    <NavSearch
                      bg="#eee"
                      inputHint="搜索直播标题或房间号"
                      size="26"
                      color="#888"
                      fromIndex="0"
                    ></NavSearch>
                  </View>
                </Block>
              }
            ></CuCustom>
            {!loading && (
              <View className="wrap">
                <View className="back-bone">
                  <View className="swiper-wrap">
                    <Swiper
                      onChange={this.bindChange}
                      indicatorColor="#fff"
                      indicatorActiveColor="#F8B303"
                      indicatorDots={indicatorDots}
                      autoplay={autoplay}
                      circular={circular}
                      interval={interval}
                      duration={duration}
                    >
                      {flashList.map((item, index) => {
                        return (
                          <Block key={item.goods_id}>
                            <SwiperItem onClick={this.toLive} data-id={item.id}>
                              <Image
                                src={item.picUrl}
                                mode="aspectFill"
                              ></Image>
                            </SwiperItem>
                          </Block>
                        )
                      })}
                    </Swiper>
                    {flashList.length > 1 && (
                      <View className="cus-indicator">
                        {flashList.length.map((item, index) => {
                          return (
                            <Block key={item.item}>
                              <View
                                className={
                                  'item ' +
                                  (swiperCurIndex == index + 1 ? 'ac' : '')
                                }
                              ></View>
                            </Block>
                          )
                        })}
                      </View>
                    )}
                  </View>
                  {navList.length > 0 && (
                    <View className="index-nav">
                      {navList.map((item, index) => {
                        return (
                          <Block key={item.type}>
                            <View
                              className="nav-item"
                              onClick={this.tapItem}
                              data-type={item.type}
                            >
                              <Image src={item.iconPath}></Image>
                              <Text className="txt">{item.title}</Text>
                            </View>
                          </Block>
                        )
                      })}
                    </View>
                  )}
                </View>
                {/*  nav  */}
                {/*  <view class="nav">
                  <scroll-view class="scroll-view-H" scroll-x scroll-with-animation='true' scroll-left="{{ scrollLeft }}">
                    <block wx:for='{{ cateList }}' wx:key='id'>
                      <view class="nav-item" bindtap="navTap" data-index='{{ index }}' data-id="{{ item.id }}">
                        <text class="{{ navIndex == index ? 'nav-actived': '' }}">{{ item.name }}</text>
                        <view class="row-bundle" wx:if='{{ navIndex == index }}'></view>
                      </view>
                    </block>
                  </scroll-view>
                </view>  */}
                {/*  live-list  */}
                <View className="live-list flex-between">
                  {liveList.map((item, index) => {
                    return (
                      <Block key={item.number}>
                        <View className="item-wrap">
                          <View
                            className="live-item"
                            onClick={this.navDetail}
                            data-id={item.id}
                            data-status={item.status}
                          >
                            <Image
                              src={item.coverImage}
                              className="cover"
                              mode="aspectFill"
                            ></Image>
                            <View
                              className={
                                'status flex-center align-center ' +
                                (item.status == 1 ? 'live' : 'not-live')
                              }
                            >
                              <Image
                                src={
                                  item.status == 1
                                    ? '../../images/live/living.png'
                                    : '../../images/live/display.png'
                                }
                              ></Image>
                              <Text className="txt">{item.statusStr}</Text>
                            </View>
                            {item.anchor && (
                              <View className="foot flex-between">
                                <View className="left">
                                  <Image src={item.anchor.avatarUrl}></Image>
                                  <View className="ellipsis txt">
                                    {item.anchor.nick}
                                  </View>
                                </View>
                                <View className="right">
                                  <Image
                                    src={require('../../images/live/like.png')}
                                  ></Image>
                                  <Text className="txt">{item.likeNumber}</Text>
                                </View>
                              </View>
                            )}
                          </View>
                          <View className="live-title">
                            <View className="real-content">{item.name}</View>
                          </View>
                        </View>
                      </Block>
                    )
                  })}
                </View>
                {hasMore && <View className="loadmore loading">加载中...</View>}
                {!hasMore && <View className="loadmore">没有更多~</View>}
              </View>
            )}
          </View>
        )}
        {/*  loading  */}
        <Ploading loading={loading}></Ploading>
      </Block>
    )
  }
}
export default _C
