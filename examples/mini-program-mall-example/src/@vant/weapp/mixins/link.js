import Taro from '@tarojs/taro'
export const link = Taro.Behavior({
  properties: {
    url: String,
    linkType: {
      type: String,
      value: 'navigateTo',
    },
  },
  methods: {
    jumpLink(urlKey = 'url') {
      const url = this.data[urlKey]
      if (url) {
        if (
          this.data.linkType === 'navigateTo' &&
          Taro.getCurrentPages().length > 9
        ) {
          Taro.redirectTo({
            url,
          })
        } else {
          Taro[this.data.linkType]({
            url,
          })
        }
      }
    },
  },
})
