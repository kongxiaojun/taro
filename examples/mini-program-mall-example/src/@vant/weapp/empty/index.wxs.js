/* eslint-disable */
var PRESETS = ['error', 'search', 'default', 'network']
function imageUrl(image) {
  if (PRESETS.indexOf(image) !== -1) {
    return 'https://img.yzcdn.cn/vant/empty-image-' + image + '.png'
  }
  return image
}
module.exports = {
  imageUrl: imageUrl,
}
