import { request } from '@/utils/request.ts'
import type { PurchaseOrderPickUpResult, PurchasePageResult } from '@/types/PurchaseOrder'
import type { OrderProductItem } from '@/types/OrderItem.d.ts'

/**
 * 获取所有店长的进货单
 * @param status - 订单状态 'ALL', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED'
 * @param pageNum - 页码
 * @param pageSize - 条数
 */
export const purchaseOrderGetApi = (status: string, pageNum: number, pageSize: number) => {
  return request<PurchasePageResult>({
    method: 'GET',
    url: '/purchasedOrder/get',
    params: { status, pageNum, pageSize }
  })
}

/**
 * 将店长进货单更新为已取货
 * @param out_trade_no - 业务订单号
 * @param userId - 店长的用户ID
 * @param products - 当前订单里的采购商品
 * @param amountYuan - 实际支付金额，扣除积分抵扣后的金额
 */
export const purchaseOrderPickUpApi = (
  out_trade_no: string,
  userId: string,
  products: OrderProductItem[],
  amountYuan: number
) => {
  return request<PurchaseOrderPickUpResult>({
    method: 'POST',
    url: '/purchasedOrder/pickup',
    data: { out_trade_no, userId, products, amountYuan }
  })
}

/**
 * 根据订单号或者手机号码搜索进货单
 * @param searchVal - 搜搜内容
 * @param status - 订单状态
 * @param pageNum
 * @param pageSize
 */
export const purchaseOrderSearchApi = (
  searchVal: string,
  status: string,
  pageNum: number,
  pageSize: number
) => {
  return request<PurchasePageResult>({
    method: 'POST',
    url: '/purchasedOrder/search',
    data: { searchVal, status, pageNum, pageSize }
  })
}
