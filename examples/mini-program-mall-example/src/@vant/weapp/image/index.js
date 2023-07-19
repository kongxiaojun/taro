import { Block, View, Image, Slot } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import utils from '../wxs/utils.wxs.js'
import computed from './index.wxs.js'
import { VantComponent } from '../common/component.js'
import { button } from '../mixins/button.js'
import VanLoading from '../loading/index'
import VanIcon from '../icon/index'
import './index.scss'

@withWeapp(VantComponent({
  mixins: [button],
  classes: ['custom-class', 'loading-class', 'error-class', 'image-class'],
  props: {
    src: {
      type: String,
      observer() {
        this.setData({
          error: false,
          loading: true,
        })
      },
    },
    round: Boolean,
    width: null,
    height: null,
    radius: null,
    lazyLoad: Boolean,
    useErrorSlot: Boolean,
    useLoadingSlot: Boolean,
    showMenuByLongpress: Boolean,
    fit: {
      type: String,
      value: 'fill',
    },
    webp: {
      type: Boolean,
      value: false,
    },
    showError: {
      type: Boolean,
      value: true,
    },
    showLoading: {
      type: Boolean,
      value: true,
    },
  },
  data: {
    error: false,
    loading: true,
    viewStyle: '',
  },
  methods: {
    onLoad(event) {
      this.setData({
        loading: false,
      })
      this.$emit('load', event.detail)
    },
    onError(event) {
      this.setData({
        loading: false,
        error: true,
      })
      this.$emit('error', event.detail)
    },
    onClick(event) {
      this.$emit('click', event.detail)
    },
  },
}))
class _C extends React.Component {
  render() {
    const {
      width,
      height,
      radius,
      round,
      src,
      fit,
      lazyLoad,
      webp,
      showMenuByLongpress,
      error,
      useLoadingSlot,
      loading,
      showLoading,
      useErrorSlot,
      showError,
    } = this.data
    return (
      <View
        style={computed.rootStyle({
          width,
          height,
          radius,
        })}
        className={
          'custom-class ' +
          utils.bem('image', {
            round,
          })
        }
        onTap={this.onClick}
      >
        {!error && (
          <Image
            src={src}
            mode={computed.mode(fit)}
            lazyLoad={lazyLoad}
            webp={webp}
            className="image-class van-image__img"
            showMenuByLongpress={showMenuByLongpress}
            onLoad={this.onLoad}
            onError={this.onError}
          ></Image>
        )}
        {loading && showLoading && (
          <View className="loading-class van-image__loading">
            {useLoadingSlot ? (
              this.props.renderLoading
            ) : (
              <VanIcon
                name="photo"
                customClass="van-image__loading-icon"
              ></VanIcon>
            )}
          </View>
        )}
        {error && showError && (
          <View className="error-class van-image__error">
            {useErrorSlot ? (
              this.props.renderError
            ) : (
              <VanIcon
                name="photo-fail"
                customClass="van-image__error-icon"
              ></VanIcon>
            )}
          </View>
        )}
      </View>
    )
  }
}
export default _C
