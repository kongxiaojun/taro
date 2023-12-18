import Taro from '@tarojs/api'

import { getParameterError, shouldBeObject, temporarilyNotSupport } from '../../utils'
import { MethodHandler } from '../../utils/handler'

// 数据缓存
export const setStorageSync: typeof Taro.setStorageSync = (key, data = '') => {
  
  if (typeof key !== 'string') {
    console.error(
      getParameterError({
        name: 'setStorage',
        correct: 'String',
        wrong: key,
      })
    )
    return
  }
  // @ts-ignore
  native.setStorageSync(key,data)
}

export const setStorage: typeof Taro.setStorage = (options) => {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `setStorage:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  // data 需要存储的内容。只支持原生类型、Date、及能够通过JSON.stringify序列化的对象
  const { key, data, success, fail, complete } = options
  const handle = new MethodHandler({ name: 'setStorage', success, fail, complete })

  if (typeof key !== 'string') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'key',
        correct: 'String',
        wrong: key,
      }),
    })
  }

  return new Promise((resolve,reject) => {
    // @ts-ignore
    native.setStorage({
      key,
      data,
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      },
    })
  }
  )

}

export const revokeBufferURL = /* @__PURE__ */ temporarilyNotSupport('revokeBufferURL')

export const removeStorageSync: typeof Taro.removeStorageSync = (key: string) => {
  if (typeof key !== 'string') {
    console.error(
      getParameterError({
        name: 'removeStorage',
        correct: 'String',
        wrong: key,
      })
    )
    return
  }
  // @ts-ignore
  native.removeStorageSync(key)
}

export const removeStorage: typeof Taro.removeStorage = (options: Taro.removeStorage.Option) => {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `removeStorage:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const { key, success, fail, complete } = options
  const handle = new MethodHandler({ name: 'removeStorage', success, fail, complete })

  if (typeof key !== 'string') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'key',
        correct: 'String',
        wrong: key,
      }),
    })
  }

  return new Promise((resolve, reject) => {
    // @ts-ignore
    native.removeStorage({
      key,
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      },
    })
  })
}

export const getStorageSync: typeof Taro.getStorageSync = (key) => {
  if (typeof key !== 'string') {
    console.error(
      getParameterError({
        name: 'getStorageSync',
        correct: 'String',
        wrong: key,
      })
    )
    return
  }
  // @ts-ignore
  const res = native.getStorageSync(key)
  if (res) return res.data
  return ''
}

export const getStorageInfoSync: typeof Taro.getStorageInfoSync = () => {
  // @ts-ignore
  return native.getStorageInfoSync()
}

export const getStorageInfo: typeof Taro.getStorageInfo = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler<Taro.getStorageInfo.SuccessCallbackOption>({
    name: 'getStorageInfo',
    success,
    fail,
    complete,
  })
  return new Promise((resolve,reject ) => [
    // @ts-ignore
    native.getStorageInfo({
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      },
    })
  ])

}

export const getStorage: typeof Taro.getStorage = <T>(options) => {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `getStorage:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { key, success, fail, complete } = options
  const handle = new MethodHandler<Taro.getStorage.SuccessCallbackResult<T>>({
    name: 'getStorage',
    success,
    fail,
    complete,
  })

  if (typeof key !== 'string') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'key',
        correct: 'String',
        wrong: key,
      }),
    })
  }
  return new Promise((resolve,reject ) => [
    // @ts-ignore
    native.getStorage({
      key,
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      },
    })
  ])


}

export const createBufferURL = /* @__PURE__ */ temporarilyNotSupport('createBufferURL')

export const clearStorageSync: typeof Taro.clearStorageSync = () => {
  // @ts-ignore
  native.clearStorageSync()
}

export const clearStorage: typeof Taro.clearStorage = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'clearStorage', success, fail, complete })
  return new Promise((resolve,reject ) => [
    // @ts-ignore
    native.clearStorage({
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      },
    })
  ])
}




export * from './background-fetch'
export { createCacheManager } from '@tarojs/taro-h5'

/**
 * CacheManager实例
 * 
 * @canNotUse CacheManager
 */