// 佣金规则类型
export type CommissionRule = {
  /**  mongo唯一标识ID */
  _id?: string
  /**  一级佣金比例 (0.1 = 10%) */
  level1Rate: number
  /** 二级佣金比例 */
  level2Rate: number
  /** 平台佣金比例 */
  platformRate: number
  /** 总佣金比例  */
  totalRate: number
  /**  创建时间 (ISO 时间字符串) */
  createdAt: Date
  /**  更新时间 (ISO 时间字符串) */
  updatedAt: Date
}
