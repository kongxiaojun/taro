/* eslint-disable */
var utils = require('../wxs/utils.wxs.js')
function tabClass(active, ellipsis) {
  var classes = ['tab-class']
  if (active) {
    classes.push('tab-active-class')
  }
  if (ellipsis) {
    classes.push('van-ellipsis')
  }
  return classes.join(' ')
}
function tabStyle(data) {
  var titleColor = data.active ? data.titleActiveColor : data.titleInactiveColor
  var ellipsis = data.scrollable && data.ellipsis

  // card theme color
  if (data.type === 'card') {
    return {
      'borderColor': data.color,
      'backgroundColor': !data.disabled && data.active ? data.color : null,
      color: titleColor || (!data.disabled && !data.active ? data.color : null),
      'flexBasis': ellipsis ? 88 / data.swipeThreshold + '%' : null,
    }
  }
  return {
    color: titleColor,
    'flexBasis': ellipsis ? 88 / data.swipeThreshold + '%' : null,
  }
}
function navStyle(color, type) {
  return {
    'borderColor': type === 'card' && color ? color : null,
  }
}
function trackStyle(data) {
  if (!data.animated) {
    return {}
  }
  return {
    left: -100 * data.currentIndex + '%',
    'transitionDuration': data.duration + 's',
    'webkitTransitionDuration': data.duration + 's',
  }
}
function lineStyle(data) {
  return {
    width: utils.addUnit(data.lineWidth),
    opacity: data.inited ? 1 : 0,
    transform: 'translateX(' + data.lineOffsetLeft + 'px)',
    'webkitTransform': 'translateX(' + data.lineOffsetLeft + 'px)',
    'backgroundColor': data.color,
    height: data.lineHeight !== -1 ? utils.addUnit(data.lineHeight) : null,
    'borderRadius':
      data.lineHeight !== -1 ? utils.addUnit(data.lineHeight) : null,
    'transitionDuration': !data.skipTransition ? data.duration + 's' : null,
    'webkitTransitionDuration': !data.skipTransition
      ? data.duration + 's'
      : null,
  }
}
module.exports = {
  tabClass: tabClass,
  tabStyle: tabStyle,
  trackStyle: trackStyle,
  lineStyle: lineStyle,
  navStyle: navStyle,
}
