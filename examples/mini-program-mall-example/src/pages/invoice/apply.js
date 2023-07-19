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
import './apply.scss'
import WXAPI from '../../apifm-wxapi'
const AUTH = require('../../utils/auth.js')
const CONFIG = require('../../config.js')
@withWeapp({
  /**
   * 页面的初始数据
   */
  data: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    // 读取分享链接中的邀请人编号
    if (e && e.inviter_id) {
      Taro.setStorageSync('referrer', e.inviter_id)
    }
    // 静默式授权注册/登陆
    // AUTH.checkHasLogined().then((isLogined) => {
    //   if (!isLogined) {
    //     AUTH.authorize().then((aaa) => {
    //       if (CONFIG.bindSeller) {
    //         AUTH.bindSeller()
    //       }
    //     })
    //   } else {
    //     if (CONFIG.bindSeller) {
    //       AUTH.bindSeller()
    //     }
    //   }
    // })
    // 弹出编辑昵称头像框
    Taro.getApp().initNickAvatarUrlPOP(this)
  },
  onShow() {},
  chooseInvoiceTitle() {
    Taro.chooseInvoiceTitle({
      success: (res) => {
        this.setData({
          wxInvoiceInfo: res,
        })
      },
      fail: (err) => {
        console.error(err)
        Taro.showToast({
          title: '读取失败',
          icon: 'none',
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '申请开票',
      path: '/pages/invoice/apply?inviter_id=' + Taro.getStorageSync('uid'),
    }
  },
  onShareTimeline() {
    return {
      title: '申请开票',
      query: 'inviter_id=' + Taro.getStorageSync('uid'),
      imageUrl: Taro.getStorageSync('share_pic'),
    }
  },
  async bindSave(e) {
    // 提交保存
    let comName = e.detail.value.comName
    let tfn = e.detail.value.tfn
    let mobile = e.detail.value.mobile
    let amount = e.detail.value.amount
    let consumption = e.detail.value.consumption
    let remark = e.detail.value.remark
    let email = e.detail.value.email
    let address = e.detail.value.address
    let bank = e.detail.value.bank
    if (!mobile) {
      Taro.showToast({
        title: '请填写您在工厂注册的手机号码',
        icon: 'none',
      })
      return
    }
    if (!comName) {
      Taro.showToast({
        title: '公司名称不能为空',
        icon: 'none',
      })
      return
    }
    if (!tfn) {
      Taro.showToast({
        title: '税号不能为空',
        icon: 'none',
      })
      return
    }
    if (!consumption) {
      Taro.showToast({
        title: '发票内容不能为空',
        icon: 'none',
      })
      return
    }
    if (!email) {
      Taro.showToast({
        title: '请填写邮箱地址',
        icon: 'none',
      })
      return
    }
    if (!amount || amount * 1 < 100) {
      Taro.showToast({
        title: '开票金额不能低于100',
        icon: 'none',
      })
      return
    }
    const extJsonStr = {}
    extJsonStr['api工厂账号'] = mobile
    extJsonStr['地址与电话'] = address
    extJsonStr['开户行与账号'] = bank
    WXAPI.invoiceApply({
      token: Taro.getStorageSync('token'),
      comName,
      tfn,
      amount,
      consumption,
      remark,
      email,
      extJsonStr: JSON.stringify(extJsonStr),
    }).then((res) => {
      if (res.code == 0) {
        Taro.showModal({
          title: '成功',
          content: '提交成功，请耐心等待我们处理！',
          showCancel: false,
          confirmText: '我知道了',
          success(res) {
            Taro.navigateTo({
              url: '/pages/invoice/list',
            })
          },
        })
      } else {
        Taro.showModal({
          title: '失败',
          content: res.msg,
          showCancel: false,
          confirmText: '我知道了',
        })
      }
    })
  },
})
class _C extends React.Component {
  render() {
    const { invoiceList } = this.data
    return (
      <Block>
        {(!invoiceList || invoiceList.length <= 0) && (
          <VanEmpty description="暂无开票信息"></VanEmpty>
        )}
        {invoiceList && invoiceList.map((item, index) => {
          return (
            <VanCellGroup key={item} title={item.comName}>
              <VanCell title="金额" value={'￥' + item.amount}></VanCell>
              <VanCell title="内容" value={item.consumption}></VanCell>
              <VanCell
                title="状态"
                renderTestSlot={
                  <Block>
                    <View>
                      {item.status == 0 && (
                        <VanTag type="primary">待处理</VanTag>
                      )}
                      {item.status == 1 && (
                        <VanTag type="danger">不通过</VanTag>
                      )}
                      {item.status == 2 && (
                        <VanTag type="warning">开票中</VanTag>
                      )}
                      {item.status == 3 && (
                        <VanTag type="success">已开票</VanTag>
                      )}
                    </View>
                  </Block>
                }
              ></VanCell>
              {item.email && (
                <VanCell title="邮箱" value={item.email}></VanCell>
              )}
              <VanCell title="申请日期" value={item.dateAdd}></VanCell>
              {item.file && (
                <VanCell
                  title="查看"
                  value="打开电子发票"
                  isLink
                  data-file={item.file}
                  onClick={this.download}
                ></VanCell>
              )}
            </VanCellGroup>
          )
        })}
      </Block>
    )
  }
}
export default _C
