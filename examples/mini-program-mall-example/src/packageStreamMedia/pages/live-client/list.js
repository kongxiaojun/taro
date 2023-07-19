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
import './list.scss'
import WXAPI from '../../../apifm-wxapi'
@withWeapp({
  data: {
    page: 1,
    // 读取第几页数据
    navIndex: 0,
    liveList: [],
    hasMore: true,
    reload: false,
    indicatorDots: false,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 500,
    circular: true,
    showEmpty: false,
    cateList: [
      // 直播分类
      {
        id: 1,
        name: '精选',
      },
      {
        id: 2,
        name: '全部',
      },
    ],
    cate_id: 1,
    navList: [
      {
        type: 1,
        iconPath: '../../images/live/nav01.png',
        title: '入驻主播',
      },
      {
        type: 2,
        iconPath: '../../images/live/nav02.png',
        title: '入驻经纪人',
      },
      {
        type: 3,
        iconPath: '../../images/live/nav03.png',
        title: '入驻服务商',
      },
      {
        type: 4,
        iconPath: '../../images/live/nav04.png',
        title: '入驻合伙人',
      },
    ],
    flashList: [],
    // 幻灯片
    swiperCurIndex: 1,
    left: 100,
    showjoo: 1,
    isCustom: true,
  },
  async banners() {
    //获取轮播
    const bannerRes = await WXAPI.banners({
      type: 'livelist',
    })
    this.setData({
      flashList: bannerRes.data,
    })
  },
  onLoad: function (option) {
    this.banners()
    this.queryLiveRoomInfo()
  },
  onShow() {},
  bindChange(e) {
    let current = e.detail.current
    this.setData({
      swiperCurIndex: current + 1,
    })
  },
  /**
   * 首页导航
   */
  tapItem(e) {
    Taro.showModal({
      title: '提示',
      content: '线上申请未开放，请联系客服申请入驻！',
      success(res) {
        if (res.confirm) {
          //console.log('用户点击确定')
        } else if (res.cancel) {
          //console.log('用户点击取消')
        }
      },
    })
    return
    let url = ''
    let { type } = e.currentTarget.dataset
    let { userType, live_status, reason } = app.globalData
    // console.log('用户当前身份类型' + userType)
    // console.log('想要申请类型' + type)
    // console.log('申请状态' + live_status)
    // console.log('如果被驳回的原因是' + reason)
    // 申请入驻的条件为 入驻身份不能低于或等于当前身份
    if (userType >= type) {
      $api.msg('入驻身份不能低于当前身份')
      return
    }
    if (live_status == 1 || (live_status == 0 && reason)) {
      // 入驻主播正在申请中
      url = `/packageB/pages/apply-status/index?status=${live_status}&reason=${reason}`
    } else {
      url = `/packageB/pages/apply-live/apply-live?type=${type}`
    }
    Taro.navigateTo({
      url,
    })
  },
  // 点击幻灯片去直播间
  toLive(e) {
    return
    let { id } = e.currentTarget.dataset
    console.log(id)
    if (id == 0) return
    let like
    let url
    setTimeout(() => {
      Taro.navigateTo({
        url: `/pages/live-detail/live-detail?number=${id}&url=${encodeURIComponent(
          url
        )}&like=${like}`,
      })
    }, 200)
  },
  navDetail(e) {
    let status = e.currentTarget.dataset.status
    let id = e.currentTarget.dataset.id
    if (status != 1) {
      Taro.showToast({
        title: '未开播，敬请期待',
        icon: 'none',
      })
      return
    }
    Taro.navigateTo({
      url: '/pages/live-client/client?id=' + id,
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.setData({
      reload: true,
      hasMore: true,
      page: 1,
    })
    this.queryLiveRoomInfo()
    Taro.stopPullDownRefresh()
  },
  // 导航切换
  navTap(e) {
    let temp = e.currentTarget.dataset
    let navIndex = temp.index
    let id = temp.id
    if (navIndex == this.data.navIndex) return
    let cate_id = ''
    if (id) {
      cate_id = id
    }
    this.setData({
      navIndex,
      reload: true,
      page: 1,
      hasMore: true,
      cate_id: cate_id,
      scrollLeft: navIndex * 50,
    })
    this.queryLiveRoomInfo()
  },
  // 获取直播列表
  async queryLiveRoomInfo() {
    const res = await WXAPI.liveRooms({
      page: this.data.page,
    })
    if (res.code == 700) {
      this.setData({
        loading: false,
        liveList: null,
        hasMore: false,
      })
    }
    if (res.code == 0) {
      const anchorMap = res.data.anchorMap
      res.data.result.forEach((ele) => {
        if (anchorMap) {
          ele.anchor = anchorMap[ele.uid]
        }
      })
      this.setData({
        loading: false,
        liveList: res.data.result,
        hasMore: res.data.totalPage > this.data.page ? true : false,
      })
    }
  },
  getRandomNumber() {
    let number = Math.floor(Math.random() * 15000)
    return number
  },
  onReachBottom() {
    const hasMore = this.data.hasMore
    if (hasMore) {
      this.data.page++
      this.queryLiveRoomInfo()
    }
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
