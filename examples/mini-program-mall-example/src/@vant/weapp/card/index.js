import { Block, View, Image, Slot, Text } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import utils from '../wxs/utils.wxs.js'
import { link } from '../mixins/link.js'
import { VantComponent } from '../common/component.js'
import VanTag from '../tag/index'
import './index.scss'

@withWeapp(VantComponent({
  classes: [
    'num-class',
    'desc-class',
    'thumb-class',
    'title-class',
    'price-class',
    'origin-price-class',
  ],
  mixins: [link],
  props: {
    tag: String,
    num: String,
    desc: String,
    thumb: String,
    title: String,
    price: {
      type: String,
      observer: 'updatePrice',
    },
    centered: Boolean,
    lazyLoad: Boolean,
    thumbLink: String,
    originPrice: String,
    thumbMode: {
      type: String,
      value: 'aspectFit',
    },
    currency: {
      type: String,
      value: '¥',
    },
  },
  methods: {
    updatePrice() {
      const { price } = this.data
      const priceArr = price.toString().split('.')
      this.setData({
        integerStr: priceArr[0],
        decimalStr: priceArr[1] ? `.${priceArr[1]}` : '',
      })
    },
    onClickThumb() {
      this.jumpLink('thumbLink')
    },
  },
}))
class _C extends React.Component {
  render() {
    const {
      centered,
      thumb,
      thumbMode,
      lazyLoad,
      tag,
      title,
      desc,
      currency,
      integerStr,
      decimalStr,
      price,
      originPrice,
      num,
    } = this.data
    return (
      <View className="custom-class van-card">
        <View
          className={utils.bem('card__header', {
            center: centered,
          })}
        >
          <View className="van-card__thumb" onClick={this.onClickThumb}>
            {thumb ? (
              <Image
                src={thumb}
                mode={thumbMode}
                lazyLoad={lazyLoad}
                className="van-card__img thumb-class"
              ></Image>
            ) : (
              this.props.renderThumb
            )}
            {tag ? (
              <VanTag mark type="danger" customClass="van-card__tag">
                {tag}
              </VanTag>
            ) : (
              this.props.renderTag
            )}
          </View>
          <View
            className={
              'van-card__content ' +
              utils.bem('card__content', {
                center: centered,
              })
            }
          >
            <View>
              {title ? (
                <View className="van-card__title title-class">{title}</View>
              ) : (
                this.props.renderTitle
              )}
              {desc ? (
                <View className="van-card__desc desc-class">{desc}</View>
              ) : (
                this.props.renderDesc
              )}
              {this.props.renderTags}
            </View>
            <View className="van-card__bottom">
              {this.props.renderPricetop}
              {price || price === 0 ? (
                <View className="van-card__price price-class">
                  <Text>{currency}</Text>
                  <Text className="van-card__price-integer">{integerStr}</Text>
                  <Text className="van-card__price-decimal">{decimalStr}</Text>
                </View>
              ) : (
                this.props.renderPrice
              )}
              {originPrice || originPrice === 0 ? (
                <View className="van-card__origin-price origin-price-class">
                  {currency + ' ' + originPrice}
                </View>
              ) : (
                this.props.renderOriginprice
              )}
              {num ? (
                <View className="van-card__num num-class">{'x ' + num}</View>
              ) : (
                this.props.renderNum
              )}
              {this.props.renderBottom}
            </View>
          </View>
        </View>
        <View className="van-card__footer">{this.props.renderFooter}</View>
      </View>
    )
  }
}
export default _C
