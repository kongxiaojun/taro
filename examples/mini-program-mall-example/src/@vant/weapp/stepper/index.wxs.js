/* eslint-disable */
var addUnit = require('../wxs/add-unit.wxs.js')
function buttonStyle(data) {
  return {
    width: addUnit(data.buttonSize),
    height: addUnit(data.buttonSize),
  }
}
function inputStyle(data) {
  return {
    width: addUnit(data.inputWidth),
    height: addUnit(data.buttonSize),
  }
}
module.exports = {
  buttonStyle: buttonStyle,
  inputStyle: inputStyle,
}
