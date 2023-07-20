import { Block, Slot, View, Textarea, Input } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import utils from '../wxs/utils.wxs.js'
import computed from './index.wxs.js'
import { nextTick } from '../common/utils.js'
import { VantComponent } from '../common/component.js'
import { commonProps, inputProps, textareaProps } from './props.js'
import VanIcon from '../icon/index'
import VanCell from '../cell/index'
import './index.scss'

@withWeapp(VantComponent({
  field: true,
  classes: ['input-class', 'right-icon-class', 'label-class'],
  props: Object.assign(
      Object.assign(
          Object.assign(Object.assign({}, commonProps), inputProps),
          textareaProps
      ),
      {
        size: String,
        icon: String,
        label: String,
        error: Boolean,
        center: Boolean,
        isLink: Boolean,
        leftIcon: String,
        rightIcon: String,
        autosize: null,
        required: Boolean,
        iconClass: String,
        clickable: Boolean,
        inputAlign: String,
        customStyle: String,
        errorMessage: String,
        arrowDirection: String,
        showWordLimit: Boolean,
        errorMessageAlign: String,
        readonly: {
          type: Boolean,
          observer: 'setShowClear',
        },
        clearable: {
          type: Boolean,
          observer: 'setShowClear',
        },
        clearTrigger: {
          type: String,
          value: 'focus',
        },
        border: {
          type: Boolean,
          value: true,
        },
        titleWidth: {
          type: String,
          value: '6.2em',
        },
        clearIcon: {
          type: String,
          value: 'clear',
        },
        extraEventParams: {
          type: Boolean,
          value: false,
        },
      }
  ),
  data: {
    focused: false,
    innerValue: '',
    showClear: false,
  },
  created() {
    this.value = this.data.value
    this.setData({
      innerValue: this.value,
    })
  },
  methods: {
    formatValue(value) {
      const { maxlength } = this.data
      if (maxlength !== -1 && value.length > maxlength) {
        return value.slice(0, maxlength)
      }
      return value
    },
    onInput(event) {
      const { value = '' } = event.detail || {}
      const formatValue = this.formatValue(value)
      this.value = formatValue
      this.setShowClear()
      return this.emitChange(
          Object.assign(Object.assign({}, event.detail), {
            value: formatValue,
          })
      )
    },
    onFocus(event) {
      this.focused = true
      this.setShowClear()
      this.$emit('focus', event.detail)
    },
    onBlur(event) {
      this.focused = false
      this.setShowClear()
      this.$emit('blur', event.detail)
    },
    onClickIcon() {
      this.$emit('click-icon')
    },
    onClickInput(event) {
      this.$emit('click-input', event.detail)
    },
    onClear() {
      this.setData({
        innerValue: '',
      })
      this.value = ''
      this.setShowClear()
      nextTick(() => {
        this.emitChange({
          value: '',
        })
        this.$emit('clear', '')
      })
    },
    onConfirm(event) {
      const { value = '' } = event.detail || {}
      this.value = value
      this.setShowClear()
      this.$emit('confirm', value)
    },
    setValue(value) {
      this.value = value
      this.setShowClear()
      if (value === '') {
        this.setData({
          innerValue: '',
        })
      }
      this.emitChange({
        value,
      })
    },
    onLineChange(event) {
      this.$emit('linechange', event.detail)
    },
    onKeyboardHeightChange(event) {
      this.$emit('keyboardheightchange', event.detail)
    },
    emitChange(detail) {
      const { extraEventParams } = this.data
      this.setData({
        value: detail.value,
      })
      let result
      const data = extraEventParams
          ? Object.assign(Object.assign({}, detail), {
            callback: (data) => {
              result = data
            },
          })
          : detail.value
      this.$emit('input', data)
      this.$emit('change', data)
      return result
    },
    setShowClear() {
      const { clearable, readonly, clearTrigger } = this.data
      const { focused, value } = this
      let showClear = false
      if (clearable && !readonly) {
        const hasValue = !!value
        const trigger =
            clearTrigger === 'always' || (clearTrigger === 'focus' && focused)
        showClear = hasValue && trigger
      }
      this.setData({
        showClear,
      })
    },
    noop() {},
  },
}))
class _C extends React.Component {
  render() {
    const {
      size,
      leftIcon,
      center,
      border,
      isLink,
      required,
      clickable,
      titleWidth,
      customStyle,
      arrowDirection,
      label,
      disabled,
      type,
      inputAlign,
      clearIcon,
      showClear,
      rightIcon,
      icon,
      iconClass,
      value,
      maxlength,
      showWordLimit,
      errorMessageAlign,
      error,
      errorMessage,
      fixed,
      focus,
      cursor,
      innerValue,
      autoFocus,
      readonly,
      placeholder,
      placeholderStyle,
      autosize,
      cursorSpacing,
      adjustPosition,
      showConfirmBar,
      holdKeyboard,
      selectionEnd,
      selectionStart,
      disableDefaultPadding,
      confirmType,
      confirmHold,
      alwaysEmbed,
      password,
    } = this.data
    return (
      <VanCell
        size={size}
        icon={leftIcon}
        center={center}
        border={border}
        isLink={isLink}
        required={required}
        clickable={clickable}
        titleWidth={titleWidth}
        titleStyle={{marginRight: '12px'}}
        customStyle={customStyle}
        arrowDirection={arrowDirection}
        customClass="van-field"
        renderIcon={
          <Block>
            <Slot name="left-icon"></Slot>
          </Block>
        }
        renderTitle={
          <Block>
            {label ? (
              <View
                className={
                  'label-class ' +
                  utils.bem('field__label', {
                    disabled,
                  })
                }
              >
                {label}
              </View>
            ) : (
              <Slot name="label" slot="title"></Slot>
            )}
          </Block>
        }
      >
        <View className={utils.bem('field__body', [type])}>
          <View
            className={utils.bem('field__control', [inputAlign, 'custom'])}
            onClick={this.onClickInput}
          >
            {this.props.renderInput}
          </View>
          {type === 'textarea' ? (
            <Textarea
              className={
                utils.bem('field__control', [
                  inputAlign,
                  type,
                  {
                    disabled,
                    error,
                  },
                ]) + ' input-class'
              }
              fixed={fixed}
              focus={focus}
              cursor={cursor}
              value={innerValue}
              autoFocus={autoFocus}
              disabled={disabled || readonly}
              maxlength={maxlength}
              placeholder={placeholder}
              placeholderStyle={placeholderStyle}
              placeholderClass={utils.bem('field__placeholder', {
                error,
                disabled,
              })}
              autoHeight={!!autosize}
              style={computed.inputStyle(autosize)}
              cursorSpacing={cursorSpacing}
              adjustPosition={adjustPosition}
              showConfirmBar={showConfirmBar}
              holdKeyboard={holdKeyboard}
              selectionEnd={selectionEnd}
              selectionStart={selectionStart}
              disableDefaultPadding={disableDefaultPadding}
              onInput={this.onInput}
              onClick={this.onClickInput}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
              onConfirm={this.onConfirm}
              onLinechange={this.onLineChange}
              onKeyboardheightchange={this.onKeyboardHeightChange}
            ></Textarea>
          ) : (
            <Input
              className={
                utils.bem('field__control', [
                  inputAlign,
                  {
                    disabled,
                    error,
                  },
                ]) + ' input-class'
              }
              type={type}
              focus={focus}
              cursor={cursor}
              value={innerValue}
              autoFocus={autoFocus}
              disabled={disabled || readonly}
              maxlength={maxlength}
              placeholder={placeholder}
              placeholderStyle={placeholderStyle}
              placeholderClass={utils.bem('field__placeholder', {
                error,
              })}
              confirmType={confirmType}
              confirmHold={confirmHold}
              holdKeyboard={holdKeyboard}
              cursorSpacing={cursorSpacing}
              adjustPosition={adjustPosition}
              selectionEnd={selectionEnd}
              selectionStart={selectionStart}
              alwaysEmbed={alwaysEmbed}
              password={password || type === 'password'}
              onInput={this.onInput}
              onClick={this.onClickInput}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
              onConfirm={this.onConfirm}
              onKeyboardheightchange={this.onKeyboardHeightChange}
            ></Input>
          )}
          {showClear && (
            <VanIcon
              name={clearIcon}
              className="van-field__clear-root van-field__icon-root"
              onTouchstart={this.privateStopNoop.bind(this, this.onClear)}
            ></VanIcon>
          )}
          <View className="van-field__icon-container" onTap={this.onClickIcon}>
            {(rightIcon || icon) && (
              <VanIcon
                name={rightIcon || icon}
                className={'van-field__icon-root ' + iconClass}
                customClass="right-icon-class"
              ></VanIcon>
            )}
            {this.props.renderRighticon}
            {this.props.renderIcon}
          </View>
          <View className="van-field__button">{this.props.renderButton}</View>
        </View>
        {showWordLimit && maxlength && (
          <View className="van-field__word-limit">
            <View
              className={utils.bem('field__word-num', {
                full: value.length >= maxlength,
              })}
            >
              {value.length >= maxlength ? maxlength : value.length}
            </View>
            {'/' + maxlength}
          </View>
        )}
        {errorMessage && (
          <View
            className={utils.bem('field__error-message', [
              errorMessageAlign,
              {
                disabled,
                error,
              },
            ])}
          >
            {errorMessage}
          </View>
        )}
      </VanCell>
    )
  }
}
export default _C
