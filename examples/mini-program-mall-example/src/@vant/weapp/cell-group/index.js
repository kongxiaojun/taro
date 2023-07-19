import { Block, View, Slot } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import utils from '../wxs/utils.wxs.js'
import { VantComponent } from '../common/component.js'
import './index.scss'

@withWeapp(VantComponent({
    props: {
        title: String,
        border: {
            type: Boolean,
            value: true,
        },
        inset: Boolean,
    },
}))
class _C extends React.Component {
  render() {
    const { inset, title, border } = this.data
    return (
      <Block>
        {title && (
          <View
            className={utils.bem('cell-group__title', {
              inset,
            })}
          >
            {title}
          </View>
        )}
        <View
          className={
            'custom-class ' +
            utils.bem('cell-group', {
              inset,
            }) +
            ' ' +
            (border ? 'van-hairline--top-bottom' : '')
          }
        >
          {this.props.children}
        </View>
      </Block>
    )
  }
}
export default _C
