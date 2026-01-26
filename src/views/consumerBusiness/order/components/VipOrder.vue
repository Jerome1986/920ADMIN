<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Position } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import { searchVipOrderApi, sendVipOrderApi, vipOrderGetApi } from '@/api/order.ts'
import type { VipOrderItem } from '@/types/OrderItem.d.ts'
import { formatTimestamp, formatVipOrderState } from '@/utils'
import { ElMessage, ElMessageBox, type TabsPaneContext } from 'element-plus'

// 分页
const params = ref({
  pageNum: 1,
  pageSize: 10
})

const total = ref(0)
const loading = ref(false)

const handleSizeChange = async (size: number) => {
  params.value.pageSize = size
  // 重置到第 1 页，避免当前页超出最大页数后数据为空
  params.value.pageNum = 1
  if (searchValue.value) {
    await handleSearch(false)
  } else {
    await vipOrderListGet(activeTagName.value, params.value.pageNum, params.value.pageSize)
  }
}

const handleCurrentChange = async (num: number) => {
  params.value.pageNum = num
  // 重新获取数据
  if (searchValue.value) {
    await handleSearch(false)
  } else {
    await vipOrderListGet(activeTagName.value, params.value.pageNum, params.value.pageSize)
  }
}

// tag列表
const tagList = ref([
  { id: 'tag1', text: 'ALL', label: '全部' },
  { id: 'tag2', text: 'PAID', label: '待同步' },
  { id: 'tag3', text: 'SHIPPED', label: '已同步' },
  { id: 'tag4', text: 'COMPLETED', label: '已完成' },
  { id: 'tag5', text: 'CANCELLED', label: '已取消' },
  { id: 'tag6', text: 'REFUNDING', label: '已退款' }
])
const activeTagName = ref('ALL')
const handleClickTag = (tagName: TabsPaneContext) => {
  console.log('订单状态', tagName.paneName)
  searchValue.value = ''
  params.value.pageNum = 1
  activeTagName.value = tagName.paneName as string
  vipOrderListGet(activeTagName.value, params.value.pageNum, params.value.pageSize)
}

// 搜索
const searchValue = ref('')
const handleSearch = async (isSearch = true) => {
  console.log('搜索')
  loading.value = true
  //  用来区分是点击，还是函数调用
  if (isSearch) {
    params.value.pageNum = 1
  }

  const res = await searchVipOrderApi(
    searchValue.value,
    activeTagName.value,
    params.value.pageNum,
    params.value.pageSize
  )
  vipOrderList.value = res.data.list
  total.value = res.data.total
  loading.value = false
}
const handleClearSearch = () => {
  params.value.pageNum = 1
  searchValue.value = ''
  vipOrderListGet(activeTagName.value, params.value.pageNum, params.value.pageSize)
}

// 会员订单
const vipOrderList = ref<VipOrderItem[]>([])
const vipOrderListGet = async (tag: string, pageNum: number, pageSize: number) => {
  const res = await vipOrderGetApi(tag, pageNum, pageSize)
  console.log('会员订单', res.data)
  vipOrderList.value = res.data.list
  total.value = res.data.total
}

// 将订单同步到微信
const onSend = async (row: VipOrderItem) => {
  console.log('onSend', row)
  ElMessageBox.confirm('点击确定同步到微信后台', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'el-button--danger' // Element 内置类
  })
    .then(async () => {
      const res = await sendVipOrderApi(row.transaction_id, row.out_trade_no, row.openid)
      if (res.code === 200) {
        ElMessage.success('同步成功')
        await vipOrderListGet(activeTagName.value, params.value.pageNum, params.value.pageSize)
      }
    })
    .catch((err) => {
      // catch error
      console.error('异常错误', err)
    })
}

// 处理子组件操作成功

onMounted(() => vipOrderListGet(activeTagName.value, params.value.pageNum, params.value.pageSize))
</script>

<template>
  <PageContainer title="会员订单">
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
    <el-table :data="vipOrderList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" align="center" width="60" type="index"></el-table-column>
      <el-table-column
        label="业务订单号"
        align="center"
        prop="out_trade_no"
        show-overflow-tooltip
        :tooltip-options="{ placement: 'top', effect: 'light', popperClass: 'addr-tooltip' }"
      ></el-table-column>
      <el-table-column label="用户电话" align="center" prop="userMobile"></el-table-column>
      <el-table-column
        label="会员产品"
        align="center"
        prop="vipLevelText"
        min-width="120"
      ></el-table-column>
      <el-table-column label="订单金额" align="center" prop="amount">
        <template #default="{ row }">
          {{ (row.amount / 100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="权益折扣" align="center" prop="discount"></el-table-column>
      <el-table-column label="每月免费次数" align="center" prop="limit"></el-table-column>
      <el-table-column label="可绑定人数" align="center" prop="maxUsers"></el-table-column>
      <el-table-column label="产品期限" align="center" prop="term"></el-table-column>
      <el-table-column label="订单状态" align="center" prop="status">
        <template #default="{ row }">
          {{ formatVipOrderState(row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createdAt">
        <template #default="{ row }">
          {{ formatTimestamp(row.createdAt, 2) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template #default="{ row }">
          <el-tooltip content="同步" placement="top">
            <el-button
              v-if="row.status === 'PAID'"
              :icon="Position"
              circle
              plain
              type="danger"
              @click="onSend(row)"
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
