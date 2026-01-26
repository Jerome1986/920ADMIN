import { request } from '@/utils/request.ts'
import type { SettlementPageResult, SettlementStatus, SettlementUpdate } from '@/types/Settlement'

/**
 * 获取店长的结算信息
 * @param pageNum - 页码
 * @param pageSize - 条数
 */
export const settlementInfoGetApi = (pageNum: number, pageSize: number) => {
  return request<SettlementPageResult>({
    method: 'GET',
    url: '/settlement/managerGet',
    params: { pageNum, pageSize }
  })
}

/**
 * 根据电话搜索结算用户
 * @param searchVal - 搜索内容
 * @param pageNum - 页码
 * @param pageSize - 条数
 */
export const settlementManagerSearchApi = (
  searchVal: string,
  pageNum: number,
  pageSize: number
) => {
  return request<SettlementPageResult>({
    method: 'POST',
    url: '/settlement/search',
    data: { searchVal, pageNum, pageSize }
  })
}

/**
 * 结算信息结算后更新
 * @param out_trade_no - 结算订单号
 * @param userId - 用户ID
 * @param mobile - 结算人手机号
 * @param amount - 订单结算金额
 * @param remark - 结算说明
 * @param receiptFiles - 结算凭证
 * @param settlementStatus - 结算单状态
 */
export const settlementUpdateApi = (
  out_trade_no: string,
  userId: string,
  mobile: string,
  amount: number,
  remark: string,
  receiptFiles: string,
  settlementStatus: SettlementStatus
) => {
  return request<SettlementUpdate>({
    method: 'POST',
    url: '/settlement/update',
    data: { out_trade_no, userId, mobile, amount, remark, receiptFiles, settlementStatus }
  })
}
