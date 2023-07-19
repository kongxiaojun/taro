import { Block, View, Slot } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import { VantComponent } from '../../../common/component.js'
import './index.scss'

@withWeapp(VantComponent({
  props: {
    title: {
      type: String,
      value: '日期选择',
    },
    subtitle: String,
    showTitle: Boolean,
    showSubtitle: Boolean,
    firstDayOfWeek: {
      type: Number,
      observer: 'initWeekDay',
    },
  },
  data: {
    weekdays: [],
  },
  created() {
    this.initWeekDay()
  },
  methods: {
    initWeekDay() {
      const defaultWeeks = ['日', '一', '二', '三', '四', '五', '六']
      const firstDayOfWeek = this.data.firstDayOfWeek || 0
      this.setData({
        weekdays: [
          ...defaultWeeks.slice(firstDayOfWeek, 7),
          ...defaultWeeks.slice(0, firstDayOfWeek),
        ],
      })
    },
    onClickSubtitle(event) {
      this.$emit('click-subtitle', event)
    },
  },
}))
class _C extends React.Component {
  render() {
    const { title, showTitle, subtitle, showSubtitle, weekdays } = this.data
    return (
      <View className="van-calendar__header">
        {showTitle && (
          <Block>
            <View className="van-calendar__header-title">
              {this.props.renderTitle}
            </View>
            <View className="van-calendar__header-title">{title}</View>
          </Block>
        )}
        {showSubtitle && (
          <View
            className="van-calendar__header-subtitle"
            onTap={this.onClickSubtitle}
          >
            {subtitle}
          </View>
        )}
        <View className="van-calendar__weekdays">
          {weekdays.map((item, index) => {
            return (
              <View key={item.index} className="van-calendar__weekday">
                {item}
              </View>
            )
          })}
        </View>
      </View>
    )
  }
}
export default _C
