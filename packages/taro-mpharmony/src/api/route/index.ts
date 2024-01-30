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

export { redirectTo, reLaunch, switchTab } from '@tarojs/router'

export const navigateBack: typeof Taro.navigateBack = async (option: Taro.navigateBack.Option) => {
  if (option.delta === 1) {
    return new Promise(() => [
      // @ts-ignore
      native.NatvieBack({
        delta: option.delta,
        complete: option.complete,
        success: (res: any) => {
          // eslint-disable-next-line no-console
          console.log(option.delta, res)
        },
        fail: (err: any) => {
          // eslint-disable-next-line no-console
          console.log(err)
        }
      })
    ])
  } else {
    const delta: number = await new Promise((resolve, reject) => {
      // @ts-ignore
      native.getUrlDistance({
        success: (res) => {
          // eslint-disable-next-line no-console
          console.log('zhou xxx res = ' + res)
          // @ts-ignore
          resolve(res < option.delta ? res : option.delta)
        },
        fail: () => {
          reject(new Error(''))
        }
      })
    })
    // @ts-ignore
    native.deleteNodes(delta)
    // eslint-disable-next-line no-console
    console.log('zhou xxx delta = ' + delta)
    return navigateBacks({ delta })
  }
}

// navigateTo 跳转
export const navigateTo: typeof Taro.navigateTo = (option: Taro.navigateTo.Option) => {
  // eslint-disable-next-line no-console
  console.log('zhou navigateTo, option.url = ' + option.url)
  // @ts-ignore
  if (pageMap.has(option.url)) {
    return new Promise(() => [
      // @ts-ignore
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
    native.NavigateWebToWeb(option)
    return navigateTos(option)
  }
}

// FIXME 方法导出类型未对齐，后续修复

/**
 * 页面间事件通信通道
 *
 * @canNotUse EventChannel
 */
