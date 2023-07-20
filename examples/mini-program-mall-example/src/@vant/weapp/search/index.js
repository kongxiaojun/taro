'use strict'

import { Block, View } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import utils from '../wxs/utils.wxs.js'
import VanField from '../field/index'
import './index.scss'
Object.defineProperty(exports, '__esModule', {
  value: true,
})
import { VantComponent } from '../common/component.js'
var version_1 = require('../common/version.js')

@withWeapp(VantComponent({
  field: true,
  classes: ['field-class', 'input-class', 'cancel-class'],
  props: {
    value: {
      type: String,
      value: '',
    },
    label: String,
    focus: Boolean,
    error: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    inputAlign: String,
    showAction: Boolean,
    useActionSlot: Boolean,
    useLeftIconSlot: Boolean,
    useRightIconSlot: Boolean,
    leftIcon: {
      type: String,
      value: 'search',
    },
    rightIcon: String,
    placeholder: String,
    placeholderStyle: String,
    actionText: {
      type: String,
      value: '取消',
    },
    background: {
      type: String,
      value: '#ffffff',
    },
    maxlength: {
      type: Number,
      value: -1,
    },
    shape: {
      type: String,
      value: 'square',
    },
    clearable: {
      type: Boolean,
      value: true,
    },
    clearTrigger: {
      type: String,
      value: 'focus',
    },
    clearIcon: {
      type: String,
      value: 'clear',
    },
  },
  methods: {
    onChange: function (event) {
      if ((0, version_1.canIUseModel)()) {
        this.setData({
          value: event.detail,
        })
      }
      this.$emit('change', event.detail)
    },
    onCancel: function () {
      var _this = this
      /**
       * 修复修改输入框值时，输入框失焦和赋值同时触发，赋值失效
       * https://github.com/youzan/vant-weapp/issues/1768
       */
      setTimeout(function () {
        if ((0, version_1.canIUseModel)()) {
          _this.setData({
            value: '',
          })
        }
        _this.$emit('cancel')
        _this.$emit('change', '')
      }, 200)
    },
    onSearch: function (event) {
      this.$emit('search', event.detail)
    },
    onFocus: function (event) {
      this.$emit('focus', event.detail)
    },
    onBlur: function (event) {
      this.$emit('blur', event.detail)
    },
    onClear: function (event) {
      this.$emit('clear', event.detail)
    },
    onClickInput: function (event) {
      this.$emit('click-input', event.detail)
    },
  },
}))
class _C extends React.Component {
  render() {
    const {
      showAction,
      useActionSlot,
      background,
      shape,
      label,
      useLeftIconSlot,
      leftIcon,
      useRightIconSlot,
      rightIcon,
      focus,
      error,
      value,
      disabled,
      readonly,
      clearable,
      clearTrigger,
      clearIcon,
      maxlength,
      inputAlign,
      placeholder,
      placeholderStyle,
      actionText,
    } = this.data
    return (
      <View
        className={
          utils.bem('search', {
            withaction: showAction || useActionSlot,
          }) + ' custom-class'
        }
        style={{background: background}}
      >
        <View className={utils.bem('search__content', [shape])}>
          {label && <View className="van-search__label">{label}</View>}
          <VanField
            type="search"
            leftIcon={!useLeftIconSlot ? leftIcon : ''}
            rightIcon={!useRightIconSlot ? rightIcon : ''}
            focus={focus}
            error={error}
            border={false}
            confirmType="search"
            className="van-search__field field-class"
            value={value}
            disabled={disabled}
            readonly={readonly}
            clearable={clearable}
            clearTrigger={clearTrigger}
            clearIcon={clearIcon}
            maxlength={maxlength}
            inputAlign={inputAlign}
            inputClass="input-class"
            placeholder={placeholder}
            placeholderStyle={placeholderStyle}
            customStyle={{padding: '5px 10px 5px 0', backgroundColor: 'transparent'}}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            onChange={this.onChange}
            onConfirm={this.onSearch}
            onClear={this.onClear}
            onClickInput={this.onClickInput}
          ></VanField>
        </View>
        {(showAction || useActionSlot) && (
          <View
            className="van-search__action"
            hoverClass="van-search__action--hover"
            hoverStayTime="70"
          >
            <View
              onTap={this.onCancel}
              className="van-search__action-button cancel-class"
            >
              {actionText}
            </View>
          </View>
        )}
      </View>
    )
  }
}
export default _C
