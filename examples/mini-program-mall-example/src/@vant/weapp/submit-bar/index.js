import { Block, View, Slot, Text } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import utils from '../wxs/utils.wxs.js'
import { VantComponent } from '../common/component.js'
import VanIcon from '../icon/index'
import VanButton from '../button/index'
import './index.scss'

@withWeapp(VantComponent({
  classes: ['bar-class', 'price-class', 'button-class'],
  props: {
    tip: {
      type: null,
      observer: 'updateTip',
    },
    tipIcon: String,
    type: Number,
    price: {
      type: null,
      observer: 'updatePrice',
    },
    label: String,
    loading: Boolean,
    disabled: Boolean,
    buttonText: String,
    currency: {
      type: String,
      value: '¥',
    },
    buttonType: {
      type: String,
      value: 'danger',
    },
    decimalLength: {
      type: Number,
      value: 2,
      observer: 'updatePrice',
    },
    suffixLabel: String,
    safeAreaInsetBottom: {
      type: Boolean,
      value: true,
    },
  },
  methods: {
    updatePrice() {
      const { price, decimalLength } = this.data
      const priceStrArr =
          typeof price === 'number' &&
          (price / 100).toFixed(decimalLength).split('.')
      this.setData({
        hasPrice: typeof price === 'number',
        integerStr: priceStrArr && priceStrArr[0],
        decimalStr: decimalLength && priceStrArr ? `.${priceStrArr[1]}` : '',
      })
    },
    updateTip() {
      this.setData({
        hasTip: typeof this.data.tip === 'string',
      })
    },
    onSubmit(event) {
      this.$emit('submit', event.detail)
    },
  },
}))
class _C extends React.Component {
  render() {
    const {
      tipIcon,
      tip,
      hasTip,
      label,
      currency,
      integerStr,
      decimalStr,
      suffixLabel,
      hasPrice,
      buttonType,
      loading,
      disabled,
      buttonText,
      safeAreaInsetBottom,
    } = this.data
    return (
      <View className="van-submit-bar custom-class">
        {this.props.renderTop}
        <View className="van-submit-bar__tip">
          {tipIcon && (
            <VanIcon
              size="12px"
              name={tipIcon}
              customClass="van-submit-bar__tip-icon"
            ></VanIcon>
          )}
          {hasTip && <View className="van-submit-bar__tip-text">{tip}</View>}
          {this.props.renderTip}
        </View>
        <View className="bar-class van-submit-bar__bar">
          {this.props.children}
          {hasPrice && (
            <View className="van-submit-bar__text">
              <Text>{label || '合计：'}</Text>
              <Text className="van-submit-bar__price price-class">
                <Text className="van-submit-bar__currency">{currency}</Text>
                <Text className="van-submit-bar__price-integer">
                  {integerStr}
                </Text>
                <Text>{decimalStr}</Text>
              </Text>
              <Text className="van-submit-bar__suffix-label">
                {suffixLabel}
              </Text>
            </View>
          )}
          <VanButton
            round
            type={buttonType}
            loading={loading}
            disabled={disabled}
            className="van-submit-bar__button"
            customClass="button-class"
            customStyle="width: 100%;"
            onClick={this.onSubmit}
          >
            {loading ? '' : buttonText}
          </VanButton>
        </View>
        {safeAreaInsetBottom && <View className="van-submit-bar__safe"></View>}
      </View>
    )
  }
}
export default _C
