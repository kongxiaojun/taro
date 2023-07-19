import { Block, View, Button, Image } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './index.scss'
import WXAPI from '../../apifm-wxapi'
import VanPopup from '../../@vant/weapp/popup'
import VanField from '../../@vant/weapp/field'
import VanButton from '../../@vant/weapp/button'
@withWeapp({
  options: {
    // 样式隔离 https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/wxml-wxss.html#%E7%BB%84%E4%BB%B6%E6%A0%B7%E5%BC%8F%E9%9A%94%E7%A6%BB
    styleIsolation: 'apply-shared',
  },
  /**
   * 组件的对外属性，是属性名到属性设置的映射表
   */
  properties: {
    avatarUrl: String,
    name: String,
    show: Boolean,
  },
  /**
   * 组件的内部数据，和 properties 一同用于组件的模板渲染
   */
  data: {
    nick: undefined,
  },
  // 组件数据字段监听器，用于监听 properties 和 data 的变化
  observers: {},
  lifetimes: {
    attached() {
      this.setData({
        nick: this.data.name,
      })
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    async _editNick() {
      if (!this.data.nick) {
        Taro.showToast({
          title: '请填写昵称',
          icon: 'none',
        })
        return
      }
      const postData = {
        token: Taro.getStorageSync('token'),
        nick: this.data.nick,
      }
      const res = await WXAPI.modifyUserInfo(postData)
      if (res.code != 0) {
        Taro.showToast({
          title: res.msg,
          icon: 'none',
        })
        return
      }
      Taro.showToast({
        title: '保存成功',
      })
      this.setData({
        show: false,
      })
      Taro.getApp().getUserApiInfo()
    },
    async onChooseAvatar(e) {
      let avatarUrl = e.detail.avatarUrl
      let res = await WXAPI.uploadFile(Taro.getStorageSync('token'), avatarUrl)
      if (res.code != 0) {
        Taro.showToast({
          title: res.msg,
          icon: 'none',
        })
        return
      }
      avatarUrl = res.data.url
      res = await WXAPI.modifyUserInfo({
        token: Taro.getStorageSync('token'),
        avatarUrl,
      })
      if (res.code != 0) {
        Taro.showToast({
          title: res.msg,
          icon: 'none',
        })
        return
      }
      this.setData({
        avatarUrl,
      })
    },
    jump() {
      this.setData({
        show: false,
      })
    },
  },
})
class _C extends React.Component {
  render() {
    const { show, avatarUrl, nick } = this.data
    return (
      <VanPopup
        show={show}
        customClass="btn-add-box-popup"
        round
        closeOnClickOverlay={false}
      >
        <View className="t-box">
          <View className="t">头像昵称填写</View>
          <View className="jump" onClick={this.jump}>
            跳过
          </View>
        </View>
        <View className="avatar-box">
          <Button
            className="avatar"
            openType="chooseAvatar"
            onChooseavatar={this.onChooseAvatar}
          >
            <Image
              className="avatar-img"
              src={avatarUrl ? avatarUrl : '/images/upload.jpg'}
              mode="aspectFill"
            ></Image>
          </Button>
        </View>
        <View className="nick-box">
          <VanField
            modelValue={nick}
            size="large"
            placeholder="请输入昵称"
            clearable
            type="nickname"
          ></VanField>
        </View>
        <View className="btn-group">
          <VanButton type="primary" block round onClick={this._editNick}>
            保存
          </VanButton>
        </View>
      </VanPopup>
    )
  }
}
export default _C
