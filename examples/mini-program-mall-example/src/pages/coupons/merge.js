import { Block, View, Image, Text, Input, Button } from '@tarojs/components'
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
import './merge.scss'
import WXAPI from '../../apifm-wxapi'
const AUTH = require('../../utils/auth.js')
@withWeapp({
  data: {},
  onLoad: function (options) {
    this.mergeCouponsRules()
  },
  onShow: function () {},
  async mergeCouponsRules() {
    const res = await WXAPI.mergeCouponsRules()
    if (res.code == 0) {
      this.setData({
        mergeCouponsRules: res.data,
      })
    }
  },
  onPullDownRefresh() {
    this.mergeCouponsRules()
    Taro.stopPullDownRefresh()
  },
  async merge(e) {
    const idx = e.currentTarget.dataset.idx
    const mergeCouponsRule = this.data.mergeCouponsRules[idx]
    this.setData({
      loading: true,
    })
    let res = await WXAPI.myCoupons({
      token: Taro.getStorageSync('token'),
      status: 0,
    })
    if (res.code == 700) {
      Taro.showToast({
        title: '您暂无可用的优惠券',
        icon: 'none',
      })
      this.setData({
        loading: false,
      })
      return
    }
    if (res.code != 0) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
      this.setData({
        loading: false,
      })
      return
    }
    const myCoupons = res.data.reverse()
    const couponIds = [] // 用来合成的优惠券id
    let ok = true
    let msg = ''
    mergeCouponsRule.rules
      .filter((rule) => {
        return rule.type == 0
      })
      .forEach((rule) => {
        for (let i = 0; i < rule.number; i++) {
          const couponIndex = myCoupons.findIndex((ele) => {
            return ele.pid == rule.couponId
          })
          if (couponIndex == -1) {
            ok = false
            msg = rule.couponName
            return
          }
          const coupon = myCoupons[couponIndex]
          couponIds.push(coupon.id)
          myCoupons.splice(couponIndex, 1)
        }
      })
    if (!ok) {
      Taro.showToast({
        title: '缺少优惠券:' + msg,
        icon: 'none',
      })
      this.setData({
        loading: false,
      })
      return
    }
    res = await WXAPI.mergeCoupons({
      token: Taro.getStorageSync('token'),
      mergeId: mergeCouponsRule.id,
      couponIds: couponIds.join(),
    })
    if (res.code != 0) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
      this.setData({
        loading: false,
      })
      return
    }
    Taro.showToast({
      title: '兑换成功',
    })
    this.setData({
      loading: false,
    })
    setTimeout(() => {
      Taro.navigateBack({
        delta: 0,
      })
    }, 1000)
  },
})
class _C extends React.Component {
  render() {
    const {
      tabs,
      activeIndex,
      coupons,
      number,
      pwd,
      exchangeCouponsLoading,
      couponPwd,
      showPwdPop,
    } = this.data
    return (
      <Block>
        <VanSticky>
          <VanTabs onChange={this.tabClick}>
            {tabs.map((item, index) => {
              return <VanTab key={item.index} title={item}></VanTab>
            })}
          </VanTabs>
        </VanSticky>
        {activeIndex == 1 && coupons && coupons.length == 0 && (
          <VanCell
            customClass="hecheng"
            title="合成高品质优惠券"
            value="合成"
            isLink
          ></VanCell>
        )}
        {activeIndex != 3 && (!coupons || coupons.length == 0) && (
          <VanEmpty description="暂无优惠券"></VanEmpty>
        )}
        {activeIndex == 0 && (
          <Block>
            {coupons.map((item, index) => {
              return (
                <View className="coupons" key={item.id}>
                  <Image
                    className="icon"
                    src={require('../../images/icon/coupons-active.svg')}
                  ></Image>
                  <View className="profile">
                    <View className="name">
                      <View className="t">代金券</View>
                      <View className="n">{item.name}</View>
                    </View>
                    <View className="price">
                      <View className="tj">{'满' + item.moneyHreshold}</View>
                      {item.moneyType == 0 && (
                        <View className="amount">
                          <Text>￥</Text>
                          {item.moneyMin}
                        </View>
                      )}
                      {item.moneyType == 1 && (
                        <View className="amount">
                          <Text></Text>
                          {item.moneyMin}
                          <Text>%</Text>
                        </View>
                      )}
                    </View>
                    <View
                      className="btn"
                      onClick={this.getCounpon}
                      data-id={item.id}
                      data-pwd={item.pwd}
                    >
                      立即领取
                    </View>
                  </View>
                </View>
              )
            })}
          </Block>
        )}
        {activeIndex == 1 && (
          <Block>
            {coupons.map((item, index) => {
              return (
                <View className="coupons" key={item.id}>
                  <Image
                    className="icon"
                    src={require('../../images/icon/coupons-active.svg')}
                  ></Image>
                  <View className="profile">
                    <View className="name">
                      <View className="t">代金券</View>
                      <View className="n">{item.name}</View>
                    </View>
                    <View className="price">
                      <View className="tj">
                        {'(' + item.dateEnd + '到期) 满' + item.moneyHreshold}
                      </View>
                      {item.moneyType == 0 && (
                        <View className="amount">
                          <Text>￥</Text>
                          {item.money}
                        </View>
                      )}
                      {item.moneyType == 1 && (
                        <View className="amount">
                          <Text></Text>
                          {item.money}
                          <Text>%</Text>
                        </View>
                      )}
                    </View>
                    <View className="btn" onClick={this.touse} data-item={item}>
                      立即使用
                    </View>
                  </View>
                </View>
              )
            })}
          </Block>
        )}
        {activeIndex == 2 && (
          <Block>
            {coupons.map((item, index) => {
              return (
                <View className="coupons" key={item.id}>
                  <Image
                    className="icon"
                    src={require('../../images/icon/coupons-off.svg')}
                  ></Image>
                  <View className="profile">
                    <View className="name">
                      <View className="t disabled1">代金券</View>
                      <View className="n disabled2">{item.name}</View>
                    </View>
                    <View className="price">
                      <View className="tj disabled2">
                        {'满' + item.moneyHreshold}
                      </View>
                      {item.moneyType == 0 && (
                        <View className="amount disabled2">
                          <Text className="disabled2">￥</Text>
                          {item.money}
                        </View>
                      )}
                      {item.moneyType == 1 && (
                        <View className="amount disabled2">
                          <Text className="disabled2"></Text>
                          {item.money}
                          <Text className="disabled2">%</Text>
                        </View>
                      )}
                    </View>
                    <View className="btn">{item.statusStr}</View>
                  </View>
                </View>
              )
            })}
          </Block>
        )}
        {activeIndex == 3 && (
          <View className="koulingcoupon">
            <VanField
              label="券号"
              modelValue={number}
              clearable
              size="large"
              placeholder="请输入券号"
              onChange={this.onChange}
            ></VanField>
            <VanField
              label="密码"
              modelValue={pwd}
              clearable
              size="large"
              placeholder="请输入密码"
              onChange={this.onChange}
            ></VanField>
            <View className="block-btn">
              <VanButton
                block
                type="primary"
                loading={exchangeCouponsLoading}
                onClick={this.exchangeCoupons}
              >
                立即兑换
              </VanButton>
            </View>
          </View>
        )}
        <View className="bottom"></View>
        {showPwdPop && (
          <Block>
            <View className="pwd-coupons-mask" onClick={this.closePwd}></View>
            <View className="pwd-coupons">
              <View className="t">请输入口令</View>
              <Input
                onInput={this.pwdCouponChange}
                className="input"
                value={couponPwd}
                autoFocus
              ></Input>
              <Button type="primary" plain onClick={this.getCounpon2}>
                领取
              </Button>
            </View>
          </Block>
        )}
      </Block>
    )
  }
}
export default _C
