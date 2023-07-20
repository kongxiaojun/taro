/* eslint-disable */
var addUnit = require('../wxs/add-unit.wxs.js')
function wrapperStyle(data) {
  var width = 100 / data.columnNum + '%'
  return {
    width: width,
    'paddingTop': data.square ? width : null,
    'paddingRight': addUnit(data.gutter),
    'marginTop':
      data.index >= data.columnNum && !data.square
        ? addUnit(data.gutter)
        : null,
  }
}
function contentStyle(data) {
  return data.square
    ? {
      right: addUnit(data.gutter),
      bottom: addUnit(data.gutter),
      height: 'auto',
    }
    : {}
}
module.exports = {
  wrapperStyle: wrapperStyle,
  contentStyle: contentStyle,
}
