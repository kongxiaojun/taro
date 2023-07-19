import { Block, View } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import utils from '../wxs/utils.wxs.js'
import style from '../wxs/style.wxs.js'
import { getAllRect } from '../common/utils.js'
import { VantComponent } from '../common/component.js'
import { canIUseModel } from '../common/version.js'
import VanIcon from '../icon/index'
import './index.scss'

@withWeapp(VantComponent({
  field: true,
  classes: ['icon-class'],
  props: {
    value: {
      type: Number,
      observer(value) {
        if (value !== this.data.innerValue) {
          this.setData({
            innerValue: value,
          })
        }
      },
    },
    readonly: Boolean,
    disabled: Boolean,
    allowHalf: Boolean,
    size: null,
    icon: {
      type: String,
      value: 'star',
    },
    voidIcon: {
      type: String,
      value: 'star-o',
    },
    color: String,
    voidColor: String,
    disabledColor: String,
    count: {
      type: Number,
      value: 5,
      observer(value) {
        this.setData({
          innerCountArray: Array.from({
            length: value,
          }),
        })
      },
    },
    gutter: null,
    touchable: {
      type: Boolean,
      value: true,
    },
  },
  data: {
    innerValue: 0,
    innerCountArray: Array.from({
      length: 5,
    }),
  },
  methods: {
    onSelect(event) {
      const { data } = this
      const { score } = event.currentTarget.dataset
      if (!data.disabled && !data.readonly) {
        this.setData({
          innerValue: score + 1,
        })
        if (canIUseModel()) {
          this.setData({
            value: score + 1,
          })
        }
        Taro.nextTick(() => {
          this.$emit('input', score + 1)
          this.$emit('change', score + 1)
        })
      }
    },
    onTouchMove(event) {
      const { touchable } = this.data
      if (!touchable) return
      const { clientX } = event.touches[0]
      getAllRect(this, '.van-rate__icon').then((list) => {
        const target = list
            .sort((cur, next) => cur.dataset.score - next.dataset.score)
            .find((item) => clientX >= item.left && clientX <= item.right)
        if (target != null) {
          this.onSelect(
              Object.assign(Object.assign({}, event), {
                currentTarget: target,
              })
          )
        }
      })
    },
  },
}))
class _C extends React.Component {
  render() {
    const {
      count,
      gutter,
      innerCountArray,
      innerValue,
      icon,
      voidIcon,
      disabled,
      size,
      disabledColor,
      color,
      voidColor,
      allowHalf,
    } = this.data
    return (
      <View
        className={utils.bem('rate') + ' custom-class'}
        onTouchmove={this.onTouchMove}
      >
        {innerCountArray.map((item, index) => {
          return (
            <View
              className={utils.bem('rate__item')}
              key={item.index}
              style={style({
                paddingRight:
                  index !== count - 1 ? utils.addUnit(gutter) : null,
              })}
            >
              <VanIcon
                name={index + 1 <= innerValue ? icon : voidIcon}
                className={utils.bem('rate__icon', [
                  {
                    disabled,
                    full: index + 1 <= innerValue,
                  },
                ])}
                style={style({
                  fontSize: utils.addUnit(size),
                })}
                customClass="icon-class"
                data-score={index}
                color={
                  disabled
                    ? disabledColor
                    : index + 1 <= innerValue
                    ? color
                    : voidColor
                }
                onClick={this.onSelect}
              ></VanIcon>
              {allowHalf && (
                <VanIcon
                  name={index + 0.5 <= innerValue ? icon : voidIcon}
                  className={utils.bem('rate__icon', [
                    'half',
                    {
                      disabled,
                      full: index + 0.5 <= innerValue,
                    },
                  ])}
                  style={style({
                    fontSize: utils.addUnit(size),
                  })}
                  customClass="icon-class"
                  data-score={index - 0.5}
                  color={
                    disabled
                      ? disabledColor
                      : index + 0.5 <= innerValue
                      ? color
                      : voidColor
                  }
                  onClick={this.onSelect}
                ></VanIcon>
              )}
            </View>
          )
        })}
      </View>
    )
  }
}
export default _C
