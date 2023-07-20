/* eslint-disable */
function rootStyle(data) {
  const style = {
    'webkitTransitionDuration': data.currentDuration + 'ms',
    'transitionDuration': data.currentDuration + 'ms',
    ...data.customStyle
  }
  if (!data.display) {
    style.display = 'none'
  }

  return style
}
module.exports = {
  rootStyle: rootStyle,
}
