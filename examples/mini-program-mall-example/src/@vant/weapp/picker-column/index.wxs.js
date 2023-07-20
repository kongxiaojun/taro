/* eslint-disable */
var addUnit = require('../wxs/add-unit.wxs.js')
function isObj(x) {
  var type = typeof x
  return x !== null && (type === 'object' || type === 'function')
}
function optionText(option, valueKey) {
  return isObj(option) && option[valueKey] != null ? option[valueKey] : option
}
function rootStyle(data) {
  return {
    height: addUnit(data.itemHeight * data.visibleItemCount),
  }
}
function wrapperStyle(data) {
  var offset = addUnit(
    data.offset + (data.itemHeight * (data.visibleItemCount - 1)) / 2
  )
  return {
    transition: 'transform ' + data.duration + 'ms',
    'lineHeight': addUnit(data.itemHeight),
    transform: 'translate3d(0, ' + offset + ', 0)',
  }
}
module.exports = {
  optionText: optionText,
  rootStyle: rootStyle,
  wrapperStyle: wrapperStyle,
}
