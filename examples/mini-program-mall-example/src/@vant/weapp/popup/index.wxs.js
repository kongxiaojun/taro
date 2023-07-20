/* eslint-disable */
function popupStyle(data) {
  console.log("popupStyle", data.customStyle)

  const style = {
    zIndex: data.zIndex,
    ...data.customStyle
  }
  if (data.currentDuration) {
    style.webkitTransitionDuration = data.currentDuration + 'ms';
    style.transitionDuration = data.currentDuration + 'ms';
  }
  if (!data.display) {
    style.display =  'none'
  }
  return style
}
module.exports = {
  popupStyle: popupStyle,
}
