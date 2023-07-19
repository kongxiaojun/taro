import { Block, View, Picker, Button } from '@tarojs/components'
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
const AUTH = require('../../utils/auth.js')
var address_parse = require('../../utils/address_parse.js')
@withWeapp({
  data: {
    provinces: undefined,
    // 省份数据数组
    pIndex: 0,
    //选择的省下标
    cities: undefined,
    // 城市数据数组
    cIndex: 0,
    //选择的市下标
    areas: undefined,
    // 区县数数组
    aIndex: 0, //选择的区下标
  },

  async provinces(provinceId, cityId, districtId, streetId) {
    const res = await WXAPI.province()
    if (res.code == 0) {
      const provinces = [
        {
          id: 0,
          name: '请选择',
        },
      ].concat(res.data)
      let pIndex = 0
      if (provinceId) {
        pIndex = provinces.findIndex((ele) => {
          return ele.id == provinceId
        })
      }
      this.setData({
        pIndex,
        provinces: provinces,
      })
      if (provinceId) {
        const e = {
          detail: {
            value: pIndex,
          },
        }
        this.provinceChange(e, cityId, districtId, streetId)
      }
    }
  },
  async provinceChange(e, cityId, districtId, streetId) {
    const index = e.detail.value
    this.setData({
      pIndex: index,
    })
    const pid = this.data.provinces[index].id
    if (pid == 0) {
      this.setData({
        cities: null,
        cIndex: 0,
        areas: null,
        aIndex: 0,
      })
      return
    }
    const res = await WXAPI.nextRegion(pid)
    if (res.code == 0) {
      const cities = [
        {
          id: 0,
          name: '请选择',
        },
      ].concat(res.data)
      let cIndex = 0
      if (cityId) {
        cIndex = cities.findIndex((ele) => {
          return ele.id == cityId
        })
      }
      this.setData({
        cIndex,
        cities: cities,
      })
      if (cityId) {
        const e = {
          detail: {
            value: cIndex,
          },
        }
        this.cityChange(e, districtId, streetId)
      }
    }
  },
  async cityChange(e, districtId, streetId) {
    const index = e.detail.value
    this.setData({
      cIndex: index,
    })
    const pid = this.data.cities[index].id
    if (pid == 0) {
      this.setData({
        areas: null,
        aIndex: 0,
      })
      return
    }
    const res = await WXAPI.nextRegion(pid)
    if (res.code == 0) {
      const areas = [
        {
          id: 0,
          name: '请选择',
        },
      ].concat(res.data)
      let aIndex = 0
      if (districtId) {
        aIndex = areas.findIndex((ele) => {
          return ele.id == districtId
        })
      }
      this.setData({
        aIndex,
        areas: areas,
      })
      if (districtId) {
        const e = {
          detail: {
            value: aIndex,
          },
        }
        this.areaChange(e, streetId)
      }
    }
  },
  async areaChange(e, streetId) {
    const index = e.detail.value
    this.setData({
      aIndex: index,
    })
    const shipping_address_region_level = Taro.getStorageSync(
      'shipping_address_region_level'
    )
    if (shipping_address_region_level == 3) {
      return
    }
    //
    const pid = this.data.areas[index].id
    if (pid == 0) {
      this.setData({
        streets: null,
        sIndex: 0,
      })
      return
    }
    const res = await WXAPI.nextRegion(pid)
    if (res.code == 0) {
      const streets = [
        {
          id: 0,
          name: '请选择',
        },
      ].concat(res.data)
      let sIndex = 0
      if (streetId) {
        sIndex = streets.findIndex((ele) => {
          return ele.id == streetId
        })
      }
      this.setData({
        sIndex,
        streets,
      })
      if (streetId) {
        const e = {
          detail: {
            value: sIndex,
          },
        }
        this.streetChange(e)
      }
    }
  },
  async streetChange(e) {
    const index = e.detail.value
    this.setData({
      sIndex: index,
    })
  },
  async bindSave() {
    if (this.data.pIndex == 0) {
      Taro.showToast({
        title: '请选择省份',
        icon: 'none',
      })
      return
    }
    if (this.data.cIndex == 0) {
      Taro.showToast({
        title: '请选择城市',
        icon: 'none',
      })
      return
    }
    if (this.data.aIndex == 0) {
      Taro.showToast({
        title: '请选择区县',
        icon: 'none',
      })
      return
    }
    const shipping_address_region_level = Taro.getStorageSync(
      'shipping_address_region_level'
    )
    if (shipping_address_region_level == 4) {
      if (this.data.sIndex == 0) {
        Taro.showToast({
          title: '请选择社区/街道',
          icon: 'none',
        })
        return
      }
    }
    const linkMan = this.data.linkMan
    const address = this.data.address
    const mobile = this.data.mobile
    if (this.data.shipping_address_gps == '1' && !this.data.addressData) {
      Taro.showToast({
        title: '请选择定位',
        icon: 'none',
      })
      return
    }
    const latitude = this.data.addressData
      ? this.data.addressData.latitude
      : null
    const longitude = this.data.addressData
      ? this.data.addressData.longitude
      : null
    if (!linkMan) {
      Taro.showToast({
        title: '请填写联系人姓名',
        icon: 'none',
      })
      return
    }
    if (!mobile) {
      Taro.showToast({
        title: '请填写手机号码',
        icon: 'none',
      })
      return
    }
    const postData = {
      token: Taro.getStorageSync('token'),
      linkMan: linkMan,
      address: address,
      mobile: mobile,
      isDefault: 'true',
    }
    if (this.data.shipping_address_gps == '1' && !latitude) {
      Taro.showToast({
        title: '请选择定位',
        icon: 'none',
      })
      return
    }
    if (latitude) {
      postData.latitude = latitude
    }
    if (longitude) {
      postData.longitude = longitude
    }
    if (!address) {
      Taro.showToast({
        title: '请填写详细地址',
        icon: 'none',
      })
      return
    }
    if (this.data.pIndex > 0) {
      postData.provinceId = this.data.provinces[this.data.pIndex].id
    }
    if (this.data.cIndex > 0) {
      postData.cityId = this.data.cities[this.data.cIndex].id
    }
    if (this.data.aIndex > 0) {
      postData.districtId = this.data.areas[this.data.aIndex].id
    }
    if (this.data.sIndex > 0) {
      postData.streetId = this.data.streets[this.data.sIndex].id
    }
    let apiResult
    if (this.data.id) {
      postData.id = this.data.id
      apiResult = await WXAPI.updateAddress(postData)
    } else {
      apiResult = await WXAPI.addAddress(postData)
    }
    if (apiResult.code != 0) {
      // 登录错误
      Taro.hideLoading()
      Taro.showToast({
        title: apiResult.msg,
        icon: 'none',
      })
      return
    } else {
      Taro.navigateBack()
    }
  },
  async onLoad(e) {
    // this.initFromClipboard('广州市天河区天河东路6号粤电广场北塔2302，徐小姐，18588998859')
    const _this = this
    if (e.id) {
      // 修改初始化数据库数据
      const res = await WXAPI.addressDetail(Taro.getStorageSync('token'), e.id)
      if (res.code == 0) {
        this.setData({
          id: e.id,
          // ...res.data.info
        })

        this.provinces(
          res.data.info.provinceId,
          res.data.info.cityId,
          res.data.info.districtId,
          res.data.info.streetId
        )
      } else {
        Taro.showModal({
          title: '错误',
          content: '无法获取快递地址数据',
          showCancel: false,
        })
      }
    } else {
      this.provinces()
      Taro.getClipboardData({
        success(res) {
          if (res.data) {
            _this.initFromClipboard(res.data)
          }
        },
      })
    }
    this.setData({
      shipping_address_gps: Taro.getStorageSync('shipping_address_gps'),
    })
  },
  async initFromClipboard(str) {
    address_parse.smart(str).then((res) => {
      console.log('ggggggg', res)
      if (res.name && res.phone && res.address) {
        // 检测到收货地址
        this.setData({
          addressData: {
            provinceId: res.provinceCode,
            cityId: res.cityCode,
            districtId: res.countyCode,
            linkMan: res.name,
            mobile: res.phone,
            address: res.address,
          },
        })
        this.provinces(res.provinceCode, res.cityCode, res.countyCode)
      }
    })
  },
  deleteAddress: function (e) {
    const id = e.currentTarget.dataset.id
    Taro.showModal({
      title: '提示',
      content: '确定要删除该收货地址吗？',
      success: function (res) {
        if (res.confirm) {
          WXAPI.deleteAddress(Taro.getStorageSync('token'), id).then(
            function () {
              Taro.navigateBack({})
            }
          )
        } else {
          console.log('用户点击取消')
        }
      },
    })
  },
  async readFromWx() {
    let that = this
    Taro.chooseAddress({
      success: function (res) {
        // res = {
        //   cityName: '上海市',
        //   countyName: '嘉定区',
        //   detailInfo: '惠民路123号',
        //   errMsg: 'chooseAddress.ok',
        //   nationalCode: '310114',
        //   postalCode: '201800',
        //   provinceName: '上海市',
        //   telNumber: '13500000000',
        //   userName: '测试',
        // }
        const provinceName = res.provinceName
        const cityName = res.cityName
        const diatrictName = res.countyName
        // 读取省
        const pIndex = that.data.provinces.findIndex((ele) => {
          return ele.name == provinceName
        })
        if (pIndex != -1) {
          const e = {
            detail: {
              value: pIndex,
            },
          }
          that.provinceChange(e, 0, 0).then(() => {
            // 读取市
            let cIndex = that.data.cities.findIndex((ele) => {
              return ele.name == cityName
            })
            if (cIndex == -1) {
              cIndex = 1 // 兼容直辖市
            }

            if (cIndex != -1) {
              const e = {
                detail: {
                  value: cIndex,
                },
              }
              that.cityChange(e, 0).then(() => {
                // 读取区县
                const aIndex = that.data.areas.findIndex((ele) => {
                  return ele.name == diatrictName
                })
                if (aIndex != -1) {
                  const e = {
                    detail: {
                      value: aIndex,
                    },
                  }
                  that.areaChange(e)
                }
              })
            }
          })
        }
        that.setData({
          linkMan: res.userName,
          mobile: res.telNumber,
          address: res.detailInfo,
        })
      },
    })
  },
  chooseLocation() {
    Taro.chooseLocation({
      success: (res) => {
        const addressData = this.data.addressData ? this.data.addressData : {}
        addressData.address = res.address + res.name
        addressData.latitude = res.latitude
        addressData.longitude = res.longitude
        this.setData({
          addressData,
        })
      },
      fail: (e) => {
        console.error(e)
      },
    })
  },
})
class _C extends React.Component {
  render() {
    const {
      id,
      provinces,
      pIndex,
      cIndex,
      cities,
      aIndex,
      areas,
      sIndex,
      streets,
      ccIndex,
      communities,
      linkMan,
      mobile,
      addressData,
      shipping_address_gps,
      address,
    } = this.data
    return (
      <Block>
        {!id && provinces && (
          <Block>
            <VanCell
              title="一键获取微信收货地址"
              size="large"
              isLink
              onClick={this.readFromWx}
            ></VanCell>
            <View className="space"></View>
          </Block>
        )}
        <Picker
          onChange={this.provinceChange}
          value={pIndex}
          range={provinces}
          rangeKey="name"
        >
          <VanCell title="省份" value={provinces[pIndex].name} isLink></VanCell>
        </Picker>
        {cities && (
          <Picker
            onChange={this.cityChange}
            value={cIndex}
            range={cities}
            rangeKey="name"
          >
            <VanCell title="城市" value={cities[cIndex].name} isLink></VanCell>
          </Picker>
        )}
        {areas && (
          <Picker
            onChange={this.areaChange}
            value={aIndex}
            range={areas}
            rangeKey="name"
          >
            <VanCell title="区县" value={areas[aIndex].name} isLink></VanCell>
          </Picker>
        )}
        {streets && (
          <Picker
            onChange={this.streetChange}
            value={sIndex}
            range={streets}
            rangeKey="name"
          >
            <VanCell
              title="街道/镇"
              value={streets[sIndex].name}
              isLink
            ></VanCell>
          </Picker>
        )}
        {communities && (
          <Picker
            onChange={this.communityChange}
            value={ccIndex}
            range={communities}
            rangeKey="name"
          >
            <VanCell
              title="社区/村委会"
              value={communities[ccIndex].name}
              isLink
            ></VanCell>
          </Picker>
        )}
        <VanField
          label="姓名"
          modelValue={linkMan}
          placeholder="填写收货人"
          inputAlign="right"
          clearable
        ></VanField>
        <VanField
          label="手机号码"
          modelValue={mobile}
          placeholder="填写手机号码"
          inputAlign="right"
          type="number"
          clearable
        ></VanField>
        {shipping_address_gps == '1' && (
          <VanCell
            title="选择定位"
            value={
              addressData.latitude
                ? addressData.latitude + ',' + addressData.longitude
                : '请选择'
            }
            isLink
            onClick={this.chooseLocation}
          ></VanCell>
        )}
        <VanField
          label="详细地址"
          modelValue={address}
          placeholder="街道门牌信息"
          inputAlign="right"
          clearable
        ></VanField>
        <Button type="primary" className="save-btn" onClick={this.bindSave}>
          保存
        </Button>
        {id && (
          <Button
            type="danger"
            className="save-btn"
            onClick={this.deleteAddress}
            data-id={id}
          >
            删除该地址
          </Button>
        )}
      </Block>
    )
  }
}
export default _C
