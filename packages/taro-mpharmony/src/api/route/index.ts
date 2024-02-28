/**
 * @canUse navigateBack
 * @__object [delta]
 */

/**
 * @canUse navigateTo
 * @__object [url, events]
 */

/**
 * @canUse redirectTo
 * @object [url]
 */

/**
 * @canUse reLaunch
 * @__object [url]
 */

/**
 * @canUse switchTab
 * @__object [url]
 */

/**
 * 修改路由逻辑，部分桥接到native
 */
import Taro from '@tarojs/api'
import { navigateBack as navigateBacks, navigateTo as navigateTos } from '@tarojs/router'

import native from '../NativeApi'

export { redirectTo, reLaunch, switchTab } from '@tarojs/router'

export const navigateBack: typeof Taro.navigateBack = async (option: Taro.navigateBack.Option) => {
  const currentUrl = window.location.href
  if (currentUrl.endsWith('from=native')) {
    return new Promise(() => [
      native.webBackToNative()
    ])
  } else {
    return navigateBacks(option)
  }
}

// navigateTo 跳转
export const navigateTo: typeof Taro.navigateTo = (option: Taro.navigateTo.Option) => {
  // eslint-disable-next-line no-console
  console.log('zhou navigateTo, option.url = ' + option.url)
  // @ts-ignore
  if (pageMap.has(option.url)) {
    return new Promise(() => [
      native.NavigateTo({
        // @ts-ignore
        url: pageMap.get(option.url),
        complete: option.complete,
        events: option.events,
        success: (res: any) => {
          // eslint-disable-next-line no-console
          console.log(option.url, res)
        },
        fail: (err: any) => {
          // eslint-disable-next-line no-console
          console.log(err)
        },
      })
    ])
  } else {
    // @ts-ignore
    native.setOrCreateAppStorage('tabBarVisible', false)
    return navigateTos(option)
  }
}

// FIXME 方法导出类型未对齐，后续修复

/**
 * 页面间事件通信通道
 *
 * @canNotUse EventChannel
 */
