import { Block, View } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import computed from './index.wxs.js'
import { VantComponent } from '../common/component.js'
import { pickerProps } from './shared.js'
import Loading from '../loading/index'
import PickerColumn from '../picker-column/index'
import './index.scss'

@withWeapp(VantComponent({
  classes: ['active-class', 'toolbar-class', 'column-class'],
  props: Object.assign(Object.assign({}, pickerProps), {
    valueKey: {
      type: String,
      value: 'text',
    },
    toolbarPosition: {
      type: String,
      value: 'top',
    },
    defaultIndex: {
      type: Number,
      value: 0,
    },
    columns: {
      type: Array,
      value: [],
      observer(columns = []) {
        this.simple = columns.length && !columns[0].values
        if (Array.isArray(this.children) && this.children.length) {
          this.setColumns().catch(() => {})
        }
      },
    },
  }),
  beforeCreate() {
    Object.defineProperty(this, 'children', {
      get: () => this.selectAllComponents('.van-picker__column') || [],
    })
  },
  methods: {
    noop() {},
    setColumns() {
      const { data } = this
      const columns = this.simple
          ? [
            {
              values: data.columns,
            },
          ]
          : data.columns
      const stack = columns.map((column, index) =>
          this.setColumnValues(index, column.values)
      )
      return Promise.all(stack)
    },
    emit(event) {
      const { type } = event.currentTarget.dataset
      if (this.simple) {
        this.$emit(type, {
          value: this.getColumnValue(0),
          index: this.getColumnIndex(0),
        })
      } else {
        this.$emit(type, {
          value: this.getValues(),
          index: this.getIndexes(),
        })
      }
    },
    onChange(event) {
      if (this.simple) {
        this.$emit('change', {
          picker: this,
          value: this.getColumnValue(0),
          index: this.getColumnIndex(0),
        })
      } else {
        this.$emit('change', {
          picker: this,
          value: this.getValues(),
          index: event.currentTarget.dataset.index,
        })
      }
    },
    // get column instance by index
    getColumn(index) {
      return this.children[index]
    },
    // get column value by index
    getColumnValue(index) {
      const column = this.getColumn(index)
      return column && column.getValue()
    },
    // set column value by index
    setColumnValue(index, value) {
      const column = this.getColumn(index)
      if (column == null) {
        return Promise.reject(new Error('setColumnValue: 对应列不存在'))
      }
      return column.setValue(value)
    },
    // get column option index by column index
    getColumnIndex(columnIndex) {
      return (this.getColumn(columnIndex) || {}).data.currentIndex
    },
    // set column option index by column index
    setColumnIndex(columnIndex, optionIndex) {
      const column = this.getColumn(columnIndex)
      if (column == null) {
        return Promise.reject(new Error('setColumnIndex: 对应列不存在'))
      }
      return column.setIndex(optionIndex)
    },
    // get options of column by index
    getColumnValues(index) {
      return (this.children[index] || {}).data.options
    },
    // set options of column by index
    setColumnValues(index, options, needReset = true) {
      const column = this.children[index]
      if (column == null) {
        return Promise.reject(new Error('setColumnValues: 对应列不存在'))
      }
      const isSame =
          JSON.stringify(column.data.options) === JSON.stringify(options)
      if (isSame) {
        return Promise.resolve()
      }
      return column
          .set({
            options,
          })
          .then(() => {
            if (needReset) {
              column.setIndex(0)
            }
          })
    },
    // get values of all columns
    getValues() {
      return this.children.map((child) => child.getValue())
    },
    // set values of all columns
    setValues(values) {
      const stack = values.map((value, index) =>
          this.setColumnValue(index, value)
      )
      return Promise.all(stack)
    },
    // get indexes of all columns
    getIndexes() {
      return this.children.map((child) => child.data.currentIndex)
    },
    // set indexes of all columns
    setIndexes(indexes) {
      const stack = indexes.map((optionIndex, columnIndex) =>
          this.setColumnIndex(columnIndex, optionIndex)
      )
      return Promise.all(stack)
    },
  },
}))
class _C extends React.Component {
  render() {
    const {
      toolbarPosition,
      loading,
      itemHeight,
      visibleItemCount,
      valueKey,
      defaultIndex,
      columns,
      cancelButtonText,
      title,
      confirmButtonText,
    } = this.data
    return (
      <View className="van-picker custom-class">
        {toolbarPosition === 'top' && showToolbar && (
          <View className="van-picker__toolbar toolbar-class">
            <View
              className="van-picker__cancel"
              hoverClass="van-picker__cancel--hover"
              hoverStayTime="70"
              data-type="cancel"
              onClick={this.emit}
            >
              {cancelButtonText}
            </View>
            {title && (
              <View className="van-picker__title van-ellipsis">{title}</View>
            )}
            <View
              className="van-picker__confirm"
              hoverClass="van-picker__confirm--hover"
              hoverStayTime="70"
              data-type="confirm"
              onClick={this.emit}
            >
              {confirmButtonText}
            </View>
          </View>
        )}
        {loading && (
          <View className="van-picker__loading">
            <Loading color="#1989fa"></Loading>
          </View>
        )}
        <View
          className="van-picker__columns"
          style={computed.columnsStyle({
            itemHeight,
            visibleItemCount,
          })}
          onTouchmove={this.privateStopNoop.bind(this, this.noop)}
        >
          {computed.columns(columns).map((item, index) => {
            return (
              <PickerColumn
                className="van-picker__column"
                key={item.index}
                data-index={index}
                customClass="column-class"
                valueKey={valueKey}
                initialOptions={item.values}
                defaultIndex={item.defaultIndex || defaultIndex}
                itemHeight={itemHeight}
                visibleItemCount={visibleItemCount}
                activeClass="active-class"
                onChange={this.onChange}
              ></PickerColumn>
            )
          })}
          <View
            className="van-picker__mask"
            style={computed.maskStyle({
              itemHeight,
              visibleItemCount,
            })}
          ></View>
          <View
            className="van-picker__frame van-hairline--top-bottom"
            style={computed.frameStyle({
              itemHeight,
            })}
          ></View>
        </View>
        {toolbarPosition === 'bottom' && showToolbar && (
          <View className="van-picker__toolbar toolbar-class">
            <View
              className="van-picker__cancel"
              hoverClass="van-picker__cancel--hover"
              hoverStayTime="70"
              data-type="cancel"
              onClick={this.emit}
            >
              {cancelButtonText}
            </View>
            {title && (
              <View className="van-picker__title van-ellipsis">{title}</View>
            )}
            <View
              className="van-picker__confirm"
              hoverClass="van-picker__confirm--hover"
              hoverStayTime="70"
              data-type="confirm"
              onClick={this.emit}
            >
              {confirmButtonText}
            </View>
          </View>
        )}
      </View>
    )
  }
}
export default _C
