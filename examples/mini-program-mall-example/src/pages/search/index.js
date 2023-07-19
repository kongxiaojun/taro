import { Block, View } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import VanArea from '../../@vant/weapp/area/index'
import VanDatetimePicker from '../../@vant/weapp/datetime-picker/index'
import VanOverlay from '../../@vant/weapp/overlay/index'
import VanTabs from '../../@vant/weapp/tabs/index'
import VanTab from '../../@vant/weapp/tab/index'
import VanImage from '../../@vant/weapp/image/index'
import VanGridItem from '../../@vant/weapp/grid-item/index'
import VanGrid from '../../@vant/weapp/grid/index'
import VanUploader from '../../@vant/weapp/uploader/index'
import VanRate from '../../@vant/weapp/rate/index'
import VanSwitch from '../../@vant/weapp/switch/index'
import VanCalendar from '../../@vant/weapp/calendar/index'
import VanSwipeCell from '../../@vant/weapp/swipe-cell/index'
import VanDialog from '../../@vant/weapp/dialog/index'
import VanSticky from '../../@vant/weapp/sticky/index'
import VanStepper from '../../@vant/weapp/stepper/index'
import VanPicker from '../../@vant/weapp/picker/index'
import VanPopup from '../../@vant/weapp/popup/index'
import VanGoodsActionButton from '../../@vant/weapp/goods-action-button/index'
import VanGoodsActionIcon from '../../@vant/weapp/goods-action-icon/index'
import VanGoodsAction from '../../@vant/weapp/goods-action/index'
import VanEmpty from '../../@vant/weapp/empty/index'
import VanSidebarItem from '../../@vant/weapp/sidebar-item/index'
import VanSidebar from '../../@vant/weapp/sidebar/index'
import VanRadioGroup from '../../@vant/weapp/radio-group/index'
import VanRadio from '../../@vant/weapp/radio/index'
import VanField from '../../@vant/weapp/field/index'
import VanSubmitBar from '../../@vant/weapp/submit-bar/index'
import VanProgress from '../../@vant/weapp/progress/index'
import VanCard from '../../@vant/weapp/card/index'
import VanTag from '../../@vant/weapp/tag/index'
import VanCellGroup from '../../@vant/weapp/cell-group/index'
import VanCell from '../../@vant/weapp/cell/index'
import VanButton from '../../@vant/weapp/button/index'
import VanCountDown from '../../@vant/weapp/count-down/index'
import VanIcon from '../../@vant/weapp/icon/index'
import VanDivider from '../../@vant/weapp/divider/index'
import VanSearch from '../../@vant/weapp/search/index'
import VanNoticeBar from '../../@vant/weapp/notice-bar/index'
import MpHtml from '../../mp-html'
import Login from '../../components/login/index'
import GoodsPop from '../../components/goods-pop/index'
import Fuwuxieyi from '../../components/fuwuxieyi/index'
import './index.scss'
@withWeapp({
  data: {},
  onLoad: function (options) {
    this.setData({
      list: Taro.getStorageSync('searchHis'),
    })
  },
  onShow: function () {},
  search(e) {
    this.setData({
      inputVal: e.detail,
    })
    if (e.detail) {
      let searchHis = Taro.getStorageSync('searchHis')
      if (!searchHis) {
        searchHis = [e.detail]
      }
      if (!searchHis.includes(e.detail)) {
        searchHis.push(e.detail)
      }
      Taro.setStorageSync('searchHis', searchHis)
      this.setData({
        list: searchHis,
      })
    }
    Taro.redirectTo({
      url: '/pages/goods/list?name=' + this.data.inputVal,
    })
  },
  onClose(e) {
    const idx = e.currentTarget.dataset.idx
    const searchHis = this.data.list
    searchHis.splice(idx, 1)
    Taro.setStorageSync('searchHis', searchHis)
    this.setData({
      list: searchHis,
    })
  },
  go(e) {
    const idx = e.currentTarget.dataset.idx
    const keywords = this.data.list[idx]
    Taro.redirectTo({
      url: '/pages/goods/list?name=' + keywords,
    })
  },
  searchscan() {
    Taro.scanCode({
      scanType: ['barCode', 'qrCode', 'datamatrix', 'pdf417'],
      success: (res) => {
        Taro.redirectTo({
          url: '/pages/goods/list?name=' + res.result,
        })
      },
    })
  },
})
class _C extends React.Component {
  render() {
    const { list } = this.data
    return (
      <Block>
        <VanSearch
          placeholder="请输入搜索关键词"
          focus
          onSearch={this.search}
          useRightIconSlot
          renderRighticon={
            <Block>
              <VanIcon name="scan" onClick={this.searchscan}></VanIcon>
            </Block>
          }
        ></VanSearch>
        {(!list || list.length == 0) && (
          <VanEmpty description="暂无历史搜索"></VanEmpty>
        )}
        {list && list.length > 0 && (
          <VanCellGroup title="历史搜索">
            {list.map((item, index) => {
              return (
                <VanCell
                  key={item}
                  renderTitle={
                    <Block>
                      <View>
                        <View data-idx={index} onClick={this.go}>
                          {item}
                        </View>
                      </View>
                    </Block>
                  }
                >
                  <VanTag
                    closeable
                    size="medium"
                    type="primary"
                    id="primary"
                    data-idx={index}
                    onClose={this.onClose}
                  >
                    删除
                  </VanTag>
                </VanCell>
              )
            })}
          </VanCellGroup>
        )}
      </Block>
    )
  }
}
export default _C
