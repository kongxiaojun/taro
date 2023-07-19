import { Block, View, Image, LivePusher, LivePlayer } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
export default class VideoTemplateTmpl extends React.Component {
  render() {
    const {
      data: { pusherConfig, streamList, item, soundMode },
    } = this.props
    return (
      <Block>
        <LivePusher
          className="pusher-video"
          id="pusher"
          autopush={true}
          url={pusherConfig.pushUrl}
          enableCamera={pusherConfig.enableCamera}
          audioVolumeType="voicecall"
          beauty="5"
          enableMic={true}
          onStateChange={this._pusherStateChangeHandler}
          onAudiovolumenotify={this._pusherAudioVolumeNotify}
        ></LivePusher>
        {streamList.map((item, index) => {
          return (
            <View
              key={item.streamID}
              className="view-container player-container"
            >
              <LivePlayer
                className={'player' + streamList.length}
                id={item.streamID}
                data-userid={item.userID}
                data-streamid={item.streamID}
                data-streamtype={item.streamType}
                src={item.src}
                mode="RTC"
                objectFit="fillCrop"
                autoplay={true}
                muteVideo={item.muteVideo}
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
