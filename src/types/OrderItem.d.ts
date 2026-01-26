/** 购物车项数据类型 */
export interface OrderProductItem {
  /** 购物车项ID */
  _id: string
  /** 商品ID */
  productId: string
  /** 商品货号 */
  skuNo: string
  /** 商品名称 */
  name: string
  /** 商品描述 */
  dec: string
  /** 商品封面图（如果选择了SKU，则为SKU图片） */
  cover: string
  /** 原价 */
  originalPrice: number
  /** 当前价格（SKU价格或商品价格） */
  currentPrice: number
  /** 购买数量 */
  quantity: number
  /** 型号 */
  model: string
  /** 选中的SKU信息（如果有） */
  sku?: SkuItem
  /** 商品类型--设置某些角色可见，区分店长产品和用户产品 */
  type?: 'user' | 'manager' | 'vip' | 'both'
}

/** 前端对应的商品SKU类型 */
export interface SkuItem {
  /** sku标识 */
  _id: string
  /** sku编码 */
  skuCode: string
  /** 价格 */
  price: number
  /** 库存 */
  stock: number
  /** 封面图 */
  image: string
  /** 规格映射 */
  attrs: {
    /** 规格名称  如：颜色、规格、尺寸等*/
    label: string
    /** 具体数值 */
    value: string
  }
  /** 对应的产品ID */
  goodsId: string
  /** 创建时间 */
  createdAt?: Date
  /** 更新时间 */
  updatedAt?: Date
}

/**
 * 订单状态枚举
 */
export type OrderStatus =
  | 'PENDING' // 待支付
  | 'PAID' // 已支付
  | 'SHIPPED' // 已发货
  | 'COMPLETED' // 已完成
  | 'CANCELLED' // 已取消
  | 'REFUNDING' // 退款中
  | 'REFUNDED' // 已退款

/**
 * 支付方式枚举
 */
export type PaymentMethod = 'wechat' | 'alipay' | 'balance'

/**
 * 订单金额明细
 */
export interface OrderAmount {
  /** 商品总金额 */
  totalPrice: number
  /** 积分抵扣金额 */
  deductAmount: number
  /** 实际支付金额 */
  actualPayment: number
  /** 使用的积分数 */
  usedScore?: number
}

/**
 * 订单用户信息
 */
export interface OrderUserInfo {
  /** 用户ID */
  userId: string
  /** 用户昵称 */
  nickname: string
  /** 用户角色 */
  role: string
  /** 用户手机号 */
  mobile: string
  /** 用户头像 */
  avatarUrl?: string
}

/**
 * 订单物流信息
 */
export interface OrderLogistics {
  /** 物流公司ID,如顺丰：SF */
  express_company?: string
  /** 物流单号 */
  tracking_no?: string
  /** 物流信息备注 */
  item_desc: string
  /** 联系方式 */
  contact: {
    /** 收货人电话 */
    receiver_contact: string
  }
}

// 收货地址信息
export interface AddressInfo {
  userName: string
  telNumber: string
  provinceName: string
  cityName: string
  countyName: string
  detailInfo: string
  postalCode?: string
  nationalCode?: string
}

/**
 * 订单项（完整订单数据类型）
 */
export interface ProductOrderItem {
  /** 订单ID */
  _id: string
  /** 订单编号（业务订单号） */
  out_trade_no: string
  /** 微信交易订单号 */
  transaction_id: string
  /** 微信唯一标识 */
  openid: string
  /** 订单状态 */
  status: OrderStatus
  /** 用户信息 */
  userInfo: OrderUserInfo
  /** 收货地址信息 */
  addressInfo: AddressInfo
  /** 订单商品列表 */
  products: OrderProductItem[]
  /** 订单商品总件数 */
  totalCount: number
  /** 金额明细 */
  amount: OrderAmount
  /** 支付方式 */
  paymentMethod?: PaymentMethod
  /** 支付流水号 */
  paymentNo?: string
  /** 物流信息 */
  logistics?: OrderLogistics[]
  /** 订单备注 */
  remark?: string
  /** 创建时间 */
  createdAt: string
  /** 支付时间 */
  paidAt?: string
  /** 发货时间 */
  shippedAt?: string
  /** 完成时间 */
  completedAt?: string
  /** 取消时间 */
  cancelledAt?: string
  /** 取消原因 */
  cancelReason?: string
  /** 更新时间 */
  updatedAt: string
}

/**
 * 订单分页响应
 */
export interface ProductOrderPageResult {
  /** 订单列表 */
  list: ProductOrderItem[]
  /** 总数 */
  total: number
  /** 当前页码 */
  pageNum: number
  /** 每页条数 */
  pageSize: number
  /** 总页数 */
  totalPage: number
}

/**
 * 订单统计信息
 */
export interface OrderStatistics {
  /** 待支付订单数 */
  pendingCount: number
  /** 待发货订单数 */
  paidCount: number
  /** 待收货订单数 */
  shippedCount: number
  /** 已完成订单数 */
  completedCount: number
  /** 总订单数 */
  totalCount: number
  /** 总交易额 */
  totalAmount: number
}

// 会员订单类型
export interface VipOrderItem {
  /** mongodb 唯一标识 */
  _id: string
  /** 微信唯一标识 */
  openid: string
  /** 订单号*/
  out_trade_no: string
  /** 微信交易订单号 */
  transaction_id: string
  /** 用户ID*/
  userId: string
  /** 用户电话*/
  userMobile: string
  /** 对应的产品ID*/
  vipProId: string
  /** 会员等级*/
  vipLevel: number
  /** 会员等级文本说明*/
  vipLevelText: string
  /** 产品金额*/
  amount: number
  /** 会员可享折扣*/
  discount: number
  /** 每月对应的免费贴膜次数*/
  limit: number
  /** 可共享的家庭成员*/
  maxUsers: number
  /** 会员周期 */
  term: string
  /** 当前订单状态*/
  status: VipOrderStatus
  /** 订单创建时间 */
  createdAt: Date
  /** 订单更新时间 */
  updatedAt: Date
}

// 会员订单分页类型
export interface VipOrderPageResult {
  list: VipOrderItem[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}

/**
 * 会员订单状态:支付则代表完成 前端显示已开通,会员订单不用发货，但是要同步微信后台订单状态结算金额。
 * 所以，状态对应为 PAID - 支付完成后待同步微信订单
 * SHIPPED - 已同步微信订单
 */
export type VipOrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'SHIPPED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDING'

/**
 * 会员日志操作类型
 * DEDUCT → 消费掉
 * REFUND → 退回
 * GRANT → 新增奖励
 * ADJUST → 人工修正
 */
export type VipGiftType = 'DEDUCT' | 'REFUND' | 'GRANT' | 'ADJUST'

/**
 * 会员免费次数变动流水
 */
export interface VipGiftLog {
  /** 主键 */
  _id?: ObjectId
  /** 会员手机号（冗余字段，方便查询） */
  mobile: string
  /** 关联订单号 */
  orderNo: string
  /** 变动类型 */
  type: VipGiftType
  /** 本次变动的次数（正整数） */
  count: number
  /** 变动前剩余次数 */
  before: number
  /** 变动后剩余次数 */
  after: number
  /** 所属门店 */
  storeId?: string
  /** 操作角色（与你现在的业务假设兼容） */
  operatorRole?: 'store_manager' | 'admin' | 'system'
  /** 变动原因说明 */
  remark?: string
  /** 创建时间 */
  createdAt: Date
}
