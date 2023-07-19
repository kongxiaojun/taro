import {
  Block,
  View,
  Image,
  Canvas,
  Form,
  Input,
  Button,
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
import goodsDetailPage from '../../imports/goodsDetailPage9.js'
import './index.scss'
@withWeapp({
  data: {
    orderId: 0,
    goodsList: [],
  },
  onLoad: function (e) {
    // e.id = 478785
    var orderId = e.id
    this.data.orderId = orderId
    this.setData({
      orderId: orderId,
    })
  },
  onShow: function () {
    var that = this
    WXAPI.orderDetail(Taro.getStorageSync('token'), that.data.orderId).then(
      function (res) {
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
        // 子快递单信息
        if (res.data.orderLogisticsShippers) {
          res.data.orderLogisticsShippers.forEach((ele) => {
            if (ele.traces) {
              ele.tracesArray = JSON.parse(ele.traces)
              if (ele.tracesArray && ele.tracesArray.length > 0) {
                ele.tracesLast =
                  ele.tracesArray[ele.tracesArray.length - 1].AcceptStation +
                  '\n' +
                  ele.tracesArray[ele.tracesArray.length - 1].AcceptTime
              }
            }
          })
        }
        that.setData({
          orderDetail: res.data,
        })
      }
    )
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
      title: '确认您已收到商品？',
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
  async submitReputation(e) {
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
      if (!goodReputation) {
        goodReputation = 0
      } else if (goodReputation <= 1) {
        goodReputation = 0
      } else if (goodReputation <= 4) {
        goodReputation = 1
      } else {
        goodReputation = 2
      }
      let reputations_json = {}
      reputations_json.id = orderGoodsId
      reputations_json.reputation = goodReputation
      reputations_json.remark = goodReputationRemark
      if (
        this.data.picsList &&
        this.data.picsList[i] &&
        this.data.picsList[i].length > 0
      ) {
        reputations_json.pics = []
        for (let index = 0; index < this.data.picsList[i].length; index++) {
          const pic = this.data.picsList[i][index]
          const res = await WXAPI.uploadFile(
            Taro.getStorageSync('token'),
            pic.url
          )
          if (res.code == 0) {
            reputations_json.pics.push(res.data.url)
          }
        }
      }
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
  afterPicRead(e) {
    const idx = e.currentTarget.dataset.idx
    let picsList = this.data.picsList
    if (!picsList) {
      picsList = []
      for (let index = 0; index < this.data.orderDetail.goods.length; index++) {
        picsList[index] = []
      }
    }
    picsList[idx] = picsList[idx].concat(e.detail.file)
    this.setData({
      picsList,
    })
  },
  afterPicDel(e) {
    const idx = e.currentTarget.dataset.idx
    let picsList = this.data.picsList
    picsList[idx].splice(e.detail.index, 1)
    this.setData({
      picsList,
    })
  },
})
class _C extends React.Component {
  render() {
    const { orderDetail, message, picsList } = this.data
    return (
      <View className="container">
        <View className="sec-wrap">
          <View className="order-status">
            <View className="icon-box">
              {orderDetail.orderInfo.status == -1 ? (
                <Image
                  className="icon"
                  src={require('../../images/order-details/icon-ddgb.png')}
                ></Image>
              ) : orderDetail.orderInfo.status == 0 ? (
                <Image
                  className="icon"
                  src={require('../../images/order-details/icon-ddfk.png')}
                ></Image>
              ) : orderDetail.orderInfo.status == 1 ? (
                <Image
                  className="icon"
                  src={require('../../images/order-details/icon-ddfh.png')}
                ></Image>
              ) : orderDetail.orderInfo.status == 2 ? (
                <Image
                  className="icon"
                  src={require('../../images/order-details/icon-ddsh.png')}
                ></Image>
              ) : (
                (orderDetail.orderInfo.status == 3 ||
                  orderDetail.orderInfo.status == 4) && (
                  <Image
                    className="icon"
                    src={require('../../images/order-details/icon-jycg.png')}
                  ></Image>
                )
              )}
            </View>
            <View className="right-text">
              <View className="status red">
                {orderDetail.orderInfo.statusStr}
              </View>
              <View className="des" hidden="true">
                请于11时59分59秒内付款，超时订单将自动关闭
              </View>
            </View>
          </View>
          {orderDetail.logistics && (
            <Block>
              {orderDetail.logisticsTraces ? (
                <View className="wuliu-box">
                  <View className="icon-box">
                    <Image
                      className="icon"
                      src={require('../../images/order-details/icon-wuliu.png')}
                    ></Image>
                  </View>
                  <View
                    className="right-text"
                    onClick={this.wuliuDetailsTap}
                    data-id={orderDetail.orderInfo.id}
                  >
                    <View className="order-number">
                      {'快递单号：' + orderDetail.logistics.trackingNumber}
                    </View>
                    {orderDetail.logisticsTraces && (
                      <Block>
                        <View className="wuliu-text">
                          {
                            orderDetail.logisticsTraces[
                              orderDetail.logisticsTraces.length - 1
                            ].AcceptStation
                          }
                        </View>
                        <View className="wuliu-date">
                          {
                            orderDetail.logisticsTraces[
                              orderDetail.logisticsTraces.length - 1
                            ].AcceptTime
                          }
                        </View>
                      </Block>
                    )}
                  </View>
                  <View className="arrow-right">
                    <VanIcon name="arrow"></VanIcon>
                  </View>
                </View>
              ) : (
                <View className="wuliu-box">
                  <View className="icon-box">
                    <Image
                      className="icon"
                      src={require('../../images/order-details/icon-wuliu.png')}
                    ></Image>
                  </View>
                  <View className="right-text">
                    <View className="order-number">
                      {'快递单号：' + orderDetail.logistics.trackingNumber}
                    </View>
                    <View className="wuliu-text">暂无物流信息</View>
                  </View>
                </View>
              )}
              {orderDetail.orderLogisticsShippers &&
                orderDetail.orderLogisticsShippers.length > 0 && (
                  <VanCellGroup>
                    {orderDetail.orderLogisticsShippers.map((item, index) => {
                      return (
                        <VanCell
                          key={item.id}
                          title={item.shipperName + ': ' + item.trackingNumber}
                          label={item.tracesLast}
                          center
                          isLink
                          url={
                            '/pages/wuliu/index?id=' +
                            item.orderId +
                            '&trackingNumber=' +
                            item.trackingNumber
                          }
                        ></VanCell>
                      )
                    })}
                  </VanCellGroup>
                )}
              <View className="address-sec">
                <View className="icon-box">
                  <Image
                    className="icon"
                    src={require('../../images/order-details/icon-address.png')}
                  ></Image>
                </View>
                <View className="right-box">
                  <View className="name-tel">
                    {orderDetail.logistics.linkMan +
                      ' ' +
                      orderDetail.logistics.mobile}
                  </View>
                  <View className="text">
                    {orderDetail.logistics.provinceStr +
                      ' ' +
                      orderDetail.logistics.cityStr +
                      ' ' +
                      orderDetail.logistics.areaStr +
                      ' ' +
                      orderDetail.logistics.address}
                  </View>
                </View>
              </View>
            </Block>
          )}
        </View>
        {orderDetail.orderInfo.hxNumber && orderDetail.orderInfo.status > 0 && (
          <View className="goods-list">
            <View className="list-title hx-title">核销码</View>
            <Canvas className="hx-canvas" canvasId="qrcode"></Canvas>
          </View>
        )}
        <View className="goods-list">
          <View className="list-title">商品信息</View>
          <Form onSubmit={this.submitReputation}>
            {orderDetail.goods.map((item, index) => {
              return (
                <Block key={item.id}>
                  <VanCard
                    num={item.number}
                    price={item.amount}
                    desc={item.property}
                    title={item.goodsName}
                    thumb={item.pic}
                    thumbLink={goodsDetailPage.url(item)}
                    centered
                    lazyLoad
                  ></VanCard>
                  {orderDetail.orderInfo.status == 3 && (
                    <VanCellGroup title="评价">
                      <Input
                        name={'orderGoodsId' + index}
                        value={item.id}
                        style="display:none;"
                      ></Input>
                      <VanCell title="满意度">
                        <VanRate
                          name={'goodReputation' + index}
                          value={5}
                        ></VanRate>
                      </VanCell>
                      <VanField
                        name={'goodReputationRemark' + index}
                        value={message}
                        type="textarea"
                        placeholder="从多个角度评价宝贝，可以帮助更多想买对人"
                        autosize
                      ></VanField>
                      <View style="margin-top:16rpx;padding-left:16rpx;">
                        <VanUploader
                          accept="image"
                          multiple
                          uploadText="买家秀"
                          imageFit="aspectFill"
                          fileList={picsList[index]}
                          data-idx={index}
                          onAfterRead={this.afterPicRead}
                          onDelete={this.afterPicDel}
                        ></VanUploader>
                      </View>
                    </VanCellGroup>
                  )}
                </Block>
              )
            })}
            {orderDetail.orderInfo.status == 3 && (
              <View className="btn-row">
                <Button
                  style="float:right;"
                  className="confirm-btn"
                  formType="submit"
                >
                  提交评价
                </Button>
              </View>
            )}
          </Form>
          <Form onSubmit={this.confirmBtnTap} reportSubmit="true">
            {orderDetail.orderInfo.status == 2 && (
              <View className="btn-row">
                <Button className="confirm-btn" formType="submit">
                  确认收货
                </Button>
              </View>
            )}
          </Form>
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
            <View className="row-label">运费</View>
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
      </View>
    )
  }
}
export default _C
