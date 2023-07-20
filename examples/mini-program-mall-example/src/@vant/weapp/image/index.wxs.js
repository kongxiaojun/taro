/* eslint-disable */
var addUnit = require('../wxs/add-unit.wxs.js')
function rootStyle(data) {

  const style = {
    width: addUnit(data.width),
    height: addUnit(data.height),
    'borderRadius': addUnit(data.radius),
  }

  if (data.radius) {
    style.overflow = 'hidden'
  }

  return style;

}
var FIT_MODE_MAP = {
  none: 'center',
  fill: 'scaleToFill',
  cover: 'aspectFill',
  contain: 'aspectFit',
  widthFix: 'widthFix',
  heightFix: 'heightFix',
}
function mode(fit) {
  return FIT_MODE_MAP[fit]
}
module.exports = {
  rootStyle: rootStyle,
  mode: mode,
}
