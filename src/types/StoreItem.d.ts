// 门店表类型
export type StoreItem = {
  /** 门店ID */
  _id?: string
  /**  门店短id--用于生成收款码 */
  storeId?: string
  /** 当前门店logo */
  storeLogo: string
  /** 门店名称 */
  storeName: string
  /** 门店地址 */
  address: string
  /** 当前门店收款码 */
  qrCodeUrl: string
  /** 门店店长ID（收款负责人） */
  managerId?: string
  /** 店长姓名*/
  managerName: string
  /** 上级门店ID，可选，用于管理层级关系 */
  parentStoreId?: string
  /** 上上级门店ID */
  parentStoreId2?: string
  /** 创建时间 */
  createdAt?: Date
  /** 更新时间 */
  updatedAt?: Date
  /** 可拓展字段，比如门店电话、营业状态等 */
  phone: string
  /** 门店状态 */
  status?: 'active' | 'inactive'
  /** 店长运营资金（展示用，字段归属类型UserItem） */
  operating_balance: number
  /** 店长待结算余额 （展示用，字段归属类型UserItem）*/
  settle_balance: number
  /** 门店基础库存套餐配置。对应门店基础套餐的ID*/
  inventory_config?: boolean
}

// 带页码类型
export type pagesStoreResult = {
  /** 用户列表 */
  list: StoreItem[]
  /** 总数 */
  total: number
  /** 当前页 */
  num: number
  /** 每页条数 */
  size: number
}

// 门店库存数据类型(数据库存储类型)
export interface StoreInventory {
  /** 唯一标识 */
  _id: string
  /** 产品ID */
  product_id: string
  /** SKU的ID,后台管理查看门店库存时需要 */
  sku_id?: string
  /** 门店ID */
  store_id: string
  /** SKU对应的进货价 */
  cost_price: number
  /** 拆算单位后的数量，当前单位为“片” 1盒 =1 * 5片 */
  unit_count: number
  /** 创建时间 */
  created_at: Date
  /** 更新时间 */
  updated_at: Date
}

// 获取门店库存数据返回的类型(返回给前端展示的数据类型)
export interface StoreInventoryGetResult {
  /** 产品ID */
  product_id: string
  /** 商品名 */
  productName: string
  /** 商品封面图 */
  productCover: string
  /** 货号 */
  productSkuNo: string
  /** 零售价 */
  currentPrice: number
  /** 根据基础单位换算的数量：如单位为片，默认1盒5片，那么 2盒就是 10 片 */
  unit_count: number
}
