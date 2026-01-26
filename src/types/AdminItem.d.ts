/**
 * 管理员数据类型
 */

export type AdminItem = {
  /** 主键，系统自动生成 */
  _id?: string
  /** 用户名，唯一 */
  username: string
  /** 哈希后的密码（bcrypt 存储) */
  password?: string
  /** 角色，比如 'super_admin' | 'admin' | 'editor' */
  role: string
  /** 邮箱，可选 */
  email?: string
  /** 手机号，可选 */
  phone?: string
  /** 状态：1=正常，0=禁用 */
  status: number
  /** 最近登录时间 */
  lastLoginAt?: Date
  /** 最近登录 IP */
  lastLoginIp?: string
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updatedAt: Date
}

/**
 * 登录返回类型
 */

export type loginResult = {
  /** token */
  token: string
  /** token剩余的时间 */
  expiresAt: number
  /** 用户简单信息 */
  user: AdminItem
}
