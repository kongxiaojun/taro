import { Block, View, Form, Button } from '@tarojs/components'
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
import './refundApply.scss'
import WXAPI from '../../apifm-wxapi'
@withWeapp({
  data: {
    autosize: {
      minHeight: 100,
    },
    orderId: 1,
    amount: 999.0,
    refundApplyDetail: undefined,
    type: '0',
    typeItems: [
      {
        name: '我要退款(无需退货)',
        value: '0',
        checked: true,
      },
      {
        name: '我要退货退款',
        value: '1',
      },
      {
        name: '我要换货',
        value: '2',
      },
    ],
    logisticsStatus: '0',
    logisticsStatusItems: [
      {
        name: '未收到货',
        value: '0',
        checked: true,
      },
      {
        name: '已收到货',
        value: '1',
      },
    ],
    reason: '不喜欢/不想要',
    reasons: [
      '不喜欢/不想要',
      '空包裹',
      '未按约定时间发货',
      '快递/物流一直未送达',
      '货物破损已拒签',
      '退运费',
      '规格尺寸与商品页面描述不符',
      '功能/效果不符',
      '质量问题',
      '少件/漏发',
      '包装/商品破损',
      '发票问题',
    ],
    reasonIndex: 0,
    files: [],
    pics: [],
  },
  onLoad: function (e) {
    this.setData({
      orderId: e.id,
      amount: e.amount,
    })
  },
  onShow() {
    const _this = this
    WXAPI.refundApplyDetail(
      Taro.getStorageSync('token'),
      _this.data.orderId
    ).then((res) => {
      if (res.code == 0) {
        _this.setData({
          refundApplyDetail: res.data[0], // baseInfo, pics
        })
      }
    })
  },

  refundApplyCancel() {
    const _this = this
    WXAPI.refundApplyCancel(
      Taro.getStorageSync('token'),
      _this.data.orderId
    ).then((res) => {
      if (res.code == 0) {
        Taro.navigateTo({
          url: '/pages/order-list/index',
        })
      }
    })
  },
  typeChange(event) {
    this.setData({
      type: event.detail,
    })
  },
  typeClick(event) {
    const { name } = event.currentTarget.dataset
    this.setData({
      type: name,
    })
  },
  logisticsStatusChange(event) {
    this.setData({
      logisticsStatus: event.detail,
    })
  },
  logisticsStatusClick(event) {
    const { name } = event.currentTarget.dataset
    this.setData({
      logisticsStatus: name,
    })
  },
  reasonChange(event) {
    this.setData({
      reason: event.detail,
    })
  },
  reasonClick(event) {
    const { name } = event.currentTarget.dataset
    this.setData({
      reason: name,
    })
  },
  reasonChange: function (e) {
    this.setData({
      reasonIndex: e.detail.value,
    })
  },
  afterPicRead(e) {
    let picsList = this.data.picsList
    if (!picsList) {
      picsList = []
    }
    picsList = picsList.concat(e.detail.file)
    this.setData({
      picsList,
    })
  },
  afterPicDel(e) {
    let picsList = this.data.picsList
    picsList.splice(e.detail.index, 1)
    this.setData({
      picsList,
    })
  },
  previewImage: function (e) {
    const that = this
    Taro.previewImage({
      current: e.currentTarget.id,
      // 当前显示图片的http链接
      urls: that.data.files, // 需要预览的图片http链接列表
    })
  },

  async uploadPics() {
    // 批量上传附件
    if (this.data.picsList) {
      for (let index = 0; index < this.data.picsList.length; index++) {
        const pic = this.data.picsList[index]
        const res = await WXAPI.uploadFile(
          Taro.getStorageSync('token'),
          pic.url
        )
        if (res.code == 0) {
          this.data.pics.push(res.data.url)
        }
      }
    }
  },
  async bindSave(e) {
    // 提交保存
    const _this = this
    // _this.data.orderId
    // _this.data.type
    // _this.data.logisticsStatus
    // _this.data.reasons[_this.data.reasonIndex]
    let amount = this.data.amount
    if (_this.data.type == 2) {
      amount = 0.0
    }
    let remark = this.data.remark
    if (!remark) {
      remark = ''
    }
    // 上传图片
    await _this.uploadPics()
    // _this.data.pics
    WXAPI.refundApply({
      token: Taro.getStorageSync('token'),
      orderId: _this.data.orderId,
      type: _this.data.type,
      logisticsStatus: _this.data.logisticsStatus,
      reason: _this.data.reason,
      amount,
      remark,
      pic: _this.data.pics.join(),
    }).then((res) => {
      if (res.code == 0) {
        Taro.showModal({
          title: '成功',
          content: '提交成功，请耐心等待我们处理！',
          showCancel: false,
          confirmText: '我知道了',
          success(res) {
            Taro.navigateTo({
              url: '/pages/order-list/index',
            })
          },
        })
      } else {
        Taro.showModal({
          title: '失败',
          content: res.msg,
          showCancel: false,
          confirmText: '我知道了',
          success(res) {
            Taro.navigateTo({
              url: '/pages/order-list/index',
            })
          },
        })
      }
    })
  },
})
class _C extends React.Component {
  render() {
    const {
      refundApplyDetail,
      type,
      typeItems,
      logisticsStatus,
      logisticsStatusItems,
      reason,
      reasons,
      amount,
      remark,
      autosize,
      picsList,
    } = this.data
    return (
      <View className="page">
        <Form onSubmit={this.bindSave} reportSubmit="true">
          <View className="page__bd">
            {refundApplyDetail && refundApplyDetail.baseInfo.status == 0 && (
              <VanNoticeBar
                leftIcon="volume-o"
                speed="30"
                text="已申请，等待处理"
              ></VanNoticeBar>
            )}
            {refundApplyDetail && refundApplyDetail.baseInfo.status == 2 && (
              <VanNoticeBar
                leftIcon="volume-o"
                speed="30"
                text="本次申请已拒绝，请联系客服"
              ></VanNoticeBar>
            )}
            {refundApplyDetail && refundApplyDetail.baseInfo.status == 3 && (
              <VanNoticeBar
                leftIcon="volume-o"
                speed="30"
                text="正在处理中"
              ></VanNoticeBar>
            )}
            {refundApplyDetail && refundApplyDetail.baseInfo.status == 4 && (
              <VanNoticeBar
                leftIcon="volume-o"
                speed="30"
                text="已成功退换货"
              ></VanNoticeBar>
            )}
            <VanRadioGroup value={type} onChange={this.typeChange}>
              <VanCellGroup title="选择服务类型">
                {typeItems.map((item, index) => {
                  return (
                    <VanCell
                      key={item.value}
                      title={item.name}
                      clickable
                      data-name={item.value}
                      onClick={this.typeClick}
                      renderRighticon={
                        <Block>
                          <VanRadio name={item.value}></VanRadio>
                        </Block>
                      }
                    ></VanCell>
                  )
                })}
              </VanCellGroup>
            </VanRadioGroup>
            {type == 0 && (
              <VanRadioGroup
                value={logisticsStatus}
                onChange={this.logisticsStatusChange}
              >
                <VanCellGroup title="选择货物状态">
                  {logisticsStatusItems.map((item, index) => {
                    return (
                      <VanCell
                        key={item.value}
                        title={item.name}
                        clickable
                        data-name={item.value}
                        onClick={this.logisticsStatusClick}
                        renderRighticon={
                          <Block>
                            <VanRadio name={item.value}></VanRadio>
                          </Block>
                        }
                      ></VanCell>
                    )
                  })}
                </VanCellGroup>
              </VanRadioGroup>
            )}
            <VanRadioGroup value={reason} onChange={this.reasonChange}>
              <VanCellGroup title="售后原因">
                {reasons.map((item, index) => {
                  return (
                    <VanCell
                      key={item.value}
                      title={item}
                      clickable
                      data-name={item}
                      onClick={this.reasonClick}
                      renderRighticon={
                        <Block>
                          <VanRadio name={item}></VanRadio>
                        </Block>
                      }
                    ></VanCell>
                  )
                })}
              </VanCellGroup>
            </VanRadioGroup>
            {type != 2 && (
              <VanField
                label="退款金额"
                modelValue={amount}
                placeholder="请输入申请退款金额"
                type="digit"
                inputAlign="right"
                clearable
              ></VanField>
            )}
            <VanCellGroup title="售后说明">
              <VanField
                modelValue={remark}
                placeholder="请输入退款说明"
                type="textarea"
                autosize={autosize}
              ></VanField>
            </VanCellGroup>
            <View style="margin-top:16rpx;padding-left:32rpx;">
              <VanUploader
                accept="image"
                multiple
                uploadText="上传图片"
                imageFit="aspectFill"
                fileList={picsList}
                onAfterRead={this.afterPicRead}
                onDelete={this.afterPicDel}
              ></VanUploader>
            </View>
            <View>
              {refundApplyDetail && refundApplyDetail.baseInfo.status == 0 && (
                <Button type="warn" onClick={this.refundApplyCancel}>
                  撤回本次申请
                </Button>
              )}
              {refundApplyDetail && refundApplyDetail.baseInfo.status == 3 && (
                <Button type="warn" disabled>
                  等待处理
                </Button>
              )}
              {refundApplyDetail && refundApplyDetail.baseInfo.status == 4 ? (
                <Button type="primary" disabled>
                  处理完毕
                </Button>
              ) : (
                <Button type="warn" formType="submit">
                  立即申请售后
                </Button>
              )}
            </View>
          </View>
        </Form>
      </View>
    )
  }
}
export default _C
