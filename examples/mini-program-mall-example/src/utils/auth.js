import Taro from '@tarojs/taro'
import WXAPI from '../apifm-wxapi'
const CONFIG = require('../config.js')
async function checkSession() {
  return new Promise((resolve, reject) => {
    Taro.checkSession({
      success() {
        return resolve(true)
      },
      fail() {
        return resolve(false)
      },
    })
  })
}
export async function bindSeller() {
  const token = Taro.getStorageSync('token')
  const referrer = Taro.getStorageSync('referrer')
  if (!token) {
    return
  }
  if (!referrer) {
    return
  }
  const res = await WXAPI.bindSeller({
    token,
    uid: referrer,
  })
}

// 检测登录状态，返回 true / false
export async function checkHasLogined() {
  // TODO 登录检测
  const token = Taro.getStorageSync('token')
  if (!token) {
    return false
  }
  const loggined = await checkSession()
  if (!loggined) {
    Taro.removeStorageSync('token')
    return false
  }
  const checkTokenRes = await WXAPI.checkToken(token)
  if (checkTokenRes.code != 0) {
    Taro.removeStorageSync('token')
    return false
  }
  return false
}
export async function wxaCode() {
  return new Promise((resolve, reject) => {
    Taro.login({
      appid:'1208731172335528704',
      success(res) {
        return resolve(res.code)
      },
      fail() {
        Taro.showToast({
          title: '获取code失败',
          icon: 'none',
        })
        return resolve('获取code失败')
      },
    })
  })

  // return new Promise((resolve, reject) => {
  //   return resolve('获取code失败')
  // })
}
export async function login(page) {
  const _this = this
  Taro.login({
    appid:'1208731172335528704',
    success: function (res) {
      const extConfigSync = Taro.getExtConfigSync()
      if (extConfigSync.subDomain) {
        WXAPI.wxappServiceLogin({
          code: res.code,
        }).then(function (res) {
          if (res.code == 10000) {
            // 去注册
            return
          }
          if (res.code != 0) {
            // 登录错误
            Taro.showModal({
              title: '无法登录',
              content: res.msg,
              showCancel: false,
            })
            return
          }
          Taro.setStorageSync('token', res.data.token)
          Taro.setStorageSync('uid', res.data.uid)
          if (CONFIG.bindSeller) {
            _this.bindSeller()
          }
          if (page) {
            page.onShow()
          }
        })
      } else {
        WXAPI.login_wx(res.code).then(function (res) {
          if (res.code == 10000) {
            // 去注册
            return
          }
          if (res.code != 0) {
            // 登录错误
            Taro.showModal({
              title: '无法登录',
              content: res.msg,
              showCancel: false,
            })
            return
          }
          Taro.setStorageSync('token', res.data.token)
          Taro.setStorageSync('uid', res.data.uid)
          if (CONFIG.bindSeller) {
            _this.bindSeller()
          }
          if (page) {
            page.onShow()
          }
        })
      }
    },
  })
}
export async function authorize() {
  // const code = await wxaCode()
  // const resLogin = await WXAPI.login_wx(code)
  // if (resLogin.code == 0) {
  //   wx.setStorageSync('token', resLogin.data.token)
  //   wx.setStorageSync('uid', resLogin.data.uid)
  //   return resLogin
  // }
  return new Promise((resolve, reject) => {
    //TODO 登录适配
    // reject("暂不支持登录")
    Taro.login({
      appid:'1208731172335528704',
      success: function (res) {
        const code = res.code
        let referrer = '' // 推荐人
        let referrer_storge = Taro.getStorageSync('referrer')
        if (referrer_storge) {
          referrer = referrer_storge
        }
        // 下面开始调用注册接口
        const extConfigSync = Taro.getExtConfigSync()
        if (extConfigSync.subDomain) {
          WXAPI.wxappServiceAuthorize({
            code: code,
            referrer: referrer,
          }).then(function (res) {
            if (res.code == 0) {
              Taro.setStorageSync('token', res.data.token)
              Taro.setStorageSync('uid', res.data.uid)
              resolve(res)
            } else {
              Taro.showToast({
                title: res.msg,
                icon: 'none',
              })
              reject(res.msg)
            }
          })
        } else {
          WXAPI.authorize({
            code: code,
            referrer: referrer,
          }).then(function (res) {
            if (res.code == 0) {
              Taro.setStorageSync('token', res.data.token)
              Taro.setStorageSync('uid', res.data.uid)
              resolve(res)
            } else {
              Taro.showToast({
                title: res.msg,
                icon: 'none',
              })
              reject(res.msg)
            }
          })
        }
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}
export function loginOut() {
  Taro.removeStorageSync('token')
  Taro.removeStorageSync('uid')
}
async function checkAndAuthorize(scope) {
  return new Promise((resolve, reject) => {
    Taro.getSetting({
      success(res) {
        if (!res.authSetting[scope]) {
          Taro.authorize({
            scope: scope,
            success() {
              resolve() // 无返回参数
            },

            fail(e) {
              console.error(e)
              // if (e.errMsg.indexof('auth deny') != -1) {
              //   wx.showToast({
              //     title: e.errMsg,
              //     icon: 'none'
              //   })
              // }
              Taro.showModal({
                title: '无权操作',
                content: '需要获得您的授权',
                showCancel: false,
                confirmText: '立即授权',
                confirmColor: '#e64340',
                success(res) {
                  Taro.openSetting()
                },
                fail(e) {
                  console.error(e)
                  reject(e)
                },
              })
            },
          })
        } else {
          resolve() // 无返回参数
        }
      },

      fail(e) {
        console.error(e)
        reject(e)
      },
    })
  })
}
