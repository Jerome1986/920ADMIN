<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Position } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import PurchaseOrderDetail from './components/PurchaseOrderDetail.vue'
import { ElMessage, ElMessageBox, type TabsPaneContext } from 'element-plus'
import { formatAmount, formatOrderState } from '@/utils'
import type { PurchaseItem } from '@/types/PurchaseOrder'
import {
  purchaseOrderGetApi,
  purchaseOrderPickUpApi,
  purchaseOrderSearchApi
} from '@/api/purchaseOrder.ts'
import type { JelPurchaseOrderDetail } from '@/types/Components'

// 获取子组件
const dialog = ref<JelPurchaseOrderDetail>()

const loading = ref(false)

// 标签
const activeTagName = ref('ALL')
// tag列表
const tagList = ref([
  { id: 'tag1', text: 'ALL', label: '全部' },
  { id: 'tag2', text: 'PAID', label: '待取货' },
  { id: 'tag3', text: 'COMPLETED', label: '已完成' },
  { id: 'tag4', text: 'CANCELLED', label: '已取消' }
])
// tag切换
const handleClickTag = (tag: TabsPaneContext) => {
  console.log(tag.paneName)
  activeTagName.value = tag.paneName as string
  params.value.pageNum = 1
  searchValue.value = ''
  //  获取进货单接口
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

  //  搜索进货单接口
  const res = await purchaseOrderSearchApi(
    searchValue.value,
    activeTagName.value,
    params.value.pageNum,
    params.value.pageSize
  )
  purchasedOrderList.value = res.data.list
  total.value = res.data.total
  loading.value = false
}

// 清空搜索
const handleClearSearch = () => {
  searchValue.value = ''
  params.value.pageNum = 1
  //  获取进货单接口
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
    //  获取进货单接口
    productOrderGet(activeTagName.value, params.value.pageNum, params.value.pageSize)
  }
}
const handleSizeChange = (pageSize: number) => {
  params.value.pageNum = 1
  params.value.pageSize = pageSize
  if (searchValue.value) {
    handleSearch(false)
  } else {
    //  获取进货单接口
    productOrderGet(activeTagName.value, params.value.pageNum, params.value.pageSize)
  }
}

// 获取进货单
const purchasedOrderList = ref<PurchaseItem[]>([])
const productOrderGet = async (status: string, pageNum: number, pageSize: number) => {
  loading.value = true
  //  获取进货单接口
  console.log(status, pageNum, pageSize)
  const res = await purchaseOrderGetApi(status, pageNum, pageSize)
  purchasedOrderList.value = res.data.list
  total.value = res.data.total
  loading.value = false
}

//  确认取货/查看详情--打开抽屉组件
const currentOrder = ref<PurchaseItem | null>(null)
const onSendGoods = (row: PurchaseItem) => {
  console.log(row)
  currentOrder.value = row
  dialog.value?.open(currentOrder.value)
}

// 处理点击取货
const handlePickUp = async (order: PurchaseItem) => {
  console.log('onSendGoods', order)
  await ElMessageBox.confirm('确定出货吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'el-button--danger' // Element 内置类
  })
    .then(async () => {
      const res = await purchaseOrderPickUpApi(
        order.out_trade_no,
        order.userInfo.userId,
        order.products,
        order.amount.actualPayment
      )
      console.log(res)
      if (res.code === 200) {
        ElMessage.success('取货成功')
        dialog.value?.close()
        await productOrderGet(activeTagName.value, params.value.pageNum, params.value.pageSize)
      }
    })
    .catch((err) => {
      if (err === 'cancel') ElMessage.warning('已取消')
      // catch error
      console.error('异常错误', err)
    })
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
    <el-table :data="purchasedOrderList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" align="center" width="60" type="index"></el-table-column>
      <el-table-column
        label="业务订单号"
        align="center"
        prop="out_trade_no"
        show-overflow-tooltip
        :tooltip-options="{ placement: 'top', effect: 'light', popperClass: 'addr-tooltip' }"
      >
      </el-table-column>

      <el-table-column label="用户电话" align="center" prop="userInfo.mobile"> </el-table-column>

      <el-table-column label="商品列表" align="center">
        <template #default="{ row }">
          <p style="color: #d62731; cursor: pointer" @click="onSendGoods(row)">查看详情</p>
        </template>
      </el-table-column>
      <el-table-column label="订单总金额(元)" align="center">
        <template #default="{ row }">
          {{ formatAmount(row.amount?.totalPrice) }}
        </template>
      </el-table-column>
      <el-table-column label="积分抵扣" align="center">
        <template #default="{ row }">
          {{ formatAmount(row.amount?.usedScore) }}
        </template>
      </el-table-column>
      <el-table-column label="实际支付金额(元)" align="center">
        <template #default="{ row }">
          {{ formatAmount(row.amount?.actualPayment) }}
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" prop="status">
        <template #default="{ row }">
          {{ formatOrderState(row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template #default="{ row }">
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
  <!-- 订单详情抽屉 -->
  <PurchaseOrderDetail
    ref="dialog"
    :order-data="currentOrder"
    @confirm="handlePickUp"
  ></PurchaseOrderDetail>
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
