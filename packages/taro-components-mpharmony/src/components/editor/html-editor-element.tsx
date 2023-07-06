import Taro from '@tarojs/taro'
import Quill, { DeltaStatic } from 'quill'
import React from 'react'

export default class HTMLEditorElement extends HTMLDivElement implements Taro.EditorContext {

  editor?: Quill

  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
  }

  setEditors (editor?: Quill) {
    this.editor = editor
  }

  getContext (): Taro.EditorContext {
    return this as Taro.EditorContext
  }

  getSelectionText (option?: Taro.EditorContext.getSelectionText.Option | undefined): void {
    try {
      const selection = this.editor?.getSelection()
      if (selection) {
        const selectionText = this.editor?.getText(selection.index, selection.length)
        if (selectionText) {
          option?.success?.({ errMsg: '', text: selectionText })
        }
      }
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `` })
    }
  }

  clear (option?: Taro.EditorContext.ClearOption | undefined): void {
    try {
      this.editor?.setText('')
      option?.success?.({ errMsg: `` })
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `` })
    }
  }

  format (name: string, value?: string | undefined): void {
    this.editor?.format(name, value)
  }

  getContents (option?: Taro.EditorContext.GetContents.Option | undefined): void {
    try {
      const editor = this.editor
      if (editor) {
        option?.success?.({
          errMsg: '',
          html: editor.root.innerHTML,
          text: editor.getText(),
          delta: editor.getContents(),
        })
      }
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `` })
    }

    option?.complete?.({ errMsg: `` })
  }

  insertDivider (option?: Taro.EditorContext.InsertDividerOption | undefined): void {
    try {
      option?.fail?.({ errMsg: 'not support EditorContext.insertDivider api.' })
    } finally {
      option?.complete?.({ errMsg: '' })
    }
  }

  insertImage (option: Taro.EditorContext.InsertImageOption): void {
    try {
      option.fail?.({ errMsg: 'not support EditorContext.insertImage api.' })
    } finally {
      option.complete?.({ errMsg: '' })
    }
  }

  insertText (option: Taro.EditorContext.InsertTextOption): void {
    try {
      const length = this.editor?.getLength() || 0
      this.editor?.insertText(length, option.text || '')
      option?.success?.({ errMsg: `` })
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `` })
    }
  }

  removeFormat (option?: Taro.EditorContext.RemoveFormatOption | undefined): void {
    try {
      const length = this.editor?.getLength() || -1
      if (length > 0) {
        this.editor?.removeFormat(0, length)
      }
      option?.success?.({ errMsg: `` })
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `` })
    }
  }

  setContents (option: Taro.EditorContext.SetContentsOption): void {
    try {

      const delta = option && option.delta
      const html = option && option.html
      if (delta) {
        try {
          this.editor?.setContents(delta as DeltaStatic)
        } catch (e) {
          if (html) {
            this.editor?.clipboard.dangerouslyPasteHTML(html)
          }
        }
      } else {
        if (html) {
          this.editor?.clipboard.dangerouslyPasteHTML(html)
        }
      }

      option?.success?.({ errMsg: `` })
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `` })
    }
  }

  redo (option?: Taro.EditorContext.RedoOption | undefined): void {
    try {
      // @react/quill version=1.3.10版本指定的ts中缺少history属性和接口定义导致实现undo、redo时无法引用， https://github.com/DefinitelyTyped/DefinitelyTyped/blob/11413d1988d3d7e081dc29e16356a85597885cd9/types/quill/index.d.ts
      // this.editor?.history?.redo()
      option?.success?.({ errMsg: `` })
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `` })
    }
  }

  undo (option?: Taro.EditorContext.UndoOption | undefined): void {
    try {
      // this.editor?.history?.undo()
      option?.success?.({ errMsg: `` })
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `` })
    }
  }

}

window.customElements.define('div-editor', HTMLEditorElement, { extends: 'div' })


declare global {
  namespace JSX {
    interface IntrinsicElements {
      'div-editor': React.DetailedHTMLProps<React.HTMLAttributes<HTMLEditorElement>, HTMLEditorElement>
    }
  }
}
