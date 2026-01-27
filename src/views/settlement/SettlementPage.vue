<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { formatAmount, formatSettlementOrderState, formatTimestamp } from '@/utils'
import PageContainer from '@/components/PageContainer.vue'
import SettlementDraw from './SettlementDraw.vue'
import {
  settlementInfoGetApi,
  settlementManagerSearchApi,
  settlementUpdateApi
} from '@/api/settlement'
import type { SettlementItem, SettlementStatus } from '@/types/Settlement'
import { ElMessage } from 'element-plus'

// 加载
const loading = ref(true)

// 抽屉状态
const drawerVisible = ref(false)
const currentUser = ref<SettlementItem | null>(null)

// 分页
const params = ref({
  pageNum: 1,
  pageSize: 10
})

const total = ref(0)

// 条数改变
const handleSizeChange = (size: number) => {
  console.log(size)
  params.value.pageNum = 1
  // 如果搜索有值就请求搜索结果，反之直接渲染
  if (searchValue.value) {
    searchMaterialGet()
  } else {
    settlementListGet(params.value.pageNum, params.value.pageSize)
  }
}

// 页数改变
const handleCurrentChange = (pageNum: number) => {
  console.log(pageNum)
  if (searchValue.value) {
    searchMaterialGet()
  } else {
    settlementListGet(params.value.pageNum, params.value.pageSize)
  }
}

// 搜索
const searchValue = ref('')
const searchMaterialGet = async () => {
  loading.value = true
  //  搜索接口
  const res = await settlementManagerSearchApi(
    searchValue.value,
    params.value.pageNum,
    params.value.pageSize
  )
  settlementList.value = res.data.list
  total.value = res.data.total
  loading.value = false
}

// 清除搜索
const handleClearSearch = () => {
  params.value.pageNum = 1
  settlementListGet(params.value.pageNum, params.value.pageSize)
}

// 店长数据
const settlementList = ref<SettlementItem[]>([])
const settlementListGet = async (pageNum: number, pageSize: number) => {
  loading.value = true
  const res = await settlementInfoGetApi(pageNum, pageSize)
  console.log(res.data)
  settlementList.value = res.data.list
  total.value = res.data.total
  loading.value = false
}

// 结算
const handleSettlement = (row: SettlementItem) => {
  console.log('行内', row)
  currentUser.value = row
  drawerVisible.value = true
}

// 关闭抽屉
const handleCloseDrawer = () => {
  drawerVisible.value = false
  currentUser.value = null
}

// 确认结算
const handleConfirmSettlement = async (data: {
  out_trade_no: string
  mobile: string
  userId: string
  amount: number
  remark: string
  receiptFiles: string
  settlementStatus: SettlementStatus
}) => {
  //  调用结算API
  console.log('结算信息:', data)
  const res = await settlementUpdateApi(
    data.out_trade_no,
    data.userId,
    data.mobile,
    Number(data.amount.toFixed(2)),
    data.remark,
    data.receiptFiles,
    data.settlementStatus
  )

  console.log('结算结果', res)
  if (res.code === 200) {
    ElMessage.success('结算成功')
    await settlementListGet(params.value.pageNum, params.value.pageSize)
  }

  // 关闭抽屉
  handleCloseDrawer()
}

onMounted(() => settlementListGet(params.value.pageNum, params.value.pageSize))
</script>

<template>
  <!-- 非会员用户 -->
  <PageContainer title="用户列表">
    <div class="header">
      <!--   搜索   -->
      <div class="search">
        <el-input
          v-model="searchValue"
          style="width: 240px; margin-right: 8px"
          placeholder="根据手机号搜索"
          clearable
          @clear="handleClearSearch"
        />
        <el-button type="danger" @click="searchMaterialGet">查询</el-button>
      </div>
    </div>
    <el-table :data="settlementList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" align="center" width="60" type="index"></el-table-column>
      <el-table-column label="手机号" align="center" prop="mobile"></el-table-column>
      <el-table-column label="订单说明" align="center" prop="remark">
        <template #default="{ row }">
          {{ row.remark || '无' }}
        </template>
      </el-table-column>
      <el-table-column label="结算凭证" align="center">
        <template #default="{ row }">
          <el-image
            v-if="row.receiptFiles"
            style="width: 100px; height: 100px"
            :src="row.receiptFiles"
            :preview-src-list="[row.receiptFiles]"
            fit="cover"
            :preview-teleported="true"
            hide-on-click-modal
          />
          <span v-else>未上传</span>
        </template>
      </el-table-column>

      <el-table-column label="账单金额" align="center" prop="amount">
        <template #default="{ row }">
          {{ formatAmount(row.should_settlement_amount) }}
        </template>
      </el-table-column>
      <el-table-column label="结算金额" align="center" prop="amount">
        <template #default="{ row }">
          {{ formatAmount(row.actual_settlement_amount) }}
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center">
        <template #default="{ row }">
          {{ formatSettlementOrderState(row.settlementStatus) }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="registerTime" width="160">
        <template #default="{ row }">
          {{ formatTimestamp(row.createdAt, 2) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template #default="{ row }">
          <p
            v-if="row.settlementStatus === 'PENDING'"
            style="color: #d62731; cursor: pointer"
            @click="handleSettlement(row)"
          >
            结算
          </p>
          <p v-if="row.settlementStatus === 'COMPLETED'" style="color: #aaaaaa">已结算</p>
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

  <!-- 结算抽屉组件 -->
  <SettlementDraw
    v-model="drawerVisible"
    :user-data="currentUser"
    @confirm="handleConfirmSettlement"
  />
</template>

<style scoped lang="scss">
.page-container {
  .header {
    display: flex;
    justify-content: flex-end;
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

    .search {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
}
</style>
