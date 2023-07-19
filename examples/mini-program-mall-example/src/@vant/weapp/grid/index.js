import { Block, View, Slot } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import computed from './index.wxs.js'
import { VantComponent } from '../common/component.js'
import { useChildren } from '../common/relation.js'
import './index.scss'

@withWeapp(VantComponent({
  relation: useChildren('grid-item'),
  props: {
    square: {
      type: Boolean,
      observer: 'updateChildren',
    },
    gutter: {
      type: null,
      value: 0,
      observer: 'updateChildren',
    },
    clickable: {
      type: Boolean,
      observer: 'updateChildren',
    },
    columnNum: {
      type: Number,
      value: 4,
      observer: 'updateChildren',
    },
    center: {
      type: Boolean,
      value: true,
      observer: 'updateChildren',
    },
    border: {
      type: Boolean,
      value: true,
      observer: 'updateChildren',
    },
    direction: {
      type: String,
      observer: 'updateChildren',
    },
    iconSize: {
      type: String,
      observer: 'updateChildren',
    },
    reverse: {
      type: Boolean,
      value: false,
      observer: 'updateChildren',
    },
  },
  methods: {
    updateChildren() {
      this.children.forEach((child) => {
        child.updateStyle()
      })
    },
  },
}))
class _C extends React.Component {
  render() {
    const { border, gutter } = this.data
    return (
      <View
        className={
          'van-grid custom-class ' +
          (border && !gutter ? 'van-hairline--top' : '')
        }
        style={computed.rootStyle({
          gutter,
        })}
      >
        {React.Children.map(this.props.children, (child, index) => {
          // 判断子组件的类型
          if (React.isValidElement(child)) {
            // 克隆子组件并添加新的属性
            return React.cloneElement(child, {
              parent: this
            });
          }
          return child;
        })}
      </View>
    )
  }
}
export default _C
