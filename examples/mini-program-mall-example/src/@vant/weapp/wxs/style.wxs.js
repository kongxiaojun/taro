/* eslint-disable */
var object = require('./object.wxs.js')
var array = require('./array.wxs.js')
function kebabCase(word) {
  var newWord = word
    .replace(/[A-Z]/g, function (i) {
      return '-' + i
    })
    .toLowerCase()
  return newWord
}
function style(styles) {
  if (array.isArray(styles)) {
    return styles
      .filter(function (item) {
        return item && item !== ''
      })
      .map(function (item) {
        return style(item)
      })
      .join(';')
  }
  if ('Object' === styles.constructor) {
    return object
      .keys(styles)
      .filter(function (key) {
        return styles[key] != null && styles[key] !== ''
      })
      .map(function (key) {
        return [kebabCase(key), [styles[key]]].join(':')
      })
      .join(';')
  }
  return styles
}
module.exports = style
