/* eslint-disable */
var utils = require('./utils.wxs.js')
function getMonths(minDate, maxDate) {
  var months = []
  var cursor = new Date(minDate)
  cursor.setDate(1)
  do {
    months.push(cursor.getTime())
    cursor.setMonth(cursor.getMonth() + 1)
  } while (utils.compareMonth(cursor, new Date(maxDate)) !== 1)
  return months
}
function getButtonDisabled(type, currentDate, minRange) {
  if (currentDate == null) {
    return true
  }
  if (type === 'range') {
    return !currentDate[0] || !currentDate[1]
  }
  if (type === 'multiple') {
    return currentDate.length < minRange
  }
  return !currentDate
}
module.exports = {
  getMonths: getMonths,
  getButtonDisabled: getButtonDisabled,
}
