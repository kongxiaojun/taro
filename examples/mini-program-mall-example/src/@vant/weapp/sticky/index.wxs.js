/* eslint-disable */
var style = require('../wxs/style.wxs.js')
var addUnit = require('../wxs/add-unit.wxs.js')
function wrapStyle(data) {
  return style({
    transform: data.transform
      ? 'translate3d(0, ' + data.transform + 'px, 0)'
      : '',
    top: data.fixed ? addUnit(data.offsetTop) : '',
    'zIndex': data.zIndex,
  })
}
function containerStyle(data) {
  return style({
    height: data.fixed ? addUnit(data.height) : '',
    'zIndex': data.zIndex,
  })
}
module.exports = {
  wrapStyle: wrapStyle,
  containerStyle: containerStyle,
}
