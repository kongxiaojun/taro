import { Block, View, Slot } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import utils from '../wxs/utils.wxs.js'
import { VantComponent } from '../common/component.js'
import { useParent } from '../common/relation.js'
import VanInfo from '../info/index'
import './index.scss'

@withWeapp(VantComponent({
  classes: ['active-class', 'disabled-class'],
  relation: useParent('sidebar'),
  props: {
    dot: Boolean,
    badge: null,
    info: null,
    title: String,
    disabled: Boolean,
    selected: Boolean,
  },
  methods: {
    onClick() {
      const { parent, index } = this.props
      console.log("sidebar onclick", index, parent)
      if (!parent || this.data.disabled) {
        return
      }
      console.log("sidebar onclick2", index)
      parent.setActive(index).then(() => {
        console.log("sidebar onclick4")
        this.$emit('click', index)
        parent.$emit('change', index)
      })
    },
  },
}))
class _C extends React.Component {
  render() {
    const { disabled, dot, badge, info, title } = this.data
    const { selected } = this.props
    return (
      <View
        className={
          utils.bem('sidebar-item', {
            selected,
            disabled,
          }) +
          ' ' +
          (selected ? 'active-class' : '') +
          ' ' +
          (disabled ? 'disabled-class' : '') +
          ' custom-class'
        }
        hoverClass="van-sidebar-item--hover"
        hoverStayTime="70"
        onClick={this.onClick}
      >
        <View className="van-sidebar-item__text">
          {(badge || info || dot) && (
            <VanInfo dot={dot} info={badge != null ? badge : info}></VanInfo>
          )}
          {title ? <View>{title}</View> : this.props.renderTitle}
        </View>
      </View>
    )
  }
}
export default _C
