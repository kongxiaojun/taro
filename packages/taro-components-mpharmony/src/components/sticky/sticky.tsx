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
  height?: number
  attached?: boolean
  containerHeight?: number
}

export class Sticky extends Component<StickyProps, State> {

  getRect = (selector) => {
    return new Promise((resolve, reject) => {
      Taro.createSelectorQuery()
        .select(selector)
        .boundingClientRect(rect => {
          if (rect) {
            resolve(rect)
          } else {
            reject(new Error(`can not find selector: ${selector}`))
          }
        }).exec()
    })
  }

  getAllRects = (selector) => {
    return new Promise((resolve, reject) => {
      Taro.createSelectorQuery()
        .selectAll(selector)
        .boundingClientRect(rects => {
          if (rects) {
            if (Array.isArray(rects) && rects.length > 0) {
              resolve(rects)
            } else {
              resolve([rects])
            }
          } else {
            reject(new Error(`can not find selector: ${selector}`))
          }
        }).exec()
    })
  }

  componentDidMount () {
    this.setState({
      attached: true
    })

    if (!this.props.disabled) {
      this.initObserver()
    }
  }

  shouldComponentUpdate (nextProps: Readonly<StickyProps>, _nextState: Readonly<State>, _nextContext: any): boolean {
    if (nextProps.disabled !== this.props.disabled) {
      nextProps.disabled ? this.disconnectObserver('') : this.initObserver()
    }
    if (nextProps.container !== this.props.container) {
      if (typeof nextProps.container === 'function' && this.state.height) {
        this.observerContainer()
      }
    }
    if (typeof nextProps.offsetTop === 'number' && this.state.attached) {
      this.initObserver()
    }
    return true
  }

  componentWillUnmount () {
    this.setState({
      attached: false
    })
    this.disconnectObserver('')
  }

  initObserver = () => {
    this.disconnectObserver(undefined)
    this.getRect(this).then((rect: any) => {
      this.setState({
        height: rect.height
      })
      this.observerContent()
      this.observerContainer()
    })
  }

  disconnectObserver = (_observerName) => {

  }

  observerContent = () => {

  }

  observerContainer = () => {

  }

  render () {
    return <div>
      {this.props.children}
    </div>
  }
}
