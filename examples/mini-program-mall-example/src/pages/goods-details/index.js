import {
    Block,
    View,
    ScrollView,
    Swiper,
    SwiperItem,
    Video,
    Image,
    Text,
    Button,
    Canvas,
} from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import WXAPI from '../../apifm-wxapi'

const TOOLS = require('../../utils/tools.js')
const AUTH = require('../../utils/auth.js')
const CONFIG = require('../../config.js')
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
import Poster from '../../wxa-plugin-canvas/poster'
import goodReputationPercent from '../../imports/goodReputationPercent6.js'
import './index.scss'
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import AtTabs from "../../at-tabs/AtTabs";

@withWeapp({
    data: {
        tabIndex: 0,
        createTabs: false,
        //绘制tabs
        goodsDetail: {},
        hasMoreSelect: false,
        selectSizePrice: 0,
        selectSizeOPrice: 0,
        totalScoreToPay: 0,
        shopNum: 0,
        hideShopPopup: true,
        buyNumber: 0,
        buyNumMin: 1,
        buyNumMax: 0,
        propertyChildIds: '',
        propertyChildNames: '',
        canSubmit: false,
        //  选中规格尺寸时候是否允许加入购物车
        shopType: 'addShopCar', //购物类型，加入购物车或立即购买，默认为加入购物车
    },

    bindscroll(e) {
        console.log("bindscroll", e)
        if (this.data.tabclicked) {
            return
        }
        //计算页面 轮播图、详情、评价(砍价)view 高度
        this.getTopHeightFunction()
        var tabsHeight = this.data.tabsHeight //顶部距离（tabs高度）
        if (
            this.data.tabs[0].topHeight - tabsHeight <= 0 &&
            0 < this.data.tabs[1].topHeight - tabsHeight
        ) {
            //临界值，根据自己的需求来调整
            this.setData({
                tabIndex: 0, //设置当前标签栏
            })
        } else if (this.data.tabs.length == 2) {
            this.setData({
                tabIndex: 1,
            })
        } else if (
            this.data.tabs[1].topHeight - tabsHeight <= 0 &&
            0 < this.data.tabs[2].topHeight - tabsHeight
        ) {
            this.setData({
                tabIndex: 1,
            })
        } else if (this.data.tabs[2].topHeight - tabsHeight <= 0) {
            this.setData({
                tabIndex: 2,
            })
        }
    },
    onLoad(e) {
        console.log("onLoad", e)
        // e.id = 122843
        // 读取分享链接中的邀请人编号
        if (e && e.inviter_id) {
            Taro.setStorageSync('referrer', e.inviter_id)
        }
        // 读取小程序码中的邀请人编号
        if (e && e.scene) {
            const scene = decodeURIComponent(e.scene) // 处理扫码进商品详情页面的逻辑
            if (scene && scene.split(',').length >= 2) {
                e.id = scene.split(',')[0]
                Taro.setStorageSync('referrer', scene.split(',')[1])
            }
        }
        // 静默式授权注册/登陆
        // AUTH.checkHasLogined().then((isLogined) => {
        //   if (!isLogined) {
        //     AUTH.authorize().then((aaa) => {
        //       if (CONFIG.bindSeller) {
        //         AUTH.bindSeller()
        //       }
        //     })
        //   } else {
        //     if (CONFIG.bindSeller) {
        //       AUTH.bindSeller()
        //     }
        //   }
        // })
        this.setData({
            goodsId: e.id,
            kjJoinUid: e.kjJoinUid
        })
        let goodsDetailSkuShowType = Taro.getStorageSync('goodsDetailSkuShowType')
        if (!goodsDetailSkuShowType) {
            goodsDetailSkuShowType = 0
        }
        // 补偿写法
        Taro.getApp().configLoadOK = () => {
            this.readConfigVal()
        }
        this.setData({
            goodsDetailSkuShowType,
            curuid: Taro.getStorageSync('uid'),
        })
        this.readConfigVal()
        this.getGoodsDetailAndKanjieInfo(this.data.goodsId)
        this.shippingCartInfo()
        this.goodsAddition()
        // 弹出编辑昵称头像框
        Taro.getApp().initNickAvatarUrlPOP(this)
    },
    readConfigVal() {
        // 读取系统参数
        const hide_reputation = Taro.getStorageSync('hide_reputation')
        let tabs = [
            {
                title: '商品简介',
                view_id: 'swiper-container',
                topHeight: 0,
            },
            {
                title: '商品详情',
                view_id: 'goods-des-info',
                topHeight: 0,
            },
            {
                title: '商品评价',
                view_id: 'reputation',
                topHeight: 0,
            },
        ]
        if (hide_reputation == '1') {
            // 隐藏评价
            tabs = [
                {
                    title: '商品简介',
                    view_id: 'swiper-container',
                    topHeight: 0,
                },
                {
                    title: '商品详情',
                    view_id: 'goods-des-info',
                    topHeight: 0,
                },
            ]
        } else {
            // 读取评价
            if (!this.data.reputation) {
                // 保证只读取一次
                this.reputation(this.data.goodsId)
            }
        }
        this.setData({
            hide_reputation,
            tabs,
        })
    },
    async goodsAddition() {
        const res = await WXAPI.goodsAddition(this.data.goodsId)
        if (res.code == 0) {
            this.setData({
                goodsAddition: res.data,
                hasMoreSelect: true,
            })
        }
    },
    async shippingCartInfo() {
        const number = await TOOLS.showTabBarBadge(true)
        this.setData({
            shopNum: number,
        })
    },
    onShow() {
        this.setData({
            createTabs: true, //绘制tabs
        })
        //计算tabs高度
        var query = Taro.createSelectorQuery()
        query
            .select('#tabs')
            .boundingClientRect((rect) => {
                var tabsHeight = rect ? rect.height ? rect.height : 20 : 20
                this.setData({
                    tabsHeight: tabsHeight,
                })
            })
            .exec()
        AUTH.checkHasLogined().then((isLogined) => {
            if (isLogined) {
                this.goodsFavCheck()
            }
        })
    },
    getTopHeightFunction() {
        var that = this
        var tabs = that.data.tabs
        tabs.forEach((element, index) => {
            var viewId = '#' + element.view_id
            that.getTopHeight(viewId, index)
        })
    },
    getTopHeight(viewId, index) {
        var query = Taro.createSelectorQuery()
        query
            .select(viewId)
            .boundingClientRect((rect) => {
                if (!rect) {
                    return
                }
                let top = rect.top
                var tabs = this.data.tabs
                tabs[index].topHeight = top
                this.setData({
                    tabs: tabs,
                })
            })
            .exec()
    },
    async goodsFavCheck() {
        const res = await WXAPI.goodsFavCheck(
            Taro.getStorageSync('token'),
            this.data.goodsId
        )
        if (res.code == 0) {
            this.setData({
                faved: true,
            })
        } else {
            this.setData({
                faved: false,
            })
        }
    },
    async addFav() {
        AUTH.checkHasLogined().then((isLogined) => {
            if (isLogined) {
                if (this.data.faved) {
                    // 取消收藏
                    WXAPI.goodsFavDelete(
                        Taro.getStorageSync('token'),
                        '',
                        this.data.goodsId
                    ).then((res) => {
                        this.goodsFavCheck()
                    })
                } else {
                    // 加入收藏
                    WXAPI.goodsFavPut(
                        Taro.getStorageSync('token'),
                        this.data.goodsId
                    ).then((res) => {
                        this.goodsFavCheck()
                    })
                }
            }
        })
    },
    async getGoodsDetailAndKanjieInfo(goodsId) {
        const token = Taro.getStorageSync('token')
        const that = this
        const goodsDetailRes = await WXAPI.goodsDetail(goodsId, token ? token : '')
        const goodsKanjiaSetRes = await WXAPI.kanjiaSet(goodsId)
        if (goodsDetailRes.code == 0) {
            if (!goodsDetailRes.data.pics || goodsDetailRes.data.pics.length == 0) {
                goodsDetailRes.data.pics = [
                    {
                        pic: goodsDetailRes.data.basicInfo.pic,
                    },
                ]
            }
            if (goodsDetailRes.data.properties) {
                that.setData({
                    hasMoreSelect: true,
                    selectSizePrice: goodsDetailRes.data.basicInfo.minPrice,
                    selectSizeOPrice: goodsDetailRes.data.basicInfo.originalPrice,
                    totalScoreToPay: goodsDetailRes.data.basicInfo.minScore,
                })
            }
            if (goodsDetailRes.data.basicInfo.shopId) {
                this.shopSubdetail(goodsDetailRes.data.basicInfo.shopId)
            }
            if (goodsDetailRes.data.basicInfo.pingtuan) {
                that.pingtuanList(goodsId)
            }
            that.data.goodsDetail = goodsDetailRes.data
            if (goodsDetailRes.data.basicInfo.videoId) {
                that.getVideoSrc(goodsDetailRes.data.basicInfo.videoId)
            }
            let _data = {
                goodsDetail: goodsDetailRes.data,
                selectSizePrice: goodsDetailRes.data.basicInfo.minPrice,
                selectSizeOPrice: goodsDetailRes.data.basicInfo.originalPrice,
                totalScoreToPay: goodsDetailRes.data.basicInfo.minScore,
                buyNumMax: goodsDetailRes.data.basicInfo.stores,
                buyNumber: goodsDetailRes.data.basicInfo.stores > 0 ? 1 : 0,
            }
            if (goodsKanjiaSetRes.code == 0) {
                _data.curGoodsKanjia = goodsKanjiaSetRes.data[0]
                that.data.kjId = _data.curGoodsKanjia.id
                // 获取当前砍价进度
                if (!that.data.kjJoinUid) {
                    that.data.kjJoinUid = Taro.getStorageSync('uid')
                }
                const curKanjiaprogress = await WXAPI.kanjiaDetail(
                    _data.curGoodsKanjia.id,
                    that.data.kjJoinUid
                )
                const myHelpDetail = await WXAPI.kanjiaHelpDetail(
                    Taro.getStorageSync('token'),
                    _data.curGoodsKanjia.id,
                    that.data.kjJoinUid
                )
                if (curKanjiaprogress.code == 0) {
                    _data.curKanjiaprogress = curKanjiaprogress.data
                }
                if (myHelpDetail.code == 0) {
                    _data.myHelpDetail = myHelpDetail.data
                }
                //砍价商品 tabs栏显示砍价情况
                // var tabs = that.data.tabs
                // tabs[2].title="砍价记录"
                // tabs[2].view_id="kanjia"
                // that.setData({
                //   tabs:tabs
                // })
            }

            if (goodsDetailRes.data.basicInfo.pingtuan) {
                const pingtuanSetRes = await WXAPI.pingtuanSet(goodsId)
                if (pingtuanSetRes.code == 0) {
                    _data.pingtuanSet = pingtuanSetRes.data
                    // 如果是拼团商品， 默认显示拼团价格
                    _data.selectSizePrice = goodsDetailRes.data.basicInfo.pingtuanPrice
                }
            }
            that.setData(_data)
        }
    },
    async shopSubdetail(shopId) {
        const res = await WXAPI.shopSubdetail(shopId)
        if (res.code == 0) {
            this.setData({
                shopSubdetail: res.data,
            })
        }
    },
    goShopCar: function () {
        Taro.reLaunch({
            url: '/pages/shop-cart/index',
        })
    },
    toAddShopCar: function () {
        console.log("toAddShopCar", this.data)
        this.setData({
            shopType: 'addShopCar',
        })
        this.bindGuiGeTap()
    },
    tobuy: function () {
        this.setData({
            shopType: 'tobuy',
        })
        this.bindGuiGeTap()
    },
    toPingtuan: function (e) {
        let pingtuanopenid = 0
        if (e.currentTarget.dataset.pingtuanopenid) {
            pingtuanopenid = e.currentTarget.dataset.pingtuanopenid
        }
        this.setData({
            shopType: 'toPingtuan',
            selectSizePrice: this.data.goodsDetail.basicInfo.pingtuanPrice,
            selectSizeOPrice: this.data.goodsDetail.basicInfo.originalPrice,
            pingtuanopenid: pingtuanopenid,
            hideShopPopup: false,
            skuGoodsPic: this.data.goodsDetail.basicInfo.pic,
        })
    },
    /**
     * 规格选择弹出框
     */
    bindGuiGeTap: function () {
        this.setData({
            hideShopPopup: false,
            selectSizePrice: this.data.goodsDetail.basicInfo.minPrice,
            selectSizeOPrice: this.data.goodsDetail.basicInfo.originalPrice,
            skuGoodsPic: this.data.goodsDetail.basicInfo.pic,
        })
    },
    /**
     * 规格选择弹出框隐藏
     */
    closePopupTap: function () {
        this.setData({
            hideShopPopup: true,
        })
    },
    stepChange(event) {
        this.setData({
            buyNumber: event.detail,
        })
    },
    // 判断当前商品是否支持某个sku的属性
    checkHasSkuItems(sk) {
        this.data.goodsDetail.skuList.filter((ele) => {
            const a = this.data.goodsDetail.properties.filter((ele) => {
                return ele.optionValueId
            })
            console.log(a)
            for (let index = 0; index < array.length; index++) {
                const element = array[index]
            }
        })
    },
    /**
     * 选择商品规格
     */
    async labelItemTap(e) {
        const propertyindex = e.currentTarget.dataset.propertyindex
        const propertychildindex = e.currentTarget.dataset.propertychildindex
        const property = this.data.goodsDetail.properties[propertyindex]
        const child = property.childsCurGoods[propertychildindex]
        const _childActive = child.active
        // 当前位置往下的所有sku取消选中状态
        for (
            let index = propertyindex;
            index < this.data.goodsDetail.properties.length;
            index++
        ) {
            const element = this.data.goodsDetail.properties[index]
            element.optionValueId = null
            element.childsCurGoods.forEach((child) => {
                child.active = false
            })
        }
        // // 取消该分类下的子栏目所有的选中状态
        // property.childsCurGoods.forEach(child => {
        //   child.active = false
        // })
        // 设置当前选中状态，或者取消选中
        property.optionValueId = child.id
        child.active = true
        // 下面代码块，支持点击后取消选中
        // if (!_childActive) {
        //   property.optionValueId = child.id
        //   child.active = true
        // } else {
        //   property.optionValueId = null
        //   child.active = false
        // }

        // 获取所有的选中规格尺寸数据
        const needSelectNum = this.data.goodsDetail.properties.length
        let curSelectNum = 0
        let propertyChildIds = ''
        let propertyChildNames = ''
        let _skuList = this.data.goodsDetail.skuList
        this.data.goodsDetail.properties.forEach((p) => {
            p.childsCurGoods.forEach((c) => {
                // 处理当前选中的sku信息
                if (c.active) {
                    _skuList = _skuList.filter((aaa) => {
                        return aaa.propertyChildIds.indexOf(p.id + ':' + c.id) != -1
                    })
                    curSelectNum++
                    propertyChildIds = propertyChildIds + p.id + ':' + c.id + ','
                    propertyChildNames = propertyChildNames + p.name + ':' + c.name + '  '
                } else if (!p.optionValueId) {
                    const nextO = _skuList.find((aaa) => {
                        return aaa.propertyChildIds.indexOf(p.id + ':' + c.id) != -1
                    })
                    c.hidden = nextO ? false : true
                }
            })
        })
        let canSubmit = false
        if (needSelectNum == curSelectNum) {
            canSubmit = true
        }
        let skuGoodsPic = this.data.skuGoodsPic
        if (
            this.data.goodsDetail.subPics &&
            this.data.goodsDetail.subPics.length > 0
        ) {
            const _subPic = this.data.goodsDetail.subPics.find((ele) => {
                return ele.optionValueId == child.id
            })
            if (_subPic) {
                skuGoodsPic = _subPic.pic
            }
        }
        this.setData({
            goodsDetail: this.data.goodsDetail,
            canSubmit,
            skuGoodsPic,
            propertyChildIds,
            propertyChildNames,
        })
        this.calculateGoodsPrice()
    },
    async calculateGoodsPrice() {
        // 计算最终的商品价格
        let price = this.data.goodsDetail.basicInfo.minPrice
        let originalPrice = this.data.goodsDetail.basicInfo.originalPrice
        let totalScoreToPay = this.data.goodsDetail.basicInfo.minScore
        let buyNumMax = this.data.goodsDetail.basicInfo.stores
        let buyNumber = this.data.goodsDetail.basicInfo.minBuyNumber
        if (this.data.shopType == 'toPingtuan') {
            price = this.data.goodsDetail.basicInfo.pingtuanPrice
        }
        // 计算 sku 价格
        if (this.data.canSubmit) {
            const token = Taro.getStorageSync('token')
            const res = await WXAPI.goodsPriceV2({
                token: token ? token : '',
                goodsId: this.data.goodsDetail.basicInfo.id,
                propertyChildIds: this.data.propertyChildIds,
            })
            if (res.code == 0) {
                price = res.data.price
                if (this.data.shopType == 'toPingtuan') {
                    price = res.data.pingtuanPrice
                }
                originalPrice = res.data.originalPrice
                totalScoreToPay = res.data.score
                buyNumMax = res.data.stores
            }
        }
        // 计算配件价格
        if (this.data.goodsAddition) {
            this.data.goodsAddition.forEach((big) => {
                big.items.forEach((small) => {
                    if (small.active) {
                        price = (price * 100 + small.price * 100) / 100
                    }
                })
            })
        }
        this.setData({
            selectSizePrice: price,
            selectSizeOPrice: originalPrice,
            totalScoreToPay: totalScoreToPay,
            buyNumMax,
            buyNumber: buyNumMax >= buyNumber ? buyNumber : 0,
        })
    },
    /**
     * 选择可选配件
     */
    async labelItemTap2(e) {
        const propertyindex = e.currentTarget.dataset.propertyindex
        const propertychildindex = e.currentTarget.dataset.propertychildindex
        const goodsAddition = this.data.goodsAddition
        const property = goodsAddition[propertyindex]
        const child = property.items[propertychildindex]
        if (child.active) {
            // 该操作为取消选择
            child.active = false
            this.setData({
                goodsAddition,
            })
            this.calculateGoodsPrice()
            return
        }
        // 单选配件取消所有子栏目选中状态
        if (property.type == 0) {
            property.items.forEach((child) => {
                child.active = false
            })
        }
        // 设置当前选中状态
        child.active = true
        this.setData({
            goodsAddition,
        })
        this.calculateGoodsPrice()
    },
    /**
     * 加入购物车
     */
    async addShopCar() {
        console.log("加入购物车", this.data)
        if (this.data.goodsDetail.properties && !this.data.canSubmit) {
            if (!this.data.canSubmit) {
                Taro.showToast({
                    title: '请选择规格',
                    icon: 'none',
                })
            }
            this.bindGuiGeTap()
            return
        }
        const goodsAddition = []
        if (this.data.goodsAddition) {
            let canSubmit = true
            this.data.goodsAddition.forEach((ele) => {
                if (ele.required) {
                    const a = ele.items.find((item) => {
                        return item.active
                    })
                    if (!a) {
                        canSubmit = false
                    }
                }
                ele.items.forEach((item) => {
                    if (item.active) {
                        goodsAddition.push({
                            id: item.id,
                            pid: item.pid,
                        })
                    }
                })
            })
            if (!canSubmit) {
                Taro.showToast({
                    title: '请选择配件',
                    icon: 'none',
                })
                this.bindGuiGeTap()
                return
            }
        }
        if (this.data.buyNumber < 1) {
            Taro.showToast({
                title: '请选择购买数量',
                icon: 'none',
            })
            return
        }
        const isLogined = await AUTH.checkHasLogined()
        if (!isLogined) {
            return
        }
        const token = Taro.getStorageSync('token')
        const goodsId = this.data.goodsDetail.basicInfo.id
        const sku = []
        if (this.data.goodsDetail.properties) {
            this.data.goodsDetail.properties.forEach((p) => {
                sku.push({
                    optionId: p.id,
                    optionValueId: p.optionValueId,
                })
            })
        }
        const res = await WXAPI.shippingCarInfoAddItem(
            token,
            goodsId,
            this.data.buyNumber,
            sku,
            goodsAddition
        )
        if (res.code != 0) {
            Taro.showToast({
                title: res.msg,
                icon: 'none',
            })
            return
        }
        this.closePopupTap()
        Taro.showToast({
            title: '加入购物车',
            icon: 'success',
        })
        this.shippingCartInfo()
    },
    /**
     * 立即购买
     */
    buyNow: function (e) {
        let that = this
        let shoptype = e.currentTarget.dataset.shoptype
        if (this.data.goodsDetail.properties && !this.data.canSubmit) {
            Taro.showToast({
                title: '请选择规格',
                icon: 'none',
            })
            this.bindGuiGeTap()
            return
        }
        if (this.data.goodsAddition) {
            let canSubmit = true
            this.data.goodsAddition.forEach((ele) => {
                if (ele.required) {
                    const a = ele.items.find((item) => {
                        return item.active
                    })
                    if (!a) {
                        canSubmit = false
                    }
                }
            })
            if (!canSubmit) {
                Taro.showToast({
                    title: '请选择配件',
                    icon: 'none',
                })
                this.bindGuiGeTap()
                return
            }
        }
        if (this.data.buyNumber < 1) {
            Taro.showModal({
                title: '提示',
                content: '购买数量不能为0！',
                showCancel: false,
            })
            return
        }
        //组建立即购买信息
        var buyNowInfo = this.buliduBuyNowInfo(shoptype)
        // 写入本地存储
        Taro.setStorage({
            key: 'buyNowInfo',
            data: buyNowInfo,
        })
        this.closePopupTap()
        if (shoptype == 'toPingtuan') {
            if (this.data.pingtuanopenid) {
                Taro.navigateTo({
                    url:
                        '/pages/to-pay-order/index?orderType=buyNow&pingtuanOpenId=' +
                        this.data.pingtuanopenid,
                })
            } else {
                WXAPI.pingtuanOpen(
                    Taro.getStorageSync('token'),
                    that.data.goodsDetail.basicInfo.id
                ).then(function (res) {
                    if (res.code == 2000) {
                        return
                    }
                    if (res.code != 0) {
                        Taro.showToast({
                            title: res.msg,
                            icon: 'none',
                            duration: 2000,
                        })
                        return
                    }
                    Taro.navigateTo({
                        url:
                            '/pages/to-pay-order/index?orderType=buyNow&pingtuanOpenId=' +
                            res.data.id,
                    })
                })
            }
        } else {
            Taro.navigateTo({
                url: '/pages/to-pay-order/index?orderType=buyNow',
            })
        }
    },
    /**
     * 组建立即购买信息
     */
    buliduBuyNowInfo: function (shoptype) {
        var shopCarMap = {}
        shopCarMap.goodsId = this.data.goodsDetail.basicInfo.id
        shopCarMap.shopId = this.data.goodsDetail.basicInfo.shopId
        shopCarMap.pic = this.data.goodsDetail.basicInfo.pic
        shopCarMap.name = this.data.goodsDetail.basicInfo.name
        // shopCarMap.label=this.data.goodsDetail.basicInfo.id; 规格尺寸
        shopCarMap.propertyChildIds = this.data.propertyChildIds
        shopCarMap.label = this.data.propertyChildNames
        shopCarMap.price = this.data.selectSizePrice
        // if (shoptype == 'toPingtuan') { // 20190714 拼团价格注释掉
        //   shopCarMap.price = this.data.goodsDetail.basicInfo.pingtuanPrice;
        // }
        shopCarMap.score = this.data.totalScoreToPay
        shopCarMap.left = ''
        shopCarMap.active = true
        shopCarMap.number = this.data.buyNumber
        shopCarMap.logisticsType = this.data.goodsDetail.basicInfo.logisticsId
        shopCarMap.logistics = this.data.goodsDetail.logistics
        shopCarMap.weight = this.data.goodsDetail.basicInfo.weight
        if (this.data.goodsAddition && this.data.goodsAddition.length > 0) {
            const additions = []
            this.data.goodsAddition.forEach((ele) => {
                ele.items.forEach((item) => {
                    if (item.active) {
                        additions.push({
                            id: item.id,
                            name: item.name,
                            pid: ele.id,
                            pname: ele.name,
                        })
                    }
                })
            })
            if (additions.length > 0) {
                shopCarMap.additions = additions
            }
        }
        var buyNowInfo = {}
        buyNowInfo.shopNum = 0
        buyNowInfo.shopList = []
        buyNowInfo.shopList.push(shopCarMap)
        buyNowInfo.kjId = this.data.kjId
        if (this.data.shopSubdetail) {
            buyNowInfo.shopInfo = this.data.shopSubdetail.info
        } else {
            buyNowInfo.shopInfo = {
                id: 0,
                name: '其他',
                pic: null,
                serviceDistance: 99999999,
            }
        }
        return buyNowInfo
    },
    onShareAppMessage() {
        let _data = {
            title: this.data.goodsDetail.basicInfo.name,
            path:
                '/pages/goods-details/index?id=' +
                this.data.goodsDetail.basicInfo.id +
                '&inviter_id=' +
                Taro.getStorageSync('uid'),
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            },
        }
        if (this.data.kjJoinUid) {
            _data.title = this.data.curKanjiaprogress.joiner.nick + '邀请您帮TA砍价'
            _data.path += '&kjJoinUid=' + this.data.kjJoinUid
        }
        return _data
    },
    onShareTimeline() {
        let title = this.data.goodsDetail.basicInfo.name
        let query =
            'id=' +
            this.data.goodsDetail.basicInfo.id +
            '&inviter_id=' +
            Taro.getStorageSync('uid')
        if (this.data.kjJoinUid) {
            title = this.data.curKanjiaprogress.joiner.nick + '邀请您帮TA砍价'
            query += '&kjJoinUid=' + this.data.kjJoinUid
        }
        return {
            title,
            query,
            imageUrl: this.data.goodsDetail.basicInfo.pic,
        }
    },
    reputation: function (goodsId) {
        var that = this
        WXAPI.goodsReputationV2({
            goodsId: goodsId,
        }).then(function (res) {
            if (res.code == 0) {
                res.data.result.forEach((ele) => {
                    if (ele.goods.goodReputation == 0) {
                        ele.goods.goodReputation = 1
                    } else if (ele.goods.goodReputation == 1) {
                        ele.goods.goodReputation = 3
                    } else if (ele.goods.goodReputation == 2) {
                        ele.goods.goodReputation = 5
                    }
                })
                that.setData({
                    reputation: res.data,
                })
            } else {
                if (that.data.tabs && that.data.tabs.length == 3) {
                    const tabs = that.data.tabs
                    tabs.splice(2, 1)
                    that.setData({
                        tabs,
                    })
                }
            }
        })
    },
    pingtuanList: function (goodsId) {
        var that = this
        WXAPI.pingtuanList({
            goodsId: goodsId,
            status: 0,
        }).then(function (res) {
            if (res.code == 0) {
                that.setData({
                    pingtuanList: res.data.result,
                })
            }
        })
    },
    getVideoSrc: function (videoId) {
        var that = this
        WXAPI.videoDetail(videoId).then(function (res) {
            if (res.code == 0) {
                that.setData({
                    videoMp4Src: res.data.fdMp4,
                })
            }
        })
    },
    joinKanjia() {
        AUTH.checkHasLogined().then((isLogined) => {
            if (isLogined) {
                this.doneJoinKanjia()
            }
        })
    },
    doneJoinKanjia: function () {
        // 报名参加砍价活动
        const _this = this
        if (!_this.data.curGoodsKanjia) {
            return
        }
        Taro.showLoading({
            title: '加载中',
            mask: true,
        })
        WXAPI.kanjiaJoin(
            Taro.getStorageSync('token'),
            _this.data.curGoodsKanjia.id
        ).then(function (res) {
            Taro.hideLoading()
            if (res.code == 0) {
                _this.setData({
                    kjJoinUid: Taro.getStorageSync('uid'),
                    myHelpDetail: null,
                })
                _this.getGoodsDetailAndKanjieInfo(_this.data.goodsDetail.basicInfo.id)
            } else {
                Taro.showToast({
                    title: res.msg,
                    icon: 'none',
                })
            }
        })
    },
    joinPingtuan: function (e) {
        let pingtuanopenid = e.currentTarget.dataset.pingtuanopenid
        Taro.navigateTo({
            url:
                '/pages/to-pay-order/index?orderType=buyNow&pingtuanOpenId=' +
                pingtuanopenid,
        })
    },
    goIndex() {
        Taro.switchTab({
            url: '/pages/index/index',
        })
    },
    helpKanjia() {
        const _this = this
        AUTH.checkHasLogined().then((isLogined) => {
            if (isLogined) {
                _this.helpKanjiaDone()
            }
        })
    },
    helpKanjiaDone() {
        const _this = this
        WXAPI.kanjiaHelp(
            Taro.getStorageSync('token'),
            _this.data.kjId,
            _this.data.kjJoinUid,
            ''
        ).then(function (res) {
            if (res.code != 0) {
                Taro.showToast({
                    title: res.msg,
                    icon: 'none',
                })
                return
            }
            _this.setData({
                myHelpDetail: res.data,
            })
            Taro.showModal({
                title: '成功',
                content: '成功帮TA砍掉 ' + res.data.cutPrice + ' 元',
                showCancel: false,
            })
            _this.getGoodsDetailAndKanjieInfo(_this.data.goodsDetail.basicInfo.id)
        })
    },
    closePop() {
        this.setData({
            posterShow: false,
        })
    },
    async drawSharePic() {
        const _this = this
        const qrcodeRes = await WXAPI.wxaQrcode({
            scene:
                _this.data.goodsDetail.basicInfo.id + ',' + Taro.getStorageSync('uid'),
            page: 'pages/goods-details/index',
            is_hyaline: true,
            autoColor: true,
            expireHours: 1,
        })
        if (qrcodeRes.code != 0) {
            Taro.showToast({
                title: qrcodeRes.msg,
                icon: 'none',
            })
            return
        }
        const qrcode = qrcodeRes.data
        const pic = _this.data.goodsDetail.basicInfo.pic
        Taro.getImageInfo({
            src: pic,
            success(res) {
                const height = (490 * res.height) / res.width
                _this.drawSharePicDone(height, qrcode)
            },
            fail(e) {
                console.error(e)
            },
        })
    },
    drawSharePicDone(picHeight, qrcode) {
        const _this = this
        const _baseHeight = 74 + (picHeight + 120)
        this.setData(
            {
                posterConfig: {
                    width: 750,
                    height: picHeight + 660,
                    backgroundColor: '#fff',
                    debug: false,
                    blocks: [
                        {
                            x: 76,
                            y: 74,
                            width: 604,
                            height: picHeight + 120,
                            borderWidth: 2,
                            borderColor: '#c2aa85',
                            borderRadius: 8,
                        },
                    ],
                    images: [
                        {
                            x: 133,
                            y: 133,
                            url: _this.data.goodsDetail.basicInfo.pic,
                            // 商品图片
                            width: 490,
                            height: picHeight,
                        },
                        {
                            x: 76,
                            y: _baseHeight + 199,
                            url: qrcode,
                            // 二维码
                            width: 222,
                            height: 222,
                        },
                    ],
                    texts: [
                        {
                            x: 375,
                            y: _baseHeight + 80,
                            width: 650,
                            lineNum: 2,
                            text: _this.data.goodsDetail.basicInfo.name,
                            textAlign: 'center',
                            fontSize: 40,
                            color: '#333',
                        },
                        {
                            x: 375,
                            y: _baseHeight + 180,
                            text: '￥' + _this.data.goodsDetail.basicInfo.minPrice,
                            textAlign: 'center',
                            fontSize: 50,
                            color: '#e64340',
                        },
                        {
                            x: 352,
                            y: _baseHeight + 320,
                            text: '长按识别小程序码',
                            fontSize: 28,
                            color: '#999',
                        },
                    ],
                },
            },
            () => {
                Poster.create()
            }
        )
    },
    onPosterSuccess(e) {
        console.log('success:', e)
        this.setData({
            posterImg: e.detail,
            showposterImg: true,
        })
    },
    onPosterFail(e) {
        console.error('fail:', e)
    },
    savePosterPic() {
        const _this = this
        Taro.saveImageToPhotosAlbum({
            filePath: this.data.posterImg,
            success: (res) => {
                Taro.showModal({
                    content: '已保存到手机相册',
                    showCancel: false,
                    confirmText: '知道了',
                    confirmColor: '#333',
                })
            },
            complete: () => {
                _this.setData({
                    showposterImg: false,
                })
            },
            fail: (res) => {
                Taro.showToast({
                    title: res.errMsg,
                    icon: 'none',
                    duration: 2000,
                })
            },
        })
    },
    previewImage(e) {
        const url = e.currentTarget.dataset.url
        Taro.previewImage({
            current: url,
            // 当前显示图片的http链接
            urls: [url], // 需要预览的图片http链接列表
        })
    },

    previewImage2(e) {
        const url = e.currentTarget.dataset.url
        const urls = []
        this.data.goodsDetail.pics.forEach((ele) => {
            urls.push(ele.pic)
        })
        Taro.previewImage({
            current: url,
            // 当前显示图片的http链接
            urls, // 需要预览的图片http链接列表
        })
    },
    backToHome() {
        Taro.switchTab({
            url: '/pages/index/index',
        })
    },
})
class _C extends React.Component {
    render() {
        const {
            active,
            tabs,
            createTabs,
            toView,
            goodsDetail,
            videoMp4Src,
            selectSizePrice,
            selectSizeOPrice,
            curGoodsKanjia,
            pingtuanSet,
            curKanjiaprogress,
            myHelpDetail,
            curuid,
            pingtuanList,
            goodsAddition,
            hasMoreSelect,
            goodsDetailSkuShowType,
            buyNumber,
            buyNumMin,
            buyNumMax,
            shopSubdetail,
            reputation,
            shopNum,
            faved,
            shopType,
            canvasstyle,
            posterShow,
            posterConfig,
            showposterImg,
            posterImg,
            hideShopPopup,
            skuGoodsPic,
            nickPopShow,
            popavatarUrl,
            popnick,
            tabIndex
        } = this.data


        const onTabsChange = (index) =>  {
            this.setData({
                toView: tabs[index].view_id,
                tabIndex: index,
                tabclicked: true,
            })
            document.getElementById(tabs[index].view_id).scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'start'
            })
            setTimeout(() => {
                this.setData({
                    tabclicked: false,
                })
            }, 1000)
        }

        return (
            <Block>
                <View className="container">
                    {createTabs && tabs && (
                        <VanSticky>
                            <View id="tabs" className="tabs-container">
                                <AtTabs current={tabIndex} tabList={tabs} onClick={onTabsChange}>
                                </AtTabs>
                            </View>
                        </VanSticky>
                    )}
                        <View className="swiper-container-detail" id="swiper-container">
                            <Swiper
                                className="swiper_box"
                                indicatorDots="true"
                                indicatorActiveColor="#fff"
                                autoplay={!goodsDetail.basicInfo || !goodsDetail.basicInfo.videoId}
                                circular
                            >
                                {goodsDetail.basicInfo && goodsDetail.basicInfo.videoId && (
                                    <SwiperItem>
                                        <Video
                                            src={videoMp4Src}
                                            autoplay="true"
                                            loop="true"
                                            style={{width:'100%',height:'100%'}}
                                        ></Video>
                                    </SwiperItem>
                                )}
                                {goodsDetail.pics && goodsDetail.pics.map((item, index) => {
                                    return (
                                        <SwiperItem key={item.id}>
                                            <Image
                                                src={item.pic}
                                                className="slide-image"
                                                mode="aspectFill"
                                                lazyLoad="true"
                                                onClick={this.previewImage2}
                                                data-url={item.pic}
                                            ></Image>
                                        </SwiperItem>
                                    )
                                })}
                            </Swiper>
                        </View>
                        {goodsDetail.basicInfo && <View className="goods-detail-info" id={"goods-info"}>
                            <View className="goods-detail-info-top-container">
                                <View className="goods-profile">
                                    <View className="p">
                                        <Text>¥</Text>
                                        {selectSizePrice}
                                    </View>
                                    {goodsDetail.basicInfo && goodsDetail.basicInfo.originalPrice &&
                                    goodsDetail.basicInfo.originalPrice > 0 ? (
                                        <View
                                            className="goods-price"
                                            style={{ color: "#aaa",textDecoration: "line-through",padding: "15rpx 0rpx 0rpx 15rpx"}}
                                        >
                                            <Text>¥</Text>
                                            {selectSizeOPrice}
                                        </View>
                                    ) : ''}
                                </View>
                                <View className="goods-detail-info-fx">
                                    <View className="item left">
                                        <VanIcon name="share-o" size="24px"></VanIcon>
                                        <View className="icon-title">分享</View>
                                        <Button openType="share"></Button>
                                    </View>
                                    <View className="item" onClick={this.drawSharePic}>
                                        <VanIcon name="qr" size="24px"></VanIcon>
                                        <View className="icon-title">二维码</View>
                                    </View>
                                </View>
                            </View>
                            {goodsDetail.basicInfo && <View className="goods-title">{goodsDetail.basicInfo.name}</View>}
                            <View className="characteristic">
                                {goodsDetail.basicInfo.characteristic}
                            </View>
                            {goodsDetail.basicInfo.commissionType == 1 && (
                                <View className="goods-share">
                                    {'分享有赏，好友下单后可得 ' +
                                    goodsDetail.basicInfo.commission +
                                    ' 积分奖励'}
                                </View>
                            )}
                            {goodsDetail.basicInfo.commissionType == 2 && (
                                <View className="goods-share">
                                    {'分享有赏，好友下单后可得 ' +
                                    goodsDetail.basicInfo.commission +
                                    '元 现金奖励'}
                                </View>
                            )}
                        </View>}
                        {curGoodsKanjia && (
                            <VanCellGroup title="商品砍价设置">
                                <VanCell
                                    title="限量"
                                    value={curGoodsKanjia.number + '份'}
                                ></VanCell>
                                <VanCell
                                    title="已售"
                                    value={curGoodsKanjia.numberBuy + '份'}
                                ></VanCell>
                                <VanCell
                                    title="原价"
                                    value={'￥' + curGoodsKanjia.originalPrice}
                                ></VanCell>
                                <VanCell
                                    title="底价"
                                    value={'￥' + curGoodsKanjia.minPrice}
                                ></VanCell>
                                <VanCell title="截止" value={curGoodsKanjia.dateEnd}></VanCell>
                            </VanCellGroup>
                        )}
                        {pingtuanSet && (
                            <VanCellGroup title="商品拼团设置">
                                <VanCell
                                    title="已成团"
                                    value={pingtuanSet.numberSucccess}
                                ></VanCell>
                                <VanCell
                                    title="成团人数"
                                    value={pingtuanSet.numberPersion}
                                ></VanCell>
                                <VanCell
                                    title="退款条件"
                                    value={pingtuanSet.timeoutHours + '小时未成团'}
                                ></VanCell>
                                <VanCell title="截止" value={pingtuanSet.dateEnd}></VanCell>
                            </VanCellGroup>
                        )}
                        {curKanjiaprogress && (
                            <View className="curKanjiaprogress">
                                <View className="name">
                                    帮
                                    <Text style={{ color: "red",fontWeight: "bold", }}>
                                        {curKanjiaprogress.joiner.nick}
                                    </Text>
                                    砍价吧！
                                </View>
                                <VanProgress
                                    percentage={
                                        (100 *
                                            (curGoodsKanjia.originalPrice -
                                                curKanjiaprogress.kanjiaInfo.curPrice)) /
                                        (curGoodsKanjia.originalPrice - curGoodsKanjia.minPrice)
                                    }
                                    pivotText={'￥' + curKanjiaprogress.kanjiaInfo.curPrice}
                                    pivotColor="#1aad19"
                                    color="#1aad19"
                                    customClass="van-progress"
                                ></VanProgress>
                                <View className="flex">
                                    <View className="kjbutton">
                                        <Button type="primary" openType="share">
                                            邀请朋友帮忙
                                        </Button>
                                    </View>
                                    <View className="kjbutton">
                                        <Button
                                            type="warn"
                                            onClick={this.helpKanjia}
                                            disabled={myHelpDetail}
                                        >
                                            {myHelpDetail ? '您已砍过' : '帮TA砍'}
                                        </Button>
                                    </View>
                                </View>
                                <VanCell
                                    title="帮砍人数"
                                    value={curKanjiaprogress.kanjiaInfo.helpNumber}
                                ></VanCell>
                                <VanCell
                                    title="状态"
                                    value={curKanjiaprogress.kanjiaInfo.statusStr}
                                ></VanCell>
                                <VanCell
                                    title="报名时间"
                                    value={curKanjiaprogress.kanjiaInfo.dateAdd}
                                ></VanCell>
                            </View>
                        )}
                        {curGoodsKanjia &&
                        (!curKanjiaprogress ||
                            curKanjiaprogress.kanjiaInfo.uid != curuid) && (
                            <Block>
                                <Button
                                    type="warn"
                                    onClick={this.joinKanjia}
                                    style={{ width: "700rpx", }}
                                >
                                    我也要报名参与
                                </Button>
                                <View className="space"></View>
                            </Block>
                        )}
                        {pingtuanList && (
                            <View className="goods-des-info" style={{ marginTop: "35rpx", }}>
                                <View
                                    className="label-title"
                                    style={{ borderBottom: "1px solid #eee", }}
                                >
                                    {pingtuanList.length + '人在拼单，可直接参与'}
                                </View>
                                {pingtuanList.map((item, index) => {
                                    return (
                                        <View
                                            className="goods-text"
                                            style={{ marginTop: "15rpx",borderBottom: "1px solid #eee",overflow: "hidden", }}
                                            key={item.id}
                                        >
                                            <View style={{ width: "150rpx",float: "left", }}>
                                                <Image
                                                    style={{ width: "150rpx", height: "150rpx", }}
                                                    src={item.apiExtUser.avatarUrl}
                                                ></Image>
                                                <View
                                                    style={{ width: "150rpx",textAlign: "center",overflow: "hidden",whiteSpace: "nowrap",textOverflow: "ellipsis", }}>
                                                    {item.apiExtUser.nick}
                                                </View>
                                            </View>
                                            <View style={{ width: "500rpx",float: "left",marginLeft: "35rpx", }}>
                                                <View>
                                                    已有<Text style={{ color:red }}>{item.helpNumber}</Text>
                                                    人参与
                                                </View>
                                                <View style={{ color: "#B0B0B0",fontSize: "24rpx", }}>
                                                    {'截止: ' + item.dateEnd}
                                                </View>
                                                <Button
                                                    type="warn"
                                                    size="mini"
                                                    data-pingtuanopenid={item.id}
                                                    onClick={this.toPingtuan}
                                                >
                                                    去拼单
                                                </Button>
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                        )}
                        {hasMoreSelect && goodsDetailSkuShowType == 0 && (
                            <VanCell
                                customClass="vw100 goods-property-container"
                                border={false}
                                isLink
                                onClick={this.bindGuiGeTap}
                                renderTitle={
                                    <Block>
                                        <View>
                                            请选择:
                                            <Block>
                                                {goodsDetail.properties && goodsDetail.properties.map((item, index) => {
                                                    return <Block key={item.id}>{item.name}</Block>
                                                })}
                                            </Block>
                                            <Block>
                                                {goodsAddition && goodsAddition.map((item, index) => {
                                                    return <Block key={item.id}>{item.name}</Block>
                                                })}
                                            </Block>
                                        </View>
                                    </Block>
                                }
                            ></VanCell>
                        )}
                        {goodsDetailSkuShowType == 1 && (
                            <View className="size-label-box2">
                                <View className="label-title">选择商品规格</View>
                                <View className="size-label-box">
                                    {goodsDetail.properties.map((property, idx) => {
                                        return (
                                            <Block key={property.id}>
                                                <View className="label">{property.name}</View>
                                                <View className="label-item-box">
                                                    {property.childsCurGoods.map((item, index) => {
                                                        return (
                                                            <View
                                                                className={
                                                                    'label-item ' + (item.active ? 'active' : '')
                                                                }
                                                                key={item.id}
                                                                onClick={this.labelItemTap}
                                                                data-propertyindex={idx}
                                                                data-propertychildindex={index}
                                                            >
                                                                {item.name}
                                                            </View>
                                                        )
                                                    })}
                                                </View>
                                            </Block>
                                        )
                                    })}
                                </View>
                                <VanCell title="购买数量">
                                    <View>
                                        <VanStepper
                                            value={buyNumber}
                                            min={buyNumMin}
                                            max={buyNumMax}
                                            onChange={this.stepChange}
                                        ></VanStepper>
                                    </View>
                                </VanCell>
                            </View>
                        )}
                        {shopSubdetail && (
                            <View className="shop-container">
                                <Image mode="aspectFill" src={shopSubdetail.info.pic}></Image>
                                <View className="info">
                                    <View className="title">{shopSubdetail.info.name}</View>
                                    <View className="address">{shopSubdetail.info.address}</View>
                                </View>
                            </View>
                        )}
                        <View className="goods-des-info" id="goods-des-info">
                            <View className="label-title">
                                <View className="left">商品详情</View>
                            </View>
                            <View className="goods-text">
                                <MpHtml content={goodsDetail.content}></MpHtml>
                            </View>
                        </View>
                        {!curGoodsKanjia && reputation && (
                            <VanCellGroup
                                id="reputation"
                                customClass="vw100 reputation-cell-group"
                            >
                                <View className="label-title">
                                    <View className="left">
                                        {'宝贝评价 ' + goodsDetail.basicInfo.numberGoodReputation}
                                    </View>
                                    <View>
                                        {'好评度：' + goodReputationPercent.v(goodsDetail) + '%'}
                                    </View>
                                </View>
                                {reputation.result.map((item, index) => {
                                    return (
                                        <Block key={item.id}>
                                            <VanCell
                                                customClass="reputation-cell"
                                                title={item.user.nick}
                                                label={item.goods.dateReputation}
                                                border={false}
                                                renderIcon={
                                                    <Block>
                                                        <VanImage
                                                            customClass="avatarUrl-img"
                                                            src={item.user.avatarUrl}
                                                            round
                                                        ></VanImage>
                                                    </Block>
                                                }
                                            >
                                                <VanRate
                                                    value={item.goods.goodReputation}
                                                    color="#e64340"
                                                    readonly
                                                ></VanRate>
                                            </VanCell>
                                            {item.goods.goodReputationRemark && (
                                                <VanCell
                                                    titleClass="reputation-cell-reamrk"
                                                    title={item.goods.goodReputationRemark}
                                                ></VanCell>
                                            )}
                                            {item.reputationPics && (
                                                <View className="reputation-pics">
                                                    {item.reputationPics.map((picItem, index) => {
                                                        return (
                                                            <Image
                                                                src={picItem.pic}
                                                                mode="aspectFill"
                                                                onClick={this.previewImage}
                                                                data-url={picItem.pic}
                                                            ></Image>
                                                        )
                                                    })}
                                                </View>
                                            )}
                                            {item.goods.goodReputationReply && (
                                                <VanCell
                                                    titleClass="reputation-cell-reamrk"
                                                    title={'掌柜回复:' + item.goods.goodReputationReply}
                                                ></VanCell>
                                            )}
                                        </Block>
                                    )
                                })}
                            </VanCellGroup>
                        )}
                        {curKanjiaprogress &&
                        curKanjiaprogress.helps &&
                        curKanjiaprogress.helps.length > 0 && (
                            <VanCellGroup title="砍价记录">
                                {curKanjiaprogress.helps.map((item, index) => {
                                    return (
                                        <View className="kjlj" key={item}>
                                            <Image
                                                className="kjlj-l"
                                                src={item.avatarUrl}
                                                mode="aspectFill"
                                            ></Image>
                                            <VanCell
                                                customClass="kjlj-r"
                                                title={'￥ ' + item.cutPrice}
                                                label={item.nick + ' ' + item.dateAdd + ' 帮砍'}
                                                size="large"
                                            ></VanCell>
                                        </View>
                                    )
                                })}
                            </VanCellGroup>
                        )}
                        {curGoodsKanjia && curKanjiaprogress && (
                            <View className="kjBuyButton">
                                {curKanjiaprogress.kanjiaInfo.uid != curuid ? (
                                    <View className="item">
                                        <VanButton
                                            type="primary"
                                            block
                                            onClick={this.helpKanjia}
                                            disabled={myHelpDetail}
                                        >
                                            {myHelpDetail ? '您已砍过' : '帮TA砍'}
                                        </VanButton>
                                    </View>
                                ) : (
                                    <View className="item">
                                        <VanButton type="danger" block onClick={this.tobuy}>
                                            用当前价购买
                                        </VanButton>
                                    </View>
                                )}
                            </View>
                        )}
                        {!curGoodsKanjia && goodsDetail.basicInfo && (
                            <VanGoodsAction>
                                <VanGoodsActionIcon
                                    icon="chat-o"
                                    text="客服"
                                    openType="contact"
                                    sendMessageTitle={goodsDetail.basicInfo.name}
                                    sendMessageImg={goodsDetail.basicInfo.pic}
                                    sendMessagePath={
                                        '/pages/goods-details/index?id=' + goodsDetail.basicInfo.id
                                    }
                                    showMessageCard={true}
                                ></VanGoodsActionIcon>
                                <VanGoodsActionIcon
                                    icon="cart-o"
                                    text="购物车"
                                    onClick={this.goShopCar}
                                    info={shopNum ? shopNum : ''}
                                ></VanGoodsActionIcon>
                                <VanGoodsActionIcon
                                    icon={faved ? 'like' : 'like-o'}
                                    text="收藏"
                                    onClick={this.addFav}
                                ></VanGoodsActionIcon>
                                {!goodsDetail.basicInfo.pingtuan && (
                                    <VanGoodsActionButton
                                        text="加入购物车"
                                        type="warning"
                                        isFirst={true}
                                        isLast={false}
                                        onClick={
                                            goodsDetailSkuShowType == 0 ? 'toAddShopCar' : 'addShopCar'
                                        }
                                    ></VanGoodsActionButton>
                                )}
                                {!goodsDetail.basicInfo.pingtuan && (
                                    <VanGoodsActionButton
                                        text="立即购买"
                                        isFirst={false}
                                        isLast={true}
                                        data-shopType={shopType}
                                        onClick={goodsDetailSkuShowType == 0 ? 'tobuy' : 'buyNow'}
                                    ></VanGoodsActionButton>
                                )}
                                {goodsDetail.basicInfo.pingtuan && (
                                    <VanGoodsActionButton
                                        text="单独购买"
                                        type="warning"
                                        isFirst={true}
                                        isLast={false}
                                        onClick={this.tobuy}
                                    ></VanGoodsActionButton>
                                )}
                                {goodsDetail.basicInfo.pingtuan && (
                                    <VanGoodsActionButton
                                        text="发起拼团"
                                        isFirst={false}
                                        isLast={true}
                                        onClick={this.toPingtuan}
                                    ></VanGoodsActionButton>
                                )}
                            </VanGoodsAction>
                        )}
                </View>
                {posterShow && (
                    <Block>
                        <View className="poster-mask"></View>
                        <View className="poster">
                            <Canvas
                                className="canvas"
                                style={canvasstyle}
                                canvasId="firstCanvas"
                            ></Canvas>
                        </View>
                        <View className="poster-btn">
                            <Button type="primary" size="mini" onClick={this._saveToMobile}>
                                保存图片
                            </Button>
                            <Button type="warn" size="mini" onClick={this.closePop}>
                                关闭
                            </Button>
                        </View>
                    </Block>
                )}
                <Poster
                    id="poster"
                    config={posterConfig}
                    onSuccess={this.onPosterSuccess}
                    onFail={this.onPosterFail}
                ></Poster>
                {showposterImg && <View className="popup-mask"></View>}
                {showposterImg && (
                    <View className="posterImg-box">
                        <Image
                            mode="widthFix"
                            className="posterImg"
                            src={posterImg}
                        ></Image>
                        <View className="btn-create" onClick={this.savePosterPic}>
                            保存到相册
                        </View>
                    </View>
                )}
                <VanPopup
                    show={!hideShopPopup}
                    round
                    closeable
                    position="bottom"
                    customStyle={{ paddingTop: "48rpx",maxHeight: "80%", }}
                    onClose={this.closePopupTap}
                >
                    {goodsDetail.basicInfo && <VanCard
                        centered
                        price={selectSizePrice}
                        originPrice={
                            selectSizePrice != selectSizePrice ? selectSizeOPrice : ''
                        }
                        title={goodsDetail.basicInfo.name}
                        thumb={skuGoodsPic}
                    ></VanCard>}
                    <View className="size-label-box">
                        {goodsDetail.properties && goodsDetail.properties.map((property, idx) => {
                            return (
                                <Block key={property.id}>
                                    <View className="label">{property.name}</View>
                                    <View className="label-item-box">
                                        {property.childsCurGoods.map((item, index) => {
                                            return (
                                                <View
                                                    className={
                                                        'label-item ' + (item.active ? 'active' : '')
                                                    }
                                                    key={item.id}
                                                    onClick={this.labelItemTap}
                                                    data-propertyindex={idx}
                                                    data-propertychildindex={index}
                                                >
                                                    {item.name}
                                                </View>
                                            )
                                        })}
                                    </View>
                                </Block>
                            )
                        })}
                        {goodsAddition && goodsAddition.map((property, idx) => {
                            return (
                                <Block key={property.id}>
                                    <View className="label">{property.name}</View>
                                    <View className="label-item-box">
                                        {property.items.map((item, index) => {
                                            return (
                                                <View
                                                    className={
                                                        'label-item ' + (item.active ? 'active' : '')
                                                    }
                                                    key={item.id}
                                                    onClick={this.labelItemTap2}
                                                    data-propertyindex={idx}
                                                    data-propertychildindex={index}
                                                >
                                                    {item.name}
                                                </View>
                                            )
                                        })}
                                    </View>
                                </Block>
                            )
                        })}
                    </View>
                    <VanCell title="购买数量">
                        <View>
                            <VanStepper
                                value={buyNumber}
                                min={buyNumMin}
                                max={buyNumMax}
                                onChange={this.stepChange}
                            ></VanStepper>
                        </View>
                    </VanCell>
                    {shopType == 'addShopCar' && (
                        <VanButton onClick={this.addShopCar} type="danger" block>
                            加入购物车
                        </VanButton>
                    )}
                    {(shopType == 'tobuy' || shopType == 'toPingtuan') && (
                        <VanButton
                            data-shopType={shopType}
                            onClick={this.buyNow}
                            type="danger"
                            block
                        >
                            立即购买
                        </VanButton>
                    )}
                </VanPopup>
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
