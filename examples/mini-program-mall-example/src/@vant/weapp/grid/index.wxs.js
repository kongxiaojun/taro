/* eslint-disable */
var addUnit = require('../wxs/add-unit.wxs.js')
function rootStyle(data) {
  return {
    'paddingLeft': addUnit(data.gutter),
  }
}
module.exports = {
  rootStyle: rootStyle,
}
