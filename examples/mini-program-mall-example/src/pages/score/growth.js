import { Block, View } from '@tarojs/components'
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
import './growth.scss'
const app = Taro.getApp()
import WXAPI from '../../apifm-wxapi'
const AUTH = require('../../utils/auth.js')
@withWeapp({
  /**
   * 页面的初始数据
   */
  data: {
    growth: 0.0,
    cashlogs: undefined,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    AUTH.checkHasLogined().then((isLogined) => {
      if (isLogined) {
        this.doneShow()
      } else {
        Taro.showModal({
          title: '提示',
          content: '本次操作需要您的登录授权',
          cancelText: '暂不登录',
          confirmText: '前往登录',
          success(res) {
            if (res.confirm) {
              Taro.switchTab({
                url: '/pages/my/index',
              })
            } else {
              Taro.navigateBack()
            }
          },
        })
      }
    })
  },
  doneShow: function () {
    const _this = this
    const token = Taro.getStorageSync('token')
    WXAPI.userAmount(token).then(function (res) {
      if (res.code == 0) {
        _this.setData({
          growth: res.data.growth,
        })
      } else {
        Taro.showToast({
          title: res.msg,
          icon: 'none',
        })
      }
    })
    // 读取积分明细
    WXAPI.growthLogs({
      token: token,
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
})
class _C extends React.Component {
  render() {
    const { score, cashlogs } = this.data
    return cashlogs.map((item, index) => {
      return (
        <Block>
          <View className="score">
            <View>可用积分</View>
            <View>{score}</View>
          </View>
          {!cashlogs && <View className="no-data">暂无积分明细~</View>}
          {cashlogs && (
            <Block>
              {cashlogs.map((item, index) => {
                return (
                  <View className="cashlogs" key={index}>
                    <View className="profile">
                      <View className="typeStr">
                        {item.typeStr +
                          ' ' +
                          (item.remark ? '(' + item.remark + ')' : '')}
                      </View>
                      <View className="dateAdd">{item.dateAdd}</View>
                    </View>
                    <View
                      className="amount"
                      style={'color: ' + (item.behavior == 0 ? 'red' : 'green')}
                    >
                      {(item.behavior == 0 ? '+' : '') + ' ' + item.score}
                    </View>
                  </View>
                )
              })}
            </Block>
          )}
        </Block>
      )
    })
  }
}
export default _C
