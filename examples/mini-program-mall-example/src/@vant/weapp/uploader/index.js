import { Block, View, Image, Video, Text, Slot } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import utils from '../wxs/utils.wxs.js'
import computed from './index.wxs.js'
import { VantComponent } from '../common/component.js'
import { isImageFile, chooseFile, isVideoFile } from './utils.js'
import {
  imageProps,
  videoProps,
  mediaProps,
  messageFileProps,
} from './shared.js'
import { isBoolean, isPromise } from '../common/validator.js'
import VanLoading from '../loading/index'
import VanIcon from '../icon/index'
import './index.scss'

@withWeapp(VantComponent({
    props: Object.assign(
        Object.assign(
            Object.assign(
                Object.assign(
                    {
                        disabled: Boolean,
                        multiple: Boolean,
                        uploadText: String,
                        useBeforeRead: Boolean,
                        afterRead: null,
                        beforeRead: null,
                        previewSize: {
                            type: null,
                            value: 80,
                        },
                        name: {
                            type: null,
                            value: '',
                        },
                        accept: {
                            type: String,
                            value: 'image',
                        },
                        fileList: {
                            type: Array,
                            value: [],
                            observer: 'formatFileList',
                        },
                        maxSize: {
                            type: Number,
                            value: Number.MAX_VALUE,
                        },
                        maxCount: {
                            type: Number,
                            value: 100,
                        },
                        deletable: {
                            type: Boolean,
                            value: true,
                        },
                        showUpload: {
                            type: Boolean,
                            value: true,
                        },
                        previewImage: {
                            type: Boolean,
                            value: true,
                        },
                        previewFullImage: {
                            type: Boolean,
                            value: true,
                        },
                        imageFit: {
                            type: String,
                            value: 'scaleToFill',
                        },
                        uploadIcon: {
                            type: String,
                            value: 'photograph',
                        },
                    },
                    imageProps
                ),
                videoProps
            ),
            mediaProps
        ),
        messageFileProps
    ),
    data: {
        lists: [],
        isInCount: true,
    },
    methods: {
        formatFileList() {
            const { fileList = [], maxCount } = this.data
            const lists = fileList.map((item) =>
                Object.assign(Object.assign({}, item), {
                    isImage: isImageFile(item),
                    isVideo: isVideoFile(item),
                    deletable: isBoolean(item.deletable) ? item.deletable : true,
                })
            )
            this.setData({
                lists,
                isInCount: lists.length < maxCount,
            })
        },
        getDetail(index) {
            return {
                name: this.data.name,
                index: index == null ? this.data.fileList.length : index,
            }
        },
        startUpload() {
            const { maxCount, multiple, lists, disabled } = this.data
            if (disabled) return
            chooseFile(
                Object.assign(Object.assign({}, this.data), {
                    maxCount: maxCount - lists.length,
                })
            )
                .then((res) => {
                    this.onBeforeRead(multiple ? res : res[0])
                })
                .catch((error) => {
                    this.$emit('error', error)
                })
        },
        onBeforeRead(file) {
            const { beforeRead, useBeforeRead } = this.data
            let res = true
            if (typeof beforeRead === 'function') {
                res = beforeRead(file, this.getDetail())
            }
            if (useBeforeRead) {
                res = new Promise((resolve, reject) => {
                    this.$emit(
                        'before-read',
                        Object.assign(
                            Object.assign(
                                {
                                    file,
                                },
                                this.getDetail()
                            ),
                            {
                                callback: (ok) => {
                                    ok ? resolve() : reject()
                                },
                            }
                        )
                    )
                })
            }
            if (!res) {
                return
            }
            if (isPromise(res)) {
                res.then((data) => this.onAfterRead(data || file))
            } else {
                this.onAfterRead(file)
            }
        },
        onAfterRead(file) {
            const { maxSize, afterRead } = this.data
            const oversize = Array.isArray(file)
                ? file.some((item) => item.size > maxSize)
                : file.size > maxSize
            if (oversize) {
                this.$emit(
                    'oversize',
                    Object.assign(
                        {
                            file,
                        },
                        this.getDetail()
                    )
                )
                return
            }
            if (typeof afterRead === 'function') {
                afterRead(file, this.getDetail())
            }
            this.$emit(
                'after-read',
                Object.assign(
                    {
                        file,
                    },
                    this.getDetail()
                )
            )
        },
        deleteItem(event) {
            const { index } = event.currentTarget.dataset
            this.$emit(
                'delete',
                Object.assign(Object.assign({}, this.getDetail(index)), {
                    file: this.data.fileList[index],
                })
            )
        },
        onPreviewImage(event) {
            if (!this.data.previewFullImage) return
            const { index } = event.currentTarget.dataset
            const { lists, showmenu } = this.data
            const item = lists[index]
            Taro.previewImage({
                urls: lists.filter((item) => isImageFile(item)).map((item) => item.url),
                current: item.url,
                showmenu,
                fail() {
                    Taro.showToast({
                        title: '预览图片失败',
                        icon: 'none',
                    })
                },
            })
        },
        onPreviewVideo(event) {
            if (!this.data.previewFullImage) return
            const { index } = event.currentTarget.dataset
            const { lists } = this.data
            const sources = []
            const current = lists.reduce((sum, cur, curIndex) => {
                if (!isVideoFile(cur)) {
                    return sum
                }
                sources.push(
                    Object.assign(Object.assign({}, cur), {
                        type: 'video',
                    })
                )
                if (curIndex < index) {
                    sum++
                }
                return sum
            }, 0)
            Taro.previewMedia({
                sources,
                current,
                fail() {
                    Taro.showToast({
                        title: '预览视频失败',
                        icon: 'none',
                    })
                },
            })
        },
        onPreviewFile(event) {
            const { index } = event.currentTarget.dataset
            Taro.openDocument({
                filePath: this.data.lists[index].url,
                showMenu: true,
            })
        },
        onClickPreview(event) {
            const { index } = event.currentTarget.dataset
            const item = this.data.lists[index]
            this.$emit(
                'click-preview',
                Object.assign(Object.assign({}, item), this.getDetail(index))
            )
        },
    },
}))
class _C extends React.Component {
  render() {
    const {
      imageFit,
      previewSize,
      deletable,
      lists,
      previewImage,
      showUpload,
      disabled,
      uploadIcon,
      uploadText,
      isInCount,
    } = this.data
    return (
      <View className="van-uploader">
        {lists.map((item, index) => {
          return (
            <View className="van-uploader__wrapper">
              {previewImage && (
                <Block>
                  {lists.map((item, index) => {
                    return (
                      <View
                        key={item.index}
                        className="van-uploader__preview"
                        data-index={index}
                        onClick={this.onClickPreview}
                      >
                        {item.isImage ? (
                          <Image
                            mode={imageFit}
                            src={item.thumb || item.url}
                            alt={item.name || '图片' + index}
                            className="van-uploader__preview-image"
                            style={computed.sizeStyle({
                              previewSize,
                            })}
                            data-index={index}
                            onClick={this.onPreviewImage}
                          ></Image>
                        ) : item.isVideo ? (
                          <Video
                            src={item.url}
                            title={item.name || '视频' + index}
                            poster={item.thumb}
                            autoplay={item.autoplay}
                            className="van-uploader__preview-image"
                            style={computed.sizeStyle({
                              previewSize,
                            })}
                            data-index={index}
                            onClick={this.onPreviewVideo}
                          ></Video>
                        ) : (
                          <View
                            className="van-uploader__file"
                            style={computed.sizeStyle({
                              previewSize,
                            })}
                            data-index={index}
                            onClick={this.onPreviewFile}
                          >
                            <VanIcon
                              name="description"
                              className="van-uploader__file-icon"
                            ></VanIcon>
                            <View className="van-uploader__file-name van-ellipsis">
                              {item.name || item.url}
                            </View>
                          </View>
                        )}
                        {(item.status === 'uploading' ||
                          item.status === 'failed') && (
                          <View className="van-uploader__mask">
                            {item.status === 'failed' ? (
                              <VanIcon
                                name="close"
                                className="van-uploader__mask-icon"
                              ></VanIcon>
                            ) : (
                              <VanLoading customClass="van-uploader__loading"></VanLoading>
                            )}
                            {item.message && (
                              <Text className="van-uploader__mask-message">
                                {item.message}
                              </Text>
                            )}
                          </View>
                        )}
                        {deletable && item.deletable && (
                          <View
                            data-index={index}
                            className="van-uploader__preview-delete"
                            onTap={this.privateStopNoop.bind(
                              this,
                              this.deleteItem
                            )}
                          >
                            <VanIcon
                              name="cross"
                              className="van-uploader__preview-delete-icon"
                            ></VanIcon>
                          </View>
                        )}
                      </View>
                    )
                  })}
                </Block>
              )}
              {/*  上传样式  */}
              {isInCount && (
                <Block>
                  <View
                    className="van-uploader__slot"
                    onClick={this.startUpload}
                  >
                    {this.props.children}
                  </View>
                  {/*  默认上传样式  */}
                  {showUpload && (
                    <View
                      className={
                        'van-uploader__upload ' +
                        (disabled ? 'van-uploader__upload--disabled' : '')
                      }
                      style={computed.sizeStyle({
                        previewSize,
                      })}
                      onClick={this.startUpload}
                    >
                      <VanIcon
                        name={uploadIcon}
                        className="van-uploader__upload-icon"
                      ></VanIcon>
                      {uploadText && (
                        <Text className="van-uploader__upload-text">
                          {uploadText}
                        </Text>
                      )}
                    </View>
                  )}
                </Block>
              )}
            </View>
          )
        })}
      </View>
    )
  }
}
export default _C
