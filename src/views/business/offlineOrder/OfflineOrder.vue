<script setup lang="ts">
import { onMounted, ref } from 'vue'
import PageContainer from '@/components/PageContainer.vue'
import { type TabsPaneContext } from 'element-plus'
import { formatOfflineOrderState, formatTimestamp } from '@/utils'
import { OfflineOrderGetApi } from '@/api/order.ts'
import type { offlineOrder } from '@/types/offlineOrder'

const loading = ref(false)

// 标签
const activeTagName = ref('ALL')
// tag列表
const tagList = ref([
  { id: 'tag1', text: 'ALL', label: '全部' },
  { id: 'tag2', text: 'COMPLETED', label: '已完成' },
  { id: 'tag3', text: 'CANCELLED', label: '已取消' }
])
// tag切换
const handleClickTag = (tag: TabsPaneContext) => {
  console.log(tag.paneName)
  activeTagName.value = tag.paneName as string
  params.value.pageNum = 1
  searchValue.value = ''
  //  获取门店线下贴膜订单
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

  // todo  搜索线下贴膜单接口

  loading.value = false
}

// 清空搜索
const handleClearSearch = () => {
  searchValue.value = ''
  params.value.pageNum = 1
  //  获取门店线下贴膜订单
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
    //  获取门店线下贴膜订单
    productOrderGet(activeTagName.value, params.value.pageNum, params.value.pageSize)
  }
}

const handleSizeChange = (pageSize: number) => {
  params.value.pageNum = 1
  params.value.pageSize = pageSize
  if (searchValue.value) {
    handleSearch(false)
  } else {
    //  获取门店线下贴膜订单
    productOrderGet(activeTagName.value, params.value.pageNum, params.value.pageSize)
  }
}

// 获取进货单
const purchasedOrderList = ref<offlineOrder[]>([])
const productOrderGet = async (status: string, pageNum: number, pageSize: number) => {
  loading.value = true
  //  获取门店线下贴膜订单
  console.log(status, pageNum, pageSize)
  const res = await OfflineOrderGetApi(status, pageNum, pageSize)
  purchasedOrderList.value = res.data.list
  console.log('线下订单', purchasedOrderList.value)
  total.value = res.data.total
  loading.value = false
}

// 处理点击取货

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

      <el-table-column label="用户电话" align="center" prop="memberPhone"> </el-table-column>
      <el-table-column label="货号" align="center" prop="productSkuNo"> </el-table-column>
      <el-table-column
        label="商品名称"
        align="center"
        prop="productName"
        show-overflow-tooltip
        :tooltip-options="{ placement: 'top', effect: 'light', popperClass: 'addr-tooltip' }"
      >
      </el-table-column>
      <el-table-column label="商品封面" align="center" prop="productCover">
        <template #default="{ row }">
          <img :src="row.productCover" style="width: 50px; height: 50px" alt="封面" />
        </template>
      </el-table-column>
      <el-table-column label="商品备注" align="center" prop="productDec"> </el-table-column>
      <el-table-column
        label="型号范围"
        align="center"
        prop="models"
        show-overflow-tooltip
        :tooltip-options="{ placement: 'top', effect: 'light', popperClass: 'addr-tooltip' }"
      >
      </el-table-column>
      <el-table-column label="订单备注" align="center" prop="remark"> </el-table-column>
      <el-table-column label="支付方式" align="center" prop="paymentMethod"> </el-table-column>
      <el-table-column label="订单总金额(元)" align="center">
        <template #default="{ row }">
          {{ (row.amount / 100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" prop="status">
        <template #default="{ row }">
          {{ formatOfflineOrderState(row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createdAt">
        <template #default="{ row }">
          {{ formatTimestamp(row.createdAt, 2) }}
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
