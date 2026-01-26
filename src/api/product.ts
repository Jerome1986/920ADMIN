import { request } from '@/utils/request.ts'
import type {
  ProductDelResult,
  ProductItem,
  ProductPageResult,
  SkuItem,
  VipProduct
} from '@/types/ProductItem.d.ts'
import type { addResult, delResult, updateResult } from '@/types/Gobal'

/**
 * 获取所有商品
 * @param productType - 商品渠道 区分 进货和产品
 * @param categoryId - 所属分类ID
 * @param pageNum - 页码
 * @param pageSize - 条数
 */
export const productGetApi = (
  productType: 'toB' | 'toC',
  categoryId: string,
  pageNum: number,
  pageSize: number
) => {
  return request<ProductPageResult>({
    method: 'GET',
    url: '/product/get',
    params: { productType, categoryId, pageNum, pageSize }
  })
}

/**
 * 一次性获取所有B端商品
 */
export const productTobAllGetApi = () => {
  return request<ProductItem[]>({
    method: 'GET',
    url: '/product/getAllTob'
  })
}

/**
 * 新增商品
 * @param productType - 区分产品渠道类型
 * @param productName - 产品名称：toB模式下不用传，后端自动生成
 * @param skuNo - 货号
 * @param dec - 商品描述
 * @param models - 适配的手机型号
 * @param categoryId - 所属分类ID
 * @param subCategoryId - 二级分类ID
 * @param thirdCategoryId - 三级分类ID
 * @param originalPrice - 原价
 * @param currentPrice - 当前售价
 * @param cover - 封面图
 * @param proImages - 详情图
 * @param skus - SKU
 * @param hot - 是否推荐
 * @param type
 */
export const productAddApi = (
  productType: 'toB' | 'toC',
  productName: string = '',
  skuNo: string,
  dec: string,
  models: string[],
  categoryId: string,
  subCategoryId: string,
  thirdCategoryId: string,
  originalPrice: number,
  currentPrice: number,
  cover: string,
  proImages: string[],
  skus: SkuItem[],
  hot: 'enable' | 'disable',
  type: 'user' | 'manager' | 'vip' | 'both'
) => {
  return request({
    method: 'POST',
    url: '/product/add',
    data: {
      productType,
      productName,
      skuNo,
      dec,
      models,
      categoryId,
      subCategoryId,
      thirdCategoryId,
      originalPrice,
      currentPrice,
      cover,
      proImages,
      skus,
      hot,
      type
    }
  })
}

/**
 * 更新商品
 * @param productType - 商品渠道
 * @param productId - 商品ID
 * @param skuNo - 货号
 * @param name - 商品名称
 * @param dec - 商品描述
 * @param models - 适配的手机型号
 * @param categoryId - 所属分类ID
 * @param subCategoryId
 * @param thirdCategoryId
 * @param originalPrice - 原价
 * @param currentPrice - 当前售价
 * @param cover - 封面图
 * @param proImages - 详情图
 * @param skus - SKU
 * @param hot - 是否推荐
 * @param type
 */
export const productUpdateApi = (
  productType: 'toB' | 'toC',
  productId: string,
  skuNo: string,
  name: string,
  dec: string,
  models: string[],
  categoryId: string,
  subCategoryId: string,
  thirdCategoryId: string,
  originalPrice: number,
  currentPrice: number,
  cover: string,
  proImages: string[],
  skus: SkuItem[],
  hot: 'enable' | 'disable',
  type: 'user' | 'manager' | 'vip' | 'both'
) => {
  return request({
    method: 'POST',
    url: '/product/update',
    data: {
      productType,
      productId,
      skuNo,
      name,
      dec,
      models,
      categoryId,
      subCategoryId,
      thirdCategoryId,
      originalPrice,
      currentPrice,
      cover,
      proImages,
      skus,
      hot,
      type
    }
  })
}

/**
 * 删除指定商品
 * @param productType - 对应商品渠道类型
 * @param goodsId - 商品ID
 */
export const productDeleteApi = (productType: 'toB' | 'toC', goodsId: string) => {
  return request<ProductDelResult>({
    method: 'POST',
    url: '/product/del',
    data: { productType, goodsId }
  })
}

/**
 * 模糊搜索商品--根据商品名/货号搜索
 * @param productType - 产品渠道类型
 * @param categoryId - 搜索分类ID
 * @param searchVal - 搜索内容
 * @param pageNum - 页码
 * @param pageSize - 条数
 */
export const searchProductApi = (
  productType: 'toB' | 'toC',
  categoryId: string,
  searchVal: string,
  pageNum: number,
  pageSize: number
) => {
  return request<ProductPageResult>({
    method: 'POST',
    url: '/product/search',
    data: { productType, categoryId, searchVal, pageNum, pageSize }
  })
}

/**
 * 新增会员产品
 * @param levelText - 会员等级文本说明
 * @param price - 产品价格
 * @param discount - 产品对应折扣
 * @param cashbackRate - 消费返积分的比例
 * @param term - 产品会员有效期
 * @param rights - 会员权益说明
 * @param maxUsers - 共享人数
 * @param limit - 每月限制次数
 * @param status - 产品状态（enable启用 disable禁用）
 */
export const vipProductListAddApi = (
  levelText: string,
  price: number,
  discount: number,
  cashbackRate: number,
  term: string,
  rights: string,
  maxUsers: number,
  limit: number,
  status: 'enable' | 'disable'
) => {
  return request<addResult>({
    method: 'POST',
    url: '/vipProduct/add',
    data: { levelText, price, discount, cashbackRate, term, rights, maxUsers, limit, status }
  })
}

/**
 * 获取会员产品列表
 */
export const vipProductGetApi = () => {
  return request<VipProduct[]>({
    method: 'GET',
    url: '/vipProduct/get'
  })
}

/**
 * 更新会员产品
 * @param vipProductId - 产品ID
 * @param levelText - 会员等级文本说明
 * @param price - 产品价格
 * @param discount - 产品对应折扣
 * @param cashbackRate - 消费返积分的比例
 * @param term - 产品会员有效期
 * @param rights - 会员权益说明
 * @param maxUsers - 共享人数
 * @param limit - 每月限制次数
 * @param status - 产品状态（enable启用 disable禁用）
 */
export const vipProductUpdateApi = (
  vipProductId: string,
  levelText: string,
  price: number,
  discount: number,
  cashbackRate: number,
  term: string,
  rights: string,
  maxUsers: number,
  limit: number,
  status: 'enable' | 'disable'
) => {
  return request<updateResult>({
    method: 'POST',
    url: '/vipProduct/update',
    data: {
      vipProductId,
      levelText,
      price,
      discount,
      cashbackRate,
      term,
      rights,
      maxUsers,
      limit,
      status
    }
  })
}

/**
 * 删除指定会员产品
 * @param vipProductId - 会员产品ID
 */
export const vipProductDeleteApi = (vipProductId: string) => {
  return request<delResult>({
    method: 'POST',
    url: '/vipProduct/del',
    data: { vipProductId }
  })
}
