import { Block, Slot } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import utils from '../wxs/utils.wxs.js'
import { VantComponent } from '../common/component.js'
import { useParent } from '../common/relation.js'
import { button } from '../mixins/button.js'
import { link } from '../mixins/link.js'
import VanButton from '../button/index'
import './index.scss'

@withWeapp(VantComponent({
  mixins: [link, button],
  relation: useParent('goods-action'),
  props: {
    text: String,
    color: String,
    size: {
      type: String,
      value: 'normal',
    },
    loading: Boolean,
    disabled: Boolean,
    plain: Boolean,
    type: {
      type: String,
      value: 'danger',
    },
  },
  methods: {
    onClick(event) {
      this.$emit('click', event.detail)
      this.jumpLink()
    },
    updateStyle() {
      if (this.parent == null) {
        return
      }
      const { index } = this
      const { children = [] } = this.parent
      this.setData({
        isFirst: index === 0,
        isLast: index === children.length - 1,
      })
    },
  },
}))
class _C extends React.Component {
  render() {
    const {
      id,
      lang,
      type,
      size,
      color,
      plain,
      loading,
      disabled,
      openType,
      businessId,
      sessionFrom,
      appParameter,
      sendMessageImg,
      sendMessagePath,
      showMessageCard,
      sendMessageTitle,
      text,
    } = this.data

    const {isFirst,
      isLast} = this.props

    return (
      <VanButton
        id={id}
        lang={lang}
        type={type}
        size={size}
        color={color}
        plain={plain}
        loading={loading}
        disabled={disabled}
        openType={openType}
        className={utils.bem('goods-action-button', [
          type,
          {
            first: isFirst,
            last: isLast,
            plain: plain,
          },
        ])}
        customClass="van-goods-action-button__inner"
        businessId={businessId}
        sessionFrom={sessionFrom}
        appParameter={appParameter}
        sendMessageImg={sendMessageImg}
        sendMessagePath={sendMessagePath}
        showMessageCard={showMessageCard}
        sendMessageTitle={sendMessageTitle}
        onClick={this.onClick}
        onError={this.onError}
        onContact={this.onContact}
        onOpenSetting={this.onOpenSetting}
        onGetuserinfo={this.onGetUserInfo}
        onGetphonenumber={this.onGetPhoneNumber}
        onLaunchapp={this.onLaunchApp}
      >
        {text}
        {this.props.children}
      </VanButton>
    )
  }
}
export default _C
