import { request } from '@/utils/request.ts'
import type { loginResult } from '@/types/AdminItem'

/**
 * 登录
 * /admin/login
 * @param {string} username - 用户名
 * @param {string} password - 密码
 */
export const loginApi = (username: string, password: string) => {
  return request<loginResult>({
    method: 'POST',
    url: '/admin/login',
    data: { username, password }
  })
}
