// 线下贴膜订单
export interface offlineOrder {
  /** 唯一标识ID */
  _id: string
  /** 门店ID */
  storeId: string
  /** 会员手机号码 */
  memberPhone: string
  /** 业务订单号 */
  out_trade_no: string
  /** 商品名称 */
  productName: string
  /** 商品封面图 */
  productCover: string
  /** 商品货号 */
  productSkuNo: string
  /** 商品备注 */
  productDec: string
  /** 包含的手机范围 */
  models: string[]
  /** 订单金额 */
  amount: number
  /** 支付方式 */
  paymentMethod: string
  /** 订单备注 */
  remark: string
  /** 返回的订单状态，门店线下订单，后台只需要观察已完成和已取消就行了 */
  status: 'COMPLETED' | 'CANCELLED'
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updatedAt: Date
}

export interface offlineOrderPageResult {
  list: offlineOrder[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}

// 免费贴膜服务订单状态类型
export type freeOrderStatus =
  | 'SERVICING' // 服务中
  | 'COMPLETED' // 服务完成
  | 'CANCELLED' // 已取消

/**
 * 付费订单服务类型
 */
export type OrderStatus =
  | 'PENDING' // 待支付
  | 'PAID' // 已支付
  | 'COMPLETED' // 已完成
  | 'CANCELLED' // 已取消

// 综合类型
export type OrderStatusAll = FreeOrderStatus | PaidOrderStatus
