import { request } from '@/utils/request.ts'
import type { TeamItem } from '@/types/TeamItem.d.ts'
import type { addResult, delResult, updateResult } from '@/types/Gobal'

/**
 * 获取团队风采
 */
export const teamListGetApi = () => {
  return request<TeamItem[]>({
    method: 'GET',
    url: '/team/get'
  })
}

/**
 * 团队风采新增
 * @param name - 标题
 * @param image - 图片
 */
export const teamListAddApi = (name: string, image: string) => {
  return request<addResult>({
    method: 'POST',
    url: '/team/add',
    data: { name, image }
  })
}

/**
 * 删除指定团队风采信息
 * @param teamId - 团队风采ID
 */
export const teamListDeleteApi = (teamId: string) => {
  return request<delResult>({
    method: 'POST',
    url: '/team/del',
    data: { teamId }
  })
}

/**
 * 更新指定团队风采信息
 * @param teamId - 团队风采ID
 * @param name - 标题
 * @param image - 图片地址
 * @param status - 是否显示
 */
export const teamListUpdateApi = (
  teamId: string,
  name: string,
  image: string,
  status: 'active' | 'inactive'
) => {
  return request<updateResult>({
    method: 'POST',
    url: '/team/update',
    data: { teamId, name, image, status }
  })
}
