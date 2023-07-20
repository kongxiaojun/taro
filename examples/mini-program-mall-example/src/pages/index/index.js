import {
    Block,
    View,
    Input,
    Navigator,
    Image,
    Text,
    Swiper,
    SwiperItem,
    Button,
} from '@tarojs/components'
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
import goodsDetailPage from '../../imports/goodsDetailPage1.js'
import './index.scss'
import WXAPI from '../../apifm-wxapi'

const TOOLS = require('../../utils/tools.js')
const AUTH = require('../../utils/auth.js')
const CONFIG = require('../../config.js')
const APP = Taro.getApp()

@withWeapp({
    data: {
        inputVal: '',
        // 搜索框内容
        goodsRecommend: [],
        // 推荐商品
        kanjiaList: [],
        //砍价商品列表
        pingtuanList: [],
        //拼团商品列表
        loadingHidden: false,
        // loading
        selectCurrent: 0,
        categories: [],
        goods: [],
        loadingMoreHidden: true,
        coupons: [],
        curPage: 1,
        pageSize: 20,
        menuButtonObject: {},
        banners: [],
        cmsCategories: [],
        adPositionIndexPop: {},
    },
    tabClick(e) {
        // 商品分类点击
        const category = this.data.categories.find((ele) => {
            return ele.id == e.currentTarget.dataset.id
        })
        if (category.vopCid1 || category.vopCid2) {
            Taro.navigateTo({
                url:
                    '/pages/goods/list-vop?cid1=' +
                    (category.vopCid1 ? category.vopCid1 : '') +
                    '&cid2=' +
                    (category.vopCid2 ? category.vopCid2 : ''),
            })
        } else {
            Taro.setStorageSync('_categoryId', category.id)
            Taro.switchTab({
                url: '/pages/category/category',
            })
        }
    },
    tabClickCms(e) {
        // 文章分类点击
        const category = this.data.cmsCategories[e.currentTarget.dataset.idx]
        Taro.navigateTo({
            url: '/pages/cms/list?categoryId=' + category.id,
        })
    },
    toDetailsTap: function (e) {
        console.log(e)
        const id = e.currentTarget.dataset.id
        const supplytype = e.currentTarget.dataset.supplytype
        const yyId = e.currentTarget.dataset.yyid
        if (supplytype == 'cps_jd') {
            Taro.navigateTo({
                url: `/packageCps/pages/goods-details/cps-jd?id=${id}`,
            })
        } else if (supplytype == 'vop_jd') {
            Taro.navigateTo({
                url: `/pages/goods-details/vop?id=${yyId}&goodsId=${id}`,
            })
        } else if (supplytype == 'cps_pdd') {
            Taro.navigateTo({
                url: `/packageCps/pages/goods-details/cps-pdd?id=${id}`,
            })
        } else if (supplytype == 'cps_taobao') {
            Taro.navigateTo({
                url: `/packageCps/pages/goods-details/cps-taobao?id=${id}`,
            })
        } else {
            Taro.navigateTo({
                url: `/pages/goods-details/index?id=${id}`,
            })
        }
    },
    tapBanner: function (e) {
        const url = e.currentTarget.dataset.url
        if (url) {
            Taro.navigateTo({
                url,
            })
        }
    },
    adClick: function (e) {
        const url = e.currentTarget.dataset.url
        if (url) {
            Taro.navigateTo({
                url,
            })
        }
    },
    bindTypeTap: function (e) {
        this.setData({
            selectCurrent: e.index,
        })
    },
    onLoad: function (e) {
        // TODO 不支持的API
        // Taro.showShareMenu({
        //   withShareTicket: true,
        // })
        const that = this
        // 读取分享链接中的邀请人编号
        if (e && e.inviter_id) {
            Taro.setStorageSync('referrer', e.inviter_id)
        }
        // 读取小程序码中的邀请人编号
        if (e && e.scene) {
            const scene = decodeURIComponent(e.scene)
            if (scene) {
                Taro.setStorageSync('referrer', scene.substring(11))
            }
        }
        // 静默式授权注册/登陆
        // AUTH.checkHasLogined().then((isLogined) => {
        //   if (!isLogined) {
        //     AUTH.authorize().then((aaa) => {
        //       if (CONFIG.bindSeller) {
        //         AUTH.bindSeller()
        //       }
        //       TOOLS.showTabBarBadge()
        //     })
        //   } else {
        //     if (CONFIG.bindSeller) {
        //       AUTH.bindSeller()
        //     }
        //     TOOLS.showTabBarBadge()
        //   }
        // })
        this.initBanners()
        this.categories()
        this.cmsCategories()
        // https://www.yuque.com/apifm/nu0f75/wg5t98
        WXAPI.goodsv2({
            recommendStatus: 1,
        }).then((res) => {
            if (res.code === 0) {
                that.setData({
                    goodsRecommend: res.data.result,
                })
            }
        })
        that.getCoupons()
        that.getNotice()
        that.kanjiaGoods()
        that.pingtuanGoods()
        this.adPosition()
        // 读取系统参数
        this.readConfigVal()
        Taro.getApp().configLoadOK = () => {
            this.readConfigVal()
        }
    },
    readConfigVal() {
        Taro.setNavigationBarTitle({
            title: Taro.getStorageSync('mallName'),
        })
        this.setData({
            mallName: Taro.getStorageSync('mallName')
                ? Taro.getStorageSync('mallName')
                : '',
            show_buy_dynamic: Taro.getStorageSync('show_buy_dynamic'),
        })
        const shopMod = Taro.getStorageSync('shopMod')
        const shopInfo = Taro.getStorageSync('shopInfo')
        if (shopMod == '1' && !shopInfo) {
            Taro.redirectTo({
                url: '/pages/shop/select',
            })
        }
    },
    async miaoshaGoods() {
        // https://www.yuque.com/apifm/nu0f75/wg5t98
        const res = await WXAPI.goodsv2({
            miaosha: true,
        })
        if (res.code == 0) {
            res.data.result.forEach((ele) => {
                const _now = new Date().getTime()
                if (ele.dateStart) {
                    ele.dateStartInt =
                        new Date(ele.dateStart.replace(/-/g, '/')).getTime() - _now
                }
                if (ele.dateEnd) {
                    ele.dateEndInt =
                        new Date(ele.dateEnd.replace(/-/g, '/')).getTime() - _now
                }
            })
            this.setData({
                miaoshaGoods: res.data.result,
            })
        }
    },
    async initBanners() {
        const _data = {}
        // 读取头部轮播图
        const res1 = await WXAPI.banners({
            type: 'index',
        })
        console.log("initBanners", res1)
        if (res1.code == 700) {
            Taro.showModal({
                title: '提示',
                content: '请在后台添加 banner 轮播图片，自定义类型填写 index',
                showCancel: false,
            })
        } else {
            _data.banners = res1.data
        }
        this.setData(_data)
    },
    onShow: function (e) {
        this.setData({
            navHeight: APP.globalData.navHeight,
            navTop: APP.globalData.navTop,
            windowHeight: APP.globalData.windowHeight,
            menuButtonObject: APP.globalData.menuButtonObject, //小程序胶囊信息
        })

        this.setData({
            shopInfo: Taro.getStorageSync('shopInfo'),
        })
        // 获取购物车数据，显示TabBarBadge
        TOOLS.showTabBarBadge()
        this.goodsDynamic()
        this.miaoshaGoods()
        const refreshIndex = Taro.getStorageSync('refreshIndex')
        if (refreshIndex) {
            this.onPullDownRefresh()
            Taro.removeStorageSync('refreshIndex')
        }
    },
    async goodsDynamic() {
        const res = await WXAPI.goodsDynamic(0)
        if (res.code == 0) {
            this.setData({
                goodsDynamic: res.data,
            })
        }
    },
    async categories() {
        const res = await WXAPI.goodsCategory()
        let categories = []
        if (res.code == 0) {
            const _categories = res.data.filter((ele) => {
                return ele.level == 1
            })
            categories = categories.concat(_categories)
        }
        this.setData({
            categories: categories,
            curPage: 1,
        })
        this.getGoodsList(0)
    },
    async getGoodsList(categoryId, append) {
        if (categoryId == 0) {
            categoryId = ''
        }
        Taro.showLoading({
            mask: true,
        })
        // https://www.yuque.com/apifm/nu0f75/wg5t98
        const res = await WXAPI.goodsv2({
            categoryId: categoryId,
            page: this.data.curPage,
            pageSize: this.data.pageSize,
        })
        Taro.hideLoading()
        if (res.code == 404 || res.code == 700) {
            let newData = {
                loadingMoreHidden: false,
            }
            if (!append) {
                newData.goods = []
            }
            this.setData(newData)
            return
        }
        let goods = []
        if (append) {
            goods = this.data.goods
        }
        if (res.data) {
            for (var i = 0; i < res.data.result.length; i++) {
                goods.push(res.data.result[i])
            }
        }
        this.setData({
            loadingMoreHidden: true,
            goods: goods,
        })
    },
    getCoupons: function () {
        var that = this
        WXAPI.coupons().then(function (res) {
            if (res.code == 0) {
                that.setData({
                    coupons: res.data,
                })
            }
        })
    },
    onShareAppMessage: function () {
        return {
            title:
                '"' +
                Taro.getStorageSync('mallName') +
                '" ' +
                Taro.getStorageSync('share_profile'),
            path: '/pages/index/index?inviter_id=' + Taro.getStorageSync('uid'),
        }
    },
    onShareTimeline() {
        return {
            title:
                '"' +
                Taro.getStorageSync('mallName') +
                '" ' +
                Taro.getStorageSync('share_profile'),
            query: 'inviter_id=' + Taro.getStorageSync('uid'),
            imageUrl: Taro.getStorageSync('share_pic'),
        }
    },
    getNotice: function () {
        var that = this
        WXAPI.noticeList({
            pageSize: 5,
        }).then(function (res) {
            if (res.code == 0) {
                that.setData({
                    noticeList: res.data,
                })
            }
        })
    },
    onReachBottom: function () {
        this.setData({
            curPage: this.data.curPage + 1,
        })
        this.getGoodsList(0, true)
    },
    onPullDownRefresh: function () {
        this.setData({
            curPage: 1,
        })
        this.getGoodsList(0)
        Taro.stopPullDownRefresh()
    },
    // 获取砍价商品
    async kanjiaGoods() {
        // https://www.yuque.com/apifm/nu0f75/wg5t98
        const res = await WXAPI.goodsv2({
            kanjia: true,
        })
        if (res.code == 0) {
            const kanjiaGoodsIds = []
            res.data.result.forEach((ele) => {
                kanjiaGoodsIds.push(ele.id)
            })
            const goodsKanjiaSetRes = await WXAPI.kanjiaSet(kanjiaGoodsIds.join())
            if (goodsKanjiaSetRes.code == 0) {
                res.data.result.forEach((ele) => {
                    const _process = goodsKanjiaSetRes.data.find((_set) => {
                        return _set.goodsId == ele.id
                    })
                    if (_process) {
                        ele.process = (100 * _process.numberBuy) / _process.number
                        ele.process = ele.process.toFixed(0)
                    }
                })
                this.setData({
                    kanjiaList: res.data.result,
                })
            }
        }
    },
    goCoupons: function (e) {
        Taro.switchTab({
            url: '/pages/coupons/index',
        })
    },
    pingtuanGoods() {
        // 获取团购商品列表
        const _this = this
        // https://www.yuque.com/apifm/nu0f75/wg5t98
        WXAPI.goodsv2({
            pingtuan: true,
        }).then((res) => {
            if (res.code === 0) {
                _this.setData({
                    pingtuanList: res.data.result,
                })
            }
        })
    },
    goSearch() {
        Taro.navigateTo({
            url: '/pages/search/index',
        })
    },
    goNotice(e) {
        const id = e.currentTarget.dataset.id
        Taro.navigateTo({
            url: '/pages/notice/show?id=' + id,
        })
    },
    async adPosition() {
        let res = await WXAPI.adPosition('indexPop')
        if (res.code == 0) {
            this.setData({
                adPositionIndexPop: res.data,
            })
        } else {
            // 没有广告位，弹出编辑昵称头像框
            APP.initNickAvatarUrlPOP(this)
        }
        res = await WXAPI.adPosition('index-live-pic')
        if (res.code == 0) {
            this.setData({
                adPositionIndexLivePic: res.data,
            })
        }
    },
    clickAdPositionIndexLive() {
        if (
            !this.data.adPositionIndexLivePic ||
            !this.data.adPositionIndexLivePic.url
        ) {
            return
        }
        Taro.navigateTo({
            url: this.data.adPositionIndexLivePic.url,
        })
    },
    closeAdPositionIndexPop() {
        this.setData({
            adPositionIndexPop: null,
        })
        // 关闭广告位，弹出编辑昵称头像框
        // APP.initNickAvatarUrlPOP(this)
    },
    clickAdPositionIndexPop() {
        const adPositionIndexPop = this.data.adPositionIndexPop
        this.setData({
            adPositionIndexPop: null,
        })
        // 点击广告位，弹出编辑昵称头像框
        // APP.initNickAvatarUrlPOP(this)
        if (!adPositionIndexPop || !adPositionIndexPop.url) {
            return
        }
        Taro.navigateTo({
            url: adPositionIndexPop.url,
        })
    },
    async cmsCategories() {
        // https://www.yuque.com/apifm/nu0f75/slu10w
        const res = await WXAPI.cmsCategories()
        if (res.code == 0) {
            const cmsCategories = res.data.filter((ele) => {
                return ele.type == 'index' // 只筛选类型为 index 的分类
            })

            this.setData({
                cmsCategories,
            })
        }
    },
})
class _C extends React.Component {
    render() {
        const {
            navHeight,
            navTop,
            mallName,
            menuButtonObject,
            name,
            shopInfo,
            banners,
            goodsDynamic,
            show_buy_dynamic,
            categories,
            cmsCategories,
            noticeList,
            adPositionIndexLivePic,
            miaoshaGoods,
            goodsRecommend,
            kanjiaList,
            pingtuanList,
            goods,
            loadingMoreHidden,
            adPositionIndexPop,
            nickPopShow,
            popavatarUrl,
            popnick,
        } = this.data

        console.log("index this.data", this.data)

        return (
            <Block>
                <VanSticky>
                    <View className="search-container">
                      {navHeight && <View
                            className="search"
                            style={{height: navHeight + 'px', paddingTop: navTop + 'px'}}
                        >
                            <View
                                className="search-title"
                                style={{
                                  height: (navHeight - navTop - 5) + 'px',
                                  lineHeight:(navHeight - navTop - 5) + 'px',
                                  width: (132 / 52) * (navHeight - navTop - 5) + 'px'
                                }}
                            >
                                {mallName}
                            </View>
                            <Input
                                placeholderClass="search-placeholder"
                                style={{
                                    width:
                                    (menuButtonObject.left -
                                        18 -
                                        (132 / 52) * (navHeight - navTop - 5)) +
                                    'px'
                                }}
                                type="text"
                                placeholder="输入关键词搜索"
                                disabled
                                value={name}
                                onInput={this.bindinput}
                                onClick={this.goSearch}
                            ></Input>
                        </View>}
                    </View>
                </VanSticky>
                {shopInfo && (
                    <Navigator url="/pages/shop/select">
                        <View className="shops-container">
                            <View className="l">
                                <Image
                                    src={require('../../images/order-details/icon-address.png')}
                                ></Image>
                                <Text>{shopInfo.name}</Text>
                            </View>
                            <View className="r">
                                <Text>切换门店</Text>
                                <Image src={require('../../images/icon/next.png')}></Image>
                            </View>
                        </View>
                    </Navigator>
                )}
                <View className="swiper-container1">
                    {banners && <Swiper
                        className="swiper1"
                        indicatorDots="true"
                        indicatorActiveColor="#fff"
                        autoplay
                        circular
                    >
                        {banners.map((item, index) => {
                            return (
                                <SwiperItem key={item.id}>
                                    <Image
                                        mode="aspectFill"
                                        onClick={this.tapBanner}
                                        data-url={item.linkUrl}
                                        src={item.picUrl}
                                    ></Image>
                                </SwiperItem>
                            )
                        })}
                    </Swiper>}
                    {goodsDynamic && show_buy_dynamic == '1' && (
                        <View className="goodsDynamic">
                            <Swiper className="swiper2" autoplay circular vertical>
                                {goodsDynamic.map((item, index) => {
                                    return (
                                        <Navigator key={item.index} url={goodsDetailPage.url(item)}>
                                            <SwiperItem>
                                                <View className="goodsDynamic-item">
                                                    <Image mode="aspectFill" src={item.avatarUrl}></Image>
                                                    <Text>{item.nick + ' 购买了 ' + item.goodsName}</Text>
                                                </View>
                                            </SwiperItem>
                                        </Navigator>
                                    )
                                })}
                            </Swiper>
                        </View>
                    )}
                </View>
                <View className="category-container">
                    <View className="category-box">
                        {categories.map((item, index) => {
                            return (
                                <View className="category-list" key={item.id}>
                                    <View
                                        className="category-column"
                                        onClick={this.tabClick}
                                        data-id={item.id}
                                    >
                                        <Image
                                            mode="aspectFill"
                                            className="category-imgbox"
                                            src={item.icon}
                                        ></Image>
                                        <View className="category-title">{item.name}</View>
                                    </View>
                                </View>
                            )
                        })}
                        {cmsCategories.map((item, index) => {
                            return (
                                <View className="category-list" key={item.id}>
                                    <View
                                        className="category-column"
                                        onClick={this.tabClickCms}
                                        data-idx={index}
                                    >
                                        <Image
                                            mode="aspectFill"
                                            className="category-imgbox"
                                            src={item.icon}
                                        ></Image>
                                        <View className="category-title">{item.name}</View>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                </View>
                {/*TODO 首页通知栏暂时去掉*/}
                {/*{noticeList && (*/}
                {/*  <View className="notice-box">*/}
                {/*    <Swiper*/}
                {/*      className="notice_swiper"*/}
                {/*      vertical*/}
                {/*      autoplay*/}
                {/*      circular*/}
                {/*      interval="8000"*/}
                {/*    >*/}
                {/*      {noticeList.dataList.map((item, index) => {*/}
                {/*        return (*/}
                {/*          <SwiperItem key={item.id}>*/}
                {/*            {item && (*/}
                {/*              <VanNoticeBar*/}
                {/*                mode="link"*/}
                {/*                text={item.title}*/}
                {/*                background="#FFFFFF"*/}
                {/*                data-id={item.id}*/}
                {/*                speed="30"*/}
                {/*                onClick={this.goNotice}*/}
                {/*                renderLefticon={*/}
                {/*                  <Block>*/}
                {/*                    <Image*/}
                {/*                      className="notice-icon"*/}
                {/*                      src={require('../../images/home/notice.png')}*/}
                {/*                    ></Image>*/}
                {/*                  </Block>*/}
                {/*                }*/}
                {/*              ></VanNoticeBar>*/}
                {/*            )}*/}
                {/*          </SwiperItem>*/}
                {/*        )*/}
                {/*      })}*/}
                {/*    </Swiper>*/}
                {/*  </View>*/}
                {/*)}*/}
                <View className="container">
                    {adPositionIndexLivePic && (
                        <Image
                            className="live-banner"
                            src={adPositionIndexLivePic.val}
                            mode="widthFix"
                            onClick={this.clickAdPositionIndexLive}
                        ></Image>
                    )}
                    {/*  秒杀开始  */}
                    {miaoshaGoods && miaoshaGoods.length > 0 && (
                        <Block>
                            <VanDivider customClass="table-text" contentPosition="center">
                                <Image
                                    className="table-icon-miaosha"
                                    src={require('../../images/home/miaosha.png')}
                                ></Image>
                                限时秒杀
                            </VanDivider>
                            <View className="miaosha-container">
                                {miaoshaGoods.map((item, index) => {
                                    return (
                                        <View
                                            className="miaosha-goods-list"
                                            key={item.id}
                                            onClick={this.toDetailsTap}
                                            data-id={item.id}
                                            data-supplytype={item.supplyType}
                                            data-yyid={item.yyId}
                                        >
                                            <Image
                                                src={item.pic}
                                                className="image"
                                                mode="aspectFill"
                                                lazyLoad="true"
                                            ></Image>
                                            <View className="r">
                                                <View className="goods-title">{item.name}</View>
                                                <View className="count-down">
                                                    {item.dateStartInt > 0 && (
                                                        <VanCountDown
                                                            time={item.dateStartInt}
                                                            format={
                                                                item.dateStartInt > 86400000
                                                                    ? '距离开始: DD 天 HH 时 mm 分 ss 秒'
                                                                    : '距离开始: HH 时 mm 分 ss 秒'
                                                            }
                                                        ></VanCountDown>
                                                    )}
                                                    {item.dateStartInt <= 0 && item.dateEndInt > 0 && (
                                                        <VanCountDown
                                                            time={item.dateEndInt}
                                                            format={
                                                                item.dateEndInt > 86400000
                                                                    ? '剩余: DD 天 HH 时 mm 分 ss 秒'
                                                                    : '剩余: HH 时 mm 分 ss 秒'
                                                            }
                                                        ></VanCountDown>
                                                    )}
                                                </View>
                                                <View className="miaosha-price-btn">
                                                    <View className="price">
                                                        {'￥' + item.minPrice}
                                                        <Text>{'￥' + item.originalPrice}</Text>
                                                    </View>
                                                    {item.dateStartInt > 0 && (
                                                        <VanButton
                                                            customClass="msbtn"
                                                            type="danger"
                                                            size="small"
                                                            round
                                                            plain
                                                            disabled
                                                        >
                                                            未开始
                                                        </VanButton>
                                                    )}
                                                    {item.dateEndInt <= 0 && (
                                                        <VanButton
                                                            customClass="msbtn"
                                                            type="danger"
                                                            size="small"
                                                            disabled
                                                            round
                                                        >
                                                            已结束
                                                        </VanButton>
                                                    )}
                                                    {item.stores <= 0 && (
                                                        <VanButton
                                                            customClass="msbtn"
                                                            type="danger"
                                                            size="small"
                                                            round
                                                            disabled
                                                        >
                                                            已抢完
                                                        </VanButton>
                                                    )}
                                                    {item.dateStartInt <= 0 &&
                                                    item.dateEndInt > 0 &&
                                                    item.stores > 0 && (
                                                        <VanButton
                                                            customClass="msbtn"
                                                            type="danger"
                                                            size="small"
                                                            round
                                                        >
                                                            马上抢
                                                        </VanButton>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                        </Block>
                    )}
                    {/*  秒杀结束  */}
                    <View className="space"></View>
                    {goodsRecommend.length > 0 && (
                        <VanDivider customClass="table-text" contentPosition="center">
                            <Image
                                className="table-icon-tuijian"
                                src={require('../../images/home/recommend.png')}
                            ></Image>
                            爆品推荐
                        </VanDivider>
                    )}
                    {goodsRecommend.length > 0 && (
                        <View className="goods-container">
                            {goodsRecommend.map((item, index) => {
                                return (
                                    <View
                                        className="goods-box"
                                        key={item.id}
                                        onClick={this.toDetailsTap}
                                        data-id={item.id}
                                        data-supplytype={item.supplyType}
                                        data-yyid={item.yyId}
                                    >
                                        <View className="img-box">
                                            <Image
                                                src={item.pic}
                                                className="image"
                                                mode="aspectFill"
                                                lazyLoad="true"
                                            ></Image>
                                        </View>
                                        <View className="goods-title van-multi-ellipsis--l2">
                                            {item.name}
                                        </View>
                                        {item.characteristic && (
                                            <View
                                                className="characteristic van-multi-ellipsis--l2"
                                                style={{webkitLineClamp: 1}}
                                            >
                                                {item.characteristic}
                                            </View>
                                        )}
                                        <View style={{display:"flex"}}>
                                            <View className="goods-price">
                                                {'¥ ' + item.minPrice}
                                            </View>
                                            {item.originalPrice && item.originalPrice > 0 ? (
                                                <View
                                                    className="goods-price"
                                                    style={{color:"#aaa",textDecoration:"line-through"}}
                                                >
                                                    {'¥ ' + item.originalPrice}
                                                </View>
                                            ) : ''}
                                        </View>
                                    </View>
                                )
                            })}
                        </View>
                    )}
                    <View className="space"></View>
                    {kanjiaList.length > 0 && (<View className="kanjia-container">
                        <VanDivider customClass="table-text" contentPosition="center">
                            <Image
                                className="table-icon-kanjia"
                                src={require('../../images/home/kanjia.png')}
                            ></Image>
                            疯狂砍价
                        </VanDivider>
                        {kanjiaList.map((item, index) => {
                            return (
                                <VanCard
                                    customClass="kanjia-vcard"
                                    key={item.id}
                                    price={item.kanjiaPrice}
                                    originPrice={item.originalPrice}
                                    desc={item.characteristic}
                                    title={item.name}
                                    thumb={item.pic}
                                    renderFooter={
                                        <Block>
                                            <View>
                                                <VanButton
                                                    customClass="kjbtn"
                                                    type="danger"
                                                    size="small"
                                                    data-id={item.id}
                                                    data-supplytype={item.supplyType}
                                                    data-yyid={item.yyId}
                                                    onClick={this.toDetailsTap}
                                                >
                                                    砍价
                                                </VanButton>
                                            </View>
                                        </Block>
                                    }
                                    renderPricetop={
                                        <Block>
                                            <View>
                                                <VanProgress
                                                    customClass="vprogress"
                                                    percentage={item.process}
                                                    color="#FDEDED;"
                                                ></VanProgress>
                                            </View>
                                        </Block>
                                    }
                                ></VanCard>
                            )
                        })}
                    </View>)}

                    {pingtuanList.length > 0 && (
                        <Block>
                            <View className="space"></View>
                            <VanDivider customClass="table-text" contentPosition="center">
                                <Image
                                    className="table-icon-pingtuan"
                                    src={require('../../images/home/pingtuan.png')}
                                ></Image>
                                全民拼团
                            </VanDivider>
                            <View className="tuan">
                                {pingtuanList.map((item, index) => {
                                    return (
                                        <View className="tuan-item" key={item.id}>
                                            <View className="tuan-goods-pic">
                                                <Image
                                                    src={item.pic}
                                                    mode="aspectFill"
                                                    aspectFillMode={"height"}
                                                    lazyLoad={true}
                                                    style={{height: '100%'}}
                                                ></Image>
                                            </View>
                                            <View className="tuan-title">{item.name}</View>
                                            <View className="tuan-profile">
                                                {item.characteristic}
                                            </View>
                                            {item.tags && (
                                                <VanTag customClass="pingtuantag" type="danger">
                                                    {item.tags}
                                                </VanTag>
                                            )}
                                            <View className="tuan-price">
                                                <Text className="now">
                                                    {'￥ ' + item.pingtuanPrice}
                                                </Text>
                                                <Text className="original">
                                                    {'￥ ' + item.originalPrice}
                                                </Text>
                                            </View>
                                            <View className="tuan-btn">
                                                <Button
                                                    className="ptbtn"
                                                    type="warn"
                                                    size="mini"
                                                    onClick={this.toDetailsTap}
                                                    data-id={item.id}
                                                    data-supplytype={item.supplyType}
                                                    data-yyid={item.yyId}
                                                >
                                                    拼团
                                                </Button>
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                        </Block>
                    )}
                    <View className="space"></View>
                    <VanDivider customClass="table-text" contentPosition="center">
                        <Image
                            className="table-icon-goodslist"
                            src={require('../../images/home/goodslist.png')}
                        ></Image>
                        商品列表
                    </VanDivider>
                    <View className="goods-container">
                        {goods.map((item, index) => {
                            return (
                                <View
                                    className="goods-box"
                                    key={item.id}
                                    onClick={this.toDetailsTap}
                                    data-id={item.id}
                                    data-supplytype={item.supplyType}
                                    data-yyid={item.yyId}
                                >
                                    <View className="img-box">
                                        <Image
                                            src={item.pic}
                                            className="image"
                                            mode="aspectFill"
                                            lazyLoad="true"
                                        ></Image>
                                    </View>
                                    <View className="goods-title van-multi-ellipsis--l2">
                                        {item.name}
                                    </View>
                                    {item.characteristic && (
                                        <View
                                            className="characteristic van-multi-ellipsis--l2"
                                            style={{webkitLineClamp: 1}}
                                        >
                                            {item.characteristic}
                                        </View>
                                    )}
                                    <View className="goods-price-container">
                                        <View className="goods-price">{'¥ ' + item.minPrice}</View>
                                        {item.originalPrice && item.originalPrice > 0 ? (
                                            <View className="goods-price2">
                                                {'¥ ' + item.originalPrice}
                                            </View>
                                        ) : ''}
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                    {!loadingMoreHidden && (
                        <VanDivider contentPosition="center">没有更多啦</VanDivider>
                    )}
                </View>
                <View className="coupons-float" onClick={this.goCoupons}>
                    <Image src={require('../../images/gift.png')}></Image>
                </View>
                {/*<VanOverlay show={adPositionIndexPop}>*/}
                {/*    <View className="adPositionIndexPop">*/}
                {/*        <Image*/}
                {/*            src={adPositionIndexPop.val}*/}
                {/*            mode="widthFix"*/}
                {/*            onClick={this.clickAdPositionIndexPop}*/}
                {/*        ></Image>*/}
                {/*        <VanIcon*/}
                {/*            customClass="close"*/}
                {/*            name="close"*/}
                {/*            size="64rpx"*/}
                {/*            color="#fff"*/}
                {/*            onClick={this.closeAdPositionIndexPop}*/}
                {/*        ></VanIcon>*/}
                {/*    </View>*/}
                {/*</VanOverlay>*/}
                {/*  弹出编辑昵称和头像的框  */}
                {/*<Login*/}
                {/*  show={nickPopShow}*/}
                {/*  avatarUrl={popavatarUrl}*/}
                {/*  name={popnick}*/}
                {/*></Login>*/}
            </Block>
        )
    }
}

export default _C
