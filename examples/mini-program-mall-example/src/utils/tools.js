import Taro from '@tarojs/taro'
import WXAPI from '../apifm-wxapi'

// 显示购物车tabBar的Badge
export async function showTabBarBadge(noTabBarPage) {
  const token = Taro.getStorageSync('token')
  if (!token) {
    return 0
  }
  let number = 0
  // 自营商品
  let res = await WXAPI.shippingCarInfo(token)
  if (res.code == 0) {
    number += res.data.number
  }
  // vop 购物车
  res = await WXAPI.jdvopCartInfo(token)
  if (res.code == 0) {
    number += res.data.number
  }
  if (!noTabBarPage) {
    if (number == 0) {
      // 删除红点点
      Taro.removeTabBarBadge({
        index: 3,
      })
    } else {
      // 显示红点点
      Taro.setTabBarBadge({
        index: 3,
        text: number + '',
      })
    }
  }
  return number
}