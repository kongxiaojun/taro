import { Block, View, Image, Text } from '@tarojs/components'
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
import './index.scss'
import WXAPI from '../../apifm-wxapi'
const APP = Taro.getApp()
// fixed首次打开不显示标题的bug
APP.configLoadOK = () => {
  Taro.setNavigationBarTitle({})
}
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
  data: {},
  onLoad: function (options) {
    this.wxaMpLiveRooms()
  },
  onShow: function () {},
  async wxaMpLiveRooms() {
    Taro.showLoading({
      title: '',
    })
    const res = await WXAPI.wxaMpLiveRooms()
    Taro.hideLoading({
      success: (res) => {},
    })
    if (res.code == 0 && res.data.length > 0) {
      res.data.forEach((ele) => {
        if (ele.start_time) {
          ele.start_time_str = new Date(ele.start_time * 1000).format(
            'yyyy-MM-dd h:m:s'
          )
        }
      })
      this.setData({
        aliveRooms: res.data,
      })
    }
  },
  onPullDownRefresh: function () {
    // console.log('ppppp')
    this.setData({
      curPage: 1,
    })
    this.wxaMpLiveRooms()
    Taro.stopPullDownRefresh()
  },
  goLiveRoom(e) {
    const roomId = e.currentTarget.dataset.id
    const status = e.currentTarget.dataset.status
    if (status == 107 || status == 106 || status == 104) {
      return
    }
    Taro.navigateTo({
      url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}`,
    })
  },
})
class _C extends React.Component {
  render() {
    const { aliveRooms } = this.data
    return (
      <View className="container">
        {aliveRooms && (
          <Block>
            <View className="miaosha-container">
              {aliveRooms.map((item, index) => {
                return (
                  <View
                    className="miaosha-goods-list"
                    key={item.id}
                    onClick={this.goLiveRoom}
                    data-id={item.roomid}
                    data-status={item.live_status}
                  >
                    <Image
                      src={item.share_img}
                      className="image"
                      mode="aspectFill"
                      lazyLoad="true"
                    ></Image>
                    <View className="r">
                      <View className="goods-title">{item.name}</View>
                      <View className="label">
                        <VanIcon size="30rpx" name="user-o"></VanIcon>
                        <Text>{item.anchor_name}</Text>
                      </View>
                      <View className="label">
                        <VanIcon size="30rpx" name="underway"></VanIcon>
                        <Text>{item.start_time_str}</Text>
                      </View>
                      <View className="miaosha-price-btn">
                        {item.live_status == 107 ||
                        item.live_status == 106 ||
                        item.live_status == 104 ? (
                          <VanButton
                            type="default"
                            size="small"
                            block
                            round
                            plain
                          >
                            已过期
                          </VanButton>
                        ) : item.live_status == 102 ? (
                          <VanButton type="danger" size="small" block round>
                            即将开播
                          </VanButton>
                        ) : item.live_status == 103 ? (
                          <VanButton type="warning" size="small" block round>
                            直播结束
                          </VanButton>
                        ) : (
                          <VanButton type="primary" size="small" block round>
                            正在直播
                          </VanButton>
                        )}
                      </View>
                    </View>
                  </View>
                )
              })}
            </View>
          </Block>
        )}
      </View>
    )
  }
}
export default _C
