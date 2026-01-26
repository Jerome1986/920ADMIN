import StoreChannel from '@/views/manager/components/StoreChannel.vue'
import CateChannel from '@/views/business/category/CateChannel.vue'
import ConsumerCateChannel from '@/views/consumerBusiness/category/ConsumerCateChannel.vue'
import SubCateChannel from '@/views/business/category/SubCateChannel.vue'
import ConsumerSubCateChannel from '@/views/consumerBusiness/category/ConsumerSubCateChannel.vue'
import ProductChannel from '@/views/business/product/components/ProductChannel.vue'
import TocProductChannel from '@/views/consumerBusiness/tocProduct/components/TocProductChannel.vue'
import BannerChannel from '@/views/operation/banner/components/BannerChannel.vue'
import TeamChannel from '@/views/operation/team/components/TeamChannel.vue'
import GuessChannel from '@/views/operation/guess/components/GuessChannel.vue'
import RateChannel from '@/views/rate/components/RateChannel.vue'
import EditAddressInfo from '@/views/consumerBusiness/order/components/EditAddressInfo.vue'
import OrderDetail from '@/views/consumerBusiness/order/components/orderDetail.vue'
import PurchaseOrderDetail from '@/views/business/managerOrder/components/PurchaseOrderDetail.vue'

declare module 'vue' {
  export interface GlobalComponents {
    StoreChannel: typeof StoreChannel
    CateChannel: typeof CateChannel
    ConsumerCateChannel: typeof ConsumerCateChannel
    ConsumerSubCateChannel: typeof ConsumerSubCateChannel
    SubCateChannel: typeof SubCateChannel
    ProductChannel: typeof ProductChannel
    TocProductChannel: typeof TocProductChannel
    BannerChannel: typeof BannerChannel
    TeamChannel: typeof TeamChannel
    GuessChannel: typeof GuessChannel
    RateChannel: typeof RateChannel
    EditAddressInfo: typeof EditAddressInfo
    OrderDetail: typeof OrderDetail
    PurchaseOrderDetail: typeof PurchaseOrderDetail
  }
}

export type JelStoreChannel = InstanceType<typeof StoreChannel>
export type JelCateChannel = InstanceType<typeof CateChannel>
export type JelConsumerCateChannel = InstanceType<typeof ConsumerCateChannel>
export type JelConsumerSubCateChannel = InstanceType<typeof ConsumerSubCateChannel>
export type JelSubCateChannel = InstanceType<typeof SubCateChannel>
export type JelProductChannel = InstanceType<typeof ProductChannel>
export type JelTocProductChannel = InstanceType<typeof TocProductChannel>
export type JelBannerChannel = InstanceType<typeof BannerChannel>
export type JelTeamChannel = InstanceType<typeof TeamChannel>
export type JelGuessChannel = InstanceType<typeof GuessChannel>
export type JelRateChannel = InstanceType<typeof RateChannel>
export type JelEditAddressInfo = InstanceType<typeof EditAddressInfo>
export type JelOrderDetail = InstanceType<typeof OrderDetail>
export type JelPurchaseOrderDetail = InstanceType<typeof PurchaseOrderDetail>
