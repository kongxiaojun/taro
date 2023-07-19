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
const wxpay = require('../../utils/pay.js')
const AUTH = require('../../utils/auth.js')
@withWeapp({
  data: {
    payType: 'wxpay',
  },
  onLoad: function (options) {
    this.payBillDiscounts()
    this.setData({
      balance_pay_pwd: Taro.getStorageSync('balance_pay_pwd'),
    })
  },
  onShow() {
    // AUTH.checkHasLogined().then((isLogined) => {
    //   if (!isLogined) {
    //     AUTH.login(this)
    //   } else {
    //     this.userAmount()
    //   }
    // })
  },
  async payBillDiscounts() {
    const res = await WXAPI.payBillDiscounts()
    if (res.code === 0) {
      this.setData({
        rechargeSendRules: res.data,
      })
    }
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
    const amount = this.data.amount
    if (!amount) {
      Taro.showToast({
        title: '请填写正确的消费金额',
        icon: 'none',
      })
      return
    }
    if (this.data.payType == 'balance') {
      if (this.data.balance_pay_pwd == '1' && !this.data.pwd) {
        Taro.showToast({
          title: '请输入交易密码',
          icon: 'none',
        })
        return
      }
    }
    const res = await WXAPI.payBillV2({
      token: Taro.getStorageSync('token'),
      money: amount,
      calculate: true,
    })
    if (res.code != 0) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
      return
    }
    const amountReal = res.data.realMoney
    const _msg = `您本次消费${amount}，优惠后只需支付${amountReal}`
    Taro.showModal({
      title: '请确认消费金额',
      content: _msg,
      confirmText: '确认支付',
      cancelText: '取消支付',
      success: (res) => {
        if (res.confirm) {
          this.goPay(amount, amountReal)
        }
      },
    })
  },
  async goPay(amount, wxpayAmount) {
    if (this.data.payType == 'balance') {
      const res = await WXAPI.payBillV2({
        token: Taro.getStorageSync('token'),
        money: amount,
        pwd: this.data.pwd,
      })
      if (res.code != 0) {
        Taro.showToast({
          title: res.msg,
          icon: 'none',
        })
        return
      }
      Taro.showModal({
        title: '成功',
        content: '买单成功，欢迎下次光临！',
        showCancel: false,
      })
    } else {
      wxpay.wxpay('paybill', wxpayAmount, 0, '/pages/asset/index', {
        money: amount,
      })
    }
  },
  payTypeChange(event) {
    this.setData({
      payType: event.detail,
    })
  },
  payTypeClick(event) {
    const { name } = event.currentTarget.dataset
    this.setData({
      payType: name,
    })
  },
})
class _C extends React.Component {
  render() {
    const {
      amount,
      pwd,
      balance_pay_pwd,
      payType,
      rechargeSendRules,
      balance,
    } = this.data
    return (
      <Block>
        <VanField
          label="消费金额"
          type="digit"
          modelValue={amount}
          placeholder="询问服务员本次消费金额"
          clearable
        ></VanField>
        {balance_pay_pwd == '1' && payType == 'balance' && (
          <VanField
            label="交易密码"
            password
            modelValue={pwd}
            placeholder="请输入交易密码"
            clearable
          ></VanField>
        )}
        {rechargeSendRules && (
          <VanCellGroup title="优惠规则">
            {rechargeSendRules.map((item, index) => {
              return (
                <VanCell
                  key={item.index}
                  title={'减 ' + item.discounts + ' 元'}
                  value={'消费满 ' + item.consume + ' 元'}
                ></VanCell>
              )
            })}
          </VanCellGroup>
        )}
        <VanRadioGroup value={payType} onChange={this.payTypeChange}>
          <VanCellGroup title="付款方式">
            <VanCell
              title="余额支付"
              label={balance}
              clickable
              data-name="balance"
              onClick={this.payTypeClick}
              renderRighticon={
                <Block>
                  <VanRadio name="balance"></VanRadio>
                </Block>
              }
            ></VanCell>
            <VanCell
              title="在线支付"
              clickable
              data-name="wxpay"
              onClick={this.payTypeClick}
              renderRighticon={
                <Block>
                  <VanRadio name="wxpay"></VanRadio>
                </Block>
              }
            ></VanCell>
          </VanCellGroup>
        </VanRadioGroup>
        <View className="block-btn btn">
          <VanButton type="primary" block onClick={this.bindSave}>
            确认支付
          </VanButton>
        </View>
      </Block>
    )
  }
}
export default _C
