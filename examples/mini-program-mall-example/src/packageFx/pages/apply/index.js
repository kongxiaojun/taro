import { Block, View } from '@tarojs/components'
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
import './index.scss'
import WXAPI from '../../../apifm-wxapi'
const AUTH = require('../../../utils/auth.js')
const wxpay = require('../../../utils/pay.js')
@withWeapp({
  data: {
    wxlogin: true,
    applyStatus: -2,
    // -1 表示未申请，0 审核中 1 不通过 2 通过
    applyInfo: {},
    canvasHeight: 0,
  },
  onLoad: function (options) {
    this.setting()
  },
  onShow() {
    AUTH.checkHasLogined().then((isLogined) => {
      if (isLogined) {
        this.doneShow()
      }
    })
  },
  async doneShow() {
    const _this = this
    const userDetail = await WXAPI.userDetail(Taro.getStorageSync('token'))
    WXAPI.fxApplyProgress(Taro.getStorageSync('token')).then((res) => {
      let applyStatus = userDetail.data.base.isSeller ? 2 : -1
      if (res.code == 2000) {
        this.setData({
          wxlogin: false,
        })
        return
      }
      if (res.code === 700) {
        _this.setData({
          applyStatus: applyStatus,
        })
      }
      if (res.code === 0) {
        if (userDetail.data.base.isSeller) {
          applyStatus = 2
        } else {
          applyStatus = res.data.status
        }
        _this.setData({
          applyStatus: applyStatus,
          applyInfo: res.data,
        })
      }
    })
  },
  goForm: function (e) {
    Taro.navigateTo({
      url: '/packageFx/pages/apply/form',
    })
  },
  goShop: function (e) {
    Taro.switchTab({
      url: '/pages/index/index',
    })
  },
  goFx: function (e) {
    Taro.redirectTo({
      url: '/packageFx/pages/index/index',
    })
  },
  async setting() {
    const res = await WXAPI.fxSetting()
    if (res.code == 0) {
      this.setData({
        setting: res.data,
      })
    }
  },
  async buy() {
    const token = Taro.getStorageSync('token')
    let res = await WXAPI.userAmount(token)
    if (res.code != 0) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
      return
    }
    if (res.data.balance >= this.data.setting.price) {
      // 余额足够
      res = await WXAPI.fxBuy(token)
      if (res.code != 0) {
        Taro.showToast({
          title: res.msg,
          icon: 'none',
        })
        return
      }
      Taro.showToast({
        title: '升级成功',
      })
      setTimeout(() => {
        Taro.redirectTo({
          url: '/packageFx/pages/index/index',
        })
      }, 1000)
    } else {
      let price = this.data.setting.price - res.data.balance
      price = price.toFixed(2)
      wxpay.wxpay('fxsBuy', price, 0, '/packageFx/pages/index/index')
    }
  },
})
class _C extends React.Component {
  render() {
    const { setting, applyStatus, applyInfo } = this.data
    return (
      <Block>
        {applyStatus == -1 && (
          <View className="noApply">
            <VanEmpty description="诚邀您成为分销商"></VanEmpty>
            <View className="block-btn">
              <VanButton type="primary" block round onClick={this.goForm}>
                免费申请 等待管理员审核
              </VanButton>
            </View>
            {setting.canBuy && (
              <View className="block-btn">
                <VanButton type="warning" block round onClick={this.buy}>
                  {'直接支付' + setting.price + '元，立即免审开通'}
                </VanButton>
              </View>
            )}
          </View>
        )}
        {applyStatus == 0 && (
          <View className="noApply">
            <VanEmpty description="感谢您的支持，请等待管理员审核"></VanEmpty>
            <View className="block-btn">
              <VanButton type="primary" block round onClick={this.goShop}>
                先去逛逛
              </VanButton>
            </View>
          </View>
        )}
        {applyStatus == 1 && (
          <View className="noApply">
            <VanEmpty
              description={'很遗憾，您的申请没有通过 ' + applyInfo.remark}
            ></VanEmpty>
            <View className="block-btn">
              <VanButton type="danger" block round onClick={this.goShop}>
                回首页
              </VanButton>
            </View>
          </View>
        )}
        {applyStatus == 2 && (
          <View className="noApply">
            <VanIcon name="checked" color="#07c160" size="240rpx"></VanIcon>
            <View>恭喜您成为分销商</View>
            <View className="block-btn" style="margin-top:240rpx;">
              <VanButton type="primary" block round onClick={this.goFx}>
                前往分销中心
              </VanButton>
            </View>
          </View>
        )}
      </Block>
    )
  }
}
export default _C
