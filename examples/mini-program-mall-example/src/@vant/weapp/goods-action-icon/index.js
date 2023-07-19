import { Block, Slot, Text } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import { VantComponent } from '../common/component.js'
import { button } from '../mixins/button.js'
import { link } from '../mixins/link.js'
import VanButton from '../button/index'
import VanIcon from '../icon/index'
import './index.scss'

@withWeapp(VantComponent({
  classes: ['icon-class', 'text-class', 'info-class'],
  mixins: [link, button],
  props: {
    text: String,
    dot: Boolean,
    info: String,
    icon: String,
    size: String,
    color: String,
    classPrefix: {
      type: String,
      value: 'van-icon',
    },
    disabled: Boolean,
    loading: Boolean,
  },
  methods: {
    onClick(event) {
      this.$emit('click', event.detail)
      this.jumpLink()
    },
  },
}))
class _C extends React.Component {
  render() {
    const {
      id,
      lang,
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
      icon,
      dot,
      info,
      size,
      color,
      classPrefix,
      text,
    } = this.data
    return (
      <VanButton
        square
        id={id}
        size="large"
        lang={lang}
        loading={loading}
        disabled={disabled}
        openType={openType}
        businessId={businessId}
        customClass="van-goods-action-icon"
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
        {icon ? (
          <VanIcon
            name={icon}
            dot={dot}
            info={info}
            size={size}
            color={color}
            classPrefix={classPrefix}
            className="van-goods-action-icon__icon"
            customClass="icon-class"
            infoClass="info-class"
          ></VanIcon>
        ) : (
          this.props.renderIcon
        )}
        <Text className="text-class">{text}</Text>
      </VanButton>
    )
  }
}
export default _C
