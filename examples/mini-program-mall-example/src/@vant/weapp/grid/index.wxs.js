/* eslint-disable */
var style = require('../wxs/style.wxs.js')
var addUnit = require('../wxs/add-unit.wxs.js')
function rootStyle(data) {
  return style({
    'padding-left': addUnit(data.gutter),
  })
}
module.exports = {
  rootStyle: rootStyle,
}
