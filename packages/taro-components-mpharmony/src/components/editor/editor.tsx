import './style/quill.snow.css'

import { BaseEventOrig } from '@tarojs/components/dist/types/common'
import { EditorProps } from '@tarojs/components/dist/types/Editor'
import React, { Component, useState } from 'react'

import ReactQuill, { Quill, UnprivilegedEditor } from './react-quill'

// https://developers.weixin.qq.com/miniprogram/dev/component/editor.html
// 不支持以下属性:
// show-img-size	boolean	false	否	点击图片时显示图片大小控件	2.7.0
// show-img-toolbar	boolean	false	否	点击图片时显示工具栏控件	2.7.0
// show-img-resize	boolean	false	否	点击图片时显示修改尺寸控件	2.7.0

export class Editor extends Component<EditorProps> {

  override render () {
    const [value, setValue] = useState('')
    const quillRef = React.createRef<ReactQuill>()

    const icons = Quill.import('ui/icons')
    icons.undo = 'UNDO'
    icons.redo = 'REDO'

    const modules = {
      history: {
        delay: 1000,
        maxStack: 100,
        userOnly: false
      }
    }

    return <>
      <ReactQuill
        theme="snow"
        ref={quillRef}
        modules={modules}
        readOnly={this.props.readOnly}
        placeholder={this.props.placeholder}
        value={value}
        onReady={(editor) => this.props.onReady?.(this.generateEditorEventOrig('onready', editor, quillRef))}
        onChange={(value, delta, source, editor) => { setValue(value); this.props.onInput?.(this.generateEditorEventOrig('oninput', editor, quillRef)) }}
        onBlur={(selection, source, editor) => this.props.onBlur?.(this.generateEditorEventOrig('onblur', editor, quillRef))}
        onFocus={(selection, source, editor) => this.props.onFocus?.(this.generateEditorEventOrig('onfocus', editor, quillRef))}
      ></ReactQuill>
    </>
  }

  generateEditorEventOrig (
    name: string,
    editor: UnprivilegedEditor,
    ref: React.RefObject<any>,
  ): BaseEventOrig<EditorProps.editorEventDetail> {
    return {
      type: name,
      timeStamp: new Date().getTime(),
      target: ref.current,
      currentTarget: ref.current,
      preventDefault: () => ref.current.preventDefault(),
      stopPropagation: () => ref.current.stopPropagation(),
      detail: { html: editor.getHTML(), text: editor.getText(), delta: editor.getContents() }
    }
  }

}
