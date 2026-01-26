import { request } from '@/utils/request.ts'
import type { addResult, delResult, updateResult } from '@/types/Gobal'
import type { RateRulesItem } from '@/types/RateRulesItem'

/**
 * 新增积分规则
 * @param earnRate - 返积分比例：消费商品返回多少比例的积分，如10%，0.1等
 * @param useRate - 积分抵扣换算率：积分和人民币的换算比例，默认为 1：1
 * @param maxUsePercent - 抵扣比例：当前订单里，订单总额，积分最大可抵扣的比例，如：0.1 及10% 等  注：最大不可超过20%及0.2
 */
export const rateRuleAddApi = (earnRate: number, useRate: number, maxUsePercent: number) => {
  return request<addResult>({
    method: 'POST',
    url: '/rate/add',
    data: { earnRate, useRate, maxUsePercent }
  })
}

/**
 * 获取积分规则，（只有一条）
 */
export const rateRuleGetApi = () => {
  return request<RateRulesItem[]>({
    method: 'GET',
    url: '/rate/get'
  })
}

/**
 * 删除积分规则
 * @param rateId - 当前规则的ID
 */
export const rateRuleDeleteApi = (rateId: string) => {
  return request<delResult>({
    method: 'POST',
    url: '/rate/del',
    data: { rateId }
  })
}

/**
 * 更新当前积分规则
 * @param rateId - 当前积分规则ID
 * @param earnRate - 返积分比例：消费商品返回多少比例的积分，如10%，0.1等
 * @param useRate - 积分抵扣换算率：积分和人民币的换算比例，默认为 1：1
 * @param maxUsePercent - 抵扣比例：当前订单里，订单总额，积分最大可抵扣的比例，如：0.1 及10% 等  注：最大不可超过20%及0.2
 */
export const rateRuleUpdateApi = (
  rateId: string,
  earnRate: number,
  useRate: number,
  maxUsePercent: number
) => {
  return request<updateResult>({
    method: 'POST',
    url: '/rate/update',
    data: { rateId, earnRate, useRate, maxUsePercent }
  })
}
