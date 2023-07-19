/* eslint-disable */
var bem = require('./bem.wxs.js')
var memoize = require('./memoize.wxs.js')
var addUnit = require('./add-unit.wxs.js')
module.exports = {
  bem: memoize(bem),
  memoize: memoize,
  addUnit: addUnit,
}
