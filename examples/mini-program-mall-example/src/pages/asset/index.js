import { Block, View, Form, Button, Image, Text } from '@tarojs/components'
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
import ApifmLoginTmpl from '../../imports/ApifmLoginTmpl.js'
import './index.scss'
const app = Taro.getApp()
import WXAPI from '../../apifm-wxapi'
const AUTH = require('../../utils/auth.js')
var sliderWidth = 96 // 需要设置slider的宽度，用于计算中间位置
@withWeapp({
  /**
   * 页面的初始数据
   */
  data: {
    wxlogin: true,
    balance: 0.0,
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
    rechargeOpen: false, // 是否开启充值[预存]功能
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
        this.doneShow()
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
      activeIndex: e.detail.index,
    })
    this.fetchTabData(e.detail.index)
  },
  cancelLogin() {
    Taro.switchTab({
      url: '/pages/my/index',
    })
  },
})
class _C extends React.Component {
  render() {
    const {
      balance,
      freeze,
      totleConsumed,
      active,
      tabs,
      cashlogs,
      activeIndex,
      withDrawlogs,
      depositlogs,
    } = this.data
    return (
      <Block>
        <View className="asset">
          <View className="item">
            <View>可用余额(元)</View>
            <View>{balance}</View>
          </View>
          <View className="item">
            <View>冻结金额(元)</View>
            <View>{freeze}</View>
          </View>
          <View className="item right">
            <View>累计消费(元)</View>
            <View>{totleConsumed}</View>
          </View>
        </View>
        <View className="btn-view">
          <Form onSubmit={this.recharge} reportSubmit="true">
            <Button
              className="btn"
              type="default"
              size="mini"
              formType="submit"
              hoverClass="btn-hover"
              plain="true"
            >
              充值
            </Button>
          </Form>
          <Form onSubmit={this.payDeposit} reportSubmit="true">
            <Button
              className="btn"
              type="default"
              size="mini"
              formType="submit"
              hoverClass="btn-hover"
              plain="true"
            >
              押金
            </Button>
          </Form>
          <Form onSubmit={this.withdraw} reportSubmit="true">
            <Button
              className="btn"
              type="default"
              size="mini"
              formType="submit"
              hoverClass="btn-hover"
              plain="true"
            >
              提现
            </Button>
          </Form>
        </View>
        <VanTabs active={active} onChange={this.tabClick}>
          {tabs.map((item, index) => {
            return <VanTab key={item} title={item}></VanTab>
          })}
        </VanTabs>
        {activeIndex == 0 && (
          <VanCellGroup>
            {!cashlogs && <VanEmpty description="暂无资金明细"></VanEmpty>}
            {cashlogs && cashlogs.map((item, index) => {
              return (
                <VanCell
                  key={item.index}
                  title={item.typeStr}
                  label={item.dateAdd}
                  value={item.amount}
                ></VanCell>
              )
            })}
          </VanCellGroup>
        )}
        {activeIndex == 1 && (
          <VanCellGroup>
            {!withDrawlogs && <VanEmpty description="暂无提现记录"></VanEmpty>}
            {withDrawlogs && withDrawlogs.map((item, index) => {
              return (
                <VanCell
                  key={item.index}
                  title={item.statusStr}
                  label={item.dateAdd}
                  value={item.money}
                ></VanCell>
              )
            })}
          </VanCellGroup>
        )}
        {activeIndex == 2 && (
          <VanCellGroup>
            {!depositlogs && <VanEmpty description="暂无押金记录"></VanEmpty>}
            {depositlogs && depositlogs.map((item, index) => {
              return (
                <VanCell
                  key={item.index}
                  title={item.statusStr}
                  label={item.dateAdd}
                  value={item.amount}
                ></VanCell>
              )
            })}
          </VanCellGroup>
        )}
      </Block>
    )
  }
}
export default _C
