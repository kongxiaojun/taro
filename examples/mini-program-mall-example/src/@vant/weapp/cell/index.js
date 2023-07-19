import { Block, View, Slot } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import utils from '../wxs/utils.wxs.js'
import computed from './index.wxs.js'
import { link } from '../mixins/link.js'
import { VantComponent } from '../common/component.js'
import VanIcon from '../icon/index'
import './index.scss'

@withWeapp(VantComponent({
  classes: [
    'title-class',
    'label-class',
    'value-class',
    'right-icon-class',
    'hover-class',
  ],
  mixins: [link],
  props: {
    title: null,
    value: null,
    icon: String,
    size: String,
    label: String,
    center: Boolean,
    isLink: Boolean,
    required: Boolean,
    clickable: Boolean,
    titleWidth: String,
    customStyle: String,
    arrowDirection: String,
    useLabelSlot: Boolean,
    border: {
      type: Boolean,
      value: true,
    },
    titleStyle: String,
  },
  methods: {
    onClick(event) {
      this.$emit('click', event.detail)
      this.jumpLink()
    },
  },
}))
class _C extends React.Component {
  render() {
    const {
      size,
      center,
      required,
      border,
      isLink,
      clickable,
      customStyle,
      icon,
      titleWidth,
      titleStyle,
      title,
      useLabelSlot,
      label,
      value,
      arrowDirection,
    } = this.data
    return (
      <View
        className={
          'custom-class ' +
          utils.bem('cell', [
            size,
            {
              center,
              required,
              borderless: !border,
              clickable: isLink || clickable,
            },
          ])
        }
        hoverClass="van-cell--hover hover-class"
        hoverStayTime="70"
        style={customStyle}
        onClick={this.onClick}
      >
        {icon ? (
          <VanIcon
            name={icon}
            className="van-cell__left-icon-wrap"
            customClass="van-cell__left-icon"
          ></VanIcon>
        ) : (
          this.props.renderIcon
        )}
        <View
          style={computed.titleStyle({
            titleWidth,
            titleStyle,
          })}
          className="van-cell__title title-class"
        >
          {title ? <Block>{title}</Block> : this.props.renderTitle}
          {(label || useLabelSlot) && (
            <View className="van-cell__label label-class">
              {useLabelSlot
                ? this.props.renderLabel
                : label && <Block>{label}</Block>}
            </View>
          )}
        </View>
        <View className="van-cell__value value-class">
          {value || value === 0 ? <Block>{value}</Block> : this.props.children}
        </View>
        {isLink ? (
          <VanIcon
            name={arrowDirection ? 'arrow' + '-' + arrowDirection : 'arrow'}
            className="van-cell__right-icon-wrap right-icon-class"
            customClass="van-cell__right-icon"
          ></VanIcon>
        ) : (
          this.props.renderRighticon
        )}
        {this.props.renderExtra}
      </View>
    )
  }
}
export default _C
