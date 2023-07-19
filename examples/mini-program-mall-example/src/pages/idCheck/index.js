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
@withWeapp({
  data: {},
  onLoad: function (options) {},
  onShow: function () {},
  async submit() {
    if (!this.data.name) {
      Taro.showToast({
        title: '请输入姓名',
        icon: 'none',
      })
      return
    }
    if (!this.data.idcard) {
      Taro.showToast({
        title: '请输入身份证号码',
        icon: 'none',
      })
      return
    }
    Taro.showLoading({
      title: '',
    })
    this.setData({
      loading: true,
    })
    const res = await WXAPI.idcardCheck(
      Taro.getStorageSync('token'),
      this.data.name,
      this.data.idcard
    )
    Taro.hideLoading({
      success: (res) => {},
    })
    this.setData({
      loading: false,
    })
    if (res.code != 0) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
      return
    }
    Taro.showToast({
      title: '认证通过',
    })
    setTimeout(() => {
      Taro.navigateBack()
    }, 1000)
  },
})
class _C extends React.Component {
  render() {
    const { name, idcard, loading } = this.data
    return (
      <Block>
        <VanField
          label="姓名"
          size="large"
          modelValue={name}
          placeholder="请输入姓名"
          required
        ></VanField>
        <VanField
          label="身份证号码"
          type="idcard"
          size="large"
          modelValue={idcard}
          placeholder="请输入身份证号码"
          required
        ></VanField>
        <View className="btn">
          <VanButton
            type="primary"
            block
            loading={loading}
            onClick={this.submit}
          >
            立即认证
          </VanButton>
        </View>
      </Block>
    )
  }
}
export default _C
