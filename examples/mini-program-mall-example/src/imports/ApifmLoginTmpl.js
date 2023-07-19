import { Block, View, Form, Button, Image, Text } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
export default class ApifmLoginTmpl extends React.Component {
  render() {
    return (
      <Block>
        {!wxlogin && (
          <View className="apifmLogin">
            <View className="s-b">
              <View className="s-l-b">
                <Image src="/images/nologin.png"></Image>
                <Text>授权登录</Text>
              </View>
              <View className="s-t-b">
                <View className="s-t-i">
                  <Text>·</Text>请授权小程序登录
                </View>
                <View className="s-t-i">
                  <Text>·</Text>我们不会公布您的这些信息
                </View>
                <View className="s-t-i">
                  <Text>·</Text>只是为了给您提供更好的服务
                </View>
              </View>
              <Button
                className="l"
                openType="getUserInfo"
                lang="zh_CN"
                onGetuserinfo={this.processLogin}
              >
                允许[已停用]
              </Button>
              <Button className="c" onClick={this.cancelLogin} type="default">
                暂不登录
              </Button>
            </View>
          </View>
        )}
      </Block>
    )
  }
}
