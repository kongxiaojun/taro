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
import './index.scss'
import WXAPI from '../../apifm-wxapi'
const AUTH = require('../../utils/auth.js')
@withWeapp({
  /**
   * 页面的初始数据
   */
  data: {
    balance: 0.0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      balance_pay_pwd: Taro.getStorageSync('balance_pay_pwd'),
    })
  },
  onShow: function () {
    AUTH.checkHasLogined().then((isLogined) => {
      if (!isLogined) {
        AUTH.login(this)
      } else {
        this.userAmount()
      }
    })
  },
  async userAmount() {
    const res = await WXAPI.userAmount(Taro.getStorageSync('token'))
    if (res.code === 0) {
      this.setData({
        balance: res.data.balance,
      })
    }
  },
  async bindSave() {
    let minWidthAmount = Taro.getStorageSync('WITHDRAW_MIN')
    if (!minWidthAmount) {
      minWidthAmount = 0
    }
    const amount = this.data.amount
    if (!amount) {
      Taro.showToast({
        title: '请填写正确的提现金额',
        icon: 'none',
      })
      return
    }
    if (this.data.balance_pay_pwd == '1' && !this.data.pwd) {
      Taro.showToast({
        title: '请输入交易密码',
        icon: 'none',
      })
      return
    }
    if (amount * 1 < minWidthAmount) {
      Taro.showToast({
        title: '提现金额不能低于' + minWidthAmount,
        icon: 'none',
      })
      return
    }
    if (amount * 1 > 2000) {
      if (!this.data.name) {
        Taro.showToast({
          title: '请输入真实姓名',
          icon: 'none',
        })
        return
      }
    } else {
      this.data.name = ''
    }
    const res = await WXAPI.withDrawApplyV2({
      token: Taro.getStorageSync('token'),
      money: amount,
      pwd: this.data.pwd ? this.data.pwd : '',
      name: this.data.name ? this.data.name : '',
    })
    if (res.code == 0) {
      Taro.showModal({
        title: '成功',
        content: '您的提现申请已提交，等待财务打款',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            Taro.navigateBack({
              delta: 0,
            })
          }
        },
      })
    } else {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
    }
  },
})
class _C extends React.Component {
  render() {
    const { balance, amount, name, pwd, balance_pay_pwd } = this.data
    return (
      <Block>
        <VanCell title="可用余额" value={balance}></VanCell>
        <VanField
          label="提现金额"
          type="digit"
          modelValue={amount}
          placeholder="请输入本次提现金额"
          clearable
        ></VanField>
        {amount > 2000 && (
          <VanField
            label="真实姓名"
            modelValue={name}
            placeholder="超过2000需要校验真实姓名"
            clearable
          ></VanField>
        )}
        {balance_pay_pwd == '1' && (
          <VanField
            label="交易密码"
            password
            modelValue={pwd}
            placeholder="请输入交易密码"
            clearable
          ></VanField>
        )}
        <View className="block-btn btn">
          <VanButton type="primary" block onClick={this.bindSave}>
            申请提现
          </VanButton>
        </View>
      </Block>
    )
  }
}
export default _C
