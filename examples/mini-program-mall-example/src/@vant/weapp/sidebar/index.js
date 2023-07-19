import { Block, View, Slot } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import { VantComponent } from '../common/component.js'
import { useChildren } from '../common/relation.js'
import './index.scss'

@withWeapp(VantComponent({
  relation: useChildren('sidebar-item', function () {
    this.setActive(this.data.activeKey)
  }),
  props: {
    activeKey: {
      type: Number,
      value: 0,
      observer: 'setActive',
    },
  },
  methods: {
    setActive(activeKey) {
      const { children } = this
      const currentActive = this.state.currentActive
      console.log("sidebar setActive", activeKey, currentActive)
      this.setState({
        currentActive: activeKey
      })
      return Promise.resolve()
    },
  },
}))
class _C extends React.Component {

  constructor(props) {
    super(props);
    this.state = {currentActive: 0};
  }


  render() {
    return (
      <View className="van-sidebar custom-class">
        {React.Children.map(this.props.children, (child, index) => {
          // 判断子组件的类型
          if (React.isValidElement(child)) {
            // 克隆子组件并添加新的属性
            return React.cloneElement(child, {
              parent: this,
              index: index,
              selected: index === this.state.currentActive
            });
          }
          return child;
        })}
      </View>
    )
  }
}
export default _C
