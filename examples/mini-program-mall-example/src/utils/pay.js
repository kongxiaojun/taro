import Taro from '@tarojs/taro'
import WXAPI from '../apifm-wxapi'

/**
 * type: order 支付订单 recharge 充值 paybill 优惠买单
 * data: 扩展数据对象，用于保存参数
 */
function wxpay(type, money, orderId, redirectUrl, data, content) {
  const postData = {
    token: Taro.getStorageSync('token'),
    money: money,
    remark: '在线充值',
    content: content ? content : '',
  }
  if (type === 'order') {
    postData.remark = '支付订单 ：' + orderId
    postData.nextAction = {
      type: 0,
      id: orderId,
    }
  }
  if (type === 'paybill') {
    postData.remark = '优惠买单 ：' + data.money
    postData.nextAction = {
      type: 4,
      uid: Taro.getStorageSync('uid'),
      money: data.money,
    }
  }
  if (type === 'fxsBuy') {
    postData.remark = '购买分销资格'
    postData.nextAction = {
      type: 13,
    }
  }
  if (type === 'payTz') {
    postData.remark = '购买团长 ：' + money
    postData.nextAction = {
      type: 14,
    }
  }
  postData.payName = postData.remark
  if (postData.nextAction) {
    postData.nextAction = JSON.stringify(postData.nextAction)
  }
  const url = Taro.getStorageSync('wxpay_api_url')
  WXAPI.payVariableUrl(url ? url : '/pay/wx/wxapp', postData).then(function (
    res
  ) {
    if (res.code == 0) {
      // 发起支付
      Taro.requestPayment({
        timeStamp: res.data.timeStamp,
        nonceStr: res.data.nonceStr,
        package: res.data.package,
        signType: res.data.signType,
        paySign: res.data.paySign,
        fail: function (aaa) {
          console.error(aaa)
          Taro.showToast({
            title: '支付失败:' + aaa,
          })
        },
        success: function () {
          // 提示支付成功
          Taro.showToast({
            title: '支付成功',
          })
          Taro.redirectTo({
            url: redirectUrl,
          })
        },
      })
    } else {
      Taro.showModal({
        title: '出错了',
        content: JSON.stringify(res),
        showCancel: false,
      })
    }
  })
}
export default {
  wxpay: wxpay,
}
