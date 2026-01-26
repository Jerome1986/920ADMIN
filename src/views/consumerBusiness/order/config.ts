// 常见快递公司列表
export const expressList = [
  { label: '顺丰速运', value: 'SF' },
  { label: '中通快递', value: 'ZTO' },
  { label: '圆通速递', value: 'YTO' },
  { label: '申通快递', value: 'STO' },
  { label: '韵达快递', value: 'YD' },
  { label: '极兔速递', value: 'JTSD' },
  { label: '京东物流', value: 'JD' },
  { label: '邮政快递', value: 'YZPY' },
  { label: 'EMS', value: 'EMS' },
  { label: '百世快递', value: 'HTKY' },
  { label: '德邦快递', value: 'DBL' },
  { label: '天天快递', value: 'HHTT' }
]

/**
 * 物流信息校验结果类型
 */
export interface LogisticsValidateResult {
  /** 是否校验通过 */
  valid: boolean
  /** 错误信息 */
  message?: string
}

/**
 * 物流信息校验
 * @param logistics_type - 物流类型：1-实体物流配送 2-同城配送 3-虚拟商品 4-用户自提
 * @param tracking_no - 物流单号（类型1时必填）
 * @param express_company - 快递公司编码（类型1时必填）
 * @returns 校验结果
 */
export const validateLogistics = (
  logistics_type: string | number,
  tracking_no: string,
  express_company: string
): LogisticsValidateResult => {
  const type = Number(logistics_type)

  // 校验物流类型
  if (!type || ![1, 2, 3, 4].includes(type)) {
    return {
      valid: false,
      message: '请选择发货方式'
    }
  }

  // 如果是实体物流配送（类型1），需要校验快递公司和物流单号
  if (type === 1) {
    // 校验快递公司
    if (!express_company || express_company.trim() === '') {
      return {
        valid: false,
        message: '请选择快递公司'
      }
    }

    // 校验物流单号
    if (!tracking_no || tracking_no.trim() === '') {
      return {
        valid: false,
        message: '请输入物流单号'
      }
    }

    // 校验物流单号格式（长度限制）
    if (tracking_no.trim().length > 128) {
      return {
        valid: false,
        message: '物流单号长度不能超过128个字符'
      }
    }

    // 校验物流单号格式（基本格式校验）
    const trackingNoPattern = /^[A-Za-z0-9\-]+$/
    if (!trackingNoPattern.test(tracking_no.trim())) {
      return {
        valid: false,
        message: '物流单号格式不正确，只能包含字母、数字和连字符'
      }
    }
  }

  // 其他类型（2-同城配送、3-虚拟商品、4-用户自提）无需额外校验
  return {
    valid: true
  }
}
