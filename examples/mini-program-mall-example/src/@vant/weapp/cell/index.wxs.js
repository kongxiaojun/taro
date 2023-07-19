/* eslint-disable */
var style = require('../wxs/style.wxs.js')
var addUnit = require('../wxs/add-unit.wxs.js')
function titleStyle(data) {
  return style([
    {
      'max-width': addUnit(data.titleWidth),
      'min-width': addUnit(data.titleWidth),
    },
    data.titleStyle,
  ])
}
module.exports = {
  titleStyle: titleStyle,
}
