import Taro from '@tarojs/taro'
export const basic = Taro.Behavior({
  methods: {
    $emit(name, detail, options) {
      this.triggerEvent(name, detail, options)
    },
    set(data) {
      this.setData(data)
      return new Promise((resolve) => Taro.nextTick(resolve))
    },
  },
})
