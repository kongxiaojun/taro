import { Block, View, Image } from '@tarojs/components'
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
  data: {
    minDate: new Date().getTime(),
    maxDate: new Date().getTime(),
    formatter(day) {
      return day
    },
  },
  onLoad: function (options) {
    this.scoreSignLogs()
  },
  onShow: function () {
    // AUTH.checkHasLogined().then((isLogined) => {
    //   if (!isLogined) {
    //     AUTH.login(this)
    //   }
    // })
  },
  async scoreSignLogs() {
    const res = await WXAPI.scoreSignLogs({
      token: Taro.getStorageSync('token'),
    })
    if (res.code == 0) {
      this.setData({
        scoreSignLogs: res.data.result,
        formatter(day) {
          const _log = res.data.result.find((ele) => {
            const year = day.date.getYear() + 1900
            let month = day.date.getMonth() + 1
            month = month + ''
            if (month.length == 1) {
              month = '0' + month
            }
            let date = day.date.getDate() + ''
            if (date.length == 1) {
              date = '0' + date
            }
            return ele.dateAdd.indexOf(`${year}-${month}-${date}`) == 0
          })
          if (_log) {
            day.bottomInfo = '已签到'
          }
          return day
        },
      })
    }
  },
  async sign() {
    const res = await WXAPI.scoreSign(Taro.getStorageSync('token'))
    if (res.code == 10000) {
      Taro.showToast({
        title: '签到成功',
        icon: 'success',
      })
      this.scoreSignLogs()
      return
    }
    if (res.code != 0) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
    } else {
      Taro.showToast({
        title: '签到成功',
        icon: 'success',
      })
      this.scoreSignLogs()
    }
  },
})
class _C extends React.Component {
  render() {
    const { minDate, maxDate, formatter } = this.data
    return (
      <Block>
        <VanCalendar
          showTitle={false}
          poppable={false}
          minDate={minDate}
          maxDate={maxDate}
          showConfirm={false}
          formatter={formatter}
        ></VanCalendar>
        <View className="zwqd-box">
          <Image
            src={require('../../images/zw.png')}
            onClick={this.sign}
          ></Image>
          <View>点击签到</View>
        </View>
      </Block>
    )
  }
}
export default _C
