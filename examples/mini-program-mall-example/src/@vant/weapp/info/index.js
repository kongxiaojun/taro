import { Block, View } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import utils from '../wxs/utils.wxs.js'
import { VantComponent } from '../common/component.js'
import './index.scss'

@withWeapp(VantComponent({
    props: {
        dot: Boolean,
        info: null,
        customStyle: String,
    },
}))
class _C extends React.Component {
  render() {
    const { dot, customStyle, info } = this.data
    return (
      ((info !== null && info !== '') || dot) && (
        <View
          className={
            'van-info ' +
            utils.bem('info', {
              dot,
            }) +
            ' custom-class'
          }
          style={customStyle}
        >
          {dot ? '' : info}
        </View>
      )
    )
  }
}
export default _C
