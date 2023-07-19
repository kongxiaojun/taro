/* eslint-disable */
var style = require('../wxs/style.wxs.js')
function popupStyle(data) {
  const compStyle = style([
    {
      'zIndex': data.zIndex,
      '-webkit-transition-duration': data.currentDuration + 'ms',
      'transition-duration': data.currentDuration + 'ms',
    },
    data.display ? null : 'display: none',
    data.customStyle,
  ])

  console.log("popupStyle compStyle", compStyle)

  return compStyle
}
module.exports = {
  popupStyle: popupStyle,
}
