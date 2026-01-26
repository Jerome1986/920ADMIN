import { request } from '@/utils/request.ts'
import type { GuessPageResult } from '@/types/GuessItem.d.ts'
import type { addResult, delResult, updateResult } from '@/types/Gobal'

/**
 * 获取猜你想搜
 * @param pageNum - 页码
 * @param pageSize - 条数
 */
export const guessListGetApi = (pageNum: number, pageSize: number) => {
  return request<GuessPageResult>({
    method: 'GET',
    url: '/guess/get',
    params: { pageNum, pageSize }
  })
}

/**
 * 新增猜你想搜
 * @param name - 名称
 */
export const guessListAddApi = (name: string) => {
  return request<addResult>({
    method: 'POST',
    url: '/guess/add',
    data: { name }
  })
}

/**
 * 删除猜你想搜
 * @param guessId - 对应ID
 */
export const guessListDeleteApi = (guessId: string) => {
  return request<delResult>({
    method: 'POST',
    url: '/guess/del',
    data: { guessId }
  })
}

/**
 * 更新猜你想搜
 * @param guessId - 对应ID
 * @param name - 名称
 */
export const guessListEditApi = (guessId: string, name: string) => {
  return request<updateResult>({
    method: 'POST',
    url: '/guess/update',
    data: { guessId, name }
  })
}
