import { Block, View, Image } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import computed from './index.wxs.js'
import { VantComponent } from '../common/component.js'
import VanInfo from '../info/index'
import './index.scss'

@withWeapp(VantComponent({
  classes: ['info-class'],
  props: {
    dot: Boolean,
    info: null,
    size: null,
    color: String,
    customStyle: String,
    classPrefix: {
      type: String,
      value: 'van-icon',
    },
    name: String,
  },
  methods: {
    onClick() {
      this.$emit('click')
    },
  },
}))
class _C extends React.Component {
  render() {
    const { classPrefix, name, customStyle, color, size, dot, info } = this.data
    return (
      <View
        className={computed.rootClass({
          classPrefix,
          name,
        })}
        style={computed.rootStyle({
          customStyle,
          color,
          size,
        })}
        onClick={this.onClick}
      >
        {(info || dot) && (
          <VanInfo
            dot={dot}
            info={info}
            customClass="van-icon__info info-class"
          ></VanInfo>
        )}
        {computed.isImage(name) && (
          <Image
            src={name}
            mode="aspectFit"
            className="van-icon__image"
          ></Image>
        )}
      </View>
    )
  }
}
export default _C
