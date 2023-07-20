/* eslint-disable */
var addUnit = require('../wxs/add-unit.wxs.js')
function inputStyle(autosize) {
  if (autosize && autosize.constructor === 'Object') {
    return {
      'minHeight': addUnit(autosize.minHeight),
      'maxHeight': addUnit(autosize.maxHeight),
    }
  }
  return {}
}
module.exports = {
  inputStyle: inputStyle,
}
