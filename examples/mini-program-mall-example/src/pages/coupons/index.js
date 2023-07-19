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
import './index.scss'
import WXAPI from '../../apifm-wxapi'
const AUTH = require('../../utils/auth.js')
var sliderWidth = 96 // 需要设置slider的宽度，用于计算中间位置
@withWeapp({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['可领', '已领', '失效', '口令'],
    activeIndex: 0,
    showPwdPop: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.activeIndex == 0) {
      this.sysCoupons()
    }
    AUTH.checkHasLogined().then((isLogined) => {
      this.setData({
        isLogined,
      })
      if (isLogined) {
        if (this.data.activeIndex == 1) {
          this.getMyCoupons()
        }
        if (this.data.activeIndex == 2) {
          this.invalidCoupons()
        }
      }
    })
  },
  onReachBottom: function () {},
  tabClick: function (e) {
    this.setData({
      activeIndex: e.detail.index,
    })
    if (this.data.activeIndex == 0) {
      this.sysCoupons()
    }
    if (this.data.activeIndex == 1) {
      this.getMyCoupons()
    }
    if (this.data.activeIndex == 2) {
      this.invalidCoupons()
    }
  },
  sysCoupons() {
    // 读取可领取券列表
    var _this = this
    Taro.showLoading({
      title: '',
    })
    WXAPI.coupons().then(function (res) {
      Taro.hideLoading({
        success: (res) => {},
      })
      if (res.code == 0) {
        _this.setData({
          coupons: res.data,
        })
      } else {
        _this.setData({
          coupons: null,
        })
      }
    })
  },
  getCounpon2() {
    if (!this.data.couponPwd) {
      Taro.showToast({
        title: '请输入口令',
        icon: 'none',
      })
      return
    }
    const e = {
      kl: true,
      currentTarget: {
        dataset: {
          id: this.data.pwdCounponId,
        },
      },
    }
    this.getCounpon(e)
  },
  getCounpon: function (e) {
    const that = this
    if (e.currentTarget.dataset.pwd) {
      this.setData({
        pwdCounponId: e.currentTarget.dataset.id,
        showPwdPop: true,
      })
      return
    } else {
      if (!e.kl) {
        this.data.couponPwd = ''
      }
    }
    this.setData({
      showPwdPop: false,
    })
    WXAPI.fetchCoupons({
      id: e.currentTarget.dataset.id,
      token: Taro.getStorageSync('token'),
      pwd: this.data.couponPwd,
    }).then(function (res) {
      if (res.code == 20001 || res.code == 20002) {
        Taro.showModal({
          title: '错误',
          content: '来晚了',
          showCancel: false,
        })
        return
      }
      if (res.code == 20003) {
        Taro.showModal({
          title: '错误',
          content: '你领过了，别贪心哦~',
          showCancel: false,
        })
        return
      }
      if (res.code == 30001) {
        Taro.showModal({
          title: '错误',
          content: '您的积分不足',
          showCancel: false,
        })
        return
      }
      if (res.code == 20004) {
        Taro.showModal({
          title: '错误',
          content: '已过期~',
          showCancel: false,
        })
        return
      }
      if (res.code == 0) {
        Taro.showToast({
          title: '领取成功',
          icon: 'success',
        })
      } else {
        Taro.showModal({
          title: '错误',
          content: res.msg,
          showCancel: false,
        })
      }
    })
  },
  getMyCoupons: function () {
    var _this = this
    Taro.showLoading({
      title: '',
    })
    WXAPI.myCoupons({
      token: Taro.getStorageSync('token'),
      status: 0,
    }).then(function (res) {
      Taro.hideLoading({
        success: (res) => {},
      })
      if (res.code == 0) {
        res.data.forEach((ele) => {
          if (ele.dateEnd) {
            ele.dateEnd = ele.dateEnd.split(' ')[0]
          }
        })
        _this.setData({
          coupons: res.data,
        })
      } else {
        _this.setData({
          coupons: null,
        })
      }
    })
  },
  invalidCoupons: function () {
    var _this = this
    Taro.showLoading({
      title: '',
    })
    WXAPI.myCoupons({
      token: Taro.getStorageSync('token'),
      status: '1,2,3',
    }).then(function (res) {
      Taro.hideLoading({
        success: (res) => {},
      })
      if (res.code == 0) {
        _this.setData({
          coupons: res.data,
        })
      } else {
        _this.setData({
          coupons: null,
        })
      }
    })
  },
  async touse(e) {
    const item = e.currentTarget.dataset.item
    const res = await WXAPI.couponDetail(item.pid)
    if (res.code != 0) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
      return
    }
    if (!res.data.couponRefs || res.data.couponRefs.length == 0) {
      Taro.switchTab({
        url: '/pages/index/index',
      })
      return
    }
    let categoryId, goodsId
    res.data.couponRefs.forEach((ele) => {
      if (ele.type == 0) {
        categoryId = ele.refId
      }
      if (ele.type == 1) {
        goodsId = ele.refId
      }
    })
    if (categoryId) {
      Taro.navigateTo({
        url: '/pages/goods/list?categoryId=' + categoryId,
      })
      return
    }
    if (goodsId) {
      Taro.navigateTo({
        url: '/pages/goods-details/index?id=' + goodsId,
      })
      return
    }
  },
  pwdCouponChange(e) {
    this.setData({
      couponPwd: e.detail.value,
    })
  },
  onPullDownRefresh() {
    if (this.data.activeIndex == 0) {
      this.sysCoupons()
    }
    if (this.data.activeIndex == 1) {
      this.getMyCoupons()
    }
    if (this.data.activeIndex == 2) {
      this.invalidCoupons()
    }
    Taro.stopPullDownRefresh()
  },
  closePwd() {
    this.setData({
      showPwdPop: false,
    })
  },
  async exchangeCoupons() {
    if (!this.data.number) {
      Taro.showToast({
        title: '请输入券号',
        icon: 'none',
      })
      return
    }
    if (!this.data.pwd) {
      Taro.showToast({
        title: '请输入密码',
        icon: 'none',
      })
      return
    }
    this.setData({
      exchangeCouponsLoading: true,
    })
    Taro.showLoading({
      title: '',
    })
    const res = await WXAPI.exchangeCoupons(
      Taro.getStorageSync('token'),
      this.data.number,
      this.data.pwd
    )
    Taro.hideLoading({
      success: (res) => {},
    })
    this.setData({
      exchangeCouponsLoading: false,
    })
    if (res.code != 0) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
    } else {
      Taro.showToast({
        title: '兑换成功',
      })
    }
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
            {tabs && tabs.map((item, index) => {
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
            {coupons && coupons.map((item, index) => {
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
