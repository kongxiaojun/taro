import { Block, View, Form, Input, Button } from '@tarojs/components'
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
    wxlogin: true,
    score: 0,
    uid: undefined,
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
      this.setData({
        wxlogin: isLogined,
      })
      if (isLogined) {
        this.initData()
      }
    })
  },
  async initData() {
    const token = Taro.getStorageSync('token')
    const res1 = await WXAPI.userAmount(token)
    if (res1.code == 0) {
      this.data.score = res1.data.score
    }
    const res2 = await WXAPI.scoreDeductionRules(1)
    if (res2.code == 0) {
      this.data.deductionRules = res2.data
    }
    this.setData({
      score: this.data.score,
      deductionRules: this.data.deductionRules,
    })
  },
  async bindSave(e) {
    const score = e.detail.value.score
    if (!score) {
      Taro.showToast({
        title: '请输入积分数量',
        icon: 'none',
      })
      return
    }
    const res = await WXAPI.exchangeScoreToGrowth(
      Taro.getStorageSync('token'),
      score
    )
    if (res.code == 0) {
      Taro.showModal({
        title: '成功',
        content: '恭喜您，成功兑换' + res.data + '成长值',
        showCancel: false,
      })
    } else {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
    }
  },
  cancelLogin() {
    this.setData({
      wxlogin: true,
    })
  },
})
class _C extends React.Component {
  render() {
    return (
      <View className="container">
        <Form onSubmit={this.bindSave}>
          <View className="form-box">
            <View className="row-wrap">
              <View className="label">券号</View>
              <View className="label-right">
                <Input
                  name="amount"
                  className="input"
                  type="text"
                  placeholder="请输入券号"
                ></Input>
              </View>
            </View>
          </View>
          <Button type="warn" className="save-btn" formType="submit">
            立即兑换
          </Button>
        </Form>
      </View>
    )
  }
}
export default _C
