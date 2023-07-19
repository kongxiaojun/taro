import { Block, View, Text } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './index.scss'
const App = Taro.getApp()
@withWeapp({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的对外属性，是属性名到属性设置的映射表
   */
  properties: {
    k: String,
  },
  /**
   * 组件的内部数据，和 properties 一同用于组件的模板渲染
   */
  data: {
    s: false,
  },
  // 组件数据字段监听器，用于监听 properties 和 data 的变化
  observers: {},
  lifetimes: {
    attached: function () {
      if (!this.data.k) {
        this.setData({
          s: true,
        })
        return
      }
      const agreeYxtk = Taro.getStorageSync('agreeYxtk_' + this.data.k)
      if (!agreeYxtk) {
        this.setData({
          s: true,
        })
      }
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    aggree() {
      if (this.data.k) {
        Taro.setStorageSync('agreeYxtk_' + this.data.k, true)
      }
      this.setData({
        s: false,
      })
    },
    notagree() {
      Taro.navigateTo({
        url: '/pages/notagree/index',
      })
    },
    goYstk(e) {
      const k = e.currentTarget.dataset.k
      Taro.navigateTo({
        url: '/pages/about/index?key=' + k,
      })
    },
    navBack: function () {
      Taro.navigateBack({
        delta: 1,
      })
    },
    //回主页
    toIndex: function () {
      Taro.navigateTo({
        url: '/pages/admin/home/index/index',
      })
    },
  },
})
class _C extends React.Component {
  render() {
    const { s } = this.data
    return (
      <VanPopup
        show={s}
        customClass="btn-add-box-popup"
        round
        closeOnClickOverlay={false}
      >
        <View className="t">用户协议及隐私政策</View>
        <View className="content">
          您在使用我们的服务时，我们可能会收集和
          使用您的相关信息。我们希望通过本
          <Text className="link" data-k="yhxy" onClick={this.goYstk}>
            《用户协议》
          </Text>
          及
          <Text className="link" data-k="ysxy" onClick={this.goYstk}>
            《隐私协议》
          </Text>
          向您说明，在使用我 们的服务时，我们如何收集、使用、储存和
          分享这些信息，以及我们为您提供的访问、
          更新、控制和保护这些信息的方式。本
          <Text className="link" data-k="yhxy" onClick={this.goYstk}>
            《用户协议》
          </Text>
          及
          <Text className="link" data-k="ysxy" onClick={this.goYstk}>
            《隐私协议》
          </Text>
          ，希望您仔细闭读， 充分理解协议中的内容后再点击同意。
        </View>
        <View className="btn-group">
          <VanButton type="primary" block size="small" onClick={this.aggree}>
            同意
          </VanButton>
          <VanButton type="danger" block size="small" onClick={this.notagree}>
            不同意
          </VanButton>
        </View>
      </VanPopup>
    )
  }
}
export default _C
