import { Block, View, Text } from '@tarojs/components'
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
const wxpay = require('../../../utils/pay.js')
import WXAPI from '../../../apifm-wxapi'
@withWeapp({
  data: {
    dateBegin: undefined,
    dateEnd: undefined,
    sellerMobile: undefined,
    aggregate: {
      sum_sale_amount: 0,
    },
  },
  onLoad(options) {},
  onShow: function () {
    //获取佣金列表
    this.getCommisionLog()
  },
  async getCommisionLog() {
    const postData = {
      token: Taro.getStorageSync('token'),
      dateAddBegin: this.data.dateBegin ? this.data.dateBegin : '',
      dateAddEnd: this.data.dateEnd ? this.data.dateEnd : '',
      sellerMobile: this.data.sellerMobile ? this.data.sellerMobile : '',
    }
    await WXAPI.fxCommisionLog(postData).then((res) => {
      if (res.code == 0) {
        const goodsMap = res.data.goodsMap
        const commisionLog = res.data.result
        if (goodsMap) {
          res.data.orderList.forEach((ele) => {
            const _goods = goodsMap[ele.id] // 该订单下的商品列表
            if (_goods) {
              let totalCommision = 0
              _goods.forEach((c) => {
                const commisionRecord = commisionLog.find((d) => {
                  return d.orderId == ele.id && d.goodsName == c.goodsName //  FIXME 要么根据销售额，还是别的来匹配返佣记录
                })

                if (commisionRecord) {
                  totalCommision += commisionRecord.money
                  c.commisionRecord = commisionRecord
                  ele.buyerUserNick = commisionRecord.nicks
                    ? commisionRecord.nicks
                    : '用户' + commisionRecord.uids
                }
              })
              ele.goodsList = _goods
              ele.totalCommision = totalCommision
            }
          })
        }
        this.setData({
          commisionLog,
          orderList: res.data.orderList,
          logisticsMap: res.data.logisticsMap,
          goodsMap,
          aggregate: res.data.aggregate,
          userInviter: res.data.userInviter,
        })
      } else {
        this.setData({
          commisionLog: [],
          orderList: [],
          logisticsMap: [],
          goodsMap: [],
        })
      }
    })
  },
  dateBeginCancel() {
    this.setData({
      dateBegin: null,
    })
  },
  dateBeginChange(e) {
    this.setData({
      dateBegin: e.detail.value,
    })
  },
  dateEndCancel() {
    this.setData({
      dateEnd: null,
    })
  },
  dateEndChange(e) {
    this.setData({
      dateEnd: e.detail.value,
    })
  },
})
class _C extends React.Component {
  render() {
    const { orderList, userInviter } = this.data
    return (
      <View className="container">
        {(!orderList || orderList.length == 0) && (
          <VanEmpty description="暂无订单"></VanEmpty>
        )}
        {!(orderList.length > 0 ? false : true) && (
          <View className="order-list">
            {orderList.map((item, index) => {
              return (
                <View className="a-order" key={item.index}>
                  <VanCell
                    title={'订单号：' + item.orderNumber}
                    value={item.statusStr}
                    label={'购买用户:' + item.buyerUserNick}
                    titleStyle={{flex:3}}
                  ></VanCell>
                  {item.goodsList.map((g, index) => {
                    return (
                      <VanCard
                        key={g.id}
                        num={g.number}
                        price={g.amountSingle}
                        desc
                        title={g.goodsName}
                        thumb={g.pic}
                        centered
                        renderBottom={
                          <Block>
                            <View style="color:#ee0a24;">
                              {g.commisionRecord.bili +
                                '% 返佣 ' +
                                g.commisionRecord.money +
                                ' ' +
                                (g.commisionRecord.unit == 0 ? '元' : '积分')}
                              {g.commisionRecord.isSettlement ? (
                                <Text style="color:green;margin-left:10px;font-size:14px;">
                                  已结算
                                </Text>
                              ) : (
                                item.status != -1 && (
                                  <Text style="color:gray;margin-left:10px;font-size:14px;">
                                    待结算
                                  </Text>
                                )
                              )}
                            </View>
                          </Block>
                        }
                      ></VanCard>
                    )
                  })}
                  <View className="goods-price">
                    {'共 ' + item.goodsNumber + ' 件商品 合计：'}
                    {item.score <= 0 && (
                      <Text className="p">{'¥ ' + item.amountReal}</Text>
                    )}
                    {item.score > 0 && (
                      <Text className="p">
                        {'¥ ' + item.amountReal + ' + ' + item.score + ' 积分'}
                      </Text>
                    )}
                    ，累计佣金
                    {item.score <= 0 && (
                      <Text className="p">{item.totalCommision}</Text>
                    )}
                  </View>
                  {userInviter[item.goodsList[0].commisionRecord.uids] && (
                    <VanCell
                      title={
                        '销售员:' +
                        userInviter[item.goodsList[0].commisionRecord.uids].nick
                      }
                    ></VanCell>
                  )}
                  <View className="goods-info">
                    <View className="goods-des">
                      {item.remark && item.remark != '' && (
                        <View className="remark">{item.remark}</View>
                      )}
                      <View style="font-size:24rpx;color:#666;">
                        {'下单日期：' + item.dateAdd}
                      </View>
                    </View>
                  </View>
                </View>
              )
            })}
          </View>
        )}
        <View className="safeAreaOldMarginBttom safeAreaNewMarginBttom"></View>
      </View>
    )
  }
}
export default _C
