import { Block, View, Slot } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import utils from '../wxs/utils.wxs.js'
import computed from './index.wxs.js'
import { VantComponent } from '../common/component.js'
import VanIcon from '../icon/index'
import './index.scss'

@withWeapp(VantComponent({
  props: {
    size: String,
    mark: Boolean,
    color: String,
    plain: Boolean,
    round: Boolean,
    textColor: String,
    type: {
      type: String,
      value: 'default',
    },
    closeable: Boolean,
  },
  methods: {
    onClose() {
      this.$emit('close')
    },
  },
}))
class _C extends React.Component {
  render() {
    const { type, size, mark, plain, round, color, textColor, closeable } =
      this.data
    return (
      <View
        className={
          'custom-class ' +
          utils.bem('tag', [
            type,
            size,
            {
              mark,
              plain,
              round,
            },
          ])
        }
        style={computed.rootStyle({
          plain,
          color,
          textColor,
        })}
      >
        {this.props.children}
        {closeable && (
          <VanIcon
            name="cross"
            customClass="van-tag__close"
            onClick={this.onClose}
          ></VanIcon>
        )}
      </View>
    )
  }
}
export default _C
