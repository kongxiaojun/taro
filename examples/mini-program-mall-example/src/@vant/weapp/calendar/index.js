import { Block, View, Slot, ScrollView } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import computed from './index.wxs.js'
import utils from '../wxs/utils.wxs.js'
import { VantComponent } from '../common/component.js'
import {
  ROW_HEIGHT,
  getPrevDay,
  getNextDay,
  getToday,
  compareDay,
  copyDates,
  calcDateNum,
  formatMonthTitle,
  compareMonth,
  getMonths,
  getDayByOffset,
} from './utils.js'
import Toast from '../toast/toast.js'
import { requestAnimationFrame } from '../common/utils.js'
import VanToast from '../toast/index'
import VanPopup from '../popup/index'
import VanButton from '../button/index'
import Month from './components/month/index'
import Header from './components/header/index'
import './index.scss'
const initialMinDate = getToday().getTime()
const initialMaxDate = (() => {
  const now = getToday()
  return new Date(
    now.getFullYear(),
    now.getMonth() + 6,
    now.getDate()
  ).getTime()
})()
const getTime = (date) => (date instanceof Date ? date.getTime() : date)

@withWeapp(VantComponent({
  props: {
    title: {
      type: String,
      value: '日期选择',
    },
    color: String,
    show: {
      type: Boolean,
      observer(val) {
        if (val) {
          this.initRect()
          this.scrollIntoView()
        }
      },
    },
    formatter: null,
    confirmText: {
      type: String,
      value: '确定',
    },
    confirmDisabledText: {
      type: String,
      value: '确定',
    },
    rangePrompt: String,
    showRangePrompt: {
      type: Boolean,
      value: true,
    },
    defaultDate: {
      type: null,
      observer(val) {
        this.setData({
          currentDate: val,
        })
        this.scrollIntoView()
      },
    },
    allowSameDay: Boolean,
    type: {
      type: String,
      value: 'single',
      observer: 'reset',
    },
    minDate: {
      type: Number,
      value: initialMinDate,
    },
    maxDate: {
      type: Number,
      value: initialMaxDate,
    },
    position: {
      type: String,
      value: 'bottom',
    },
    rowHeight: {
      type: null,
      value: ROW_HEIGHT,
    },
    round: {
      type: Boolean,
      value: true,
    },
    poppable: {
      type: Boolean,
      value: true,
    },
    showMark: {
      type: Boolean,
      value: true,
    },
    showTitle: {
      type: Boolean,
      value: true,
    },
    showConfirm: {
      type: Boolean,
      value: true,
    },
    showSubtitle: {
      type: Boolean,
      value: true,
    },
    safeAreaInsetBottom: {
      type: Boolean,
      value: true,
    },
    closeOnClickOverlay: {
      type: Boolean,
      value: true,
    },
    maxRange: {
      type: null,
      value: null,
    },
    minRange: {
      type: Number,
      value: 1,
    },
    firstDayOfWeek: {
      type: Number,
      value: 0,
    },
    readonly: Boolean,
  },
  data: {
    subtitle: '',
    currentDate: null,
    scrollIntoView: '',
  },
  created() {
    this.setData({
      currentDate: this.getInitialDate(this.data.defaultDate),
    })
  },
  mounted() {
    if (this.data.show || !this.data.poppable) {
      this.initRect()
      this.scrollIntoView()
    }
  },
  methods: {
    reset() {
      this.setData({
        currentDate: this.getInitialDate(),
      })
      this.scrollIntoView()
    },
    initRect() {
      if (this.contentObserver != null) {
        this.contentObserver.disconnect()
      }
      const contentObserver = Taro.createIntersectionObserver(this, {
        thresholds: [0, 0.1, 0.9, 1],
        observeAll: true,
      })
      this.contentObserver = contentObserver
      contentObserver.relativeTo('.van-calendar__body')
      contentObserver.observe('.month', (res) => {
        if (res.boundingClientRect.top <= res.relativeRect.top) {
          // @ts-ignore
          this.setData({
            subtitle: formatMonthTitle(res.dataset.date),
          })
        }
      })
    },
    limitDateRange(date, minDate = null, maxDate = null) {
      minDate = minDate || this.data.minDate
      maxDate = maxDate || this.data.maxDate
      if (compareDay(date, minDate) === -1) {
        return minDate
      }
      if (compareDay(date, maxDate) === 1) {
        return maxDate
      }
      return date
    },
    getInitialDate(defaultDate = null) {
      const { type, minDate, maxDate, allowSameDay } = this.data
      const now = getToday().getTime()
      if (type === 'range') {
        if (!Array.isArray(defaultDate)) {
          defaultDate = []
        }
        const [startDay, endDay] = defaultDate || []
        const startDate = getTime(startDay || now)
        const start = this.limitDateRange(
            startDate,
            minDate,
            allowSameDay ? startDate : getPrevDay(new Date(maxDate)).getTime()
        )
        const date = getTime(endDay || now)
        const end = this.limitDateRange(
            date,
            allowSameDay ? date : getNextDay(new Date(minDate)).getTime()
        )
        return [start, end]
      }
      if (type === 'multiple') {
        if (Array.isArray(defaultDate)) {
          return defaultDate.map((date) => this.limitDateRange(date))
        }
        return [this.limitDateRange(now)]
      }
      if (!defaultDate || Array.isArray(defaultDate)) {
        defaultDate = now
      }
      return this.limitDateRange(defaultDate)
    },
    scrollIntoView() {
      requestAnimationFrame(() => {
        const { currentDate, type, show, poppable, minDate, maxDate } =
            this.data
        // @ts-ignore
        const targetDate = type === 'single' ? currentDate : currentDate[0]
        const displayed = show || !poppable
        if (!targetDate || !displayed) {
          return
        }
        const months = getMonths(minDate, maxDate)
        months.some((month, index) => {
          if (compareMonth(month, targetDate) === 0) {
            this.setData({
              scrollIntoView: `month${index}`,
            })
            return true
          }
          return false
        })
      })
    },
    onOpen() {
      this.$emit('open')
    },
    onOpened() {
      this.$emit('opened')
    },
    onClose() {
      this.$emit('close')
    },
    onClosed() {
      this.$emit('closed')
    },
    onClickDay(event) {
      if (this.data.readonly) {
        return
      }
      let { date } = event.detail
      const { type, currentDate, allowSameDay } = this.data
      if (type === 'range') {
        // @ts-ignore
        const [startDay, endDay] = currentDate
        if (startDay && !endDay) {
          const compareToStart = compareDay(date, startDay)
          if (compareToStart === 1) {
            const { days } = this.selectComponent('.month').data
            days.some((day, index) => {
              const isDisabled =
                  day.type === 'disabled' &&
                  getTime(startDay) < getTime(day.date) &&
                  getTime(day.date) < getTime(date)
              if (isDisabled) {
                ;({ date } = days[index - 1])
              }
              return isDisabled
            })
            this.select([startDay, date], true)
          } else if (compareToStart === -1) {
            this.select([date, null])
          } else if (allowSameDay) {
            this.select([date, date], true)
          }
        } else {
          this.select([date, null])
        }
      } else if (type === 'multiple') {
        let selectedIndex
        // @ts-ignore
        const selected = currentDate.some((dateItem, index) => {
          const equal = compareDay(dateItem, date) === 0
          if (equal) {
            selectedIndex = index
          }
          return equal
        })
        if (selected) {
          // @ts-ignore
          const cancelDate = currentDate.splice(selectedIndex, 1)
          this.setData({
            currentDate,
          })
          this.unselect(cancelDate)
        } else {
          // @ts-ignore
          this.select([...currentDate, date])
        }
      } else {
        this.select(date, true)
      }
    },
    unselect(dateArray) {
      const date = dateArray[0]
      if (date) {
        this.$emit('unselect', copyDates(date))
      }
    },
    select(date, complete) {
      if (complete && this.data.type === 'range') {
        const valid = this.checkRange(date)
        if (!valid) {
          // auto selected to max range if showConfirm
          if (this.data.showConfirm) {
            this.emit([
              date[0],
              getDayByOffset(date[0], this.data.maxRange - 1),
            ])
          } else {
            this.emit(date)
          }
          return
        }
      }
      this.emit(date)
      if (complete && !this.data.showConfirm) {
        this.onConfirm()
      }
    },
    emit(date) {
      this.setData({
        currentDate: Array.isArray(date) ? date.map(getTime) : getTime(date),
      })
      this.$emit('select', copyDates(date))
    },
    checkRange(date) {
      const { maxRange, rangePrompt, showRangePrompt } = this.data
      if (maxRange && calcDateNum(date) > maxRange) {
        if (showRangePrompt) {
          Toast({
            context: this,
            message: rangePrompt || `选择天数不能超过 ${maxRange} 天`,
          })
        }
        this.$emit('over-range')
        return false
      }
      return true
    },
    onConfirm() {
      if (
          this.data.type === 'range' &&
          !this.checkRange(this.data.currentDate)
      ) {
        return
      }
      Taro.nextTick(() => {
        // @ts-ignore
        this.$emit('confirm', copyDates(this.data.currentDate))
      })
    },
    onClickSubtitle(event) {
      this.$emit('click-subtitle', event)
    },
  },
}))
class _C extends React.Component {
  render() {
    const {
      position,
      show,
      round,
      showTitle,
      showSubtitle,
      closeOnClickOverlay,
      safeAreaInsetBottom,
      poppable,
      title,
      subtitle,
      firstDayOfWeek,
      scrollIntoView,
      minDate,
      maxDate,
      item,
      index,
      type,
      color,
      showMark,
      formatter,
      rowHeight,
      currentDate,
      allowSameDay,
      showConfirm,
      minRange,
      confirmDisabledText,
      confirmText,
    } = this.data
    return (
      <Block>
        {poppable ? (
          <VanPopup
            customClass={'van-calendar__popup--' + position}
            closeIconClass="van-calendar__close-icon"
            show={show}
            round={round}
            position={position}
            closeable={showTitle || showSubtitle}
            closeOnClickOverlay={closeOnClickOverlay}
            safeAreaInsetBottom={safeAreaInsetBottom}
            onEnter={this.onOpen}
            onClose={this.onClose}
            onAfterEnter={this.onOpened}
            onAfterLeave={this.onClosed}
          >
            <View className="van-calendar">
              <Header
                title={title}
                showTitle={showTitle}
                subtitle={subtitle}
                showSubtitle={showSubtitle}
                firstDayOfWeek={firstDayOfWeek}
                onClickSubtitle={this.onClickSubtitle}
                renderTitle={<Block>{this.props.renderTitle}</Block>}
              ></Header>
              <ScrollView
                className="van-calendar__body"
                scrollY
                scrollIntoView={scrollIntoView}
              >
                {computed.getMonths(minDate, maxDate).map((item, index) => {
                  return (
                    <Month
                      key={item.index}
                      id={'month' + index}
                      className="month"
                      data-date={item}
                      date={item}
                      type={type}
                      color={color}
                      minDate={minDate}
                      maxDate={maxDate}
                      showMark={showMark}
                      formatter={formatter}
                      rowHeight={rowHeight}
                      currentDate={currentDate}
                      showSubtitle={showSubtitle}
                      allowSameDay={allowSameDay}
                      showMonthTitle={index !== 0 || !showSubtitle}
                      firstDayOfWeek={firstDayOfWeek}
                      onClick={this.onClickDay}
                    ></Month>
                  )
                })}
              </ScrollView>
              <View
                className={utils.bem('calendar__footer', {
                  safeAreaInsetBottom,
                })}
              >
                {this.props.renderFooter}
              </View>
              <View
                className={utils.bem('calendar__footer', {
                  safeAreaInsetBottom,
                })}
              >
                {showConfirm && (
                  <VanButton
                    round
                    block
                    type="danger"
                    color={color}
                    customClass="van-calendar__confirm"
                    disabled={computed.getButtonDisabled(
                      type,
                      currentDate,
                      minRange
                    )}
                    nativeType="text"
                    onClick={this.onConfirm}
                  >
                    {computed.getButtonDisabled(type, currentDate, minRange)
                      ? confirmDisabledText
                      : confirmText}
                  </VanButton>
                )}
              </View>
            </View>
          </VanPopup>
        ) : (
          <View className="van-calendar">
            <Header
              title={title}
              showTitle={showTitle}
              subtitle={subtitle}
              showSubtitle={showSubtitle}
              firstDayOfWeek={firstDayOfWeek}
              onClickSubtitle={this.onClickSubtitle}
              renderTitle={<Block>{this.props.renderTitle}</Block>}
            ></Header>
            <ScrollView
              className="van-calendar__body"
              scrollY
              scrollIntoView={scrollIntoView}
            >
              {computed.getMonths(minDate, maxDate).map((item, index) => {
                return (
                  <Month
                    key={item.index}
                    id={'month' + index}
                    className="month"
                    data-date={item}
                    date={item}
                    type={type}
                    color={color}
                    minDate={minDate}
                    maxDate={maxDate}
                    showMark={showMark}
                    formatter={formatter}
                    rowHeight={rowHeight}
                    currentDate={currentDate}
                    showSubtitle={showSubtitle}
                    allowSameDay={allowSameDay}
                    showMonthTitle={index !== 0 || !showSubtitle}
                    firstDayOfWeek={firstDayOfWeek}
                    onClick={this.onClickDay}
                  ></Month>
                )
              })}
            </ScrollView>
            <View
              className={utils.bem('calendar__footer', {
                safeAreaInsetBottom,
              })}
            >
              {this.props.renderFooter}
            </View>
            <View
              className={utils.bem('calendar__footer', {
                safeAreaInsetBottom,
              })}
            >
              {showConfirm && (
                <VanButton
                  round
                  block
                  type="danger"
                  color={color}
                  customClass="van-calendar__confirm"
                  disabled={computed.getButtonDisabled(
                    type,
                    currentDate,
                    minRange
                  )}
                  nativeType="text"
                  onClick={this.onConfirm}
                >
                  {computed.getButtonDisabled(type, currentDate, minRange)
                    ? confirmDisabledText
                    : confirmText}
                </VanButton>
              )}
            </View>
          </View>
        )}
        <VanToast id="van-toast"></VanToast>
      </Block>
    )
  }
}
export default _C
