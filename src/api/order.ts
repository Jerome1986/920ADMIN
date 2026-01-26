import { request } from '@/utils/request.ts'
import type {
  AddressInfo,
  ProductOrderPageResult,
  VipOrderPageResult
} from '@/types/OrderItem.d.ts'
import type { updateResult } from '@/types/Gobal'
import type { offlineOrderPageResult } from '@/types/offlineOrder'

/**
 * 获取商品订单
 * @param status  - 订单状态，参考订单类型 OrderStatus
 * @param pageNum - 页码
 * @param pageSize - 条数
 */
export const productOrderGetApi = (status: string, pageNum: number, pageSize: number) => {
  return request<ProductOrderPageResult>({
    method: 'GET',
    url: '/order/getProduct',
    params: { status, pageNum, pageSize }
  })
}

/**
 * 根据用户电话和业务订单号搜索订单
 * @param searchVal  - 搜索内容
 * @param status - 订单状态
 * @param pageNum - 页码
 * @param pageSize - 条数
 */
export const searchProductOrderApi = (
  searchVal: string,
  status: string,
  pageNum: number,
  pageSize: number
) => {
  return request<ProductOrderPageResult>({
    method: 'POST',
    url: '/order/search',
    data: { searchVal, status, pageNum, pageSize }
  })
}

/**
 * 根据订单号更新收货信息
 * @param out_trade_no  - 业务订单号
 * @param addressInfo - 收货信息
 */
export const updateProductOrderAddressApi = (out_trade_no: string, addressInfo: AddressInfo) => {
  return request<updateResult>({
    method: 'POST',
    url: '/order/editAddress',
    data: { out_trade_no, addressInfo }
  })
}

// 物流消息接口需要绑定的商品信息的数据类型
interface Detail_list {
  goods_name: string
  goods_img_url: string
}

/**
 * 上传发货物流信息接口
 * @param transaction_id - 微信交易订单号
 * @param out_trade_no - 业务订单号
 * @param logistics_type - 物流模式，发货方式枚举值：1、实体物流配送采用快递公司进行实体物流配送形式 2、同城配送 3、虚拟商品，虚拟商品，例如话费充值，点卡等，无实体配送形式 4、用户自提
 * @param tracking_no - 物流单号，物流快递发货时必填，示例值: 323244567777 字符字节限制: [1, 128]
 * @param express_company - 物流公司编码，快递公司ID
 * @param item_desc - 商品信息，例如：微信红包抱枕*1个，限120个字以内
 * @param receiver_contact - 收件人联系方式为，采用掩码传输，最后4位数字不能打掩码 示例值: `189****1234
 * @param openid -  微信的openid
 * @param detail_list - 商品信息，用于绑定物流消息通知的参数之一
 */
export const sendGoodsApi = (
  transaction_id: string,
  out_trade_no: string,
  logistics_type: number,
  tracking_no: string,
  express_company: string,
  item_desc: string,
  receiver_contact: string,
  openid: string,
  detail_list: Detail_list[]
) => {
  return request({
    method: 'POST',
    url: '/order/sendGoods',
    data: {
      transaction_id,
      out_trade_no,
      logistics_type,
      tracking_no,
      express_company,
      item_desc,
      receiver_contact,
      openid,
      detail_list
    }
  })
}

/**
 * 获取会员订单
 * @param status - 订单状态
 * @param pageNum - 页码
 * @param pageSize - 条数
 */
export const vipOrderGetApi = (status: string, pageNum: number, pageSize: number) => {
  return request<VipOrderPageResult>({
    method: 'GET',
    url: '/order/getVip',
    params: { status, pageNum, pageSize }
  })
}

/**
 * 搜索会员订单
 * @param searchVal  - 搜索内容
 * @param status - 订单状态
 * @param pageNum - 页码
 * @param pageSize - 条数
 */
export const searchVipOrderApi = (
  searchVal: string,
  status: string,
  pageNum: number,
  pageSize: number
) => {
  return request<VipOrderPageResult>({
    method: 'POST',
    url: '/order/searchVipOrder',
    data: { searchVal, status, pageNum, pageSize }
  })
}

/**
 * 将会员订单同步到微信后台订单
 * @param transaction_id
 * @param out_trade_no
 * @param openid
 */
export const sendVipOrderApi = (transaction_id: string, out_trade_no: string, openid: string) => {
  return request({
    method: 'POST',
    url: '/order/sendVip',
    data: { transaction_id, out_trade_no, openid }
  })
}

/**
 * 获取线下门店订单
 * @param status - 订单状态
 * @param pageNum - 页码
 * @param pageSize - 条数
 */
export const OfflineOrderGetApi = (status: string, pageNum: number, pageSize: number) => {
  return request<offlineOrderPageResult>({
    method: 'GET',
    url: '/order/offlineOrder',
    params: { status, pageNum, pageSize }
  })
}
