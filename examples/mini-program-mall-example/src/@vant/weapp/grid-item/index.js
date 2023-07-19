import { Block, View, Slot, Text } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import utils from '../wxs/utils.wxs.js'
import computed from './index.wxs.js'
import { VantComponent } from '../common/component.js'
import { useParent } from '../common/relation.js'
import { link } from '../mixins/link.js'
import VanIcon from '../icon/index'
import './index.scss'

@withWeapp(VantComponent({
  relation: useParent('grid'),
  classes: ['content-class', 'icon-class', 'text-class'],
  mixins: [link],
  props: {
    icon: String,
    iconColor: String,
    iconPrefix: {
      type: String,
      value: 'van-icon',
    },
    dot: Boolean,
    info: null,
    badge: null,
    text: String,
    useSlot: Boolean,
  },
  data: {
    viewStyle: '',
  },
  mounted() {
    this.updateStyle()
  },
  methods: {
    updateStyle() {
      if (!this.props.parent) {
        return
      }
      const { data, children } = this.props.parent
      const {
        columnNum,
        border,
        square,
        gutter,
        clickable,
        center,
        direction,
        reverse,
        iconSize,
      } = data
      this.setData({
        center,
        border,
        square,
        gutter,
        clickable,
        direction,
        reverse,
        iconSize,
        index: children.indexOf(this),
        columnNum,
      })
    },
    onClick() {
      this.$emit('click')
      this.jumpLink()
    },
  },
}))
class _C extends React.Component {
  render() {
    const {
      square,
      gutter,
      columnNum,
      index,
      direction,
      center,
      reverse,
      clickable,
      border,
      useSlot,
      icon,
      iconColor,
      iconPrefix,
      dot,
      badge,
      info,
      iconSize,
      text,
    } = this.data
    return (
      <View
        className={
          'custom-class ' +
          utils.bem('grid-item', {
            square,
          })
        }
        style={computed.wrapperStyle({
          square,
          gutter,
          columnNum,
          index,
        })}
        onClick={this.onClick}
      >
        <View
          className={
            'content-class ' +
            utils.bem('grid-item__content', [
              direction,
              {
                center,
                square,
                reverse,
                clickable,
                surround: border && gutter,
              },
            ]) +
            ' ' +
            (border ? 'van-hairline--surround' : '')
          }
          style={computed.contentStyle({
            square,
            gutter,
          })}
        >
          {useSlot ? (
            <Block>{this.props.children}</Block>
          ) : (
            <Block>
              <View className="van-grid-item__icon icon-class">
                {icon ? (
                  <VanIcon
                    name={icon}
                    color={iconColor}
                    classPrefix={iconPrefix}
                    dot={dot}
                    info={badge || info}
                    size={iconSize}
                  ></VanIcon>
                ) : (
                  this.props.renderIcon
                )}
              </View>
              <View className="van-grid-item__text text-class">
                {text ? <Text>{text}</Text> : this.props.renderText}
              </View>
            </Block>
          )}
        </View>
      </View>
    )
  }
}
export default _C
