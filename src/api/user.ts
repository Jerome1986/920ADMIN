import { request } from '@/utils/request.ts'
import type { pagesUserResult } from '@/types/UserItem.d.ts'
import type { delResult, updateResult } from '@/types/Gobal'

/**
 * 获取所有用户 - 没传角色就渲染所有
 * @param role - 用户角色
 * @param pageNum - 页码
 * @param pageSize - 条数
 */
export const userDataGetApi = (role: string | number, pageNum: number, pageSize: number) => {
  return request<pagesUserResult>({
    method: 'GET',
    url: '/user/get',
    params: { role, pageNum, pageSize }
  })
}

/**
 * 根据用户ID更新用户基础信息
 * @param userId - 当前用户ID
 * @param name - 用户真实姓名
 * @param gender - 性别
 * @param score - 积分
 * @param status - 账号状态
 */
export const userDataUpdateApi = (
  userId: string,
  name: string,
  gender: number,
  score: number,
  status: 'active' | 'inactive'
) => {
  return request<updateResult>({
    method: 'POST',
    url: '/user/update',
    data: { userId, name, gender, score, status }
  })
}

/**
 * 根据用户ID删除用户
 * @param userId - 当前用户ID
 */
export const userDataDeleteApi = (userId: string) => {
  return request<delResult>({
    method: 'POST',
    url: '/user/del',
    data: { userId }
  })
}

/**
 * 搜索用户
 * @param searchVal - 搜索内容
 * @param role - 根据角色搜索
 * @param pageNum - 页码
 * @param pageSize - 条数
 */
export const userSearchApi = (
  searchVal: string,
  role: string | number,
  pageNum: number,
  pageSize: number
) => {
  return request<pagesUserResult>({
    method: 'POST',
    url: '/user/search',
    data: { searchVal, role, pageNum, pageSize }
  })
}
