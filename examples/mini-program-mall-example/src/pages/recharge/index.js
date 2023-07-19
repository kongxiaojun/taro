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
const wxpay = require('../../utils/pay.js')
import WXAPI from '../../apifm-wxapi'
@withWeapp({
  data: {},
  onLoad: function (options) {
    let recharge_amount_min = Taro.getStorageSync('recharge_amount_min')
    if (!recharge_amount_min) {
      recharge_amount_min = 0
    }
    this.setData({
      recharge_amount_min: recharge_amount_min,
    })
    this.rechargeSendRules()
  },
  onShow: function () {},
  async rechargeSendRules() {
    const res = await WXAPI.rechargeSendRules()
    if (res.code == 0) {
      this.setData({
        rechargeSendRules: res.data,
      })
    }
  },
  /**
   * 点击充值优惠的充值送
   */
  rechargeAmount: function (e) {
    var confine = e.currentTarget.dataset.confine
    var amount = confine
    this.setData({
      amount: amount,
    })
    wxpay.wxpay('recharge', amount, 0, '/pages/my/index')
  },
  async bindSave() {
    const amount = this.data.amount
    if (!amount || amount * 1 < 0) {
      Taro.showModal({
        title: '错误',
        content: '请填写正确的充值金额',
        showCancel: false,
      })
      return
    }
    if (amount * 1 < this.data.recharge_amount_min * 1) {
      Taro.showModal({
        title: '错误',
        content: '单次充值金额至少' + this.data.recharge_amount_min + '元',
        showCancel: false,
      })
      return
    }
    wxpay.wxpay('recharge', amount, 0, '/pages/my/index')
  },
})
class _C extends React.Component {
  render() {
    const { amount, rechargeSendRules } = this.data
    return (
      <Block>
        <VanField
          label="充值金额"
          modelValue={amount}
          size="large"
          type="digit"
          focus
          clearable
          required
          placeholder="请输入充值金额"
        ></VanField>
        {rechargeSendRules && (
          <VanGrid
            customClass="rechargeSendRules"
            columnNum="3"
            square
            gutter={10}
            clickable
          >
            {rechargeSendRules.map((item, index) => {
              return (
                <VanGridItem
                  icon="balance-o"
                  text={'¥' + item.confine}
                  badge={item.send ? '送 ¥' + item.send : ''}
                  onClick={this.rechargeAmount}
                  data-confine={item.confine}
                  data-send={item.send}
                ></VanGridItem>
              )
            })}
          </VanGrid>
        )}
        <View className="block-btn">
          <VanButton type="primary" block round onClick={this.bindSave}>
            立即充值
          </VanButton>
        </View>
      </Block>
    )
  }
}
export default _C
