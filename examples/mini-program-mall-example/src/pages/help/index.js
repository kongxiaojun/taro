import {Block, ScrollView, View} from '@tarojs/components'
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
import WXAPI from '../../apifm-wxapi'

@withWeapp({
    data: {},
    onLoad: function (options) {
        this.category()
    },
    onShow: function () {
    },
    async category() {
        const res = await WXAPI.cmsCategories()
        if (res.code == 0) {
            const category = res.data.filter((ele) => {
                return ele.type == 'qa'
            })
            this.setData({
                category: category,
            })
            if (category && category.length > 0) {
                this.articles(category[0].id)
            }
        }
    },
    async articles(categoryId) {
        Taro.showLoading({
            title: '',
        })
        const res = await WXAPI.cmsArticles({
            categoryId,
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
    categoryChange(e) {
        const index = e.detail
        const category = this.data.category[index]
        this.articles(category.id)
    },
})
class _C extends React.Component {
    render() {
        const {cmsArticles, category, activeCategory} = this.data
        console.log("help index", cmsArticles)
        return (
            //     <scroll-view class="category" scroll-y="true" scroll-with-animation="true">
            //       <van-sidebar bind:change="categoryChange">
            //         <van-sidebar-item wx:for="{{category}}" wx:key="id" title="{{item.name}}" />
            //       </van-sidebar>
            //     </scroll-view>
            // <scroll-view class="articles" scroll-y="true" scroll-top="{{scrolltop}}">
            //   <van-empty wx:if="{{!cmsArticles}}" description="暂无记录" />
            //   <van-cell wx:for="{{cmsArticles}}" wx:key="id" title="{{item.title}}" is-link url="/pages/help/detail?id={{item.id}}" />
            // </scroll-view>
            <View className={"helpmain"}>
                <View className="category">
                    {category && <VanSidebar customClass="sidebar-l" activeKey={activeCategory}>
                        {category.map((item, index) => {
                            return item.level === 1 && (
                                <VanSidebarItem
                                    id={'category' + item.id}
                                    key={item.id}
                                    data-idx={index}
                                    onClick={this.categoryChange}
                                    title={item.name}
                                ></VanSidebarItem>
                            )
                        })}
                    </VanSidebar>}
                </View>
                <ScrollView class="articles" scrollY={true}>
                    {!cmsArticles && <VanEmpty description="暂无记录"></VanEmpty>}
                    {cmsArticles && cmsArticles.map((item, index) => {
                        return <VanCell title={item.title} url={`/pages/help/detail?id=${item.id}`}></VanCell>
                    })
                    }
                </ScrollView>
            </View>

        )
    }
}

export default _C
