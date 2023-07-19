import { Block, View, Slot } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import utils from '../wxs/utils.wxs.js'
import computed from './index.wxs.js'
import { canIUseModel } from '../common/version.js'
import { VantComponent } from '../common/component.js'
import { useParent } from '../common/relation.js'
import VanIcon from '../icon/index'
import './index.scss'

@withWeapp(VantComponent({
  field: true,
  relation: useParent('radio-group', function () {
    this.updateFromParent()
  }),
  classes: ['icon-class', 'label-class'],
  props: {
    name: null,
    value: null,
    disabled: Boolean,
    useIconSlot: Boolean,
    checkedColor: String,
    labelPosition: {
      type: String,
      value: 'right',
    },
    labelDisabled: Boolean,
    shape: {
      type: String,
      value: 'round',
    },
    iconSize: {
      type: null,
      value: 20,
    },
  },
  data: {
    direction: '',
    parentDisabled: false,
  },
  methods: {
    updateFromParent() {
      if (!this.parent) {
        return
      }
      const { value, disabled: parentDisabled, direction } = this.parent.data
      this.setData({
        value,
        direction,
        parentDisabled,
      })
    },
    emitChange(value) {
      const instance = this.parent || this
      instance.$emit('input', value)
      instance.$emit('change', value)
      if (canIUseModel()) {
        instance.setData({
          value,
        })
      }
    },
    onChange() {
      if (!this.data.disabled && !this.data.parentDisabled) {
        this.emitChange(this.data.name)
      }
    },
    onClickLabel() {
      const { disabled, parentDisabled, labelDisabled, name } = this.data
      if (!(disabled || parentDisabled) && !labelDisabled) {
        this.emitChange(name)
      }
    },
  },
}))
class _C extends React.Component {
  render() {
    const {
      direction,
      labelPosition,
      disabled,
      parentDisabled,
      iconSize,
      useIconSlot,
      shape,
      value,
      name,
      checkedColor,
    } = this.data
    return (
      <View className={utils.bem('radio', [direction]) + ' custom-class'}>
        {labelPosition === 'left' && (
          <View
            className={
              utils.bem('radio__label', [
                labelPosition,
                {
                  disabled: disabled || parentDisabled,
                },
              ]) + ' label-class'
            }
            onClick={this.onClickLabel}
          >
            {this.props.children}
          </View>
        )}
        <View
          className="van-radio__icon-wrap"
          style={'font-size: ' + utils.addUnit(iconSize)}
          onClick={this.onChange}
        >
          {useIconSlot ? (
            this.props.renderIcon
          ) : (
            <VanIcon
              name="success"
              className={utils.bem('radio__icon', [
                shape,
                {
                  disabled: disabled || parentDisabled,
                  checked: value === name,
                },
              ])}
              style={computed.iconStyle({
                iconSize,
                checkedColor,
                disabled,
                parentDisabled,
                value,
                name,
              })}
              customClass="icon-class"
              customStyle={computed.iconCustomStyle({
                iconSize,
              })}
            ></VanIcon>
          )}
        </View>
        {labelPosition === 'right' && (
          <View
            className={
              'label-class ' +
              utils.bem('radio__label', [
                labelPosition,
                {
                  disabled: disabled || parentDisabled,
                },
              ])
            }
            onClick={this.onClickLabel}
          >
            {this.props.children}
          </View>
        )}
      </View>
    )
  }
}
export default _C
