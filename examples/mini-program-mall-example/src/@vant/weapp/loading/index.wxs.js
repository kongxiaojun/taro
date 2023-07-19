/* eslint-disable */
var style = require('../wxs/style.wxs.js')
var addUnit = require('../wxs/add-unit.wxs.js')
function spinnerStyle(data) {
  return style({
    color: data.color,
    width: addUnit(data.size),
    height: addUnit(data.size),
  })
}
function textStyle(data) {
  return style({
    'font-size': addUnit(data.textSize),
  })
}
module.exports = {
  spinnerStyle: spinnerStyle,
  textStyle: textStyle,
}
