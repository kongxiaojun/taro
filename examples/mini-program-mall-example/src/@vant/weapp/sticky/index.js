import { Block, View, Slot } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import utils from '../wxs/utils.wxs.js'
import computed from './index.wxs.js'
import { getRect } from '../common/utils.js'
import { VantComponent } from '../common/component.js'
import { isDef } from '../common/validator.js'
import { pageScrollMixin } from '../mixins/page-scroll.js'
import './index.scss'
const ROOT_ELEMENT = '.van-sticky'

@withWeapp(VantComponent({
  props: {
    zIndex: {
      type: Number,
      value: 99,
    },
    offsetTop: {
      type: Number,
      value: 0,
      observer: 'onScroll',
    },
    disabled: {
      type: Boolean,
      observer: 'onScroll',
    },
    container: {
      type: null,
      observer: 'onScroll',
    },
    scrollTop: {
      type: null,
      observer(val) {
        this.onScroll({
          scrollTop: val,
        })
      },
    },
  },
  mixins: [
    pageScrollMixin(function (event) {
      if (this.data.scrollTop != null) {
        return
      }
      this.onScroll(event)
    }),
  ],
  data: {
    height: 0,
    fixed: false,
    transform: 0,
  },
  mounted() {
    this.onScroll()
  },
  methods: {
    onScroll(data) {
      const scrollTop = data ? data.scrollTop : 0
      const { container, offsetTop, disabled } = this.data
      if (disabled) {
        this.setDataAfterDiff({
          fixed: false,
          transform: 0,
        })
        return
      }
      this.scrollTop = scrollTop || this.scrollTop
      if (typeof container === 'function') {
        Promise.all([
          getRect(this, ROOT_ELEMENT),
          this.getContainerRect(),
        ]).then(([root, container]) => {
          if (offsetTop + root.height > container.height + container.top) {
            this.setDataAfterDiff({
              fixed: false,
              transform: container.height - root.height,
            })
          } else if (offsetTop >= root.top) {
            this.setDataAfterDiff({
              fixed: true,
              height: root.height,
              transform: 0,
            })
          } else {
            this.setDataAfterDiff({
              fixed: false,
              transform: 0,
            })
          }
        })
        return
      }
      getRect(this, ROOT_ELEMENT).then((root) => {
        if (!isDef(root)) {
          return
        }
        if (offsetTop >= root.top) {
          this.setDataAfterDiff({
            fixed: true,
            height: root.height,
          })
          this.transform = 0
        } else {
          this.setDataAfterDiff({
            fixed: false,
          })
        }
      })
    },
    setDataAfterDiff(data) {
      Taro.nextTick(() => {
        const diff = Object.keys(data).reduce((prev, key) => {
          if (data[key] !== this.data[key]) {
            prev[key] = data[key]
          }
          return prev
        }, {})
        if (Object.keys(diff).length > 0) {
          this.setData(diff)
        }
        this.$emit('scroll', {
          scrollTop: this.scrollTop,
          isFixed: data.fixed || this.data.fixed,
        })
      })
    },
    getContainerRect() {
      const nodesRef = this.data.container()
      return new Promise((resolve) =>
          nodesRef.boundingClientRect(resolve).exec()
      )
    },
  },
}))
class _C extends React.Component {
  render() {
    const { fixed, height, zIndex, offsetTop, transform } = this.data
    return (
      <View
        className="custom-class van-sticky"
        style={computed.containerStyle({
          fixed,
          height,
          zIndex,
        })}
      >
        <View
          className={utils.bem('sticky-wrap', {
            fixed,
          })}
          style={computed.wrapStyle({
            fixed,
            offsetTop,
            transform,
            zIndex,
          })}
        >
          {this.props.children}
        </View>
      </View>
    )
  }
}
export default _C
