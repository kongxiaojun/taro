import { Block, View, Image, LivePusher, LivePlayer } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
export default class AudioTemplateTmpl extends React.Component {
  render() {
    const {
      data: { streamList, pusherConfig, item, soundMode },
    } = this.props
    return (
      <Block>
        <View className="audio-place-holder">
          <View className={'TRTCCalling-call-audio-img' + streamList.length}>
            <Image src="./static/avatar1_100.png" className="img-place-holder">
              <View className="audio-volume">
                {pusherConfig.volume > 10 && (
                  <Image
                    className="image"
                    src="./static/micro-open.png"
                  ></Image>
                )}
              </View>
            </Image>
          </View>
          {streamList.map((item, index) => {
            return (
              <View
                className={'TRTCCalling-call-audio-img' + streamList.length}
                key={item.userID}
              >
                <Image
                  src="./static/avatar2_100.png"
                  className="img-place-holder"
                >
                  <View className="audio-volume">
                    {item.volume > 10 && (
                      <Image
                        className="image"
                        src="./static/micro-open.png"
                      ></Image>
                    )}
                  </View>
                </Image>
              </View>
            )
          })}
          <LivePusher
            className="pusher-audio"
            id="pusher"
            mode="RTC"
            autopush={true}
            url={pusherConfig.pushUrl}
            audioVolumeType="voicecall"
            enableCamera={false}
            enableMic={true}
            onStateChange={this._pusherStateChangeHandler}
            onAudiovolumenotify={this._pusherAudioVolumeNotify}
          ></LivePusher>
          {streamList.map((item, index) => {
            return (
              <View
                key={item.streamID}
                className="view-container player-container player-audio"
              >
                <LivePlayer
                  className="player-audio"
                  id={item.streamID}
                  data-userid={item.userID}
                  data-streamid={item.streamID}
                  data-streamtype={item.streamType}
                  src={item.src}
                  mode="RTC"
                  objectFit="fillCrop"
                  autoplay={true}
                  muteVideo={true}
                  muteAudio={item.muteAudio}
                  minCache="0.2"
                  maxCache="0.8"
                  soundMode={soundMode}
                  autoPauseIfNavigate={item.autoPauseIfNavigate}
                  autoPauseIfOpenNative={item.autoPauseIfOpenNative}
                  onStateChange={this._playerStateChange}
                  onAudiovolumenotify={this._playerAudioVolumeNotify}
                ></LivePlayer>
              </View>
            )
          })}
        </View>
        <View className="handle-btns">
          <View className="btn-normal" onClick={this._toggleAudio}>
            <Image
              className="btn-image"
              src={
                pusherConfig.enableMic
                  ? './static/audio-true.png'
                  : './static/audio-false.png'
              }
            ></Image>
          </View>
          <View className="btn-hangup" onClick={this._hangUp}>
            <Image className="btn-image" src="./static/hangup.png"></Image>
          </View>
          <View className="btn-normal" onClick={this._toggleSoundMode}>
            <Image
              className="btn-image"
              src={
                soundMode === 'ear'
                  ? './static/phone.png'
                  : './static/speaker-true.png'
              }
            ></Image>
          </View>
        </View>
      </Block>
    )
  }
}
