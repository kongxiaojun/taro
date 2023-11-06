import { StandardProps } from '@tarojs/components'
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

export class StickyView extends Component<StickyProps, State> {

  componentDidMount () {
    this.setState({
      attached: true,
    })
  }

  // shouldComponentUpdate(nextProps: Readonly<StickyProps>, nextState: Readonly<State>, nextContext: any): boolean {
  //   if (nextProps.disabled != this.props.disabled) {
  //
  //   }
  //
  //   return true
  // }

  componentWillUnmount () {
    this.setState({
      attached: false,
    })
  }

  render () {
    return <div>
      {this.props.children}
    </div>
  }


}
// = ({ children, offsetTop = 0, zIndex = 0, disabled = false, container = null }) => {
//
//   useEffect(() => {
//     if (!attached) return
//     disabled ? disconnectObserver('') : initObserver()
//   }, [disabled])
//
//   useEffect(() => {
//     if (typeof container !== 'function' || !height) return
//     observerContainer()
//   }, [container])
//
//   useEffect(() => {
//     if (typeof offsetTop !== 'number' || !attached) return
//     initObserver()
//   }, [offsetTop])
//
//   useEffect(() => {
//     setAttached(true)
//     if (!disabled) initObserver()
//     return function cleanup() {
//       setAttached(false)
//       disconnectObserver('')
//     }
//   }, [])
//
//   const getContainerRect = () => {
//   }
//
//   const getRect = (selector) => {
//     return new Promise((resolve, reject) => {
//       Taro.createSelectorQuery()
//         .select(selector)
//         .boundingClientRect(rect => {
//           if (rect) {
//             resolve(rect)
//           } else {
//             reject(new Error(`can not find selector: ${selector}`))
//           }
//         }).exec()
//     })
//   }
//
//   const getAllRects = (selector) => {
//     return new Promise((resolve, reject) => {
//       Taro.createSelectorQuery()
//         .selectAll(selector)
//         .boundingClientRect(rects => {
//           if (rects) {
//             if (Array.isArray(rects) && rects.length > 0) {
//               resolve(rects)
//             } else {
//               resolve([rects])
//             }
//           } else {
//             reject(new Error(`can not find selector: ${selector}`))
//           }
//         }).exec()
//     })
//   }
//
//   const initObserver = () => {
//     disconnectObserver(undefined)
//     getRect(this).then((rect: any) => {
//       setHeight(rect.height)
//       observerContent()
//       observerContainer()
//     })
//   }
//
//   const disconnectObserver = (observerName) => {
//
//   }
//
//   const observerContent = () => {
//
//   }
//
//   const observerContainer = () => {
//
//   }
//
//   return <div>
//     {children}
//   </div>
// }
