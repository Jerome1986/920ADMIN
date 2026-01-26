import { request } from '@/utils/request.ts'
import type { CateItem, CatePageResult } from '@/types/CateItem'
import type { addResult, delResult, updateResult } from '@/types/Gobal'

/**
 * 获取分类
 * @param pageNum - 页码
 * @param pageSize - 条数
 * @param parentId - 父级ID
 */
export const cateGetApi = (pageNum: number, pageSize: number, parentId: string = '') => {
  return request<CatePageResult>({
    method: 'GET',
    url: '/cate/get',
    params: { pageNum, pageSize, parentId }
  })
}

/**
 * 新增分类
 * @param name - 分类名称
 * @param parentId - 上级分类ID
 */
export const cateAddApi = (name: string, parentId: string = '') => {
  return request<addResult>({
    method: 'POST',
    url: '/cate/add',
    data: { name, parentId }
  })
}

/**
 * 更新分类
 * @param cateId - 分类ID
 * @param name - 分类名称
 */
export const cateUpdateApi = (cateId: string, name: string) => {
  return request<updateResult>({
    method: 'POST',
    url: '/cate/update',
    data: { cateId, name }
  })
}

/**
 * 删除分类
 * @param cateId - 分类ID
 */
export const cateDeleteApi = (cateId: string) => {
  return request<delResult>({
    method: 'POST',
    url: '/cate/del',
    data: { cateId }
  })
}

/**
 * 根据层级获取分类
 * @param level - 对应层级
 */
export const cateLevelGetApi = (level: number) => {
  return request<CateItem[]>({
    method: 'GET',
    url: '/cate/level',
    params: { level }
  })
}

/**
 * TOC业务里的分类获取
 * @param pageNum - 页码
 * @param pageSize - 条数
 * @param parentId - 父级ID
 */
export const cateTocGetApi = (pageNum: number, pageSize: number, parentId: string = '') => {
  return request<CatePageResult>({
    method: 'GET',
    url: '/tocCate/get',
    params: { pageNum, pageSize, parentId }
  })
}

/**
 * 新增分类
 * @param name - 分类名称
 * @param parentId - 上级分类ID
 */
export const cateTocAddApi = (name: string, parentId: string = '') => {
  return request<addResult>({
    method: 'POST',
    url: '/tocCate/add',
    data: { name, parentId }
  })
}

/**
 * TOC业务分类更新
 * @param cateId - 分类ID
 * @param name - 分类名称
 */
export const cateTocUpdateApi = (cateId: string, name: string) => {
  return request<updateResult>({
    method: 'POST',
    url: '/tocCate/update',
    data: { cateId, name }
  })
}

/**
 * 删除TOC业务分类
 * @param cateId - 分类ID
 */
export const cateTocDeleteApi = (cateId: string) => {
  return request<delResult>({
    method: 'POST',
    url: '/tocCate/del',
    data: { cateId }
  })
}
