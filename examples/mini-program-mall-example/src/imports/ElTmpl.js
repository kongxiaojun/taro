import {
  Block,
  Image,
  Text,
  View,
  Video,
  Audio,
  RichText,
} from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
export default class ElTmpl extends React.Component {
  render() {
    const {
      data: { opts, ctrl, i, n },
    } = this.props
    return (
      <Block>
        {n.name === 'img' ? (
          <Block>
            {((opts[1] && !ctrl[i]) || ctrl[i] < 0) && (
              <Image
                className="_img"
                style={n.attrs.style}
                src={ctrl[i] < 0 ? opts[2] : opts[1]}
                mode="widthFix"
              ></Image>
            )}
            <Image
              id={n.attrs.id}
              className={'_img ' + n.attrs.class}
              style={
                (ctrl[i] === -1 ? 'display:none;' : '') +
                'width:' +
                (ctrl[i] || 1) +
                'px;height:1px;' +
                n.attrs.style
              }
              src={n.attrs.src}
              mode={!n.h ? 'widthFix' : !n.w ? 'heightFix' : ''}
              lazyLoad={opts[0]}
              webp={n.webp}
              showMenuByLongpress={opts[3] && !n.attrs.ignore}
              data-i={i}
              onLoad={this.imgLoad}
              onError={this.mediaError}
              onClick={this.privateStopNoop.bind(this, this.imgTap)}
              onLongPress={this.noop}
            ></Image>
          </Block>
        ) : n.text ? (
          <Text userSelect={opts[4]} decode>
            {n.text}
          </Text>
        ) : n.name === 'br' ? (
          <Text>\n</Text>
        ) : n.name === 'a' ? (
          <View
            id={n.attrs.id}
            className={(n.attrs.href ? '_a ' : '') + n.attrs.class}
            hoverClass="_hover"
            style={'display:inline;' + n.attrs.style}
            data-i={i}
            onClick={this.privateStopNoop.bind(this, this.linkTap)}
          >
            <Node
              childs={n.children}
              opts={opts}
              style="display:inherit"
            ></Node>
          </View>
        ) : n.name === 'video' ? (
          <Video
            id={n.attrs.id}
            className={n.attrs.class}
            style={n.attrs.style}
            autoplay={n.attrs.autoplay}
            controls={n.attrs.controls}
            loop={n.attrs.loop}
            muted={n.attrs.muted}
            objectFit={n.attrs['object-fit']}
            poster={n.attrs.poster}
            src={n.src[ctrl[i] || 0]}
            data-i={i}
            onPlay={this.play}
            onError={this.mediaError}
          ></Video>
        ) : n.name === 'audio' ? (
          <Audio
            id={n.attrs.id}
            className={n.attrs.class}
            style={n.attrs.style}
            author={n.attrs.author}
            controls={n.attrs.controls}
            loop={n.attrs.loop}
            name={n.attrs.name}
            poster={n.attrs.poster}
            src={n.src[ctrl[i] || 0]}
            data-i={i}
            onPlay={this.play}
            onError={this.mediaError}
          ></Audio>
        ) : (
          <RichText
            id={n.attrs.id}
            style={n.f}
            userSelect={opts[4]}
            nodes={[n]}
          ></RichText>
        )}
      </Block>
    )
  }
}
