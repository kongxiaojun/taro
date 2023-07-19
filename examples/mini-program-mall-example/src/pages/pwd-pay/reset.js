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
import './reset.scss'
import WXAPI from '../../apifm-wxapi'
const AUTH = require('../../utils/auth.js')
@withWeapp({
  data: {},
  onLoad: function (options) {},
  onShow: function () {
    this.getUserApiInfo()
  },
  async getUserApiInfo() {
    const res = await WXAPI.userDetail(Taro.getStorageSync('token'))
    if (res.code == 2000) {
      AUTH.login(this)
      return
    }
    if (res.code == 0) {
      this.setData({
        mobile: res.data.base.mobile,
      })
    }
  },
  async sendSms() {
    const res = await WXAPI.smsValidateCodeByToken(Taro.getStorageSync('token'))
    if (res.code == 2000) {
      AUTH.login(this)
      return
    }
    if (res.code == 0) {
      this.setData({
        smsloading: true,
        smsloadingSecond: 60,
      })
      Taro.showToast({
        title: '短信已发送',
      })
      this.countDown()
    } else {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
    }
  },
  countDown() {
    const smsloadingSecond = this.data.smsloadingSecond
    if (smsloadingSecond) {
      this.setData({
        smsloadingSecond: smsloadingSecond - 1,
      })
      setTimeout(() => {
        this.countDown()
      }, 1000)
    } else {
      this.setData({
        smsloading: false,
      })
    }
  },
  async submit() {
    if (!this.data.mobile) {
      Taro.showToast({
        title: '请先绑定手机号码',
        icon: 'none',
      })
      return
    }
    if (!this.data.code) {
      Taro.showToast({
        title: '请输入短信验证码',
        icon: 'none',
      })
      return
    }
    if (!this.data.pwd) {
      Taro.showToast({
        title: '请输入交易密码',
        icon: 'none',
      })
      return
    }
    if (!this.data.pwd2) {
      Taro.showToast({
        title: '请再次输入交易密码',
        icon: 'none',
      })
      return
    }
    if (this.data.pwd != this.data.pwd2) {
      Taro.showToast({
        title: '两次输入不一致',
        icon: 'none',
      })
      return
    }
    const res = await WXAPI.resetPayPassword(
      this.data.mobile,
      this.data.code,
      this.data.pwd
    )
    if (res.code == 2000) {
      AUTH.login(this)
      return
    }
    if (res.code != 0) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
      return
    }
    Taro.showToast({
      title: '设置成功',
    })
    setTimeout(() => {
      Taro.navigateBack({
        delta: 0,
      })
    }, 1000)
  },
  getPhoneNumber: function (e) {
    if (!e.detail.errMsg || e.detail.errMsg != 'getPhoneNumber:ok') {
      Taro.showModal({
        title: '提示',
        content: e.detail.errMsg,
        showCancel: false,
      })
      return
    }
    this._getPhoneNumber(e)
  },
  async _getPhoneNumber(e) {
    let res
    const extConfigSync = Taro.getExtConfigSync()
    if (extConfigSync.subDomain) {
      // 服务商模式
      res = await WXAPI.wxappServiceBindMobile({
        token: Taro.getStorageSync('token'),
        code: this.data.code,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
      })
    } else {
      res = await WXAPI.bindMobileWxappV2(
        Taro.getStorageSync('token'),
        e.detail.code
      )
    }
    if (res.code === 10002) {
      AUTH.login(this)
      return
    }
    if (res.code == 0) {
      Taro.showToast({
        title: '绑定成功',
        icon: 'success',
        duration: 2000,
      })
      this.getUserApiInfo()
    } else {
      Taro.showModal({
        title: '提示',
        content: res.msg,
        showCancel: false,
      })
    }
  },
})
class _C extends React.Component {
  render() {
    const { mobile, smsloading, smsloadingSecond, code, pwd, pwd2 } = this.data
    return (
      <Block>
        {mobile ? (
          <VanField
            modelValue={mobile}
            center
            readonly
            clearable
            label="手机号码"
            placeholder="请输入短信验证码"
            useButtonSlot
            renderButton={
              <Block>
                <VanButton
                  size="small"
                  type="primary"
                  onClick={this.sendSms}
                  disabled={smsloading}
                >
                  {smsloading
                    ? smsloadingSecond + '秒后重新获取'
                    : '发送验证码'}
                </VanButton>
              </Block>
            }
          ></VanField>
        ) : (
          <VanField
            center
            readonly
            clearable
            label="手机号码"
            placeholder="绑定后才可以重置"
            useButtonSlot
            renderButton={
              <Block>
                <VanButton
                  type="primary"
                  size="small"
                  openType="getPhoneNumber"
                  onGetphonenumber={this.getPhoneNumber}
                >
                  立即绑定
                </VanButton>
              </Block>
            }
          ></VanField>
        )}
        {mobile && (
          <VanField
            label="短信验证码"
            type="number"
            modelValue={code}
            placeholder="请输入短信验证码"
            clearable
          ></VanField>
        )}
        {mobile && (
          <VanField
            label="交易密码"
            password
            modelValue={pwd}
            placeholder="请输入交易密码"
            clearable
          ></VanField>
        )}
        {mobile && (
          <VanField
            label="再次输入"
            password
            modelValue={pwd2}
            placeholder="请再次输入交易密码"
            clearable
          ></VanField>
        )}
        <VanCell
          icon="info-o"
          title="温馨提示"
          label="为了保障您的资金安全，余额支付、优惠买单、申请提现的时候可能会需要交易密码"
        ></VanCell>
        <View className="block-btn btn">
          <VanButton type="primary" block onClick={this.submit}>
            重置交易密码
          </VanButton>
        </View>
      </Block>
    )
  }
}
export default _C
