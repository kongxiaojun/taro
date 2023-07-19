import { Block, View, Slot } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import utils from '../wxs/utils.wxs.js'
import computed from './index.wxs.js'
import { VantComponent } from '../common/component.js'
import { transition } from '../mixins/transition.js'
import VanOverlay from '../overlay/index'
import VanIcon from '../icon/index'
import './index.scss'

@withWeapp(VantComponent({
  classes: [
    'enter-class',
    'enter-active-class',
    'enter-to-class',
    'leave-class',
    'leave-active-class',
    'leave-to-class',
    'close-icon-class',
  ],
  mixins: [transition(false)],
  props: {
    round: Boolean,
    closeable: Boolean,
    customStyle: String,
    overlayStyle: String,
    transition: {
      type: String,
      observer: 'observeClass',
    },
    zIndex: {
      type: Number,
      value: 100,
    },
    overlay: {
      type: Boolean,
      value: true,
    },
    closeIcon: {
      type: String,
      value: 'cross',
    },
    closeIconPosition: {
      type: String,
      value: 'top-right',
    },
    closeOnClickOverlay: {
      type: Boolean,
      value: true,
    },
    position: {
      type: String,
      value: 'center',
      observer: 'observeClass',
    },
    safeAreaInsetBottom: {
      type: Boolean,
      value: true,
    },
    safeAreaInsetTop: {
      type: Boolean,
      value: false,
    },
    safeAreaTabBar: {
      type: Boolean,
      value: false,
    },
    lockScroll: {
      type: Boolean,
      value: true,
    },
    rootPortal: {
      type: Boolean,
      value: false,
    },
  },
  created() {
    this.observeClass()
  },
  methods: {
    onClickCloseIcon() {
      this.$emit('close')
    },
    onClickOverlay() {
      this.$emit('click-overlay')
      if (this.data.closeOnClickOverlay) {
        this.$emit('close')
      }
    },
    observeClass() {
      const { transition, position, duration } = this.data
      const updateData = {
        name: transition || position,
      }
      if (transition === 'none') {
        updateData.duration = 0
        this.originDuration = duration
      } else if (this.originDuration != null) {
        updateData.duration = this.originDuration
      }
      this.setData(updateData)
    },
  },
}))
class _C extends React.Component {
  render() {
    const {
      show,
      zIndex,
      overlayStyle,
      duration,
      lockScroll,
      rootPortal,
      overlay,
      classes,
      position,
      round,
      safeAreaInsetBottom,
      safeAreaInsetTop,
      safeAreaTabBar,
      currentDuration,
      display,
      customStyle,
      closeable,
      closeIcon,
      closeIconPosition,
    } = this.data
    return (
      <Block>
        {overlay && (
          <VanOverlay
            show={show}
            zIndex={zIndex}
            customStyle={overlayStyle}
            duration={duration}
            onClick={this.onClickOverlay}
            lockScroll={lockScroll}
            rootPortal={rootPortal}
          ></VanOverlay>
        )}
        {rootPortal ? (
          <RootPortal>
           {' '}
            <View
              className={
                'custom-class ' +
                classes +
                ' ' +
                utils.bem('popup', [
                  position,
                  {
                    round,
                    safe: safeAreaInsetBottom,
                    safeTop: safeAreaInsetTop,
                    safeTabBar: safeAreaTabBar,
                  },
                ])
              }
              style={computed.popupStyle({
                zIndex,
                currentDuration,
                display,
                customStyle,
              })}
              onTransitionend={this.onTransitionEnd}
            >
              {this.props.children}
              {closeable && (
                <VanIcon
                  name={closeIcon}
                  className={
                    'close-icon-class van-popup__close-icon van-popup__close-icon--' +
                    closeIconPosition
                  }
                  onTap={this.onClickCloseIcon}
                ></VanIcon>
              )}
            </View>
          </RootPortal>
        ) : (
            <View
              className={
                'custom-class ' +
                classes +
                ' ' +
                utils.bem('popup', [
                  position,
                  {
                    round,
                    safe: safeAreaInsetBottom,
                    safeTop: safeAreaInsetTop,
                    safeTabBar: safeAreaTabBar,
                  },
                ])
              }
              style={computed.popupStyle({
                zIndex,
                currentDuration,
                display,
                customStyle,
              })}
              onTransitionend={this.onTransitionEnd}
            >
              {this.props.children}
              {closeable && (
                <VanIcon
                  name={closeIcon}
                  className={
                    'close-icon-class van-popup__close-icon van-popup__close-icon--' +
                    closeIconPosition
                  }
                  onTap={this.onClickCloseIcon}
                ></VanIcon>
              )}
            </View>
        )}
      </Block>
    )
  }
}
export default _C
