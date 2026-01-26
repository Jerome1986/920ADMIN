import { request } from '@/utils/request.ts'
import type {
  InventoryPackage,
  InventoryPackageStatus,
  InventoryProduct,
  PackageProductDetail
} from '@/types/InventoryPackage'
import type { addResult, delResult } from '@/types/Gobal'

/**
 * 新增店长初始套餐
 * @param name - 套餐名称
 * @param desc - 套餐备注
 * @param status - 是否启用
 * @param items - 套餐包含的商品
 */
export const inventoryPackageAddApi = (
  name: string,
  desc: string,
  status: string,
  items: InventoryProduct[]
) => {
  return request<addResult>({
    method: 'POST',
    url: '/inventoryPackage/add',
    data: { name, desc, status, items }
  })
}

/**
 * 获取门店基础套餐配置
 */
export const inventoryPackageGetApi = () => {
  return request<InventoryPackage[]>({
    method: 'GET',
    url: '/inventoryPackage/get'
  })
}

/**
 * 更新当前门店套餐
 * @param inventoryId - 套餐ID
 * @param name - 套餐名称
 * @param desc - 套餐说明
 * @param status - 激活状态
 * @param items - 包含的商品
 */
export const inventoryPackageUpdateApi = (
  inventoryId: string,
  name: string,
  desc: string,
  status: string,
  items: InventoryProduct[]
) => {
  return request({
    method: 'POST',
    url: '/inventoryPackage/update',
    data: { inventoryId, name, desc, status, items }
  })
}

/**
 * 删除当前门店套餐
 * @param inventoryId - 套餐ID
 */
export const inventoryPackageDeleteApi = (inventoryId: string) => {
  return request<delResult>({
    method: 'POST',
    url: '/inventoryPackage/del',
    data: { inventoryId }
  })
}

/**
 * 设置当前套餐的激活状态
 * @param inventoryId - 当前套餐ID
 * @param status - 激活状态
 */
export const inventoryPackageStatusApi = (inventoryId: string, status: string) => {
  return request<InventoryPackageStatus>({
    method: 'POST',
    url: '/inventoryPackage/status',
    data: { inventoryId, status }
  })
}

/**
 * 查看套餐里的商品列表详情
 * @param inventoryProduct - 套餐的商品列表参数
 */
export const inventoryPackageProductDetailApi = (inventoryProduct: InventoryProduct[]) => {
  return request<PackageProductDetail[]>({
    method: 'POST',
    url: '/inventoryPackage/productData',
    data: { inventoryProduct }
  })
}
