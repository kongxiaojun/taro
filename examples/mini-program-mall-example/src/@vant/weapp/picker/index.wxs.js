/* eslint-disable */
var style = require('../wxs/style.wxs.js')
var addUnit = require('../wxs/add-unit.wxs.js')
var array = require('../wxs/array.wxs.js')
function columnsStyle(data) {
  return style({
    height: addUnit(data.itemHeight * data.visibleItemCount),
  })
}
function maskStyle(data) {
  return style({
    'background-size':
      '100% ' + addUnit((data.itemHeight * (data.visibleItemCount - 1)) / 2),
  })
}
function frameStyle(data) {
  return style({
    height: addUnit(data.itemHeight),
  })
}
function columns(columns) {
  if (!array.isArray(columns)) {
    return []
  }
  if (columns.length && !columns[0].values) {
    return [
      {
        values: columns,
      },
    ]
  }
  return columns
}
module.exports = {
  columnsStyle: columnsStyle,
  frameStyle: frameStyle,
  maskStyle: maskStyle,
  columns: columns,
}
