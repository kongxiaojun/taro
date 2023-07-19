import { Block, View } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import utils from '../wxs/utils.wxs.js'
import computed from './index.wxs.js'
import { VantComponent } from '../common/component.js'
import VanLoading from '../loading/index'
import './index.scss'

@withWeapp(VantComponent({
  field: true,
  classes: ['node-class'],
  props: {
    checked: null,
    loading: Boolean,
    disabled: Boolean,
    activeColor: String,
    inactiveColor: String,
    size: {
      type: String,
      value: '30',
    },
    activeValue: {
      type: null,
      value: true,
    },
    inactiveValue: {
      type: null,
      value: false,
    },
  },
  methods: {
    onClick() {
      const { activeValue, inactiveValue, disabled, loading } = this.data
      if (disabled || loading) {
        return
      }
      const checked = this.data.checked === activeValue
      const value = checked ? inactiveValue : activeValue
      this.$emit('input', value)
      this.$emit('change', value)
    },
  },
}))
class _C extends React.Component {
  render() {
    const {
      checked,
      activeValue,
      disabled,
      size,
      activeColor,
      inactiveColor,
      loading,
    } = this.data
    return (
      <View
        className={
          utils.bem('switch', {
            on: checked === activeValue,
            disabled,
          }) + ' custom-class'
        }
        style={computed.rootStyle({
          size,
          checked,
          activeColor,
          inactiveColor,
          activeValue,
        })}
        onTap={this.onClick}
      >
        <View className="van-switch__node node-class">
          {loading && (
            <VanLoading
              color={computed.loadingColor({
                checked,
                activeColor,
                inactiveColor,
                activeValue,
              })}
              customClass="van-switch__loading"
            ></VanLoading>
          )}
        </View>
      </View>
    )
  }
}
export default _C
