import { Block, View, Image, Canvas } from '@tarojs/components'
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
import './fxmember.scss'
const app = Taro.getApp()
import WXAPI from '../../../apifm-wxapi'
const AUTH = require('../../../utils/auth.js')
const wxpay = require('../../../utils/pay.js')
const APP = Taro.getApp()
@withWeapp({
  /**
   * 页面的初始数据
   */
  data: {
    level: 0,
    description: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var level = options.level
    if (level == 0) {
      Taro.setNavigationBarTitle({
        title: '团队长列表',
      })
      this.setData({
        description: '暂无团队长',
      })
    }
    if (level == 1) {
      Taro.setNavigationBarTitle({
        title: '团员列表',
      })
      this.setData({
        description: '暂无团员',
      })
    }
    AUTH.checkHasLogined().then((isLogined) => {
      this.setData({
        wxlogin: isLogined,
      })
      if (isLogined) {
        this.fxMembers(level)
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  getUserApiInfo: function () {
    var that = this
    WXAPI.userDetail(Taro.getStorageSync('token')).then(function (res) {
      if (res.code == 0) {
        let _data = {}
        _data.apiUserInfoMap = res.data
        if (res.data.base.mobile) {
          _data.userMobile = res.data.base.mobile
        }
        if (
          that.data.order_hx_uids &&
          that.data.order_hx_uids.indexOf(res.data.base.id) != -1
        ) {
          _data.canHX = true // 具有扫码核销的权限
        }

        const adminUserIds = Taro.getStorageSync('adminUserIds')
        if (adminUserIds && adminUserIds.indexOf(res.data.base.id) != -1) {
          _data.isAdmin = true
        }
        if (res.data.peisongMember && res.data.peisongMember.status == 1) {
          _data.memberChecked = false
        } else {
          _data.memberChecked = true
        }
        that.setData(_data)
        that.commision()
      }
    })
  },
  cancelLogin() {
    Taro.switchTab({
      url: '/pages/my/index',
    })
  },
  processLogin(e) {
    if (!e.detail.userInfo) {
      Taro.showToast({
        title: '已取消',
        icon: 'none',
      })
      return
    }
    AUTH.register(this)
  },
  async fxMembers(level) {
    const res = await WXAPI.partnerMembers({
      token: Taro.getStorageSync('token'),
      type: level,
    })
    if (res.code == 0) {
      this.setData({
        memberList: res.data,
      })
    }
    console.log('fxmenber', res)
  },
})
class _C extends React.Component {
  render() {
    const {
      apiUserInfoMap,
      freeze,
      balance,
      commisionData,
      membersStatistics,
      tzid,
      fxData,
      wxlogin,
    } = this.data
    return (
      <Block>
        <View>
          <Image
            style="width:750rpx;height:200rpx"
            mode="scaleToFill"
            src="https://dcdn.it120.cc/2021/01/13/3bb7207c-de68-476e-a5f8-8a2bfb7f1f09.png"
          ></Image>
        </View>
        {apiUserInfoMap.base.isTeamMember ||
        apiUserInfoMap.base.isTeamLeader ||
        apiUserInfoMap.partnerInfo ? (
          <View>
            <View className="tabTop" style="margin-top:-88rpx">
              {apiUserInfoMap && (
                <View className="header-box">
                  <Image
                    className="avatar"
                    src={apiUserInfoMap.base.avatarUrl}
                    mode="aspectFill"
                  ></Image>
                  <View className="r">
                    <View className="uid">
                      {'用户ID: ' + apiUserInfoMap.base.id}
                    </View>
                    <View style="display:flex">
                      <View className="nick">{apiUserInfoMap.base.nick}</View>
                      {apiUserInfoMap.partnerInfo ? (
                        <View
                          className="nick"
                          style="padding:2rpx 10rpx;background-color:#FFAF32;color:white;border-radius:10rpx;font-size:14px;margin-left:10px"
                        >
                          合伙人
                        </View>
                      ) : (
                        apiUserInfoMap.base.isTeamLeader && (
                          <View
                            className="nick"
                            style="padding:2rpx 10rpx;background-color:#FFAF32;color:white;border-radius:10rpx;font-size:14px;margin-left:10px"
                          >
                            团长
                          </View>
                        )
                      )}
                    </View>
                  </View>
                </View>
              )}
              <View className="header-box2"></View>
              <View className="line"></View>
              <View className="asset">
                <View className="item">
                  <View className="Count">{freeze}</View>
                  <View>冻结金额</View>
                </View>
                <View className="item right">
                  <View className="Count" style="color:#FF444A">
                    {balance}
                  </View>
                  <View>可用金额</View>
                </View>
                <View
                  className="txBtn"
                  onClick={this.withdraw}
                  style="margin-top:20px;background: #F5D795;"
                >
                  立即提现
                </View>
              </View>
              <View className="line"></View>
              <View className="titleXS">我的销售额</View>
              <View className="asset">
                <View className="item">
                  <View className="Count">{commisionData.todayXiaoshou}</View>
                  <View>今日销售</View>
                  <View className="yjP">{commisionData.today}</View>
                  <View className="yjT">（佣金）</View>
                </View>
                <View className="item right">
                  <View className="Count">{commisionData.yesdayXiaoshou}</View>
                  <View>昨天销售</View>
                  <View className="yjP">{commisionData.yesday}</View>
                  <View className="yjT">（佣金）</View>
                </View>
                <View className="item right" onClick={this.goScore}>
                  <View className="Count">
                    {commisionData.thisMonthXiaoshou}
                  </View>
                  <View>本月销售</View>
                  <View className="yjP">{commisionData.thisMonth}</View>
                  <View className="yjT">（佣金）</View>
                </View>
                <View className="item right">
                  <View className="Count">
                    {commisionData.lastMonthXiaoshou}
                  </View>
                  <View>上月销售</View>
                  <View className="yjP">{commisionData.lastMonth}</View>
                  <View className="yjT">（佣金）</View>
                </View>
              </View>
            </View>
            {apiUserInfoMap.partnerInfo ? (
              <View>
                {apiUserInfoMap.partnerInfo && (
                  <View className="tuan">
                    <View>我的团队</View>
                    <View className="line2"></View>
                    <View style="display:flex">
                      <View
                        className="tuanItem"
                        onClick={this.goFxmem}
                        data-level="0"
                      >
                        <View className="tI1">
                          {membersStatistics.leaders + '人'}
                        </View>
                        <View className="tI2">团队长</View>
                      </View>
                      <View
                        className="tuanItem"
                        onClick={this.goFxmem}
                        data-level="1"
                      >
                        <View className="tI1">
                          {membersStatistics.members + '人'}
                        </View>
                        <View className="tI2">团员</View>
                      </View>
                    </View>
                  </View>
                )}
                <View
                  className="tuan2"
                  style="margin-top:10px;display:flex;justify-content: space-between;margin-bottom:10px"
                  onClick={this.goCommision}
                >
                  <View className="tL" style="display:flex;align-items:center">
                    <View>推广订单</View>
                    <Image
                      className="next"
                      src={require('../../../images/icon/next.png')}
                    ></Image>
                  </View>
                </View>
                <View
                  className="tuan2"
                  style="margin-top:10px;display:flex;justify-content: space-between;"
                >
                  <View className="tL" style="display:flex;align-items:center">
                    <View>我的邀请码</View>
                    <View className="yqCode">{apiUserInfoMap.base.id}</View>
                  </View>
                  <View
                    className="cybtn"
                    onClick={this.copyContent}
                    data-id={apiUserInfoMap.base.id}
                  >
                    复制
                  </View>
                </View>
              </View>
            ) : apiUserInfoMap.base.isTeamLeader ? (
              <View>
                {apiUserInfoMap.parentPartnerInfo && (
                  <View
                    className="tuan"
                    style="padding: 40rpx 40rpx 20rpx 40rpx;margin-bottom:10px"
                  >
                    <View>我的合伙人</View>
                    <View className="line2"></View>
                    <View style="display:flex">
                      <Image
                        style="width:80rpx;height:80rpx;margin:10px 20px 0px 0;border-radius:100%"
                        src={apiUserInfoMap.parentPartnerInfo.avatarUrl}
                      ></Image>
                      <View style="height:120rpx;line-height:120rpx">
                        {apiUserInfoMap.parentPartnerInfo.nick}
                      </View>
                    </View>
                  </View>
                )}
                <View
                  className="tuan2"
                  style="margin-top:10px;display:flex;justify-content: space-between;margin-bottom:10px"
                  onClick={this.goFxmem}
                  data-level="1"
                >
                  <View className="tL" style="display:flex;align-items:center">
                    <View>我的团员</View>
                    <Image
                      className="next"
                      src={require('../../../images/icon/next.png')}
                    ></Image>
                  </View>
                </View>
                <View
                  className="tuan2"
                  style="margin-top:10px;display:flex;justify-content: space-between;margin-bottom:10px"
                  onClick={this.goCommision}
                >
                  <View className="tL" style="display:flex;align-items:center">
                    <View>推广订单</View>
                    <Image
                      className="next"
                      src={require('../../../images/icon/next.png')}
                    ></Image>
                  </View>
                </View>
                <View
                  className="tuan2"
                  style="margin-top:10px;display:flex;justify-content: space-between;margin-bottom:10px"
                >
                  <View className="tL" style="display:flex;align-items:center">
                    <View>我的邀请码</View>
                    <View className="yqCode">{apiUserInfoMap.base.id}</View>
                  </View>
                  <View
                    className="cybtn"
                    onClick={this.copyContent}
                    data-id={apiUserInfoMap.base.id}
                  >
                    复制
                  </View>
                </View>
              </View>
            ) : (
              apiUserInfoMap.base.isTeamMember && (
                <View>
                  {apiUserInfoMap.parentTeamLeaderInfo ? (
                    <View
                      className="tuan"
                      style="padding: 40rpx 40rpx 20rpx 40rpx;"
                    >
                      <View>我的团长</View>
                      <View className="line2"></View>
                      <View style="display:flex">
                        <Image
                          style="width:80rpx;height:80rpx;margin:10px 20px 0px 0;border-radius:100%"
                          src={apiUserInfoMap.parentTeamLeaderInfo.avatarUrl}
                        ></Image>
                        <View style="height:120rpx;line-height:120rpx">
                          {apiUserInfoMap.parentTeamLeaderInfo.nick}
                        </View>
                      </View>
                    </View>
                  ) : (
                    <View
                      className="tuan"
                      style="padding: 40rpx 40rpx 20rpx 40rpx;"
                    >
                      <View>绑定团长</View>
                      <View className="line2"></View>
                      <VanField
                        value={tzid}
                        placeholder="请输入团长邀请码，立即成为会员"
                        border={false}
                        onChange={this.onChange}
                        clearable
                        inputAlign="center"
                      ></VanField>
                      <View style="text-align:center">
                        <View
                          className="tzBtn"
                          onClick={this.partnerBindTeamLeader}
                          style="margin-top:20px;background: #F5D795;"
                        >
                          立即绑定
                        </View>
                      </View>
                    </View>
                  )}
                  <View className="tuan" style="margin-top:10px">
                    <View>我的团队</View>
                    <View className="line2"></View>
                    <View style="width:100%;text-align:center">
                      <View className="textsjtz">
                        您还不是团长，支付
                        <Span style="color: #FF444A;">
                          {fxData.priceLeader}
                        </Span>
                        立即升级
                      </View>
                    </View>
                    <View style="text-align:center">
                      {fxData.isOpen && !apiUserInfoMap.base.isTeamLeader && (
                        <View
                          className="tzBtn"
                          style="margin-top:20px;background: #F5D795;"
                          onClick={this.payFx}
                        >
                          立即升级
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              )
            )}
            {(apiUserInfoMap.base.isTeamLeader ||
              apiUserInfoMap.partnerInfo) && (
              <View
                className="noApply"
                style="padding-top:10px;padding-bottom:20px"
              >
                <View style="text-align:center">
                  <Canvas
                    className="canvas"
                    style="height:160px;width:160px;margin:0 auto"
                    canvasId="firstCanvas"
                  ></Canvas>
                  <View
                    className="tzBtn"
                    onClick={this.saveToMobile}
                    style="margin-top:10px;background: #F5D795;"
                  >
                    保存到相册
                  </View>
                </View>
              </View>
            )}
          </View>
        ) : (
          <View className="tabTop" style="margin-top:-88rpx">
            {apiUserInfoMap && (
              <View className="header-box">
                <Image
                  className="avatar"
                  src={apiUserInfoMap.base.avatarUrl}
                  mode="aspectFill"
                ></Image>
                <View className="r">
                  <View className="uid">
                    {'用户ID: ' + apiUserInfoMap.base.id}
                  </View>
                  <View className="nick">{apiUserInfoMap.base.nick}</View>
                </View>
              </View>
            )}
            <View className="header-box2">您当前还不是分销商</View>
            <View className="line"></View>
            <View style="padding:20px">
              <VanCellGroup>
                <VanField
                  value={tzid}
                  placeholder="请输入团长邀请码，立即成为分销商"
                  onChange={this.onChange}
                ></VanField>
              </VanCellGroup>
            </View>
            <View style="text-align:center">
              <View
                className="tzBtn"
                onClick={this.partnerBindTeamLeader}
                style="margin-top:20px;background: #F5D795;"
              >
                立即加入
              </View>
            </View>
          </View>
        )}
        <ApifmLoginTmpl
          data={{
            wxlogin: wxlogin,
          }}
        ></ApifmLoginTmpl>
        {/*  <float-menu /> */}
      </Block>
    )
  }
}
export default _C
