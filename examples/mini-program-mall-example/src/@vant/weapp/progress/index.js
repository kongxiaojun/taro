import { Block, View } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import utils from '../wxs/utils.wxs.js'
import computed from './index.wxs.js'
import { VantComponent } from '../common/component.js'
import { BLUE } from '../common/color.js'
import { getRect } from '../common/utils.js'
import './index.scss'

@withWeapp(VantComponent({
  props: {
    inactive: Boolean,
    percentage: {
      type: Number,
      observer: 'setLeft',
    },
    pivotText: String,
    pivotColor: String,
    trackColor: String,
    showPivot: {
      type: Boolean,
      value: true,
    },
    color: {
      type: String,
      value: BLUE,
    },
    textColor: {
      type: String,
      value: '#fff',
    },
    strokeWidth: {
      type: null,
      value: 4,
    },
  },
  data: {
    right: 0,
  },
  mounted() {
    this.setLeft()
  },
  methods: {
    setLeft() {
      Promise.all([
        getRect(this, '.van-progress'),
        getRect(this, '.van-progress__pivot'),
      ]).then(([portion, pivot]) => {
        if (portion && pivot) {
          this.setData({
            right: (pivot.width * (this.data.percentage - 100)) / 100,
          })
        }
      })
    },
  },
}))
class _C extends React.Component {
  render() {
    const {
      strokeWidth,
      trackColor,
      percentage,
      inactive,
      color,
      textColor,
      pivotColor,
      right,
      pivotText,
      showPivot,
    } = this.data
    return (
      <View
        className="van-progress custom-class"
        style={computed.rootStyle({
          strokeWidth,
          trackColor,
        })}
      >
        <View
          className="van-progress__portion"
          style={computed.portionStyle({
            percentage,
            inactive,
            color,
          })}
        >
          {showPivot && computed.pivotText(pivotText, percentage) && (
            <View
              style={computed.pivotStyle({
                textColor,
                pivotColor,
                inactive,
                color,
                right,
              })}
              className="van-progress__pivot"
            >
              {computed.pivotText(pivotText, percentage)}
            </View>
          )}
        </View>
      </View>
    )
  }
}
export default _C
