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
import goodsDetailPage from '../../imports/goodsDetailPage12.js'
import WXAPI from '../../apifm-wxapi'
const APP = Taro.getApp()
// fixed首次打开不显示标题的bug
APP.configLoadOK = () => {}
var timer
@withWeapp({
  data: {},
  onLoad: function (options) {
    this.data.status = options.status
    if (this.data.status == -1) {
      timer = setInterval(() => {
        this.peisongOrdersGrabbing()
      }, 1000)
    }
  },
  onShow: function () {
    if (this.data.status != -1) {
      this.orders()
    }
  },
  onUnload() {
    if (timer) {
      clearTimeout(timer)
    }
  },
  async orders() {
    Taro.showLoading({
      title: '',
    })
    const _data = {
      token: Taro.getStorageSync('token'),
    }
    if (this.data.status) {
      _data.statusBatch = this.data.status
      _data.refundStatusBatch = '0,2'
    } else {
      _data.uid = Taro.getStorageSync('uid')
    }
    const res = await WXAPI.peisongOrders(_data)
    Taro.hideLoading({
      complete: (res) => {},
    })
    if (res.code != 0) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
      this.setData({
        orderList: null,
      })
    } else {
      res.data.result.forEach((ele) => {
        if (ele.status == 2) {
          ele.statusStr = '已接单'
        }
        if (ele.status == 3) {
          ele.statusStr = '配送中'
        }
      })
      this.setData({
        orderList: res.data.result,
      })
    }
  },
  async peisongOrdersGrabbing() {
    // wx.showLoading({
    //   title: '',
    // })
    const res = await WXAPI.peisongOrdersGrabbing(Taro.getStorageSync('token'))
    // wx.hideLoading({
    //   complete: (res) => {},
    // })
    if (res.code != 0) {
      // wx.showToast({
      //   title: res.msg,
      //   icon: 'none'
      // })
      this.setData({
        orderList: null,
      })
    } else {
      res.data.forEach((ele) => {
        if (ele.status == 2) {
          ele.statusStr = '已接单'
        }
        if (ele.status == 3) {
          ele.statusStr = '服务中'
        }
      })
      this.setData({
        orderList: res.data,
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
