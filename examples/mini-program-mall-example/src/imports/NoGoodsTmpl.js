import { Block, View, Radio, Image, Input, Navigator } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import VanEmpty from '../@vant/weapp/empty/index'
import VanButton from '../@vant/weapp/button/index'
export default class NoGoodsTmpl extends React.Component {
  render() {
    return (
      <Block>
        <VanEmpty
          description="购物车空空如也～"
          image="https://dcdn.it120.cc/2021/03/02/11544ab7-38ca-4570-a876-cbfd39720367.png"
        >
          <VanButton
            round
            type="danger"
            size="small"
            className="bottom-button"
            onClick={() => {
                Taro.switchTab({
                    url: '/pages/index/index',
                })
            }}
          >
            去逛逛
          </VanButton>
        </VanEmpty>
      </Block>
    )
  }
}
