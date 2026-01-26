// 库存套餐配置数据类型说明
export interface InventoryPackage {
  /** 套餐唯一ID，用于标识一个基础库存套餐 */
  _id?: string
  /** 套餐名称，例如：新手店长基础库存包 */
  name: string
  /** 套餐说明，用于描述该套餐的适用场景或补充说明 */
  desc: string
  /** 套餐状态：ENABLE 启用，DISABLE 停用 */
  status: 'ENABLE' | 'DISABLE'
  /** 套餐包含的商品初始化配置列表 */
  items: InventoryProduct[]
  /** 套餐创建时间 */
  createdAt: Date
  /** 套餐最后更新时间 */
  updatedAt: Date
}

export interface InventoryProduct {
  /** 商品ID，关联已有商品，用于初始化门店库存 */
  product_id: string
  /** 初始化库存数量，仅在新门店创建时写入一次 */
  quantity: number
  /** SKU ID */
  sku_id?: string
  /** 对应单位的数量，等于quantity*基础单位 如 1盒 5片 */
  unit_count?: number
}

// 表单数据
export type PackageForm = Omit<InventoryPackage, 'createdAt' | 'updatedAt'>

// 设置门店套装状态返回类型
export interface InventoryPackageStatus {
  status: 'ENABLE' | 'DISABLED'
}

// 商品SKU信息接口
export interface SkuInfo {
  _id: string
  price: number
  attrs: {
    label: string
    value: string
  }
  [key: string]: unknown
}

// 套餐商品详情接口
export interface PackageProductDetail {
  product_id: string
  sku_id?: string
  quantity: number
  remark?: string
  name: string
  skuNo: string
  cover: string
  currentPrice: number
  skus: SkuInfo // 注意：后端返回的是单个 SKU 对象，不是数组
  [key: string]: unknown
}

// 套餐详情数据接口
export interface PackageDetailData {
  name: string
  desc: string
  status: 'ENABLE' | 'DISABLE'
  items: PackageProductDetail[]
}
