import {Block, RootPortal, Slot} from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import { VantComponent } from '../common/component.js'
import VanTransition from '../transition/index'
import './index.scss'

@withWeapp(VantComponent({
  props: {
    show: Boolean,
    customStyle: String,
    duration: 300,
    zIndex: 100,
    lockScroll: true,
    rootPortal: false,
  },
  methods: {
    // for prevent touchmove
    noop() {},
  },
}))
class _C extends React.Component {
  render() {
    const { rootPortal, show, zIndex, customStyle, duration, lockScroll, customClass } =
      this.data
    return rootPortal ? (
      <RootPortal>
        <VanTransition
          show={show}
          customClass={"van-overlay " + customClass}
          customStyle={{zIndex: + zIndex, ...customStyle}}
          duration={duration}
          onClick={this.data.onClick}
          onTouchmove={lockScroll ? 'noop' : ''}
        >
          {this.props.children}
        </VanTransition>
      </RootPortal>
    ) : (
      <VanTransition
        show={show}
        classes={"van-overlay " + customClass}
        customStyle={{zIndex: + zIndex, ...customStyle}}
        duration={duration}
        onClick={this.data.onClick}
        onTouchmove={lockScroll ? 'noop' : ''}
      >
        {this.props.children}
      </VanTransition>
    )
  }
}
export default _C
