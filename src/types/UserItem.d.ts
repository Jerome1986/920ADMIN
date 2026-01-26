/**
 * 用户数据类型
 */
export type UserItem = {
  /** 唯一标识 */
  _id: string
  /** 微信的用户标识id */
  openid?: string
  /** 用户昵称 */
  nickname: string
  /** 用户头像 */
  avatarUrl: string
  /** 姓名 */
  name: string
  /** 用户手机号码 */
  mobile: string
  /** 性别 */
  gender: number
  /** 用户角色 - user普通用户 vip会员 manager店长 */
  role: 'user' | 'vip' | 'manager'
  /** 注册时间 */
  registerTime: string
  /** 账号状态 - active激活 inactive未激活 */
  status: 'active' | 'inactive'
  /** 邀请码 */
  referralCode: string
  /** 上级的邀请码 */
  inviterCode: string
  /**  会员等级： 1:基础会员, 2:高级会员, 3:至尊会员 */
  vipLevel: number
  /** 会员注册时间 */
  vipStartTime: string
  /** 会员到期时间 */
  vipEndTime: string
  /** 会员权益： ['折扣9折', '免费配送'] */
  vipGift: number
  /** 会员折扣 */
  vipDiscount: number
  /** 积分 */
  score: number
  /** 运营资金 */
  operating_balance: number
  /** 待结算余额 */
  settle_balance: number
}

// 带页码类型
export type pagesUserResult = {
  /** 用户列表 */
  list: UserItem[]
  /** 总数 */
  total: number
  /** 当前页 */
  pageNum: number
  /** 每页条数 */
  pageSize: number
  /** 合计页数 */
  totalPage: number
}
