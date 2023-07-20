/* eslint-disable */
var addUnit = require('../wxs/add-unit.wxs.js')
function rootStyle(data) {
  return {
    color: data.color,
    'background-color': data.backgroundColor,
    background: data.background,
  }
}
module.exports = {
  rootStyle: rootStyle,
}
