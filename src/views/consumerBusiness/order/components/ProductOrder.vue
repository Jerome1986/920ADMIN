<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Edit, Position } from '@element-plus/icons-vue'
import type { JelEditAddressInfo, JelOrderDetail } from '@/types/Components'
import PageContainer from '@/components/PageContainer.vue'
import type { AddressInfo, ProductOrderItem } from '@/types/OrderItem.d.ts'
import type { TabsPaneContext } from 'element-plus'
import { productOrderGetApi, searchProductOrderApi, sendGoodsApi } from '@/api/order.ts'
import { formatOrderState, formatTimestamp } from '@/utils'
import EditAddressInfo from './EditAddressInfo.vue'
import OrderDetail from './orderDetail.vue'
import { ElMessage } from 'element-plus'

// 获取子组件
const dialog = ref<JelEditAddressInfo>()

const orderDetailRef = ref<JelOrderDetail>()
const loading = ref(false)

// 标签
const activeTagName = ref('ALL')
// tag列表
const tagList = ref([
  { id: 'tag1', text: 'ALL', label: '全部' },
  { id: 'tag2', text: 'PAID', label: '待发货' },
  { id: 'tag3', text: 'SHIPPED', label: '已发货' },
  { id: 'tag4', text: 'COMPLETED', label: '已完成' },
  { id: 'tag5', text: 'CANCELLED', label: '已取消' },
  { id: 'tag6', text: 'REFUNDED', label: '已退款' }
])
// tag切换
const handleClickTag = (tag: TabsPaneContext) => {
  console.log(tag.paneName)
  activeTagName.value = tag.paneName as string
  params.value.pageNum = 1
  searchValue.value = ''
  productOrderGet(activeTagName.value, params.value.pageNum, params.value.pageSize)
}

// 搜索
const searchValue = ref('')
const handleSearch = async (isSearch = true) => {
  loading.value = true
  //  用来区分是点击，还是函数调用
  if (isSearch) {
    params.value.pageNum = 1
  }

  const res = await searchProductOrderApi(
    searchValue.value,
    activeTagName.value,
    params.value.pageNum,
    params.value.pageSize
  )

  productOrderList.value = res.data.list
  total.value = res.data.total
  loading.value = false
}

// 清空搜索
const handleClearSearch = () => {
  searchValue.value = ''
  params.value.pageNum = 1
  productOrderGet(activeTagName.value, params.value.pageNum, params.value.pageSize)
}

// 分页
const params = ref({
  pageNum: 1,
  pageSize: 10
})
const total = ref(0)

const handleCurrentChange = (pageNum: number) => {
  params.value.pageNum = pageNum
  if (searchValue.value) {
    handleSearch(false)
  } else {
    productOrderGet(activeTagName.value, params.value.pageNum, params.value.pageSize)
  }
}
const handleSizeChange = (pageSize: number) => {
  params.value.pageNum = 1
  params.value.pageSize = pageSize
  if (searchValue.value) {
    handleSearch(false)
  } else {
    productOrderGet(activeTagName.value, params.value.pageNum, params.value.pageSize)
  }
}

// 获取商品订单
const productOrderList = ref<ProductOrderItem[]>([])
const productOrderGet = async (status: string, pageNum: number, pageSize: number) => {
  loading.value = true
  const res = await productOrderGetApi(status, pageNum, pageSize)
  console.log('请求结果', res)
  productOrderList.value = res.data.list
  total.value = res.data.total
  loading.value = false
}

// 修改地址
const onEditChannel = (addressInfo: AddressInfo, out_trade_no: string) => {
  dialog.value?.open(addressInfo, out_trade_no)
}

// 发货
const currentOrder = ref<ProductOrderItem | null>(null)
const onSendGoods = (row: ProductOrderItem) => {
  console.log('onSendGoods', row)
  currentOrder.value = row
  orderDetailRef.value?.open()
}

// 确认发货
const handleConfirmShipment = async (
  order: ProductOrderItem,
  logistics_type: number,
  tracking_no: string,
  express_company: string
) => {
  console.log('参数', order)

  //  准备一下商品信息参数
  const detail_list = order.products.map((item) => ({
    goods_name: item.name,
    goods_img_url: item.cover
  }))

  //  调用发货接口
  const res = await sendGoodsApi(
    order.transaction_id,
    order.out_trade_no,
    logistics_type,
    tracking_no,
    express_company,
    order.remark || '商品购买',
    order.addressInfo.telNumber,
    order.openid,
    detail_list
  )
  console.log('接口结果', res)
  // 刷新订单请求
  await productOrderGet(activeTagName.value, params.value.pageNum, params.value.pageSize)
  ElMessage.success('发货成功')
  console.log('确认发货订单：', order, logistics_type, tracking_no, express_company)
  // 关闭窗口
  orderDetailRef.value?.close()
  // 成功后初始化物流信息
  orderDetailRef.value?.reset()
}

onMounted(() => productOrderGet(activeTagName.value, params.value.pageNum, params.value.pageSize))
</script>

<template>
  <PageContainer title="商品订单管理">
    <div class="header">
      <!--  TAG  -->
      <el-tabs v-model="activeTagName" class="tabs" @tab-click="handleClickTag">
        <el-tab-pane
          v-for="item in tagList"
          :key="item.id"
          :label="item.label"
          :name="item.text"
        ></el-tab-pane>
      </el-tabs>

      <!--   搜索   -->
      <div class="search">
        <el-input
          v-model="searchValue"
          style="width: 240px; margin-right: 8px"
          placeholder="根据用户电话和业务订单号搜索"
          clearable
          @clear="handleClearSearch"
        />
        <el-button type="danger" @click="handleSearch">查询</el-button>
      </div>
    </div>
    <el-table :data="productOrderList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" align="center" width="60" type="index"></el-table-column>
      <el-table-column
        label="业务订单号"
        align="center"
        prop="out_trade_no"
        show-overflow-tooltip
        :tooltip-options="{ placement: 'top', effect: 'light', popperClass: 'addr-tooltip' }"
      >
      </el-table-column>
      <el-table-column
        label="微信交易订单号"
        align="center"
        prop="transaction_id"
        show-overflow-tooltip
        :tooltip-options="{ placement: 'top', effect: 'light', popperClass: 'addr-tooltip' }"
      >
      </el-table-column>
      <el-table-column label="用户电话" align="center" prop="userInfo.mobile"> </el-table-column>
      <el-table-column label="收货人" align="center">
        <template #default="{ row }">
          {{ row.addressInfo?.userName }}
        </template>
      </el-table-column>
      <el-table-column label="收货电话" align="center">
        <template #default="{ row }">
          {{ row.addressInfo?.telNumber }}
        </template>
      </el-table-column>
      <el-table-column
        label="收货地址"
        align="center"
        show-overflow-tooltip
        :tooltip-options="{ placement: 'top', effect: 'light', popperClass: 'addr-tooltip' }"
      >
        <template #default="{ row }">
          <div>
            {{ row.addressInfo?.cityName }}{{ row.addressInfo?.countyName
            }}{{ row.addressInfo?.detailInfo }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品列表" align="center">
        <template #default="{ row }">
          <p style="color: #d62731; cursor: pointer" @click="onSendGoods(row)">查看详情</p>
        </template>
      </el-table-column>
      <el-table-column label="订单总金额(元)" align="center">
        <template #default="{ row }">
          {{ ((row.amount?.totalPrice ?? 0) / 100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="积分抵扣" align="center">
        <template #default="{ row }">
          {{ ((row.amount?.usedScore ?? 0) / 100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="实际支付金额(元)" align="center">
        <template #default="{ row }">
          {{ ((row.amount?.actualPayment ?? 0) / 100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" prop="status">
        <template #default="{ row }">
          {{ formatOrderState(row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="下单时间" align="center">
        <template #default="{ row }">
          {{ formatTimestamp(row.createdAt, 2) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template #default="{ row }">
          <p
            v-if="row.status !== 'PAID'"
            style="color: #d62731; cursor: pointer"
            @click="onSendGoods(row)"
          >
            查看
          </p>
          <el-tooltip content="修改地址" placement="top">
            <el-button
              v-if="row.status === 'PAID'"
              :icon="Edit"
              circle
              plain
              type="primary"
              @click="onEditChannel(row.addressInfo, row.out_trade_no)"
            ></el-button>
          </el-tooltip>
          <!--     发货     -->
          <el-tooltip content="发货" placement="top">
            <el-button
              v-if="row.status === 'PAID'"
              :icon="Position"
              circle
              plain
              type="danger"
              @click="onSendGoods(row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <!-- 页码 -->
    <div style="margin-top: 20px">
      <el-pagination
        style="margin-top: 20px; justify-content: flex-end"
        v-model:current-page="params.pageNum"
        v-model:page-size="params.pageSize"
        :page-sizes="[1, 10, 30, 50, 100]"
        layout="jumper,total, sizes, prev, pager, next "
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </PageContainer>
  <!-- 弹窗 -->
  <EditAddressInfo ref="dialog"></EditAddressInfo>
  <!-- 订单详情抽屉 -->
  <OrderDetail ref="orderDetailRef" :order-data="currentOrder" @confirm="handleConfirmShipment" />
</template>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  width: 100%;
  color: $jel-font-title;

  .tabs ::v-deep(.el-tabs__item.is-active) {
    color: $jel-brandColor;
  }

  .tabs ::v-deep(.el-tabs__active-bar.is-top) {
    background-color: $jel-brandColor;
  }

  ::v-deep(.el-tabs__item:hover) {
    color: $jel-brandColor;
  }

  .search {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
