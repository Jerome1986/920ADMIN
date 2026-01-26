// 结算状态
export type SettlementStatus = 'PENDING' | 'COMPLETED' | 'FAILED'

// 结算类型返回
export interface SettlementItem {
  /** mongo ID */
  _id: string
  /** 平台结算订单号 */
  out_trade_no: string
  /** 结算用户ID */
  userId: string
  /** 结算用户手机号 */
  mobile: string
  /** 待结算金额 */
  should_settlement_amount: number
  /** 实际结算金额 */
  actual_settlement_amount: number
  /** 订单备注说明 */
  remark: string
  /** 结算凭证 */
  receiptFiles: string
  /** 订单状态 */
  settlementStatus: SettlementStatus
  /** 订单创建时间：默认每月10号，创建订单 */
  createdAt: Date
  /** 订单更新时间 */
  updatedAt: Date
}

// 结算订单分页返回类型
export interface SettlementPageResult {
  list: SettlementItem[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}

// 更新返回
export interface SettlementUpdate {
  mobile: string
  settlementStatus: SettlementStatus
  settle_balance: number
  lockedAmount: number
}
