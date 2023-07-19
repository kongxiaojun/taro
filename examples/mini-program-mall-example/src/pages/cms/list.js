import { Block } from '@tarojs/components'
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
import './list.scss'
import WXAPI from '../../apifm-wxapi'
@withWeapp({
  data: {
    categoryId: undefined, // 分类id
  },

  onLoad(options) {
    this.data.categoryId = options.categoryId
    this.cmsCategoryDetail()
    this.articles()
  },
  onShow: function () {},
  async cmsCategoryDetail() {
    const res = await WXAPI.cmsCategoryDetail(this.data.categoryId)
    if (res.code == 0) {
      this.setData({
        category: res.data,
      })
      Taro.setNavigationBarTitle({
        title: res.data.info.name,
      })
    }
  },
  async articles() {
    Taro.showLoading({
      title: '',
    })
    const res = await WXAPI.cmsArticles({
      categoryId: this.data.categoryId,
    })
    Taro.hideLoading()
    if (res.code == 0) {
      this.setData({
        cmsArticles: res.data,
      })
    } else {
      this.setData({
        cmsArticles: null,
      })
    }
  },
  onShareAppMessage: function () {
    return {
      title: this.data.category.info.name,
      path:
        '/pages/cms/list?categoryId=' +
        this.data.categoryId +
        '&inviter_id=' +
        Taro.getStorageSync('uid'),
    }
  },
  onShareTimeline() {
    return {
      title: this.data.category.info.name,
      query:
        'categoryId=' +
        this.data.categoryId +
        '&inviter_id=' +
        Taro.getStorageSync('uid'),
      imageUrl: this.data.category.info.icon,
    }
  },
})
class _C extends React.Component {
  render() {
    const { cmsArticles } = this.data
    return (
      <Block>
        {!cmsArticles && <VanEmpty description="暂无记录"></VanEmpty>}
        {cmsArticles.map((item, index) => {
          return (
            <VanCell
              key={item.id}
              title={item.title}
              isLink
              url={'/pages/help/detail?id=' + item.id}
            ></VanCell>
          )
        })}
      </Block>
    )
  }
}
export default _C
