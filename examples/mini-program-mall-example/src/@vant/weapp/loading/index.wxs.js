/* eslint-disable */
var addUnit = require('../wxs/add-unit.wxs.js')
function spinnerStyle(data) {
  return {
    color: data.color,
    width: addUnit(data.size),
    height: addUnit(data.size),
  }
}
function textStyle(data) {
  return {
    'font-size': addUnit(data.textSize),
  }
}
module.exports = {
  spinnerStyle: spinnerStyle,
  textStyle: textStyle,
}
