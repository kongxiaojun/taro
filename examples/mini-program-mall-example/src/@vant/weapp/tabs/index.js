import { Block, View, Slot, ScrollView } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import utils from '../wxs/utils.wxs.js'
import computed from './index.wxs.js'
import { VantComponent } from '../common/component.js'
import { touch } from '../mixins/touch.js'
import {
  getAllRect,
  getRect,
  groupSetData,
  nextTick,
  requestAnimationFrame,
} from '../common/utils.js'
import { isDef } from '../common/validator.js'
import { useChildren } from '../common/relation.js'
import VanSticky from '../sticky/index'
import VanInfo from '../info/index'
import './index.scss'

@withWeapp(VantComponent({
  mixins: [touch],
  classes: [
    'nav-class',
    'tab-class',
    'tab-active-class',
    'line-class',
    'wrap-class',
  ],
  relation: useChildren('tab', function () {
    this.updateTabs()
  }),
  props: {
    sticky: Boolean,
    border: Boolean,
    swipeable: Boolean,
    titleActiveColor: String,
    titleInactiveColor: String,
    color: String,
    animated: {
      type: Boolean,
      observer() {
        this.children.forEach((child, index) =>
            child.updateRender(index === this.data.currentIndex, this)
        )
      },
    },
    lineWidth: {
      type: null,
      value: 40,
      observer: 'resize',
    },
    lineHeight: {
      type: null,
      value: -1,
    },
    active: {
      type: null,
      value: 0,
      observer(name) {
        if (name !== this.getCurrentName()) {
          this.setCurrentIndexByName(name)
        }
      },
    },
    type: {
      type: String,
      value: 'line',
    },
    ellipsis: {
      type: Boolean,
      value: true,
    },
    duration: {
      type: Number,
      value: 0.3,
    },
    zIndex: {
      type: Number,
      value: 1,
    },
    swipeThreshold: {
      type: Number,
      value: 5,
      observer(value) {
        this.setData({
          scrollable: this.children.length > value || !this.data.ellipsis,
        })
      },
    },
    offsetTop: {
      type: Number,
      value: 0,
    },
    lazyRender: {
      type: Boolean,
      value: true,
    },
    useBeforeChange: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    tabs: [],
    scrollLeft: 0,
    scrollable: false,
    currentIndex: 0,
    container: null,
    skipTransition: true,
    scrollWithAnimation: false,
    lineOffsetLeft: 0,
    inited: false,
  },
  mounted() {
    requestAnimationFrame(() => {
      this.swiping = true
      this.setData({
        container: () => this.createSelectorQuery().select('.van-tabs'),
      })
      this.resize()
      this.scrollIntoView()
    })
  },
  methods: {
    updateTabs() {
      const { children = [], data } = this
      this.setData({
        tabs: children.map((child) => child.data),
        scrollable:
            this.children.length > data.swipeThreshold || !data.ellipsis,
      })
      this.setCurrentIndexByName(data.active || this.getCurrentName())
    },
    trigger(eventName, child) {
      const { currentIndex } = this.data
      const data = this.getChildData(currentIndex, child)
      if (!isDef(data)) {
        return
      }
      this.$emit(eventName, data)
    },
    onTap(event) {
      const { index } = event.currentTarget.dataset
      const child = this.children[index]
      if (child.data.disabled) {
        this.trigger('disabled', child)
        return
      }
      this.onBeforeChange(index).then(() => {
        this.setCurrentIndex(index)
        nextTick(() => {
          this.trigger('click')
        })
      })
    },
    // correct the index of active tab
    setCurrentIndexByName(name) {
      const { children = [] } = this
      const matched = children.filter(
          (child) => child.getComputedName() === name
      )
      if (matched.length) {
        this.setCurrentIndex(matched[0].index)
      }
    },
    setCurrentIndex(currentIndex) {
      const { data, children = [] } = this
      if (
          !isDef(currentIndex) ||
          currentIndex >= children.length ||
          currentIndex < 0
      ) {
        return
      }
      groupSetData(this, () => {
        children.forEach((item, index) => {
          const active = index === currentIndex
          if (active !== item.data.active || !item.inited) {
            item.updateRender(active, this)
          }
        })
      })
      if (currentIndex === data.currentIndex) {
        if (!data.inited) {
          this.resize()
        }
        return
      }
      const shouldEmitChange = data.currentIndex !== null
      this.setData({
        currentIndex,
      })
      requestAnimationFrame(() => {
        this.resize()
        this.scrollIntoView()
      })
      nextTick(() => {
        this.trigger('input')
        if (shouldEmitChange) {
          this.trigger('change')
        }
      })
    },
    getCurrentName() {
      const activeTab = this.children[this.data.currentIndex]
      if (activeTab) {
        return activeTab.getComputedName()
      }
    },
    resize() {
      if (this.data.type !== 'line') {
        return
      }
      const { currentIndex, ellipsis, skipTransition } = this.data
      Promise.all([
        getAllRect(this, '.van-tab'),
        getRect(this, '.van-tabs__line'),
      ]).then(([rects = [], lineRect]) => {
        const rect = rects[currentIndex]
        if (rect == null) {
          return
        }
        let lineOffsetLeft = rects
            .slice(0, currentIndex)
            .reduce((prev, curr) => prev + curr.width, 0)
        lineOffsetLeft += (rect.width - lineRect.width) / 2 + (ellipsis ? 0 : 8)
        this.setData({
          lineOffsetLeft,
          inited: true,
        })
        this.swiping = true
        if (skipTransition) {
          // waiting transition end
          setTimeout(() => {
            this.setData({
              skipTransition: false,
            })
          }, this.data.duration)
        }
      })
    },
    // scroll active tab into view
    scrollIntoView() {
      const { currentIndex, scrollable, scrollWithAnimation } = this.data
      if (!scrollable) {
        return
      }
      Promise.all([
        getAllRect(this, '.van-tab'),
        getRect(this, '.van-tabs__nav'),
      ]).then(([tabRects, navRect]) => {
        const tabRect = tabRects[currentIndex]
        const offsetLeft = tabRects
            .slice(0, currentIndex)
            .reduce((prev, curr) => prev + curr.width, 0)
        this.setData({
          scrollLeft: offsetLeft - (navRect.width - tabRect.width) / 2,
        })
        if (!scrollWithAnimation) {
          nextTick(() => {
            this.setData({
              scrollWithAnimation: true,
            })
          })
        }
      })
    },
    onTouchScroll(event) {
      this.$emit('scroll', event.detail)
    },
    onTouchStart(event) {
      if (!this.data.swipeable) return
      this.swiping = true
      this.touchStart(event)
    },
    onTouchMove(event) {
      if (!this.data.swipeable || !this.swiping) return
      this.touchMove(event)
    },
    // watch swipe touch end
    onTouchEnd() {
      if (!this.data.swipeable || !this.swiping) return
      const { direction, deltaX, offsetX } = this
      const minSwipeDistance = 50
      if (direction === 'horizontal' && offsetX >= minSwipeDistance) {
        const index = this.getAvaiableTab(deltaX)
        if (index !== -1) {
          this.onBeforeChange(index).then(() => this.setCurrentIndex(index))
        }
      }
      this.swiping = false
    },
    getAvaiableTab(direction) {
      const { tabs, currentIndex } = this.data
      const step = direction > 0 ? -1 : 1
      for (
          let i = step;
          currentIndex + i < tabs.length && currentIndex + i >= 0;
          i += step
      ) {
        const index = currentIndex + i
        if (
            index >= 0 &&
            index < tabs.length &&
            tabs[index] &&
            !tabs[index].disabled
        ) {
          return index
        }
      }
      return -1
    },
    onBeforeChange(index) {
      const { useBeforeChange } = this.data
      if (!useBeforeChange) {
        return Promise.resolve()
      }
      return new Promise((resolve, reject) => {
        this.$emit(
            'before-change',
            Object.assign(Object.assign({}, this.getChildData(index)), {
              callback: (status) => (status ? resolve() : reject()),
            })
        )
      })
    },
    getChildData(index, child) {
      const currentChild = child || this.children[index]
      if (!isDef(currentChild)) {
        return
      }
      return {
        index: currentChild.index,
        name: currentChild.getComputedName(),
        title: currentChild.data.title,
      }
    },
  },
}))
class _C extends React.Component {
  render() {
    const {
      sticky,
      zIndex,
      offsetTop,
      container,
      type,
      scrollable,
      border,
      scrollWithAnimation,
      scrollLeft,
      color,
      ellipsis,
      lineOffsetLeft,
      lineHeight,
      skipTransition,
      duration,
      lineWidth,
      inited,
      currentIndex,
      titleActiveColor,
      titleInactiveColor,
      swipeThreshold,
      tabs,
      animated,
    } = this.data
    return (
      <View className={utils.bem('tabs')} style={{width: '100%'}}>
        <VanSticky
          disabled={!sticky}
          zIndex={zIndex}
          offsetTop={offsetTop}
          container={container}
          onScroll={this.onTouchScroll}
        >
          <View
            className={
              utils.bem('tabs--') +
              type +
              ' ' +
              utils.bem('tabs__wrap', {
                scrollable,
              }) +
              ' ' +
              (type === 'line' && border ? 'van-hairline--top-bottom' : '') +
              ' wrap-class'
            }
          >
            {this.props.renderNavleft}
            <ScrollView
              scrollX={scrollable}
              scrollWithAnimation={scrollWithAnimation}
              scrollLeft={scrollLeft}
              className={utils.bem('tabs__scroll', [type])}
              style={color ? 'border-color: ' + color : ''}
            >
              <View
                className={
                  utils.bem('tabs__nav', [
                    type,
                    {
                      complete: !ellipsis,
                    },
                  ]) + ' nav-class'
                }
                style={computed.navStyle(color, type)}
              >
                {type === 'line' && (
                  <View
                    className="van-tabs__line"
                    style={computed.lineStyle({
                      color,
                      lineOffsetLeft,
                      lineHeight,
                      skipTransition,
                      duration,
                      lineWidth,
                      inited,
                    })}
                  ></View>
                )}
                {tabs && tabs.map((item, index) => {
                  return (
                    <View
                      key={item.index}
                      data-index={index}
                      className={
                        computed.tabClass(index === currentIndex, ellipsis) +
                        ' ' +
                        utils.bem('tab', {
                          active: index === currentIndex,
                          disabled: item.disabled,
                          complete: !ellipsis,
                        })
                      }
                      style={computed.tabStyle({
                        active: index === currentIndex,
                        ellipsis,
                        color,
                        type,
                        disabled: item.disabled,
                        titleActiveColor,
                        titleInactiveColor,
                        swipeThreshold,
                        scrollable,
                      })}
                      onTap={this.onTap}
                    >
                      <View
                        className={ellipsis ? 'van-ellipsis' : ''}
                        style={item.titleStyle}
                      >
                        {item.title}
                        {(item.info || item.dot) && (
                          <VanInfo
                            info={item.info}
                            dot={item.dot}
                            customClass="van-tab__title__info"
                          ></VanInfo>
                        )}
                      </View>
                    </View>
                  )
                })}
              </View>
            </ScrollView>
            {this.props.renderNavright}
          </View>
        </VanSticky>
        <View
          className="van-tabs__content"
          onTouchstart={this.onTouchStart}
          onTouchmove={this.onTouchMove}
          onTouchend={this.onTouchEnd}
          onTouchcancel={this.onTouchEnd}
        >
          <View
            className={
              utils.bem('tabs__track', [
                {
                  animated,
                },
              ]) + ' van-tabs__track'
            }
            style={computed.trackStyle({
              duration,
              currentIndex,
              animated,
            })}
          >
            {this.props.children}
          </View>
        </View>
      </View>
    )
  }
}
export default _C
