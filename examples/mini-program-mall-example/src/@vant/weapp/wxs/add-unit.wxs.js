/* eslint-disable */
var REGEXP = /^-?\d+(\.\d+)?$/g
function addUnit(value) {
  if (value == null) {
    return undefined
  }
  return REGEXP.test('' + value) ? value + 'px' : value
}
module.exports = addUnit
