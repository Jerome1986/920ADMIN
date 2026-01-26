interface FormModel {
  _id?: string
  storeName: string
  address: string
  managerName: string
  phone: string
  status?: 'active' | 'inactive'
}

export function validateForm(form: FormModel): { valid: boolean; message?: string } {
  // 门店名称
  if (!form.storeName || form.storeName.trim().length < 2) {
    return { valid: false, message: '门店名称必填，长度需大于2个字符' }
  }
  if (form.storeName.length > 50) {
    return { valid: false, message: '门店名称不能超过50个字符' }
  }

  // 门店地址
  if (!form.address || form.address.trim().length < 5) {
    return { valid: false, message: '门店地址必填，长度需大于5个字符' }
  }
  if (form.address.length > 100) {
    return { valid: false, message: '门店地址不能超过100个字符' }
  }

  // 店长姓名
  if (!form.managerName || form.managerName.trim().length < 2) {
    return { valid: false, message: '店长姓名必填，长度需大于2个字符' }
  }
  if (form.managerName.length > 20) {
    return { valid: false, message: '店长姓名不能超过20个字符' }
  }

  // 电话
  if (!form.phone) {
    return { valid: false, message: '门店电话必填' }
  }

  if (form.phone) {
    const phoneReg = /^1[3-9]\d{9}$/ // 简单的中国手机号校验
    if (!phoneReg.test(form.phone)) {
      return { valid: false, message: '请输入正确的手机号' }
    }
  }

  // 状态
  const allowedStatus = ['active', 'inactive']
  if (!form.status || !allowedStatus.includes(form.status)) {
    return { valid: false, message: '状态字段非法，必须是 active 或 inactive' }
  }

  return { valid: true }
}
