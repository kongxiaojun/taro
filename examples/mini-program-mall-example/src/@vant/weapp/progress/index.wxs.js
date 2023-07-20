/* eslint-disable */
var utils = require('../wxs/utils.wxs.js')
function pivotText(pivotText, percentage) {
  return pivotText || percentage + '%'
}
function rootStyle(data) {
  return {
    height: data.strokeWidth ? utils.addUnit(data.strokeWidth) : '',
    background: data.trackColor,
  }
}
function portionStyle(data) {
  return {
    background: data.inactive ? '#cacaca' : data.color,
    width: data.percentage ? data.percentage + '%' : '',
  }
}
function pivotStyle(data) {
  return {
    color: data.textColor,
    right: data.right + 'px',
    background: data.pivotColor
      ? data.pivotColor
      : data.inactive
        ? '#cacaca'
        : data.color,
  }
}
module.exports = {
  pivotText: pivotText,
  rootStyle: rootStyle,
  portionStyle: portionStyle,
  pivotStyle: pivotStyle,
}
