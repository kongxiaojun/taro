import { Block, View, Slot } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import utils from '../wxs/utils.wxs.js'
import { useParent } from '../common/relation.js'
import { VantComponent } from '../common/component.js'
import './index.scss'

@withWeapp(VantComponent({
    relation: useParent('tabs'),
    props: {
        dot: {
            type: Boolean,
            observer: 'update',
        },
        info: {
            type: null,
            observer: 'update',
        },
        title: {
            type: String,
            observer: 'update',
        },
        disabled: {
            type: Boolean,
            observer: 'update',
        },
        titleStyle: {
            type: String,
            observer: 'update',
        },
        name: {
            type: null,
            value: '',
        },
    },
    data: {
        active: false,
    },
    methods: {
        getComputedName() {
            if (this.data.name !== '') {
                return this.data.name
            }
            return this.index
        },
        updateRender(active, parent) {
            const { data: parentData } = parent
            this.inited = this.inited || active
            this.setData({
                active,
                shouldRender: this.inited || !parentData.lazyRender,
                shouldShow: active || parentData.animated,
            })
        },
        update() {
            if (this.parent) {
                this.parent.updateTabs()
            }
        },
    },
}))
class _C extends React.Component {
  render() {
    const { active, shouldShow, shouldRender, title } = this.data
    return (
      <View
        className={
          utils.bem('tab__pane', {
            active,
            inactive: !active,
          })
        }
      >
        {title}
      </View>
    )
  }
}
export default _C
