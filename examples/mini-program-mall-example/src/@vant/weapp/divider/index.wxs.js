/* eslint-disable */
var addUnit = require('../wxs/add-unit.wxs.js')
function rootStyle(data) {
  return {
    borderColor: data.borderColor,
    color: data.textColor,
    fontSize: addUnit(data.fontSize),
    ...data.customStyle
  }
}
module.exports = {
  rootStyle: rootStyle,
}
