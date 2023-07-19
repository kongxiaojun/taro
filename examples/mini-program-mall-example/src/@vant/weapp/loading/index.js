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
    color: String,
    vertical: Boolean,
    type: {
      type: String,
      value: 'circular',
    },
    size: String,
    textSize: String,
  },
  data: {
    array12: Array.from({
      length: 12,
    }),
  },
}))
class _C extends React.Component {
  render() {
    const { vertical, type, color, size, array12, textSize } = this.data
    return (
      <View
        className={
          'custom-class ' +
          utils.bem('loading', {
            vertical,
          })
        }
      >
        {array12.map((item, index) => {
          return (
            <View
              className={'van-loading__spinner van-loading__spinner--' + type}
              style={computed.spinnerStyle({
                color,
                size,
              })}
            >
              {type === 'spinner' && (
                <Block>
                  {array12.map((item, index) => {
                    return (
                      <View
                        key={item.index}
                        className="van-loading__dot"
                      ></View>
                    )
                  })}
                </Block>
              )}
            </View>
          )
        })}
        <View
          className="van-loading__text"
          style={computed.textStyle({
            textSize,
          })}
        >
          {this.props.children}
        </View>
      </View>
    )
  }
}
export default _C
