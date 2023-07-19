import { Block, View } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import utils from '../wxs/utils.wxs.js'
import computed from './index.wxs.js'
import { VantComponent } from '../common/component.js'
import { range } from '../common/utils.js'
import { isObj } from '../common/validator.js'
import './index.scss'
const DEFAULT_DURATION = 200

@withWeapp(VantComponent({
  classes: ['active-class'],
  props: {
    valueKey: String,
    className: String,
    itemHeight: Number,
    visibleItemCount: Number,
    initialOptions: {
      type: Array,
      value: [],
    },
    defaultIndex: {
      type: Number,
      value: 0,
      observer(value) {
        this.setIndex(value)
      },
    },
  },
  data: {
    startY: 0,
    offset: 0,
    duration: 0,
    startOffset: 0,
    options: [],
    currentIndex: 0,
  },
  created() {
    const { defaultIndex, initialOptions } = this.data
    this.set({
      currentIndex: defaultIndex,
      options: initialOptions,
    }).then(() => {
      this.setIndex(defaultIndex)
    })
  },
  methods: {
    getCount() {
      return this.data.options.length
    },
    onTouchStart(event) {
      this.setData({
        startY: event.touches[0].clientY,
        startOffset: this.data.offset,
        duration: 0,
      })
    },
    onTouchMove(event) {
      const { data } = this
      const deltaY = event.touches[0].clientY - data.startY
      this.setData({
        offset: range(
            data.startOffset + deltaY,
            -(this.getCount() * data.itemHeight),
            data.itemHeight
        ),
      })
    },
    onTouchEnd() {
      const { data } = this
      if (data.offset !== data.startOffset) {
        this.setData({
          duration: DEFAULT_DURATION,
        })
        const index = range(
            Math.round(-data.offset / data.itemHeight),
            0,
            this.getCount() - 1
        )
        this.setIndex(index, true)
      }
    },
    onClickItem(event) {
      const { index } = event.currentTarget.dataset
      this.setIndex(index, true)
    },
    adjustIndex(index) {
      const { data } = this
      const count = this.getCount()
      index = range(index, 0, count)
      for (let i = index; i < count; i++) {
        if (!this.isDisabled(data.options[i])) return i
      }
      for (let i = index - 1; i >= 0; i--) {
        if (!this.isDisabled(data.options[i])) return i
      }
    },
    isDisabled(option) {
      return isObj(option) && option.disabled
    },
    getOptionText(option) {
      const { data } = this
      return isObj(option) && data.valueKey in option
          ? option[data.valueKey]
          : option
    },
    setIndex(index, userAction) {
      const { data } = this
      index = this.adjustIndex(index) || 0
      const offset = -index * data.itemHeight
      if (index !== data.currentIndex) {
        return this.set({
          offset,
          currentIndex: index,
        }).then(() => {
          userAction && this.$emit('change', index)
        })
      }
      return this.set({
        offset,
      })
    },
    setValue(value) {
      const { options } = this.data
      for (let i = 0; i < options.length; i++) {
        if (this.getOptionText(options[i]) === value) {
          return this.setIndex(i)
        }
      }
      return Promise.resolve()
    },
    getValue() {
      const { data } = this
      return data.options[data.currentIndex]
    },
  },
}))
class _C extends React.Component {
  render() {
    const {
      itemHeight,
      visibleItemCount,
      offset,
      duration,
      currentIndex,
      options,
      valueKey,
    } = this.data
    return (
      <View
        className="van-picker-column custom-class"
        style={computed.rootStyle({
          itemHeight,
          visibleItemCount,
        })}
        onTouchstart={this.onTouchStart}
        onTouchmove={this.privateStopNoop.bind(this, this.onTouchMove)}
        onTouchend={this.onTouchEnd}
        onTouchcancel={this.onTouchEnd}
      >
        <View
          style={computed.wrapperStyle({
            offset,
            itemHeight,
            visibleItemCount,
            duration,
          })}
        >
          {options.map((option, index) => {
            return (
              <View
                key={option.index}
                data-index={index}
                style={'height: ' + itemHeight + 'px'}
                className={
                  'van-ellipsis ' +
                  utils.bem('picker-column__item', {
                    disabled: option && option.disabled,
                    selected: index === currentIndex,
                  }) +
                  ' ' +
                  (index === currentIndex ? 'active-class' : '')
                }
                onClick={this.onClickItem}
              >
                {computed.optionText(option, valueKey)}
              </View>
            )
          })}
        </View>
      </View>
    )
  }
}
export default _C
