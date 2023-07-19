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
import './list.scss'
import WXAPI from '../../apifm-wxapi'
const AUTH = require('../../utils/auth.js')
@withWeapp({
  /**
   * 页面的初始数据
   */
  data: {
    invoiceList: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  onShow: function () {
    const _this = this
    AUTH.checkHasLogined().then((isLogined) => {
      if (isLogined) {
        WXAPI.invoiceList({
          token: Taro.getStorageSync('token'),
        }).then((res) => {
          if (res.code == 0) {
            _this.setData({
              invoiceList: res.data.result,
            })
          } else {
            _this.setData({
              invoiceList: [],
            })
          }
        })
      } else {
        Taro.showModal({
          title: '提示',
          content: '本次操作需要您的登录授权',
          cancelText: '暂不登录',
          confirmText: '前往登录',
          success(res) {
            if (res.confirm) {
              Taro.switchTab({
                url: '/pages/my/index',
              })
            } else {
              Taro.navigateBack()
            }
          },
        })
      }
    })
  },
  download(e) {
    const _this = this
    const file = e.currentTarget.dataset.file
    Taro.downloadFile({
      url: file,
      success(res) {
        const tempFilePath = res.tempFilePath
        console.log(tempFilePath)
        Taro.openDocument({
          filePath: tempFilePath,
          showMenu: true,
          success: function (res) {
            console.log('打开文档成功')
          },
        })
      },
    })
  },
})
class _C extends React.Component {
  render() {
    const { invoiceList } = this.data
    return (
      <Block>
        {invoiceList.length <= 0 && (
          <VanEmpty description="暂无开票信息"></VanEmpty>
        )}
        {invoiceList.map((item, index) => {
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
