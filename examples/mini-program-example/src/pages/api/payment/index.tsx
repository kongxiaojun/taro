import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'
import { TestConsole } from '@/util/util'

/**
 * 支付
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'requestPayment',
        inputData: {
          timeStamp: '',
          nonceStr: '',
          package: '',
          signType: ['MD5'],
          paySign: '',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('requestPayment')
          Taro.requestPayment({
            ...data,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          }).then((res) => {
            TestConsole.consoleResult.call(this, res, apiIndex)
          })
        },
      },
      {
        id: 'requestOrderPayment',
        func: null,
      },
      {
        id: 'faceVerifyForPay',
        func: null,
      },
      {
        id: '一级回退',
        func: () => {
          Taro.navigateBack({ delta: 1 })
        }
      },
      {
        id: '二级回退',
        func: () => {
          Taro.navigateBack({ delta: 2 })
        }
      },
      {
        id: '三级回退',
        func: () => {
          Taro.navigateBack({ delta: 3 })
        }
      },
      {
        id: '十级回退',
        func: () => {
          Taro.navigateBack({ delta: 10 })
        }
      },
    ],
  }

  render () {
    const { list } = this.state
    return (
      <View className="api-page">
        <ButtonList buttonList={list}/>
      </View>
    )
  }
}
