import {
  Block,
  LivePusher,
  CoverView,
  CoverImage,
  Button,
  Input,
} from '@tarojs/components'
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
import './list.scss'
import WXAPI from '../../../apifm-wxapi'
@withWeapp({
  data: {},
  onLoad: function (options) {
    this.myLiveRooms()
  },
  onShow: function () {},
  async myLiveRooms() {
    const res = await WXAPI.myLiveRooms({
      token: Taro.getStorageSync('token'),
    })
    if (res.code == 0) {
      this.setData({
        liveRooms: res.data.result,
      })
    }
  },
  stop(e) {
    Taro.showModal({
      title: '提示',
      content: '确定结束本场直播吗？',
      success: (res) => {
        if (res.confirm) {
          this._stop(e)
        }
      },
    })
  },
  async _stop(e) {
    const id = e.currentTarget.dataset.id
    const res = await WXAPI.stopLiveRoom(Taro.getStorageSync('token'), id)
    if (res.code != 0) {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
      return
    }
    this.myLiveRooms()
  },
})
class _C extends React.Component {
  render() {
    const {
      beauty,
      liveRoomsInfo,
      customBarHeight,
      apiUserInfoMap,
      onlineNumber,
      mainlyGoods,
      showTipsAvatarUrl,
      showTipsMsg,
      showTips,
      scrollTop,
      barrageList,
      systemInfo,
      showInput,
      focus,
      inputVal,
      showPeopleInfo,
      peoplelist,
      showGoodsInfo,
      showSelect09,
    } = this.data
    return (
      <Block>
        <LivePusher
          id="pusher"
          beauty={beauty}
          url={liveRoomsInfo.roomInfo.pushUrl}
          mode="FHD"
          autopush="true"
          style="width:100vw;height:100vh"
          waitingImage="https://mc.qcloudimg.com/static/img/daeed8616ac5df256c0591c22a65c4d3/pause_publish.jpg"
        ></LivePusher>
        <CoverView
          style="width:100vw;height:100vh"
          className="outer"
          onClick={this.privateStopNoop.bind(this, this.hidePeoples)}
        >
          <CoverView
            style={'height:' + customBarHeight + 'px'}
            className="back"
          >
            <CoverView className="icon" onClick={this.backTap}>
              <CoverImage
                src={require('../../images/back.png')}
                className="back-icon"
              ></CoverImage>
            </CoverView>
          </CoverView>
          {/*  直播信息  */}
          <CoverView className="anchor-info">
            <CoverView className="left">
              {apiUserInfoMap.base.avatarUrl && (
                <CoverImage
                  src={apiUserInfoMap.base.avatarUrl}
                  className="avatar"
                ></CoverImage>
              )}
              <CoverView className="mid">
                <CoverView>{apiUserInfoMap.base.nick}</CoverView>
                {/*  <cover-view>{{ apiUserInfoMap.base.province}} {{ apiUserInfoMap.base.city}}</cover-view>  */}
              </CoverView>
              <CoverView className="ops flex" onClick>
                <CoverImage
                  src={require('../../images/rotate.png')}
                  className="c-img"
                  onClick={this.privateStopNoop.bind(this, this.rotateTap)}
                ></CoverImage>
                <CoverImage
                  src={require('../../images/meiyan2.png')}
                  className="c-img"
                  onClick={this.privateStopNoop.bind(
                    this,
                    this.showBeautySelect
                  )}
                ></CoverImage>
              </CoverView>
            </CoverView>
            <CoverView className="right">
              <CoverView className="txt">
                {'房间号: ' + liveRoomsInfo.roomInfo.id}
              </CoverView>
            </CoverView>
          </CoverView>
          {/*  在线人数  */}
          <CoverView className="watcher">
            {'在线人数: ' + onlineNumber}
          </CoverView>
          {/*  主推商品  */}
          {mainlyGoods && (
            <CoverView
              className="main-goods"
              onClick={this.privateStopNoop.bind(this, this.toDetail)}
              data-id={mainlyGoods.id}
            >
              <CoverImage
                src={mainlyGoods.pic}
                style="width:168rpx;height:168rpx;border-radius:15rpx;"
              ></CoverImage>
            </CoverView>
          )}
          {/*  提示进入直播间  */}
          {showTips && (
            <CoverView className="tips">
              <CoverImage
                src={showTipsAvatarUrl}
                className="avatar-img"
              ></CoverImage>
              <CoverView>{showTipsMsg}</CoverView>
            </CoverView>
          )}
          {/*  弹幕  */}
          <CoverView
            className="barrage"
            onTouchMove={this.privateStopNoop.bind(this, this.preventDefault)}
            scrollTop={scrollTop}
          >
            <CoverView className="item-outer">
              {barrageList.map((item, index) => {
                return (
                  <Block key={item.index}>
                    <CoverView className="barrage-item">
                      <CoverView className="item-wrap">
                        {item.avatarUrl && (
                          <CoverImage
                            src={item.avatarUrl}
                            className="avatar"
                          ></CoverImage>
                        )}
                        <CoverView
                          className="item-nickname"
                          style={
                            'top:' +
                            (systemInfo.platform == 'android' ? 2 : 0) +
                            'px;color:' +
                            item.color +
                            ';vertical-align:' +
                            (systemInfo.platform == 'android'
                              ? 'bottom'
                              : 'middle')
                          }
                        >
                          {item.nick}
                        </CoverView>
                        <CoverView
                          className="item-words"
                          style={
                            'vertical-align:' +
                            (systemInfo.platform == 'android'
                              ? 'bottom'
                              : 'middle')
                          }
                        >
                          {item.msg}
                        </CoverView>
                      </CoverView>
                    </CoverView>
                  </Block>
                )
              })}
            </CoverView>
          </CoverView>
          {!showInput && (
            <CoverView className="footer">
              <CoverView
                className="item0"
                onClick={this.privateStopNoop.bind(this, this.showGoods)}
              >
                <CoverImage
                  src={require('../../images/goods.png')}
                  className="goods"
                ></CoverImage>
                {/*  <cover-view class="txt">宝贝</cover-view>  */}
              </CoverView>
              <CoverView
                className="item1"
                onClick={this.privateStopNoop.bind(
                  this,
                  this.handleInteractionTap
                )}
              >
                <CoverImage
                  className="cmt-icon"
                  src={require('../../images/chat.png')}
                ></CoverImage>
                <CoverView className="txt">跟大家互动吧...</CoverView>
              </CoverView>
              <CoverView className="item2">
                <Button className="icon-wrap" openType="share">
                  <CoverImage
                    src={require('../../images/forward.png')}
                    className="icons"
                  ></CoverImage>
                </Button>
                {/*  <cover-view class="txt">分享</cover-view>  */}
              </CoverView>
              <CoverView
                className="item2"
                onClick={this.privateStopNoop.bind(this, this.showPeoples)}
              >
                <CoverView className="icon-wrap" style="background: #B17068">
                  <CoverImage
                    src={require('../../images/people.png')}
                    className="icons"
                  ></CoverImage>
                </CoverView>
                {/*  <cover-view class="txt">人员</cover-view>  */}
              </CoverView>
              {/*  <cover-view class="item2 item3" catchtap="showSet">
                  <cover-view class="icon-wrap"  style="background: #17abe3">
                    <cover-image src="/images/shezhi.png" class="icons"></cover-image>
                  </cover-view>
                  <cover-view class="txt">设置</cover-view>
                </cover-view>  */}
            </CoverView>
          )}
        </CoverView>
        {/*  输入  */}
        {/*  发送弹幕的icon  */}
        {showInput && (
          <CoverView className="left-input">
            <CoverImage
              className="icon"
              src={require('../../images/chat02.png')}
            ></CoverImage>
          </CoverView>
        )}
        {/*  line  */}
        {showInput && (
          <CoverView className="line-wrap">
            <CoverImage
              className="line-icon"
              src={require('../../images/line.png')}
            ></CoverImage>
          </CoverView>
        )}
        {/*  send barrage  */}
        {showInput && (
          <Input
            cursorSpacing="0"
            onKeyboardheightchange={this.keyboardEvent}
            focus={focus}
            placeholderClass="holder-class"
            placeholder="说点什么吧..."
            value={inputVal}
            className="send-barrage"
            confirmType="send"
            onConfirm={this.onComment}
            onInput={this.bindInput}
          ></Input>
        )}
        {/*  <cover-view wx:if='{{ showInput }}' class="send-btn" catchtap="onComment">
            发送
          </cover-view>  */}
        {/*  点击人员列表  */}
        <CoverView
          className={'goods-list ' + (showPeopleInfo ? 'open' : 'close')}
        >
          <CoverView className="title flex-between">
            <CoverView>全部人员</CoverView>
            <CoverImage
              src={require('../../images/people.png')}
              className="img"
              onClick
            ></CoverImage>
          </CoverView>
          <CoverView className="item-list">
            {peoplelist.map((item, index) => {
              return (
                <Block key={item.id}>
                  <CoverView className="item flex">
                    {item.avatarUrl && (
                      <CoverImage
                        src={item.avatarUrl}
                        className="goods-img"
                      ></CoverImage>
                    )}
                    <CoverView className="info flex">
                      <CoverView>{item.nick}</CoverView>
                      <CoverView>{item.ip}</CoverView>
                      <CoverView>{item.ip}</CoverView>
                    </CoverView>
                    <Button
                      className="btn"
                      onClick={this.privateStopNoop.bind(this, this.lahei)}
                      data-uid={item.uid}
                    >
                      踢出
                    </Button>
                  </CoverView>
                </Block>
              )
            })}
          </CoverView>
        </CoverView>
        {/*  点击宝贝弹出的商品列表  */}
        <CoverView
          className={'goods-list ' + (showGoodsInfo ? 'open' : 'close')}
        >
          <CoverView className="title flex-between">
            <CoverView>全部商品</CoverView>
          </CoverView>
          <CoverView className="item-list">
            {liveRoomsInfo.goodsList.map((item, index) => {
              return (
                <Block key={item.id}>
                  <CoverView className="item flex">
                    <CoverImage
                      src={item.pic}
                      className="goods-img"
                    ></CoverImage>
                    <CoverView className="info flex">
                      <CoverView className="goods-title">{item.name}</CoverView>
                      <CoverView className="price">
                        {'￥' + item.minPrice}
                      </CoverView>
                    </CoverView>
                    <Button
                      className="btn"
                      onClick={this.privateStopNoop.bind(
                        this,
                        this.navPurchase
                      )}
                      data-idx={index}
                    >
                      主推
                    </Button>
                  </CoverView>
                </Block>
              )
            })}
          </CoverView>
          {!liveRoomsInfo.goodsList && (
            <CoverView className="goods-empty">暂无商品~</CoverView>
          )}
        </CoverView>
        {showSelect09 && (
          <CoverView className="beauty-select">
            {(10).map((item, index) => {
              return (
                <CoverView
                  className="item"
                  key={item}
                  data-num={item}
                  onClick={this.select09}
                >
                  {item}
                </CoverView>
              )
            })}
          </CoverView>
        )}
      </Block>
    )
  }
}
export default _C
