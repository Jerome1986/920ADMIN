// 性别转换
import type { OrderStatus } from '@/types/OrderItem.d.ts'
import type { OrderStatusAll } from '@/types/offlineOrder'
import type { SettlementStatus } from '@/types/Settlement'

export const formatGender = (gender: number) => {
  switch (gender) {
    case 1:
      return '男'
    case 2:
      return '女'
    default:
      return '未知'
  }
}

// 角色映射
export const formatRole = (levelText: string): string => {
  switch (levelText) {
    case 'user':
      return '普通用户'
    case 'vip':
      return '会员'
    case 'manager':
      return '店长'
    default:
      return '未知身份'
  }
}

// 商品订单状态转换
export const formatOrderState = (status: OrderStatus) => {
  switch (status) {
    case 'PENDING':
      return '待支付'
    case 'PAID':
      return '待发货'
    case 'SHIPPED':
      return '已发货'
    case 'COMPLETED':
      return '已完成'
    case 'CANCELLED':
      return '已取消'
    case 'REFUNDING':
      return '退款中'
    case 'REFUNDED':
      return '已退款'
    default:
      return '全部'
  }
}

// 线下贴膜订单状态装换
export const formatOfflineOrderState = (status: OrderStatusAll) => {
  switch (status) {
    case 'PENDING':
      return '待支付'
    case 'SERVICING':
      return '服务中'
    case 'COMPLETED':
      return '已完成'
    case 'CANCELLED':
      return '已取消'
    default:
      return '全部'
  }
}

export const formatSettlementOrderState = (status: SettlementStatus) => {
  switch (status) {
    case 'PENDING':
      return '等待结算'
    case 'COMPLETED':
      return '结算完成'
    case 'FAILED':
      return '结算失败'
  }
}

// 会员订单转换
export const formatVipOrderState = (status: OrderStatus) => {
  switch (status) {
    case 'PENDING':
      return '待支付'
    case 'PAID':
      return '待同步'
    case 'SHIPPED':
      return '已同步'
    case 'COMPLETED':
      return '已完成'
    case 'CANCELLED':
      return '已取消'
    case 'REFUNDING':
      return '退款中'
    case 'REFUNDED':
      return '已退款'
  }
}

// 店长订单状态转换
export const formatStoreOrderState = (state: string) => {
  switch (state) {
    case 'pending':
      return '未结算'
    case 'finished':
      return '已结算'
  }
}

// 姓名映射
export const formatName = (name: string) => {
  if (!name) return '未填写'
  return name
}

// 映射百分比
export const displayValue = (cashbackRate: number) => {
  if (!cashbackRate) return '未设置'
  return (cashbackRate * 100).toFixed(0) + '%'
}
