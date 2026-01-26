import type { addResult, updateResult } from '@/types/Gobal'
import { request } from '@/utils/request.ts'
import type { BannerItem } from '@/types/BannerItem.d.ts'

/**
 * 新增轮播图
 * @param url - 图片链接
 */
export const bannerListAddApi = (url: string) => {
  return request<addResult>({
    method: 'POST',
    url: '/banner/add',
    data: { url }
  })
}

/**
 * 获取轮播图列表
 */
export const bannerListGetApi = () => {
  return request<BannerItem[]>({
    method: 'GET',
    url: '/banner/get'
  })
}

/**
 * 更新banner
 * @param bannerId - 当前轮播图ID
 * @param url - 图片链接
 */
export const bannerListUpdateApi = (bannerId: string, url: string) => {
  return request<updateResult>({
    method: 'POST',
    url: '/banner/update',
    data: { bannerId, url }
  })
}

/**
 * 删除指定banner
 * @param bannerId - 轮播图ID
 */
export const bannerListDeleteApi = (bannerId: string) => {
  return request({
    method: 'POST',
    url: '/banner/del',
    data: { bannerId }
  })
}
