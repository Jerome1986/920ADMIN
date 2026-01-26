// 商品类型
export type ProductItem = {
  /** 商品ID（MongoDB 自动生成的唯一标识） */
  _id?: string
  /** 所属分类ID */
  categoryId: string
  /** 对应二级分类ID */
  subCategoryId?: string
  /** 对应三级分类ID */
  thirdCategoryId?: string
  /** 商品货号 */
  skuNo: string
  /** 商品名称 */
  name: string
  /** 商品描述（简要说明） */
  dec: string
  /** 商品原价（未打折前价格，单位：元） */
  originalPrice: number
  /** 当前售价（促销/实际出售价格，单位：元） */
  currentPrice: number
  /** 商品最低价（聚合 SKU 后计算） */
  minPrice?: number
  /** 商品最高价（聚合 SKU 后计算） */
  maxPrice?: number
  /** 商品封面图 URL */
  cover: string
  /** 商品详情图片 URL 数组 */
  proImages: string[]
  /** 支持的型号 ["iPhone16Pro", "iPhone17"] */
  models: string[]
  /** SKU 列表
   *  每个 SKU 代表商品的一个可售变体（如颜色、尺寸等）
   *  例如：
   *  [
   *    { price: 99, stock: 40, attrs: { 颜色: "红色", 尺寸: "M" } },
   *    { price: 99, stock: 35, attrs: { 颜色: "黑色", 尺寸: "L" } }
   *  ]
   */
  skus?: SkuItem[]
  /** 浏览量（用于排序和热度统计） */
  lookNum: number
  /** 商品状态
   *  'active'   表示上架中
   *  'inactive' 表示下架或暂不展示
   */
  status?: 'active' | 'inactive'
  /** 是否设置为热门推荐 */
  hot?: 'enable' | 'disable'
  /** 商品类型--设置某些角色可见，区分店长产品和用户产品 */
  type?: 'user' | 'manager' | 'vip' | 'both'
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updatedAt: Date
}

export interface ProductPageResult {
  list: ProductItem[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}

export interface SkuItem {
  /** SKU 唯一ID（MongoDB 自动生成） */
  _id?: string
  /** 商品ID */
  goodsId?: string
  /** SKU 编码（Stock Keeping Unit Code）
   *  用于标识唯一库存单位，比如 "TSHIRT-RED-M"
   *  通常由商品ID + 属性值组合生成，例如：商品代号 + 颜色 + 尺寸
   *  用于系统内部快速定位库存、同步第三方平台、出入库操作等
   */
  skuCode?: string
  /** 售价（该SKU的实际销售价格，单位：元） */
  price: number
  /** 库存数量（该SKU当前可售数量） */
  stock?: number
  /** SKU 图片（例如对应颜色的展示图） */
  image?: string
  /** SKU属性映射，例如 { 颜色: "红色", 尺寸: "M" }
   *  注意：attrs 用于区分不同SKU的属性组合
   *  默认值建议设为 `{}` （空对象），
   *  而不是空字符串 `''`，否则会在读取属性时触发类型错误。
   */
  attrs: Record<string, string>
  /** 总库存 */
  totalStock?: number
  /** 库存规格（如：片，个） */
  unit_count: number
}

/** 商品表单模型，用于新增或编辑商品 */
export interface ProductFormModel {
  /** 商品唯一ID（MongoDB自动生成） */
  _id?: string
  /** 商品货号 */
  skuNo: string
  /** 商品名称（例如：“夏季男士T恤”） */
  name: string
  /** 商品描述（简短的营销说明或卖点文案） */
  dec: string
  /** 支持的型号 ["iPhone16Pro", "iPhone17"] */
  models: string[]
  /** 分类ID（关联 CateList 表 _id，用于前台筛选或后台分组） */
  categoryId?: string
  /** 对应二级分类ID */
  subCategoryId?: string
  /** 对应三级分类ID */
  thirdCategoryId?: string
  /** 商品状态
   *  'active'   表示上架中
   *  'inactive' 表示下架或暂不展示
   */
  status: 'active' | 'inactive'
  /** 原价（未打折前价格，单位：元） */
  originalPrice: number
  /** 当前售价（促销/实际销售价，单位：元） */
  currentPrice: number
  /** 商品主图（封面图片 URL，展示在商品列表） */
  cover: string
  /** 商品详情图（用于商品详情页轮播展示） */
  proImages: string[]
  /** SKU 列表
   *  每个 SKU 代表商品的一个可售变体（如颜色、尺寸等）
   *  例如：
   *  [
   *    { price: 99, stock: 40, attrs: { 颜色: "红色", 尺寸: "M" } },
   *    { price: 99, stock: 35, attrs: { 颜色: "黑色", 尺寸: "L" } }
   *  ]
   */
  skus: SkuItem[]
  /** 是否设置为热门推荐 */
  hot?: 'enable' | 'disable'
  /** 商品类型--设置某些角色可见，区分店长产品和用户产品 */
  type?: 'user' | 'manager' | 'vip' | 'both'
}

// 商品删除结果类型
export interface ProductDelResult {
  /** 商品删除条数 */
  goods: number
  /** 商品对应的SKU的删除条数 */
  skus: number
}

/**
 * 会员产品类型声明
 */
export interface VipProduct {
  /** 唯一标识 */
  _id: string
  /** 会员等级（数值越大等级越高） */
  level?: number
  /** 等级名称（如“黄金会员”、“至尊会员”） */
  levelText: string
  /** 售价（单位：元） */
  price: number
  /** 折扣（单位：折，取值范围 0~10，10 表示无折扣） */
  discount: number
  /** 现金返还积分比例，用小数点表示，如：0.05为5% */
  cashbackRate: number
  /** 有效期（如“180天”、“365天”、“永久”） */
  term: string
  /** 权益说明（如“免费贴膜1次/月”） */
  rights: string
  /** 状态（enable=启用，disable=停用） */
  status: 'enable' | 'disable'
  /** 创建时间 */
  createdAt?: Date
  /** 更新时间（ISO字符串或Date类型） */
  updatedAt?: string | Date
  /** 可共享使用人数上限 */
  maxUsers: number
  /** 每月限制次数 */
  limit: number
}
