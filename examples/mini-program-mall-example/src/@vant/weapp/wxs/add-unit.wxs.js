/* eslint-disable */

function addUnit(value) {
  const REGEXP = /^-?\d+(\.\d+)?$/
  if (value == null) {
    return undefined
  }
  return REGEXP.test(value.toString()) ? value + 'px' : value
}
module.exports = addUnit
