/* eslint-disable */
var addUnit = require('../wxs/add-unit.wxs.js')
function titleStyle(data) {
  return {
    'maxWidth': addUnit(data.titleWidth),
    'minWidth': addUnit(data.titleWidth),
    ...data.titleStyle
  }
}
module.exports = {
  titleStyle: titleStyle,
}
