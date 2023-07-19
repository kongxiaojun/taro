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
const app = Taro.getApp()
@withWeapp({
  data: {},
  selectTap: function (e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    WXAPI.updateAddress({
      token: Taro.getStorageSync('token'),
      id: id,
      isDefault: 'true',
    }).then(function (res) {
      Taro.navigateBack({})
    })
  },
  addAddess: function () {
    Taro.navigateTo({
      url: '/pages/address-add/index',
    })
  },
  editAddess: function (e) {
    console.log(e)
    Taro.navigateTo({
      url: '/pages/address-add/index?id=' + e.currentTarget.dataset.id,
    })
  },
  onLoad: function () {},
  onShow: function () {
    AUTH.checkHasLogined().then((isLogined) => {
      if (isLogined) {
        this.initShippingAddress()
      } else {
        AUTH.login(this)
      }
    })
  },
  async initShippingAddress() {
    Taro.showLoading({
      title: '',
    })
    const res = await WXAPI.queryAddress(Taro.getStorageSync('token'))
    Taro.hideLoading({
      success: (res) => {},
    })
    if (res.code == 0) {
      this.setData({
        addressList: res.data,
      })
    } else if (res.code == 700) {
      this.setData({
        addressList: null,
      })
    } else {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
    }
  },
  onPullDownRefresh() {
    this.initShippingAddress()
    Taro.stopPullDownRefresh()
  },
})
class _C extends React.Component {
  render() {
    const { addressList } = this.data
    return (
      <Block>
        {!addressList && <VanEmpty description="暂无收货地址"></VanEmpty>}
        {addressList.map((item, index) => {
          return (
            <View className="list" key={item.id}>
              <View className="aaa">
                <VanCell
                  customClass="aaa"
                  title={item.linkMan + ' ' + item.mobile}
                  label={item.address}
                  onClick={this.selectTap}
                  data-id={item.id}
                ></VanCell>
              </View>
              <VanIcon
                name="records"
                size="40rpx"
                onClick={this.editAddess}
                data-id={item.id}
              ></VanIcon>
            </View>
          )
        })}
        <View style="height:32rpx"></View>
        <View className="safe-bottom-box">
          <VanButton type="primary" icon="add-o" block onClick={this.addAddess}>
            新增收货地址
          </VanButton>
        </View>
      </Block>
    )
  }
}
export default _C
