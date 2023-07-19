export default {
  v: function (goodsDetail) {
    if (!goodsDetail || !goodsDetail.basicInfo) {
      return '100'
    }
    var goodReputation =
      (goodsDetail.basicInfo.numberGoodReputation /
        goodsDetail.basicInfo.numberOrders) *
      100
    goodReputation = goodReputation.toFixed(0)
    return goodReputation
  },
}
