import Taro from '@tarojs/api'

import { shouldBeObject, temporarilyNotSupport } from '../../utils'
import { MethodHandler } from '../../utils/handler'
import native from '../NativeApi'
import { displayExecRes,getItem,getStorageStatus,handleData } from './util'

/**
 * 创建缓存管理器
 *
 * @canNotUse createCacheManager
 */
export * from './background-fetch'


// 周期性更新
export const createCacheManager = /* @__PURE__ */ temporarilyNotSupport('createCacheManager')


// 数据缓存，同步接口
export const setStorageSync: typeof Taro.setStorageSync = (key, data = '') => {
  const name = 'setStorageSync'
  // 存入数据
  native.setStorageSync({ key, data: JSON.stringify(handleData(data)) })
  // 循环查询存入数据的状态
  const status = getStorageStatus(name, key)
  displayExecRes(status, name)
}

// @ts-ignore
export const setStorage: typeof Taro.setStorage = (options) => {
  const name = 'setStorage'
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `setStorage:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const { key, data, success, fail, complete } = options
  const handle = new MethodHandler({ name: 'setStorage', success, fail, complete })

  native.setStorageSync({ key, data: JSON.stringify(handleData(data)) })
  const status = getStorageStatus('setStorageSync', key)
  displayExecRes(status, name)
  if (!status.done) {
    return handle.fail({
      errMsg: status.errorMsg
    })
  } else {
    return handle.success({ errMsg: 'ok' })
  }
}

export const revokeBufferURL = /* @__PURE__ */ temporarilyNotSupport('revokeBufferURL')

export const removeStorageSync: typeof Taro.removeStorageSync = (key: string) => {
  const name = 'removeStorageSync'

  native.removeStorageSync(key)
  const status = getStorageStatus(name, key)
  displayExecRes(status, name)
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

  native.removeStorageSync(key)
  const status = getStorageStatus('removeStorageSync', key)
  if (!status.done) {
    return handle.fail({
      errMsg: status.errorMsg
    })
  } else {
    return handle.success({ errMsg: 'ok' })
  }
}

// @ts-ignore
export const getStorageSync: typeof Taro.getStorageSync = (key) => {
  const name = 'getStorageSync'

  native.getStorageSync(key)
  const status = getStorageStatus(name, key)
  if (status.done) {
    const res = getItem(status.data)
    return res.data
  }
  return ''
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
    complete
  })

  native.getStorageSync(key)
  const status = getStorageStatus('getStorageSync', key)
  if (status.done) {
    const res = getItem(status.data)
    return handle.success({ data: res.data })
  } else {
    return handle.fail({
      errMsg: 'data not found'
    })
  }
}


export const getStorageInfoSync: typeof Taro.getStorageInfoSync = () => {
  const name = 'getStorageInfoSync'
  const res: Taro.getStorageInfoSync.Option = {
    keys: [],
    limitSize: NaN,
    currentSize: NaN
  }
  native.getStorageInfoSync()
  const status = getStorageStatus(name, '')

  if (status.done) {
    res.keys = JSON.parse(status.data)
    return res
  }
  return res
}

export const getStorageInfo: typeof Taro.getStorageInfo = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler<Taro.getStorageInfo.SuccessCallbackOption>({
    name: 'getStorageInfo',
    success,
    fail,
    complete
  })
  const res: Taro.getStorageInfoSync.Option = {
    keys: [],
    limitSize: NaN,
    currentSize: NaN
  }

  native.getStorageInfoSync()
  const status = getStorageStatus('getStorageInfoSync', '')

  if (status.done) {
    res.keys = JSON.parse(status.data)
    return handle.success(res)
  } else {
    return handle.fail({
      errMsg: status.errorMsg
    })
  }
}


export const createBufferURL = /* @__PURE__ */ temporarilyNotSupport('createBufferURL')

export const clearStorageSync: typeof Taro.clearStorageSync = () => {
  const name = 'clearStorageSync'
  native.clearStorageSync()
  const status = getStorageStatus(name, '')
  displayExecRes(status, name)
}

export const clearStorage: typeof Taro.clearStorage = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'clearStorage', success, fail, complete })
  native.clearStorageSync()
  const status = getStorageStatus('clearStorageSync', '')
  if (status.done) {
    return handle.success({ errMsg: 'ok' })
  } else {
    return handle.fail({
      errMsg: status.errorMsg
    })
  }
}

export const batchSetStorageSync = /* @__PURE__ */ temporarilyNotSupport('batchSetStorageSync')
export const batchSetStorage = /* @__PURE__ */ temporarilyNotSupport('batchSetStorage')
export const batchGetStorageSync = /* @__PURE__ */ temporarilyNotSupport('batchGetStorageSync')
export const batchGetStorage = /* @__PURE__ */ temporarilyNotSupport('batchGetStorage')

export * from './background-fetch'
