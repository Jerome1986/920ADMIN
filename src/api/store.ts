import { request } from '@/utils/request.ts'
import type { addResult, updateResult } from '@/types/Gobal'
import type { pagesStoreResult, StoreInventoryGetResult } from '@/types/StoreItem'

/**
 * 获取门店列表
 * /store/get
 * @param pageNum - 页码
 * @param pageSize - 条数
 */
export const storeGetApi = (pageNum: number, pageSize: number) => {
  return request<pagesStoreResult>({
    method: 'GET',
    url: '/store/get',
    params: { pageNum, pageSize }
  })
}

/**
 * 新增门店
 * /store/add
 * @param storeName - 门店名
 * @param address - 门店地址
 * @param managerName - 店长名字
 * @param phone - 门店电话
 * @param operating_balance - 门店运营资金
 * @param inventory_config - 新门店库存配置，存储套餐ID
 * @param status - 门店营业状态
 */
export const storeAddApi = (
  storeName: string,
  address: string,
  managerName: string,
  phone: string,
  operating_balance: number,
  inventory_config: boolean,
  status: 'active' | 'inactive'
) => {
  return request<addResult>({
    method: 'POST',
    url: '/store/add',
    data: { storeName, address, managerName, phone, operating_balance, inventory_config, status }
  })
}

/**
 * 根据门店ID更新门店信息
 * /store/update
 * @param storeId - 门店ID
 * @param managerId - 店长ID
 * @param storeName - 门店名
 * @param address - 门店地址
 * @param managerName - 店长名
 * @param phone - 门店电话
 * @param operating_balance - 门店运营资金
 * @param status - 门店状态
 */
export const storeUpdateApi = (
  storeId: string,
  managerId: string,
  storeName: string,
  address: string,
  managerName: string,
  phone: string,
  operating_balance: number,
  status: 'active' | 'inactive'
) => {
  return request<updateResult>({
    method: 'POST',
    url: '/store/update',
    data: {
      storeId,
      managerId,
      storeName,
      address,
      managerName,
      phone,
      operating_balance,
      status
    }
  })
}

/**
 * 删除门店
 * @param storeId - 门店ID
 * @param managerId - 店长ID
 */
export const storeDeleteApi = (storeId: string, managerId: string) => {
  return request({
    method: 'POST',
    url: '/store/del',
    data: { storeId, managerId }
  })
}

/**
 * 根据门店ID和电话来搜索门店 模糊搜索
 * /store/search
 * @param searchVal - 搜索内容
 * @param pageNum - 页码
 * @param pageSize - 条数
 */
export const storeSearchApi = (searchVal: string, pageNum: number, pageSize: number) => {
  return request<pagesStoreResult>({
    method: 'POST',
    url: '/store/search',
    data: { searchVal, pageNum, pageSize }
  })
}

/**
 * 根据门店ID获取门店库存
 * @param storeId - 门店ID
 */
export const storeGetInventoryApi = (storeId: string) => {
  return request<StoreInventoryGetResult[]>({
    method: 'GET',
    url: '/store/getInventory',
    params: { storeId }
  })
}
