import {Block, Button, Image, View} from '@tarojs/components'
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
import './info-menu.scss'
import WXAPI from '../../apifm-wxapi'
const AUTH = require('../../utils/auth.js')
@withWeapp({
  data: {},
  onLoad: function (options) {},
  onShow: function () {
    this.getUserApiInfo()
  },
  async getUserApiInfo() {
    const res = await WXAPI.userDetail(Taro.getStorageSync('token'))
    if (res.code == 0) {
      let _data = {}
      _data.apiUserInfoMap = res.data
      if (res.data.base.mobile) {
        _data.userMobile = res.data.base.mobile
      }
      if (
        this.data.order_hx_uids &&
        this.data.order_hx_uids.indexOf(res.data.base.id) != -1
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
      this.setData(_data)
    }
  },
  getPhoneNumber: function (e) {
    if (!e.detail.errMsg || e.detail.errMsg != 'getPhoneNumber:ok') {
      Taro.showModal({
        title: '提示',
        content: e.detail.errMsg,
        showCancel: false,
      })
      return
    }
    this._getPhoneNumber(e)
  },
  async _getPhoneNumber(e) {
    let res
    const extConfigSync = Taro.getExtConfigSync()
    if (extConfigSync.subDomain) {
      // 服务商模式
      res = await WXAPI.wxappServiceBindMobile({
        token: Taro.getStorageSync('token'),
        code: this.data.code,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
      })
    } else {
      res = await WXAPI.bindMobileWxappV2(
        Taro.getStorageSync('token'),
        e.detail.code
      )
    }
    if (res.code === 10002) {
      AUTH.login(this)
      return
    }
    if (res.code == 0) {
      Taro.showToast({
        title: '绑定成功',
        icon: 'success',
        duration: 2000,
      })
      this.getUserApiInfo()
    } else {
      Taro.showModal({
        title: '提示',
        content: res.msg,
        showCancel: false,
      })
    }
  },
})
class _C extends React.Component {
  render() {
    const {
      apiUserInfoMap,
      balance,
      freeze,
      score,
      growth,
      myCards,
      count_id_no_pay,
      count_id_no_transfer,
      count_id_no_confirm,
      count_id_no_reputation,
      cps_open,
      recycle_open,
      canHX,
      show_score_sign,
      memberChecked,
      peisongOrderNumber,
      peisongOrderNumber2,
      peisongOrderNumber3,
      fx_type,
      show_3_seller,
      show_quan_exchange_score,
      show_score_exchange_growth,
      nickShow,
      nick,
    } = this.data
    return (
      <Block>
        <View className="header-box">
          { apiUserInfoMap && <View className="header-box-left">
            <Button
              className="avatar"
              openType="chooseAvatar"
              onChooseavatar={this.onChooseAvatar}
            >
              <Image
                className="avatar-img"
                src={
                  apiUserInfoMap.base.avatarUrl
                    ? apiUserInfoMap.base.avatarUrl
                    : '/images/default.png'
                }
                mode="aspectFill"
              ></Image>
            </Button>
            <View className="r">
              <View className="uid">{'用户ID: ' + apiUserInfoMap.base.id}</View>
              <View className="nick" onClick={this.editNick}>
                {apiUserInfoMap.base.nick
                  ? apiUserInfoMap.base.nick
                  : '点击设置昵称'}
              </View>
            </View>
          </View>}
          <View className="user-code" onClick={this.goUserCode}>
            <VanIcon name="qr" size="64rpx"></VanIcon>
            <View className="txt">会员码</View>
          </View>
        </View>
        <View className="asset">
          <View className="item" onClick={this.goAsset}>
            <View className="amount">{balance}</View>
            <View>余额</View>
          </View>
          <View className="item right" onClick={this.goAsset}>
            <View className="amount">{freeze}</View>
            <View>冻结</View>
          </View>
          <View className="item right" onClick={this.goScore}>
            <View className="amount">{score}</View>
            <View>积分</View>
          </View>
          <View className="item right" onClick={this.gogrowth}>
            <View className="amount">{growth}</View>
            <View>成长值</View>
          </View>
        </View>
        <View className="space van-hairline--bottom"></View>
        {myCards && (
          <VanCellGroup title="我的会员卡">
            {myCards.map((item, index) => {
              return (
                <VanCell
                  key={item.id}
                  center
                  title={item.cardInfo.name}
                  label={item.dateEnd + ' 到期'}
                  valueClass="v-c"
                  value={'剩余: ' + item.amount}
                  isLink
                  url={'/pages/card/logs?id=' + item.id}
                ></VanCell>
              )
            })}
          </VanCellGroup>
        )}
        <VanCell
          title="我的订单"
          value="更多"
          isLink
          url="/pages/order-list/index"
        ></VanCell>
        <VanGrid clickable columnNum="5">
          <VanGridItem
            icon="balance-list-o"
            text="待付款"
            badge={count_id_no_pay}
            onClick={this.goOrder}
            data-type="0"
          ></VanGridItem>
          <VanGridItem
            icon="logistics"
            text="待发货"
            badge={count_id_no_transfer}
            onClick={this.goOrder}
            data-type="1"
          ></VanGridItem>
          <VanGridItem
            icon="certificate"
            text="待收货"
            badge={count_id_no_confirm}
            onClick={this.goOrder}
            data-type="2"
          ></VanGridItem>
          <VanGridItem
            icon="flower-o"
            text="待评价"
            badge={count_id_no_reputation}
            onClick={this.goOrder}
            data-type="3"
          ></VanGridItem>
          <VanGridItem
            icon="after-sale"
            text="售后"
            onClick={this.goOrder}
            data-type="99"
          ></VanGridItem>
        </VanGrid>
        {cps_open == '1' && (
          <VanCell
            title="CPS订单"
            value="管理"
            isLink
            url="/packageCps/pages/order-list/cps"
          ></VanCell>
        )}
        {recycle_open == '1' && (
          <VanCell
            title="回收订单"
            value="管理"
            isLink
            url="/pages/recycle/orders"
          ></VanCell>
        )}
        <VanCell title="常用功能"></VanCell>
        <VanGrid clickable>
          {canHX && (
            <VanGridItem
              icon="scan"
              text="扫码核销"
              onClick={this.scanOrderCode}
            ></VanGridItem>
          )}
          <VanGridItem
            icon="paid"
            text="优惠买单"
            url="/pages/maidan/index"
          ></VanGridItem>
          <VanGridItem
            icon="balance-list-o"
            text="资金明细"
            url="/pages/asset/index"
          ></VanGridItem>
          <VanGridItem
            icon="bill-o"
            text="申请发票"
            url="/pages/invoice/apply"
          ></VanGridItem>
          <VanGridItem
            icon="bill-o"
            text="开票记录"
            url="/pages/invoice/list"
          ></VanGridItem>
          <VanGridItem
            icon="coupon-o"
            text="优惠券"
            url="/pages/coupons/index"
            linkType="switchTab"
          ></VanGridItem>
          {show_score_sign == 1 && (
            <VanGridItem
              icon="calendar-o"
              text="签到赚积分"
              url="/pages/sign/index"
            ></VanGridItem>
          )}
        </VanGrid>
        {/*  老样式  */}
        {apiUserInfoMap && <View className="container">
          {apiUserInfoMap.peisongMember &&
            apiUserInfoMap.peisongMember.type != 0 && (
              <Block>
                <View className="space"></View>
                <View className="menu-item">
                  <View className="l">
                    {'工作状态 (' +
                      apiUserInfoMap.peisongMember.statusStr +
                      ')'}
                  </View>
                  <VanSwitch
                    checked={memberChecked}
                    onChange={this.memberCheckedChange}
                  ></VanSwitch>
                </View>
                <View className="line"></View>
                <Navigator url="/pages/peisong/orders">
                  <View className="menu-item">
                    <View className="l hongdian-box">
                      配送订单
                      {peisongOrderNumber && (
                        <View className="hongdian">{peisongOrderNumber}</View>
                      )}
                    </View>
                    <Image
                      className="next"
                      src={require('../../images/icon/next.png')}
                    ></Image>
                  </View>
                </Navigator>
                {apiUserInfoMap.peisongMember.type == 2 ? (
                  <Block>
                    <View className="line"></View>
                    <Navigator url="/pages/peisong/orders?status=1">
                      <View className="menu-item">
                        <View className="l hongdian-box">
                          待分配订单
                          {peisongOrderNumber2 && (
                            <View className="hongdian">
                              {peisongOrderNumber2}
                            </View>
                          )}
                        </View>
                        <Image
                          className="next"
                          src={require('../../images/icon/next.png')}
                        ></Image>
                      </View>
                    </Navigator>
                  </Block>
                ) : (
                  <Block>
                    <View className="line"></View>
                    <Navigator url="/pages/peisong/orders?status=-1">
                      <View className="menu-item">
                        <View className="l hongdian-box">
                          待接单订单
                          {peisongOrderNumber3 && (
                            <View className="hongdian">
                              {peisongOrderNumber3}
                            </View>
                          )}
                        </View>
                        <Image
                          className="next"
                          src={require('../../images/icon/next.png')}
                        ></Image>
                      </View>
                    </Navigator>
                  </Block>
                )}
                <View className="space"></View>
              </Block>
            )}
        </View>}
        {fx_type == 'hehuoren' ? (
          <VanCell
            title="分销中心"
            isLink
            url="/packageFx/pages/hehuorenfenxiao/index"
          ></VanCell>
        ) : (
          show_3_seller == 1 && (
            <VanCellGroup title="三级分销">
              {!apiUserInfoMap.base.isSeller ? (
                <VanCell
                  title="成为分销商"
                  isLink
                  url="/packageFx/pages/apply/index"
                ></VanCell>
              ) : (
                <VanCell
                  title="分销中心"
                  isLink
                  url="/packageFx/pages/index/index"
                ></VanCell>
              )}
              {apiUserInfoMap.base.isSeller && (
                <VanCell
                  title="我的团队"
                  isLink
                  url="/packageFx/pages/myusers/index"
                ></VanCell>
              )}
              {apiUserInfoMap.base.isSeller && (
                <VanCell
                  title="推广订单"
                  isLink
                  url="/packageFx/pages/commisionLog/index"
                ></VanCell>
              )}
            </VanCellGroup>
          )
        )}
        <VanCellGroup title="其他功能">
          {show_quan_exchange_score == 1 && (
            <VanCell
              title="积分券兑换积分"
              isLink
              url="/pages/score-excharge/index"
            ></VanCell>
          )}
          {show_score_exchange_growth == 1 && (
            <VanCell
              title="积分兑换成长值"
              isLink
              url="/pages/score-excharge/growth"
            ></VanCell>
          )}
          <VanCell title="帮助中心" isLink url="/pages/help/index"></VanCell>
          <VanCell title="个人信息" isLink url="/pages/my/info-menu"></VanCell>
          <VanCell title="系统设置" isLink url="/pages/my/setting"></VanCell>
        </VanCellGroup>
        <VanDialog
          useSlot
          title="修改昵称"
          show={nickShow}
          showCancelButton
          onConfirm={this._editNick}
        >
          <VanField
            modelValue={nick}
            type="nickname"
            placeholder="请输入昵称"
            size="large"
            clearable
          ></VanField>
        </VanDialog>
      </Block>
    )
  }
}
export default _C
