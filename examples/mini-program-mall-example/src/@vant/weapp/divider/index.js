import { Block, View, Slot } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import utils from '../wxs/utils.wxs.js'
import computed from './index.wxs.js'
import { VantComponent } from '../common/component.js'
import './index.scss'

@withWeapp(VantComponent({
  props: {
    dashed: Boolean,
    hairline: Boolean,
    contentPosition: String,
    fontSize: String,
    borderColor: String,
    textColor: String,
    customStyle: String,
  },
}))
class _C extends React.Component {
  render() {
    const {
      dashed,
      hairline,
      contentPosition,
      borderColor,
      textColor,
      fontSize,
      customStyle,
    } = this.data
    return (
      <View
        className={
          'custom-class ' +
          utils.bem('divider', [
            {
              dashed,
              hairline,
            },
            contentPosition,
          ])
        }
        style={computed.rootStyle({
          borderColor,
          textColor,
          fontSize,
          customStyle,
        })}
      >
        {this.props.children}
      </View>
    )
  }
}
export default _C
