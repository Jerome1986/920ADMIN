import type { OrderAmount, OrderProductItem, OrderUserInfo } from '@/types/OrderItem.d.ts'
// 进货订单的状态
type OrderStatus =
  | 'PAID' // 已提交
  | 'SHIPPED' // 已发货
  | 'COMPLETED' // 已完成
  | 'CANCELLED' // 已取消

// 进货订单数据类型
export interface PurchaseItem {
  _id: string
  /** 微信唯一标识 */
  openid: string
  /** 业务订单号  PRO开头商品订单  VIP开头会员订单  STORE开头 店长进货订单 */
  out_trade_no: string
  /** 订单状态 PAID 已提交 SHIPPED 已发货  COMPLETED 已完成 CANCELLED 已取消 */
  status: OrderStatus
  /** 用户信息 */
  userInfo: OrderUserInfo
  /** 产品信息 */
  products: OrderProductItem[]
  /** 总件数 */
  totalCount: number
  /** 订单金额明细 */
  amount: OrderAmount
  /** 订单备注：商品购买、办理会员、店长进货 */
  remark: string
  /** 订单创建时间 */
  createdAt: Date
  /** 订单取消时间 */
  cancelledAt: Date
  /** 订单完成时间 */
  completedAt: Date
  /** 订单更新时间 */
  updatedAt: Date
}

// 进货单分页返回类型
export interface PurchasePageResult {
  list: PurchaseItem[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}

// 取货成功后返回的数据类型
export interface PurchaseOrderPickUpResult {
  out_trade_no: string
  userId: string
}
