/* 
  商品订单表
  @author Kris 2019/2/22
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shopOrdersSchema = new Schema({
  // 订单id
  orderId: {
    type: String,
    index: 1,
    required: true
  },
  // 商铺id
  storeId: {
    type: String,
    index: 1
  },
  // 商品id
  productId: {
    type: String,
    index: 1
  },
  // 规格id
  paramId: {
    type: String,
    index: 1
  },
  // 购买者uid
  uid: {
    type: String,
  },
  // 数量
  count: {
    type: Number,
    default: 1
  },
  // 订单原始总价
  orderOriginPrice: {
    type: Number
  },
  // 订单最终总价格
  orderPrice: {
    type: Number,
  },
  // 收货地址
  receiveAddress: {
    type: String,
    default: ""
  },
  // 收货人姓名
  receiveName: {
    type: String,
    default: ""
  },
  // 收货人电话
  receiveMobile: {
    type: String,
    default: ""
  },
  // 下单时间
  orderToc: {
    type: Date,
    default: Date.now
  },
  // 是否完成付款
  payAlready: {
    type: Boolean,
  },
  // 付款时间
  payToc: {
    type: Date
  },
  /**
   * 订单状态
   * @待付款 unCost
   * @待发货 unShip
   * @待收货 unSign
   * @订单完成 finish
   */
  orderStatus: {
    type: String,
    default: "unCost"
  },
  // 是否有退款
  idRefund: {
    type: Boolean,
    default: false
  },
  /**
   * 退款状态
   * @ing 正在退款中
   * @end 退款已处理
   */
  refundStatus: {
    type: String,
    default: ""
  },
  /**
   * 订单是否关闭
   */
  closeStatus: {
    type: Boolean,
    default: false
  },
  /**
   * 快递单号
   */
  trackNumber: {
    type: String,
    default: ""
  }
}, {
  collection: 'shopOrders'
});

/**
 * 商家拓展订单信息
 * @param orders 由订单对象组成的数组
 * @param o:
 *  参数            数据类型(默认值)      介绍
 *  user:           Boolean(true)   是否拓展购买者信息
 *  product:        Boolean(true)   是否拓展商品信息
 *  productParams:  Boolean(true)   是否拓展商品规格信息
 * @return 拓展后的对象数组，此时的商品对象已不再是schema对象，故无法调用model中的方法
 * @author Kris 2019-3-15
 */
shopOrdersSchema.statics.storeExtendOrdersInfo = async (orders, o) => {
  if(!o) o = {};
  let options = {
    user: true,
    product: true,
    productParam: true
  };
  o = Object.assign(options, o);
  const UserModel = mongoose.model('users');
  const ShopGoodsModel = mongoose.model('shopGoods');
  const ShopProductsParamsModel = mongoose.model('shopProductsParams');
  const uid = new Set(), userObj = {};
  const productId = new Set(), productObj = {};
  const paramId = new Set(), productParamObj = {};
  orders.map(ord =>{
    if(o.user)
      uid.add(ord.uid);
    if(o.product)
      productId.add(ord.productId)
    if(o.productParam)
      paramId.add(ord.paramId)
  });
  let users, products, productParams;
  if(o.user) {
    users = await UserModel.find({uid: {$in:[...uid]}});
    for(const user of users) {
      userObj[user.uid] = user;
    }
  }
  if(o.product) {
    products = await ShopGoodsModel.find({productId: {$in:[...productId]}});
    products = await ShopGoodsModel.extendProductsInfo(products);
    for(const product of products) {
      productObj[product.productId] = product;
    }
  }
  if(o.productParam) {
    productParams = await ShopProductsParamsModel.find({_id: {$in:[...paramId]}});
    productParams = await ShopProductsParamsModel.extendParamsInfo(productParams);
    for(const productParam of productParams) {
      productParamObj[productParam._id] = productParam
    }
  }
  return await Promise.all(orders.map(ord => {
    const order = ord.toObject();
    if(o.user) order.user = userObj[ord.uid];
    if(o.product) order.product = productObj[ord.productId];
    if(o.productParam) order.productParam = productParamObj[ord.paramId];
    return order
  }))
}

/**
 * 买家拓展订单信息
 * @param orders 由订单组成的数组
 * @param o:
 *  参数  数据类型(默认值)    介绍
 *  store:    Boolean(true) 是否拓展店铺信息
 *  product:Boolean(true)   是否拓展商品信息
 *  productParams:Boolean(true) 是否拓展商品规格信息
 * @return 拓展后，对象已不再是schema对象，故无法调用model中的方法
 */
shopOrdersSchema.statics.userExtendOrdersInfo = async (orders, o) => {
  if(!o) o = {};
  let options = {
    store: true,
    product: true,
    productParam: true,
  };
  o = Object.assign(options, o);
  const ShopStoresModel = mongoose.model("shopStores");
  const ShopGoodsModel = mongoose.model("shopGoods");
  const ShopProductsParamsModel = mongoose.model("shopProductsParams");
  const storeId = new Set(), storeObj = {};
  const productId = new Set(), productObj = {};
  const paramId = new Set(), productParamObj = {};
  orders.map(ord => {
    if(o.store)
      storeId.add(ord.storeId)
    if(o.product)
      productId.add(ord.productId)
    if(o.productParam)
      paramId.add(ord.paramId)
  });
  let stores, products, productParams;
  if(o.store) {
    stores = await ShopStoresModel.find({storeId: {$in:[...storeId]}});
    for(const store of stores) {
      storeObj[store.storeId] = store;
    }
  }
  if(o.product) {
    products = await ShopGoodsModel.find({productId: {$in:[...productId]}});
    products = await ShopGoodsModel.extendProductsInfo(products);
    for(const product of products) {
      productObj[product.productId] = product;
    }
  }
  if(o.productParam) {
    productParams = await ShopProductsParamsModel.find({_id: {$in:[...paramId]}});
    productParams = await ShopProductsParamsModel.extendParamsInfo(productParams);
    for(const productParam of productParams) {
      productParamObj[productParam._id] = productParam
    }
  }
  return await Promise.all(orders.map(ord => {
    const order = ord.toObject();
    if(o.store) order.store = storeObj[ord.storeId];
    if(o.product) order.product = productObj[ord.productId];
    if(o.productParam) order.productParam = productParamObj[ord.paramId];
    return order
  }))
}


const ShopOrdersModel = mongoose.model('shopOrders', shopOrdersSchema);
module.exports = ShopOrdersModel;