/* eslint-disable */
var addUnit = require('../wxs/add-unit.wxs.js')
function rootStyle(data) {
  var currentColor =
    data.checked === data.activeValue ? data.activeColor : data.inactiveColor
  return {
    'fontSize': addUnit(data.size),
    'backgroundColor': currentColor,
  }
}
var BLUE = '#1989fa'
var GRAY_DARK = '#969799'
function loadingColor(data) {
  return data.checked === data.activeValue
    ? data.activeColor || BLUE
    : data.inactiveColor || GRAY_DARK
}
module.exports = {
  rootStyle: rootStyle,
  loadingColor: loadingColor,
}
