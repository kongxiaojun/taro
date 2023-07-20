/* eslint-disable */
var addUnit = require('../wxs/add-unit.wxs.js')
function sizeStyle(data) {
  return 'Array' === data.previewSize.constructor
    ? {
      width: addUnit(data.previewSize[0]),
      height: addUnit(data.previewSize[1]),
    }
    : {
      width: addUnit(data.previewSize),
      height: addUnit(data.previewSize),
    }
}
module.exports = {
  sizeStyle: sizeStyle,
}
