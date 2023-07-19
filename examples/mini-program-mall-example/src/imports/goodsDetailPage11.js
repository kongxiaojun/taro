export default {
  url: function (item) {
    if (item.supplyType == 'cps_jd') {
      return '/packageCps/pages/goods-details/cps-jd?id=' + item.goodsId
    } else if (item.supplyType == 'vop_jd') {
      return '/pages/goods-details/vop?id=' + item.yyId + '&goodsId=' + item.id
    } else if (item.supplyType == 'cps_pdd') {
      return '/packageCps/pages/goods-details/cps-pdd?id=' + item.goodsId
    } else if (item.supplyType == 'cps_taobao') {
      return '/packageCps/pages/goods-details/cps-taobao?id=' + item.goodsId
    } else {
      return '/pages/goods-details/index?id=' + item.goodsId
    }
  },
}
