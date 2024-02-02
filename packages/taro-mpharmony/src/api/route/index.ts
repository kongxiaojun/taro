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
  const backTimes: number = await new Promise((resolve, reject) => {
    // @ts-ignore
    native.getToNativeUrlDistance({
      success: (res) => {
        // @ts-ignore
        resolve(res - 1 < option.delta ? res - 1 : option.delta)
      },
      fail: () => {
        reject(new Error(''))
      }
    })
  })
  if (backTimes < 2) {
    const currentUrl2: string = await new Promise((resolve, reject) => {
      // @ts-ignore
      native.getCurrentUrl2({
        success: (res) => {
          // eslint-disable-next-line no-console
          console.log('zhou getCurrentUrl2 success, res = ' + res)
          // @ts-ignore
          resolve(res)
        },
        fail: () => {
          reject(new Error(''))
        }
      })
    })
    if (currentUrl2 !== '') {
      // @ts-ignore
      native.WebBackTo(option)
      return navigateBacks(option)
    } else {
      return new Promise(() => [
        // @ts-ignore
        native.WebBackTo()
      ])
    }
  } else {
    // 多级回退
    // eslint-disable-next-line no-console
    console.log('zhou 多级回退, backTimes = ' + backTimes)
    // @ts-ignore
    native.removeUrls({ backTimes })
    return navigateBacks({ delta: backTimes } as Taro.navigateBack.Option)
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
