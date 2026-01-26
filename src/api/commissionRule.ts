import { request } from '@/utils/request.ts'
import type { CommissionRule } from '@/types/CommissionRule'
import type { updateResult } from '@/types/Gobal'

/**
 * 获取佣金设置规则
 * /commission/get
 */
export const commissionRuleGetApi = () => {
  return request<CommissionRule>({
    method: 'GET',
    url: '/commission/get'
  })
}

/**
 * 设置总佣金
 * /commission/totalRate
 * @param commissionId - 当前佣金的ID
 * @param totalRate - 总佣金
 */
export const totalRateSetApi = (commissionId: string, totalRate: number) => {
  return request<updateResult>({
    method: 'POST',
    url: '/commission/totalRate',
    data: { commissionId, totalRate }
  })
}

/**
 * 更新佣金规则
 * @param commissionId - 规则ID
 * @param level1Rate - 一级佣金
 * @param level2Rate - 二级佣金
 * @param platformRate - 平台佣金
 */
export const commissionRuleUpdateApi = (
  commissionId: string,
  level1Rate: number,
  level2Rate: number,
  platformRate: number
) => {
  return request<updateResult>({
    method: 'POST',
    url: '/commission/update',
    data: { commissionId, level1Rate, level2Rate, platformRate }
  })
}
