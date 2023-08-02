import { Block, View, Slot } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import computed from './index.wxs.js'
import { VantComponent } from '../common/component.js'
import { transition } from '../mixins/transition.js'
import './index.scss'

@withWeapp(VantComponent({
    classes: [
        'enter-class',
        'enter-active-class',
        'enter-to-class',
        'leave-class',
        'leave-active-class',
        'leave-to-class',
    ],
    mixins: [transition(true)],
}))
class _C extends React.Component {
  render() {
    const { classes, currentDuration, display, customStyle, inited, customClass } = this.data
    return (
      inited && (
        <View
          className={'van-transition ' + classes + ' ' + customClass}
          style={computed.rootStyle({
            currentDuration,
            display,
            customStyle,
          })}
          onClick={this.data.onClick}
          onTransitionend={this.onTransitionEnd}
        >
          {this.props.children}
        </View>
      )
    )
  }
}
export default _C
