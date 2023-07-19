import { Block, View, Slot } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import utils from '../wxs/utils.wxs.js'
import { VantComponent } from '../common/component.js'
import { useChildren } from '../common/relation.js'
import './index.scss'

@withWeapp(VantComponent({
  relation: useChildren('goods-action-button', function () {
    this.children.forEach((item) => {
      item.updateStyle()
    })
  }),
  props: {
    safeAreaInsetBottom: {
      type: Boolean,
      value: true,
    },
  },
}))
class _C extends React.Component {
  render() {
    const { safeAreaInsetBottom } = this.data
    return (
      <View
        className={
          'custom-class ' +
          utils.bem('goods-action', {
            safe: safeAreaInsetBottom,
          })
        }
      >
        {this.props.children}
      </View>
    )
  }
}
export default _C
