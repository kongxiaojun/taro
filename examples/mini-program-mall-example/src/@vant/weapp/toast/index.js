import { Block, View, Text, RichText, Slot } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import { VantComponent } from '../common/component.js'
import VanTransition from '../transition/index'
import VanOverlay from '../overlay/index'
import VanLoading from '../loading/index'
import VanIcon from '../icon/index'
import './index.scss'

@withWeapp(VantComponent({
  props: {
    show: Boolean,
    mask: Boolean,
    message: String,
    forbidClick: Boolean,
    zIndex: {
      type: Number,
      value: 1000,
    },
    type: {
      type: String,
      value: 'text',
    },
    loadingType: {
      type: String,
      value: 'circular',
    },
    position: {
      type: String,
      value: 'middle',
    },
  },
  methods: {
    // for prevent touchmove
    noop() {},
  },
}))
class _C extends React.Component {
  render() {
    const {
      show,
      zIndex,
      mask,
      forbidClick,
      type,
      position,
      message,
      loadingType,
    } = this.data
    return (
      <Block>
        {(mask || forbidClick) && (
          <VanOverlay
            show={show}
            zIndex={zIndex}
            customStyle={mask ? '' : 'background-color: transparent;'}
          ></VanOverlay>
        )}
        <VanTransition
          show={show}
          customStyle={'zIndex: ' + zIndex}
          customClass="van-toast__container"
        >
          <View
            className={
              'van-toast van-toast--' +
              (type === 'text' || type === 'html' ? 'text' : 'icon') +
              ' van-toast--' +
              position
            }
            onTouchmove={this.privateStopNoop.bind(this, this.noop)}
          >
            {type === 'text' ? (
              <Text>{message}</Text>
            ) : type === 'html' ? (
              <RichText nodes={message}></RichText>
            ) : (
              <Block>
                {type === 'loading' ? (
                  <VanLoading
                    color="white"
                    type={loadingType}
                    customClass="van-toast__loading"
                  ></VanLoading>
                ) : (
                  <VanIcon className="van-toast__icon" name={type}></VanIcon>
                )}
                {message && <Text className="van-toast__text">{message}</Text>}
              </Block>
            )}
            {/*  html only  */}
            {/*  with icon  */}
            {this.props.children}
          </View>
        </VanTransition>
      </Block>
    )
  }
}
export default _C
