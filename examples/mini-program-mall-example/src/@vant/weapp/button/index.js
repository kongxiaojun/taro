import { Block, Button, View, Slot } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import utils from '../wxs/utils.wxs.js'
import computed from './index.wxs.js'
import { VantComponent } from '../common/component.js'
import { button } from '../mixins/button.js'
import { canIUseFormFieldButton } from '../common/version.js'
import VanLoading from '../loading/index'
import VanIcon from '../icon/index'
import './index.scss'
const mixins = [button]
if (canIUseFormFieldButton()) {
  mixins.push('wx://form-field-button')
}

@withWeapp(VantComponent({
  mixins,
  classes: ['hover-class', 'loading-class'],
  data: {
    baseStyle: '',
  },
  props: {
    formType: String,
    icon: String,
    classPrefix: {
      type: String,
      value: 'van-icon',
    },
    plain: Boolean,
    block: Boolean,
    round: Boolean,
    square: Boolean,
    loading: Boolean,
    hairline: Boolean,
    disabled: Boolean,
    loadingText: String,
    customStyle: String,
    loadingType: {
      type: String,
      value: 'circular',
    },
    type: {
      type: String,
      value: 'default',
    },
    dataset: null,
    size: {
      type: String,
      value: 'normal',
    },
    loadingSize: {
      type: String,
      value: '20px',
    },
    color: String,
    className: {
      type: String,
      value: '',
    }
  },
  methods: {
    onClick(event) {
      // this.$emit('click', event)
      // const { canIUseGetUserProfile, openType, getUserProfileDesc, lang } =
      //     this.data
      // if (openType === 'getUserInfo' && canIUseGetUserProfile) {
      //   Taro.getUserProfile({
      //     desc: getUserProfileDesc || '  ',
      //     lang: lang || 'en',
      //     complete: (userProfile) => {
      //       this.$emit('getuserinfo', userProfile)
      //     },
      //   })
      // }
    },
  },
}))
class _C extends React.Component {

  render() {

    console.log("VanButton render", this.props)

    const {
      id,
      dataset,
      type,
      size,
      block,
      round,
      plain,
      square,
      loading,
      disabled,
      hairline,
      lang,
      formType,
      color,
      customStyle,
      canIUseGetUserProfile,
      openType,
      businessId,
      sessionFrom,
      sendMessageTitle,
      sendMessagePath,
      sendMessageImg,
      showMessageCard,
      appParameter,
      ariaLabel,
      loadingSize,
      loadingType,
      loadingText,
      icon,
      classPrefix,
      className,
      customClass
    } = this.data
    return (
      <Button
        id={id}
        data-detail={dataset}
        className={
          className + ' ' +
          customClass + ' ' +
          utils.bem('button', [
            type,
            size,
            {
              block,
              round,
              plain,
              square,
              loading,
              disabled,
              hairline,
              unclickable: disabled || loading,
            },
          ]) +
          ' ' +
          (hairline ? 'van-hairline--surround' : '')
        }
        hoverClass={disabled || loading ? '' : 'van-button--active hover-class'}
        lang={lang}
        formType={formType}
        style={computed.rootStyle({
          plain,
          color,
          customStyle,
        })}
        openType={
          disabled ||
          loading ||
          (canIUseGetUserProfile && openType === 'getUserInfo')
            ? ''
            : openType
        }
        businessId={businessId}
        sessionFrom={sessionFrom}
        sendMessageTitle={sendMessageTitle}
        sendMessagePath={sendMessagePath}
        sendMessageImg={sendMessageImg}
        showMessageCard={showMessageCard}
        appParameter={appParameter}
        ariaLabel={ariaLabel}
        onClick={disabled || loading ? '' : this.props.onClick}
        onGetuserinfo={this.onGetUserInfo}
        onContact={this.onContact}
        onGetphonenumber={this.onGetPhoneNumber}
        onError={this.onError}
        onLaunchapp={this.onLaunchApp}
        onOpenSetting={this.onOpenSetting}
        onChooseAvatar={this.onChooseAvatar}
      >
        {loading ? (
          <Block>
            <VanLoading
              customClass="loading-class"
              size={loadingSize}
              type={loadingType}
              color={computed.loadingColor({
                type,
                color,
                plain,
              })}
            ></VanLoading>
            {loadingText && (
              <View className="van-button__loading-text">{loadingText}</View>
            )}
          </Block>
        ) : (
          <Block>
            {icon && (
              <VanIcon
                size="1.2em"
                name={icon}
                classPrefix={classPrefix}
                className="van-button__icon"
                customStyle="line-height: inherit;"
              ></VanIcon>
            )}
            {this.props.children}
          </Block>
        )}
      </Button>
    )
  }
}
export default _C
