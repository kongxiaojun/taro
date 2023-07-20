/* eslint-disable */
function rootStyle(data) {
  return {
    'backgroundColor': data.plain ? '' : data.color,
    color: data.textColor || data.plain ? data.textColor || data.color : '',
  }
}
module.exports = {
  rootStyle: rootStyle,
}
