import { Block } from "@tarojs/components";
import React from "react";
import Taro from "@tarojs/taro";
import withWeapp from "@tarojs/with-weapp";
import "./app.scss";
import WXAPI from './apifm-wxapi';
import {default as CONFIG} from "./config.js";
const AUTH = require('./utils/auth.js');
@withWeapp({
  onLaunch: function () {
    // const subDomain = Taro.getExtConfigSync().subDomain;
    // if (subDomain) {
    //   WXAPI.init(subDomain);
    // } else {
    console.log("subDomain", CONFIG.subDomain)
      WXAPI.init(CONFIG.subDomain);
      WXAPI.setMerchantId(CONFIG.merchantId);
    // }
    const that = this;
    // 检测新版本
    // const updateManager = Taro.getUpdateManager();
    // updateManager.onUpdateReady(function () {
    //   Taro.showModal({
    //     title: '更新提示',
    //     content: '新版本已经准备好，是否重启应用？',
    //     success(res) {
    //       if (res.confirm) {
    //         // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
    //         updateManager.applyUpdate();
    //       }
    //     }
    //   });
    // });
    /**
     * 初次加载判断网络情况
     * 无网络状态下根据实际情况进行调整
     */
    Taro.getNetworkType({
      success(res) {
        const networkType = res.networkType;
        if (networkType === 'none') {
          that.globalData.isConnected = false;
          Taro.showToast({
            title: '当前无网络',
            icon: 'loading',
            duration: 2000
          });
        }
      }
    });
    /**
     * 监听网络状态变化
     * 可根据业务需求进行调整
     */
    Taro.onNetworkStatusChange(function (res) {
      if (!res.isConnected) {
        that.globalData.isConnected = false;
        Taro.showToast({
          title: '网络已断开',
          icon: 'loading',
          duration: 2000
        });
      } else {
        that.globalData.isConnected = true;
        Taro.hideToast();
      }
    });
    WXAPI.queryConfigBatch('mallName,WITHDRAW_MIN,ALLOW_SELF_COLLECTION,order_hx_uids,subscribe_ids,share_profile,adminUserIds,goodsDetailSkuShowType,shopMod,needIdCheck,balance_pay_pwd,shipping_address_gps,shipping_address_region_level,shopping_cart_vop_open,cps_open,recycle_open,categoryMod,hide_reputation,show_seller_number,show_goods_echarts,show_buy_dynamic,goods_search_show_type,show_3_seller,show_quan_exchange_score,show_score_exchange_growth,show_score_sign,fx_subscribe_ids,share_pic,orderPeriod_open,order_pay_user_balance,wxpay_api_url,sphpay_open,fx_type').then(res => {
      if (res.code === 0) {
        res.data.forEach(config => {
          Taro.setStorageSync(config.key, config.value);
        });
        if (Taro.getApp().configLoadOK) {
          Taro.getApp().configLoadOK();
        }
        // wx.setStorageSync('shopMod', '1') // 测试用，不要取消注释
      }
    });
    // ---------------检测navbar高度
    // let menuButtonObject = Taro.getMenuButtonBoundingClientRect();
    let menuButtonObject = {
      width: 87, height: 32, left: 301, top: 8, right: 388, bottom: 40
    };
    console.log("小程序胶囊信息", menuButtonObject);
    Taro.getSystemInfo({
      success: res => {
        console.log("getSystemInfo ", res);
        let statusBarHeight = res.statusBarHeight ? res.statusBarHeight : 0,
          navTop = menuButtonObject.top,
          //胶囊按钮与顶部的距离
          navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2; //导航高度
        this.globalData.navHeight = navHeight ? navHeight : 16;
        this.globalData.navTop = navTop;
        this.globalData.windowHeight = res.windowHeight;
        this.globalData.menuButtonObject = menuButtonObject;
        console.log("navHeight", this.globalData.navHeight);
      },
      fail(err) {
        console.log(err);
      }
    });
  },
  onShow(e) {
    // 保存邀请人
    if (e && e.query && e.query.inviter_id) {
      Taro.setStorageSync('referrer', e.query.inviter_id);
      if (e.shareTicket) {
        Taro.getShareInfo({
          shareTicket: e.shareTicket,
          success: res => {
            Taro.login({
              success(loginRes) {
                if (loginRes.code) {
                  WXAPI.shareGroupGetScore(loginRes.code, e.query.inviter_id, res.encryptedData, res.iv).then(_res => {
                    console.log(_res);
                  }).catch(err => {
                    console.error(err);
                  });
                } else {
                  console.error('登录失败！' + loginRes.errMsg);
                }
              }
            });
          }
        });
      }
    }
    // 自动登录
    // AUTH.checkHasLogined().then(isLogined => {
    //   if (!isLogined) {
    //     AUTH.authorize().then(aaa => {
    //       if (CONFIG.bindSeller) {
    //         AUTH.bindSeller();
    //       }
    //       this.getUserApiInfo();
    //     });
    //   } else {
    //     if (CONFIG.bindSeller) {
    //       AUTH.bindSeller();
    //     }
    //     this.getUserApiInfo();
    //   }
    // });
  },
  async getUserApiInfo() {
    const res = await WXAPI.userDetail(Taro.getStorageSync('token'));
    if (res.code == 0) {
      this.globalData.apiUserInfoMap = res.data;
    }
  },
  initNickAvatarUrlPOP(_this) {
    setTimeout(() => {
      if (this.globalData.apiUserInfoMap && (!this.globalData.apiUserInfoMap.base.nick || !this.globalData.apiUserInfoMap.base.avatarUrl)) {
        _this.setData({
          nickPopShow: true,
          popnick: this.globalData.apiUserInfoMap.base.nick ? this.globalData.apiUserInfoMap.base.nick : '',
          popavatarUrl: this.globalData.apiUserInfoMap.base.avatarUrl ? this.globalData.apiUserInfoMap.base.avatarUrl : ''
        });
      }
    }, 3000); // 3秒后弹出
  },

  globalData: {
    isConnected: true,
    sdkAppID: CONFIG.sdkAppID,
    apiUserInfoMap: undefined // 当前登陆用户信息: base/ext/idcard/saleDistributionTeam
  }
}, true)
class App extends React.Component {
  render() {
    return this.props.children;
  }
}
export default App;
