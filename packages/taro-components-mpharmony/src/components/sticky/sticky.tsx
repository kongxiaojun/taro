import { StandardProps } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { Component } from 'react'

export interface StickyProps extends StandardProps {
  offsetTop?: number
  zIndex?: number
  disabled?: boolean
  container?: any
}

interface State {
  fixed?: boolean
  stickyTop: number
}


export class Sticky extends Component<StickyProps, State> {

  componentDidMount () {
    Taro.createSelectorQuery()
      .select('#taro-sticky')
      .boundingClientRect(rect => {
        this.setState({
          stickyTop: rect.top
        })
      }).exec()
  }

  render () {
    return <div id={'#taro-sticky'} style={{ position: 'fixed', top: 0 }}>
      {this.props.children}
    </div>
  }
}
