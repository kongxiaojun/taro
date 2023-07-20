import { Block, View, Slot, Text } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import utils from '../wxs/utils.wxs.js'
import { VantComponent } from '../common/component.js'
import { button } from '../mixins/button.js'
import { GRAY, RED } from '../common/color.js'
import { toPromise } from '../common/utils.js'
import VanGoodsActionButton from '../goods-action-button/index'
import VanGoodsAction from '../goods-action/index'
import VanButton from '../button/index'
import VanPopup from '../popup/index'
import './index.scss'

@withWeapp(VantComponent({
  mixins: [button],
  props: {
    show: {
      type: Boolean,
      observer(show) {
        !show && this.stopLoading()
      },
    },
    title: String,
    message: String,
    theme: {
      type: String,
      value: 'default',
    },
    useSlot: Boolean,
    className: String,
    customStyle: String,
    asyncClose: Boolean,
    messageAlign: String,
    beforeClose: null,
    overlayStyle: String,
    useTitleSlot: Boolean,
    showCancelButton: Boolean,
    closeOnClickOverlay: Boolean,
    confirmButtonOpenType: String,
    width: null,
    zIndex: {
      type: Number,
      value: 2000,
    },
    confirmButtonText: {
      type: String,
      value: '确认',
    },
    cancelButtonText: {
      type: String,
      value: '取消',
    },
    confirmButtonColor: {
      type: String,
      value: RED,
    },
    cancelButtonColor: {
      type: String,
      value: GRAY,
    },
    showConfirmButton: {
      type: Boolean,
      value: true,
    },
    overlay: {
      type: Boolean,
      value: true,
    },
    transition: {
      type: String,
      value: 'scale',
    },
  },
  data: {
    loading: {
      confirm: false,
      cancel: false,
    },
    callback: () => {},
  },
  methods: {
    onConfirm() {
      this.handleAction('confirm')
    },
    onCancel() {
      this.handleAction('cancel')
    },
    onClickOverlay() {
      this.close('overlay')
    },
    close(action) {
      this.setData({
        show: false,
      })
      Taro.nextTick(() => {
        this.$emit('close', action)
        const { callback } = this.data
        if (callback) {
          callback(action, this)
        }
      })
    },
    stopLoading() {
      this.setData({
        loading: {
          confirm: false,
          cancel: false,
        },
      })
    },
    handleAction(action) {
      this.$emit(action, {
        dialog: this,
      })
      const { asyncClose, beforeClose } = this.data
      if (!asyncClose && !beforeClose) {
        this.close(action)
        return
      }
      this.setData({
        [`loading.${action}`]: true,
      })
      if (beforeClose) {
        toPromise(beforeClose(action)).then((value) => {
          if (value) {
            this.close(action)
          } else {
            this.stopLoading()
          }
        })
      }
    },
  },
}))
class _C extends React.Component {
  render() {
    const {
      show,
      zIndex,
      overlay,
      transition,
      theme,
      className,
      width,
      customStyle,
      overlayStyle,
      closeOnClickOverlay,
      message,
      useSlot,
      useTitleSlot,
      title,
      messageAlign,
      showCancelButton,
      loading,
      cancelButtonColor,
      cancelButtonText,
      showConfirmButton,
      confirmButtonColor,
      confirmButtonOpenType,
      lang,
      businessId,
      sessionFrom,
      sendMessageTitle,
      sendMessagePath,
      sendMessageImg,
      showMessageCard,
      appParameter,
      confirmButtonText,
    } = this.data
    return (
      <VanPopup
        show={show}
        zIndex={zIndex}
        overlay={overlay}
        transition={transition}
        customClass={
          'van-dialog van-dialog--' + theme + className + ' custom-class'
        }
        customStyle={{width: utils.addUnit(width), ...customStyle}}
        overlayStyle={overlayStyle}
        closeOnClickOverlay={closeOnClickOverlay}
        onClose={this.onClickOverlay}
      >
        {(title || useTitleSlot) && (
          <View
            className={utils.bem('dialog__header', {
              isolated: !(message || useSlot),
            })}
          >
            {useTitleSlot
              ? this.props.renderTitle
              : title && <Block>{title}</Block>}
          </View>
        )}
        {useSlot
          ? this.props.children
          : message && (
              <View
                className={utils.bem('dialog__message', [
                  theme,
                  messageAlign,
                  {
                    hasTitle: title,
                  },
                ])}
              >
                <Text className="van-dialog__message-text">{message}</Text>
              </View>
            )}
        {loading && theme === 'round-button' ? (
          <VanGoodsAction customClass="van-dialog__footer--round-button">
            {showCancelButton && (
              <VanGoodsActionButton
                size="large"
                loading={loading.cancel}
                className="van-dialog__button van-hairline--right"
                customClass="van-dialog__cancel"
                customStyle={{color: cancelButtonColor}}
                onClick={this.onCancel}
              >
                {cancelButtonText}
              </VanGoodsActionButton>
            )}
            {showConfirmButton && (
              <VanGoodsActionButton
                size="large"
                className="van-dialog__button"
                loading={loading.confirm}
                customClass="van-dialog__confirm"
                customStyle={{color: confirmButtonColor}}
                openType={confirmButtonOpenType}
                lang={lang}
                businessId={businessId}
                sessionFrom={sessionFrom}
                sendMessageTitle={sendMessageTitle}
                sendMessagePath={sendMessagePath}
                sendMessageImg={sendMessageImg}
                showMessageCard={showMessageCard}
                appParameter={appParameter}
                onClick={this.onConfirm}
                onGetuserinfo={this.onGetUserInfo}
                onContact={this.onContact}
                onGetphonenumber={this.onGetPhoneNumber}
                onError={this.onError}
                onLaunchapp={this.onLaunchApp}
                onOpenSetting={this.onOpenSetting}
              >
                {confirmButtonText}
              </VanGoodsActionButton>
            )}
          </VanGoodsAction>
        ) : loading && (
          (showCancelButton || showConfirmButton) && (
            <View className="van-hairline--top van-dialog__footer">
              {showCancelButton && (
                <VanButton
                  size="large"
                  loading={loading.cancel}
                  className="van-dialog__button van-hairline--right"
                  customClass="van-dialog__cancel"
                  customStyle={{color: cancelButtonColor}}
                  onClick={this.onCancel}
                >
                  {cancelButtonText}
                </VanButton>
              )}
              {showConfirmButton && (
                <VanButton
                  size="large"
                  className="van-dialog__button"
                  loading={loading.confirm}
                  customClass="van-dialog__confirm"
                  customStyle={{color: confirmButtonColor}}
                  openType={confirmButtonOpenType}
                  lang={lang}
                  businessId={businessId}
                  sessionFrom={sessionFrom}
                  sendMessageTitle={sendMessageTitle}
                  sendMessagePath={sendMessagePath}
                  sendMessageImg={sendMessageImg}
                  showMessageCard={showMessageCard}
                  appParameter={appParameter}
                  onClick={this.onConfirm}
                  onGetuserinfo={this.onGetUserInfo}
                  onContact={this.onContact}
                  onGetphonenumber={this.onGetPhoneNumber}
                  onError={this.onError}
                  onLaunchapp={this.onLaunchApp}
                  onOpenSetting={this.onOpenSetting}
                >
                  {confirmButtonText}
                </VanButton>
              )}
            </View>
          )
        )}
      </VanPopup>
    )
  }
}
export default _C
