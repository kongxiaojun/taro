/* eslint-disable */
var addUnit = require('../wxs/add-unit.wxs.js')
function isImage(name) {
  return name.indexOf('/') !== -1
}
function rootClass(data) {
  var classes = ['custom-class']
  if (data.classPrefix !== 'van-icon') {
    classes.push('van-icon--custom')
  }
  if (data.classPrefix != null) {
    classes.push(data.classPrefix)
  }
  if (isImage(data.name)) {
    classes.push('van-icon--image')
  } else if (data.classPrefix != null) {
    classes.push(data.classPrefix + '-' + data.name)
  }
  return classes.join(' ')
}
function rootStyle(data) {
  const style = {...data.customStyle}
  if (data.color) {
    style.color = data.color
  }
  if (data.fontSize) {
    style.fontSize = data.fontSize
  }
  return style
}
module.exports = {
  isImage: isImage,
  rootClass: rootClass,
  rootStyle: rootStyle,
}
