/* eslint-disable */
var addUnit = require('../wxs/add-unit.wxs.js')
function iconStyle(data) {
  var styles = {
    'fontSize': addUnit(data.iconSize),
  }
  if (
    data.checkedColor &&
    !(data.disabled || data.parentDisabled) &&
    data.value === data.name
  ) {
    styles['borderColor'] = data.checkedColor
    styles['backgroundColor'] = data.checkedColor
  }
  return styles
}
function iconCustomStyle(data) {
  return {
    'lineHeight': addUnit(data.iconSize),
    'fontSize': '.8em',
    display: 'block',
  }
}
module.exports = {
  iconStyle: iconStyle,
  iconCustomStyle: iconCustomStyle,
}
