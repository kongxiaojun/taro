import { Block, View, Slot, Navigator } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import utils from '../wxs/utils.wxs.js'
import computed from './index.wxs.js'
import { VantComponent } from '../common/component.js'
import { getRect, requestAnimationFrame } from '../common/utils.js'
import VanIcon from '../icon/index'
import './index.scss'

@withWeapp(VantComponent({
  props: {
    text: {
      type: String,
      value: '',
      observer: 'init',
    },
    mode: {
      type: String,
      value: '',
    },
    url: {
      type: String,
      value: '',
    },
    openType: {
      type: String,
      value: 'navigate',
    },
    delay: {
      type: Number,
      value: 1,
    },
    speed: {
      type: Number,
      value: 60,
      observer: 'init',
    },
    scrollable: null,
    leftIcon: {
      type: String,
      value: '',
    },
    color: String,
    backgroundColor: String,
    background: String,
    wrapable: Boolean,
  },
  data: {
    show: true,
  },
  created() {
    this.resetAnimation = Taro.createAnimation({
      duration: 0,
      timingFunction: 'linear',
    })
  },
  destroyed() {
    this.timer && clearTimeout(this.timer)
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      requestAnimationFrame(() => {
        Promise.all([
          getRect(this, '.van-notice-bar__content'),
          getRect(this, '.van-notice-bar__wrap'),
        ]).then((rects) => {
          const [contentRect, wrapRect] = rects
          const { speed, scrollable, delay } = this.data
          if (
              contentRect == null ||
              wrapRect == null ||
              !contentRect.width ||
              !wrapRect.width ||
              scrollable === false
          ) {
            return
          }
          if (scrollable || wrapRect.width < contentRect.width) {
            const duration =
                ((wrapRect.width + contentRect.width) / speed) * 1000
            this.wrapWidth = wrapRect.width
            this.contentWidth = contentRect.width
            this.duration = duration
            this.animation = Taro.createAnimation({
              duration,
              timingFunction: 'linear',
              delay,
            })
            this.scroll(true)
          }
        })
      })
    },
    scroll(isInit = false) {
      this.timer && clearTimeout(this.timer)
      this.timer = null
      this.setData({
        animationData: this.resetAnimation
            .translateX(isInit ? 0 : this.wrapWidth)
            .step()
            .export(),
      })
      requestAnimationFrame(() => {
        this.setData({
          animationData: this.animation
              .translateX(-this.contentWidth)
              .step()
              .export(),
        })
      })
      this.timer = setTimeout(() => {
        this.scroll()
      }, this.duration)
    },
    onClickIcon(event) {
      if (this.data.mode === 'closeable') {
        this.timer && clearTimeout(this.timer)
        this.timer = null
        this.setData({
          show: false,
        })
        this.$emit('close', event.detail)
      }
    },
    onClick(event) {
      this.$emit('click', event)
    },
  },
}))
class _C extends React.Component {
  render() {
    const {
      mode,
      wrapable,
      color,
      backgroundColor,
      background,
      leftIcon,
      scrollable,
      animationData,
      text,
      url,
      openType,
      show,
    } = this.data
    return (
      show && (
        <View
          className={
            'custom-class ' +
            utils.bem('notice-bar', {
              withicon: mode,
              wrapable,
            })
          }
          style={computed.rootStyle({
            color,
            backgroundColor,
            background,
          })}
          onTap={this.onClick}
        >
          {leftIcon ? (
            <VanIcon
              name={leftIcon}
              className="van-notice-bar__left-icon"
            ></VanIcon>
          ) : (
            this.props.renderLefticon
          )}
          <View className="van-notice-bar__wrap">
            <View
              className={
                'van-notice-bar__content ' +
                (scrollable === false && !wrapable ? 'van-ellipsis' : '')
              }
              animation={animationData}
            >
              {text}
              {!text && this.props.children}
            </View>
          </View>
          {mode === 'closeable' ? (
            <VanIcon
              className="van-notice-bar__right-icon"
              name="cross"
              onTap={this.privateStopNoop.bind(this, this.onClickIcon)}
            ></VanIcon>
          ) : mode === 'link' ? (
            <Navigator url={url} openType={openType}>
              <VanIcon
                className="van-notice-bar__right-icon"
                name="arrow"
              ></VanIcon>
            </Navigator>
          ) : (
            this.props.renderRighticon
          )}
        </View>
      )
    )
  }
}
export default _C
