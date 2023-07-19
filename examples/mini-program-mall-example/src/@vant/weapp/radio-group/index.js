import { Block, View, Slot } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import utils from '../wxs/utils.wxs.js'
import { VantComponent } from '../common/component.js'
import { useChildren } from '../common/relation.js'
import './index.scss'

@withWeapp(VantComponent({
  field: true,
  relation: useChildren('radio'),
  props: {
    value: {
      type: null,
      observer: 'updateChildren',
    },
    direction: String,
    disabled: {
      type: Boolean,
      observer: 'updateChildren',
    },
  },
  methods: {
    updateChildren() {
      this.children.forEach((child) => child.updateFromParent())
    },
  },
}))
class _C extends React.Component {
  render() {
    const { direction } = this.data
    return (
      <View className={utils.bem('radio-group', [direction])}>
        {this.props.children}
      </View>
    )
  }
}
export default _C
