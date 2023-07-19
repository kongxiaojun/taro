import { Block, View, Slot, Image } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import utils from '../wxs/utils.wxs.js'
import computed from './index.wxs.js'
import { VantComponent } from '../common/component.js'
import './index.scss'

@withWeapp(VantComponent({
    props: {
        description: String,
        image: {
            type: String,
            value: 'default',
        },
    },
}))
class _C extends React.Component {
  render() {
    const { image, description } = this.data
    return (
      <View className="custom-class van-empty">
        <View className="van-empty__image">{this.props.renderImage}</View>
        <View className="van-empty__image">
          {image && (
            <Image
              className="van-empty__image__img"
              src={computed.imageUrl(image)}
            ></Image>
          )}
        </View>
        <View className="van-empty__description">
          {this.props.renderDescription}
        </View>
        <View className="van-empty__description">{description}</View>
        <View className="van-empty__bottom">{this.props.children}</View>
      </View>
    )
  }
}
export default _C
