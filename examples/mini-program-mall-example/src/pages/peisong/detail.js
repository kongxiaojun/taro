import {
  Block,
  View,
  Image,
  Text,
  Form,
  Navigator,
  Picker,
  Input,
} from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
const app = Taro.getApp()
const CONFIG = require('../../config.js')
import WXAPI from '../../apifm-wxapi'
import wxbarcode from 'wxbarcode'
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
import goodsDetailPage from '../../imports/goodsDetailPage11.js'
import './detail.scss'
@withWeapp({
  data: {
    orderId: 0,
    goodsList: [],
    fileList: [],
    membersSelectIndex: -1,
    membersSelectStr: '请选择分配配送员',
  },
  onLoad: function (e) {
    // e.peisongOrderId = 54
    var peisongOrderId = e.peisongOrderId
    this.setData({
      peisongOrderId,
    })
    this.peisongOrderDetail()
    this.peisongMemberInfo()
  },
  async peisongOrderDetail() {
    const res = await WXAPI.peisongOrderDetail(
      Taro.getStorageSync('token'),
      this.data.peisongOrderId
    )
    if (res.code == 0) {
      this.setData({
        peisongOrderDetail: res.data,
      })
    }
  },
  async peisongMemberInfo() {
    const res = await WXAPI.peisongMemberInfo(Taro.getStorageSync('token'))
    if (res.code == 0) {
      this.setData({
        peisongMemberInfo: res.data,
      })
      if (res.data.type == 2) {
        this.peisongMembers()
      }
    }
  },
  async peisongMembers() {
    const res = await WXAPI.peisongMembers({
      token: Taro.getStorageSync('token'),
    })
    if (res.code == 0) {
      res.data.result.forEach((ele) => {
        ele.showStr = ele.name + ' ' + ele.mobile + ' ' + ele.statusStr
      })
      this.setData({
        peisongMembers: res.data.result,
      })
    }
  },
  onShow: function () {
    var that = this
    WXAPI.orderDetail(
      Taro.getStorageSync('token'),
      0,
      '',
      that.data.peisongOrderId
    ).then(function (res) {
      if (res.code != 0) {
        Taro.showModal({
          title: '错误',
          content: res.msg,
          showCancel: false,
        })
        return
      }
      // 绘制核销码
      if (res.data.orderInfo.hxNumber && res.data.orderInfo.status > 0) {
        wxbarcode.qrcode('qrcode', res.data.orderInfo.hxNumber, 650, 650)
      }
      that.setData({
        orderDetail: res.data,
      })
    })
  },
  wuliuDetailsTap: function (e) {
    var orderId = e.currentTarget.dataset.id
    Taro.navigateTo({
      url: '/pages/wuliu/index?id=' + orderId,
    })
  },
  confirmBtnTap: function (e) {
    let that = this
    let orderId = this.data.orderId
    Taro.showModal({
      title: '确认服务已完成？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          WXAPI.orderDelivery(Taro.getStorageSync('token'), orderId).then(
            function (res) {
              if (res.code == 0) {
                that.onShow()
              }
            }
          )
        }
      },
    })
  },
  submitReputation: function (e) {
    let that = this
    let postJsonString = {}
    postJsonString.token = Taro.getStorageSync('token')
    postJsonString.orderId = this.data.orderId
    let reputations = []
    let i = 0
    while (e.detail.value['orderGoodsId' + i]) {
      let orderGoodsId = e.detail.value['orderGoodsId' + i]
      let goodReputation = e.detail.value['goodReputation' + i]
      let goodReputationRemark = e.detail.value['goodReputationRemark' + i]
      let reputations_json = {}
      reputations_json.id = orderGoodsId
      reputations_json.reputation = goodReputation
      reputations_json.remark = goodReputationRemark
      reputations.push(reputations_json)
      i++
    }
    postJsonString.reputations = reputations
    WXAPI.orderReputation({
      postJsonString: JSON.stringify(postJsonString),
    }).then(function (res) {
      if (res.code == 0) {
        that.onShow()
      }
    })
  },
  afterRead(event) {
    console.log(event.detail)
    const fileList = this.data.fileList
    event.detail.file.forEach((ele) => {
      fileList.push({
        url: ele.path,
        name: '图片',
      })
    })
    this.setData({
      fileList,
    })
  },
  deletePic(event) {
    const fileList = this.data.fileList
    fileList.splice(event.detail.index, 1)
    this.setData({
      fileList,
    })
  },
  async startService() {
    const extJsonStr = {}
    Taro.showLoading({
      title: '提交中',
    })
    const res = await WXAPI.peisongStartService({
      token: Taro.getStorageSync('token'),
      id: this.data.peisongOrderId,
      extJsonStr: JSON.stringify(extJsonStr),
    })
    Taro.hideLoading({
      complete: (res) => {},
    })
    if (res.code != 0) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
    } else {
      Taro.showToast({
        title: '提交成功',
        icon: 'success',
      })
      this.peisongOrderDetail()
      this.onShow()
    }
  },
  async endService() {
    const extJsonStr = {}
    let picNumber = 0
    Taro.showLoading({
      title: '提交中',
    })
    const res = await WXAPI.peisongEndService({
      token: Taro.getStorageSync('token'),
      id: this.data.peisongOrderId,
      extJsonStr: JSON.stringify(extJsonStr),
    })
    Taro.hideLoading({
      complete: (res) => {},
    })
    if (res.code != 0) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
    } else {
      Taro.showToast({
        title: '提交成功',
        icon: 'success',
      })
      this.setData({
        fileList: [],
      })
      this.peisongOrderDetail()
      this.onShow()
    }
  },
  previewImage(e) {
    const logid = e.currentTarget.dataset.logid
    const current = e.currentTarget.dataset.current
    const urls = []
    this.data.peisongOrderDetail.logs.forEach((ele) => {
      if (ele.id == logid) {
        Object.values(ele.extJson).forEach((_ele) => {
          urls.push(_ele)
        })
      }
    })
    Taro.previewImage({
      urls,
      current,
    })
  },
  bindPickerChange: function (e) {
    const obj = this.data.peisongMembers[e.detail.value]
    this.setData({
      membersSelectIndex: e.detail.value,
      membersSelectStr: obj.name + ' ' + obj.mobile,
    })
  },
  async paidan() {
    if (this.data.membersSelectIndex == -1) {
      Taro.showToast({
        title: '请选择洗车工',
        icon: 'none',
      })
      return
    }
    const member = this.data.peisongMembers[this.data.membersSelectIndex]
    const res = await WXAPI.peisongOrderAllocation(
      Taro.getStorageSync('token'),
      this.data.peisongOrderId,
      member.id
    )
    if (res.code != 0) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
    } else {
      Taro.showToast({
        title: '派单成功',
        icon: 'success',
      })
      Taro.navigateBack({
        complete: (res) => {},
      })
    }
  },
  callMobile() {
    Taro.makePhoneCall({
      phoneNumber: this.data.orderDetail.peisongMember.mobile,
    })
  },
  callMobile2() {
    Taro.makePhoneCall({
      phoneNumber: this.data.orderDetail.logistics.mobile,
    })
  },
  goMap() {
    const _this = this
    const latitude = this.data.orderDetail.logistics.latitude
    const longitude = this.data.orderDetail.logistics.longitude
    Taro.openLocation({
      latitude,
      longitude,
      scale: 18,
    })
  },
  estimatedCompletionTimeChange(value) {
    this.data.estimatedCompletionTimeChange = value.detail
  },
  async estimatedCompletionTime() {
    if (!this.data.estimatedCompletionTimeChange) {
      Taro.showToast({
        title: '填写预计完成时间',
        icon: 'none',
      })
      return
    }
    const res = await WXAPI.peisongOrderEstimatedCompletionTime({
      token: Taro.getStorageSync('token'),
      id: this.data.peisongOrderId,
      estimatedCompletionTime: this.data.estimatedCompletionTimeChange,
    })
    if (res.code == 0) {
      Taro.showToast({
        title: '设置成功',
        icon: 'success',
      })
      this.peisongOrderDetail()
      this.onShow()
    } else {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
    }
  },
  async peisongOrderGrab() {
    if (!this.data.estimatedCompletionTimeChange) {
      Taro.showToast({
        title: '填写预计完成时间',
        icon: 'none',
      })
      return
    }
    const res = await WXAPI.peisongOrderGrab({
      token: Taro.getStorageSync('token'),
      id: this.data.peisongOrderId,
      estimatedCompletionTime: this.data.estimatedCompletionTimeChange,
    })
    if (res.code == 0) {
      Taro.showToast({
        title: '抢单成功',
        icon: 'success',
      })
      this.peisongOrderDetail()
      this.onShow()
    } else {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
    }
  },
})
class _C extends React.Component {
  render() {
    const {
      orderDetail,
      peisongOrderDetail,
      membersSelectIndex,
      peisongMembers,
      membersSelectStr,
      peisongMemberInfo,
      fileList,
    } = this.data
    return (
      <View className="container">
        <View className="sec-wrap">
          {orderDetail.logistics && (
            <Block>
              <View className="wuliu-box">
                <View className="icon-box">
                  <Image
                    className="icon"
                    src={require('../../images/order-details/icon-wuliu.png')}
                  ></Image>
                </View>
                <View className="right-text">
                  <View className="order-number">
                    {'配送订单：' + orderDetail.logistics.trackingNumber}
                  </View>
                  {/*  <view class="wuliu-text">服务地址</view>  */}
                </View>
              </View>
              <View className="address-sec" onClick={this.goMap}>
                <View className="icon-box">
                  <Image
                    className="icon"
                    src={require('../../images/order-details/icon-address.png')}
                  ></Image>
                </View>
                <View className="right-box">
                  <View className="text">
                    {orderDetail.logistics.address}
                    {orderDetail.extJson.map((item, key) => {
                      return (
                        <View className="item" key={item.index}>
                          <Text className="n" style="font-weight:bold;">
                            {key + ':'}
                          </Text>
                          <Text className="v">{item}</Text>
                        </View>
                      )
                    })}
                  </View>
                </View>
              </View>
            </Block>
          )}
        </View>
        <View className="vant-contaner">
          <VanCellGroup title="顾客信息">
            <VanCell
              title="姓名"
              value={orderDetail.logistics.linkMan}
            ></VanCell>
            <VanCell
              title="手机"
              value={orderDetail.logistics.mobile}
              onClick={this.callMobile2}
            ></VanCell>
          </VanCellGroup>
        </View>
        {orderDetail.peisongMember && (
          <View className="vant-contaner">
            <VanCellGroup title="服务人员">
              <VanCell
                title="姓名"
                value={orderDetail.peisongMember.name}
              ></VanCell>
              <VanCell
                title="手机"
                value={orderDetail.peisongMember.mobile}
                onClick={this.callMobile}
              ></VanCell>
              {orderDetail.peisongOrderInfo.estimatedCompletionTime && (
                <VanCell
                  title="预计完成时间"
                  value={orderDetail.peisongOrderInfo.estimatedCompletionTime}
                ></VanCell>
              )}
            </VanCellGroup>
          </View>
        )}
        <View className="goods-list">
          <View className="list-title">服务内容</View>
          <Form onSubmit={this.submitReputation} reportSubmit="true">
            {orderDetail.goods.map((item, index) => {
              return (
                <Block key={item.id}>
                  <Navigator url={goodsDetailPage.url(item)}>
                    <View className="a-goods">
                      <View className="img-box">
                        <Image src={item.pic} className="img"></Image>
                      </View>
                      <View className="text-box">
                        <View className="arow arow01">
                          <View className="goods-name">{item.goodsName}</View>
                          <View className="goods-price">
                            {'¥ ' + item.amount}
                          </View>
                        </View>
                        <View className="arow">
                          <View className="goods-label">{item.property}</View>
                          <View className="goods-num">
                            {'x ' + item.number}
                          </View>
                        </View>
                      </View>
                    </View>
                  </Navigator>
                </Block>
              )
            })}
          </Form>
          {orderDetail.orderInfo.refundStatus == 1 ? (
            <Block>
              <View className="btn-row">
                <VanButton type="danger" block disabled>
                  客户已申请退款
                </VanButton>
              </View>
            </Block>
          ) : (
            <Block>
              {!peisongOrderDetail && (
                <View className="btn-row">
                  <VanField
                    type="text"
                    clearable
                    required
                    placeholder="填写预计完成时间，如: 12:30"
                    onChange={this.estimatedCompletionTimeChange}
                  ></VanField>
                  <VanButton
                    type="primary"
                    block
                    onClick={this.peisongOrderGrab}
                  >
                    抢单
                  </VanButton>
                </View>
              )}
              {peisongOrderDetail.orderInfo.status == 1 && (
                <View className="btn-row">
                  <Picker
                    onChange={this.bindPickerChange}
                    value={membersSelectIndex}
                    range={peisongMembers}
                    rangeKey="showStr"
                  >
                    <VanCell
                      title="配送员"
                      isLink
                      value={membersSelectStr}
                      customClass="select-peisong-member"
                    ></VanCell>
                  </Picker>
                  <VanButton type="danger" block onClick={this.paidan}>
                    派单
                  </VanButton>
                </View>
              )}
              {peisongOrderDetail.orderInfo.status == 2 &&
                peisongOrderDetail.orderInfo.uid == peisongMemberInfo.id &&
                !peisongOrderDetail.orderInfo.estimatedCompletionTime && (
                  <View className="btn-row">
                    <VanField
                      type="text"
                      clearable
                      required
                      placeholder="填写预计完成时间，如: 12:30"
                      onChange={this.estimatedCompletionTimeChange}
                    ></VanField>
                    <VanButton
                      type="primary"
                      block
                      onClick={this.estimatedCompletionTime}
                    >
                      设置预计完成时间
                    </VanButton>
                  </View>
                )}
              {peisongOrderDetail.orderInfo.status == 2 &&
                peisongOrderDetail.orderInfo.uid == peisongMemberInfo.id &&
                peisongOrderDetail.orderInfo.estimatedCompletionTime && (
                  <View className="btn-row">
                    <VanButton type="primary" block onClick={this.startService}>
                      开始配送
                    </VanButton>
                  </View>
                )}
              {peisongOrderDetail.orderInfo.status == 3 &&
                peisongOrderDetail.orderInfo.uid == peisongMemberInfo.id && (
                  <View className="btn-row">
                    <VanUploader
                      multiple
                      fileList={fileList}
                      onAfterRead={this.afterRead}
                      onDelete={this.deletePic}
                    ></VanUploader>
                    <VanButton type="danger" block onClick={this.endService}>
                      配送完成
                    </VanButton>
                  </View>
                )}
            </Block>
          )}
        </View>
        <View className="peisong-way" hidden="true">
          <View className="row-box">
            <View className="row-label">配送方式</View>
            <View className="right-text">顺丰快递</View>
          </View>
          <View className="row-box">
            <View className="row-label">留言</View>
            <View className="right-text">
              <Input
                name="remark"
                type="text"
                className="liuyan"
                placeholder="如需留言请输入"
              ></Input>
            </View>
          </View>
        </View>
        {orderDetail.goodsCoupons && (
          <View className="goods-info" style="margin-bottom:32rpx;">
            {orderDetail.goodsCoupons.map((item, index) => {
              return (
                <View key={item.id} className="row-box">
                  {item.type == 0 && <View className="row-label">优惠券</View>}
                  {item.type == 0 && (
                    <View className="right-text">{item.coupon}</View>
                  )}
                  {item.type == 1 && (
                    <Image
                      mode="widthFix"
                      src={item.coupon}
                      style="max-width:100%;"
                    ></Image>
                  )}
                </View>
              )
            })}
          </View>
        )}
        <View className="goods-info">
          <View className="row-box">
            <View className="row-label">商品金额</View>
            <View className="right-text">
              {'¥ ' + orderDetail.orderInfo.amount}
            </View>
          </View>
          <View className="row-box">
            <View className="row-label">配送费</View>
            {/*  运费  */}
            <View className="right-text">
              {'+ ¥ ' + orderDetail.orderInfo.amountLogistics}
            </View>
          </View>
          <View className="row-box">
            <View className="row-label">应付总额</View>
            <View className="right-text">
              {'¥ ' + orderDetail.orderInfo.amountReal}
            </View>
          </View>
        </View>
        <View className="vant-contaner">
          <VanCellGroup title="服务记录">
            {peisongOrderDetail.logs.map((item, index) => {
              return (
                <Block key={item.id}>
                  <VanCell title={item.typeStr} value={item.dateAdd}></VanCell>
                  {(item.type == 3 || item.type == 4) && (
                    <VanGrid>
                      {item.extJson.map((picpic, key) => {
                        return (
                          <VanGridItem key={picpic} useSlot>
                            <Image
                              style="width: 100%; height: 90px;"
                              src={picpic}
                              mode="aspectFill"
                              onClick={this.previewImage}
                              data-logid={item.id}
                              data-current={picpic}
                            ></Image>
                          </VanGridItem>
                        )
                      })}
                    </VanGrid>
                  )}
                </Block>
              )
            })}
          </VanCellGroup>
        </View>
      </View>
    )
  }
}
export default _C
