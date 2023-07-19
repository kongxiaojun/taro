import { Block, View, Radio, Image, Input, Navigator } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
export default class CartGoodsListTmpl extends React.Component {
  render() {
    const {
      data: {
        shopList,
        shop,
        item,
        items,
        index,
        option,
        curTouchGoodStore,
        score,
        price,
        shopCarType,
      },
    } = this.props
    return (
      <Block>
        {shopCarType == 0 && (
          <View className="goodsList">
            {shopList.map((shop, shopIndex) => {
              return (
                <VanCellGroup key={shop.id} title={shop.name}>
                  {item.shopId == shop.id && (
                    <Block>
                      {items.map((item, index) => {
                        return (
                          <View className="a-gooods" key={item.key}>
                            <View
                              className={
                                'a-goods-conts ' + (item.active ? 'active' : '')
                              }
                              onTouchStart={this.touchS}
                              onTouchMove={this.touchM}
                              onTouchEnd={this.touchE}
                              data-index={index}
                              style={item.left}
                            >
                              <View className="goods-info">
                                <View className="radio-box">
                                  <Radio
                                    checked={item.selected}
                                    onClick={this.radioClick}
                                    data-index={index}
                                  ></Radio>
                                </View>
                                <View className="img-box">
                                  <Image
                                    mode="aspectFill"
                                    src={item.pic}
                                    className="img"
                                  ></Image>
                                </View>
                                <View className="text-box">
                                  <View className="goods-title">
                                    {item.name}
                                  </View>
                                  <View className="goods-label">
                                    {item.sku.map((option, index) => {
                                      return (
                                        <Block key={option.index}>
                                          {option.optionName +
                                            ':' +
                                            option.optionValueName}
                                        </Block>
                                      )
                                    })}
                                    {item.additions.map((option, index) => {
                                      return (
                                        <Block key={option.index}>
                                          {option.pname + ':' + option.name}
                                        </Block>
                                      )
                                    })}
                                  </View>
                                  <View className="goods-price">
                                    {'¥ ' + item.price}
                                  </View>
                                  <View className="buy-num">
                                    <View
                                      className="jian-btn"
                                      onClick={this.privateStopNoop.bind(
                                        this,
                                        this.jianBtnTap
                                      )}
                                      data-index={index}
                                    >
                                      -
                                    </View>
                                    <Input
                                      type="number"
                                      value={item.number}
                                      data-key={item.key}
                                      onInput={this.changeCarNumber}
                                    ></Input>
                                    <View
                                      className={
                                        'jia-btn ' +
                                        (item.number == curTouchGoodStore
                                          ? 'disabled'
                                          : '')
                                      }
                                      onClick={this.privateStopNoop.bind(
                                        this,
                                        this.jiaBtnTap
                                      )}
                                      data-index={index}
                                    >
                                      +
                                    </View>
                                  </View>
                                </View>
                              </View>
                              <View
                                className="delete-btn"
                                data-key={item.key}
                                onClick={this.privateStopNoop.bind(
                                  this,
                                  this.delItem
                                )}
                              >
                                删除
                              </View>
                              {/*  <view class="del-icon">
                                  <van-icon name="close" size="32rpx" color="#000" data-key="{{item.key}}" catchtap="delItem" />
                                </view>  */}
                            </View>
                          </View>
                        )
                      })}
                    </Block>
                  )}
                </VanCellGroup>
              )
            })}
          </View>
        )}
        {shopCarType == 1 && (
          <View className="goodsList">
            {items.map((item, index) => {
              return (
                <View className="a-gooods" key={item.key}>
                  <View
                    className={'a-goods-conts ' + (item.active ? 'active' : '')}
                    onTouchStart={this.touchS}
                    onTouchMove={this.touchM}
                    onTouchEnd={this.touchE}
                    data-index={index}
                    style={item.left}
                  >
                    <View className="goods-info">
                      <View className="radio-box">
                        <Radio
                          checked={item.selected}
                          onClick={this.radioClick}
                          data-index={index}
                        ></Radio>
                      </View>
                      <View className="img-box">
                        <Image
                          mode="aspectFill"
                          src={item.pic}
                          className="img"
                        ></Image>
                      </View>
                      <View className="text-box">
                        <View className="goods-title">{item.name}</View>
                        <View className="goods-label">
                          {item.sku.map((option, index) => {
                            return (
                              <Block key={option.index}>
                                {option.optionName +
                                  ':' +
                                  option.optionValueName}
                              </Block>
                            )
                          })}
                          {item.additions.map((option, index) => {
                            return (
                              <Block key={option.index}>
                                {option.pname + ':' + option.name}
                              </Block>
                            )
                          })}
                        </View>
                        <View className="goods-price">{'¥ ' + item.price}</View>
                        <View className="buy-num">
                          <View
                            className="jian-btn"
                            onClick={this.privateStopNoop.bind(
                              this,
                              this.jianBtnTap
                            )}
                            data-index={index}
                          >
                            -
                          </View>
                          <Input
                            type="number"
                            value={item.number}
                            data-key={item.key}
                            onInput={this.changeCarNumber}
                          ></Input>
                          <View
                            className={
                              'jia-btn ' +
                              (item.number == curTouchGoodStore
                                ? 'disabled'
                                : '')
                            }
                            onClick={this.privateStopNoop.bind(
                              this,
                              this.jiaBtnTap
                            )}
                            data-index={index}
                          >
                            +
                          </View>
                        </View>
                      </View>
                    </View>
                    <View
                      className="delete-btn"
                      data-key={item.key}
                      onClick={this.privateStopNoop.bind(this, this.delItem)}
                    >
                      删除
                    </View>
                    {/*  <view class="del-icon">
                          <van-icon name="close" size="32rpx" color="#000" data-key="{{item.key}}" catchtap="delItem" />
                        </view>  */}
                  </View>
                </View>
              )
            })}
          </View>
        )}
        <View className="jiesuan-box">
          <View className="left-price">
            {score ? (
              <View className="total">
                {'合计：¥ ' + price + ' + ' + score + ' 积分'}
              </View>
            ) : (
              <View className="total">{'合计：¥ ' + price}</View>
            )}
          </View>
          <View className="to-pay-btn">
            <Navigator
              url={'/pages/to-pay-order/index?shopCarType=' + shopCarType}
            >
              去结算
            </Navigator>
          </View>
        </View>
      </Block>
    )
  }
}
