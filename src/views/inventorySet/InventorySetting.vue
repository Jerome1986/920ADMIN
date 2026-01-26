<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import type { InventoryPackage } from '@/types/InventoryPackage'
import PageContainer from '@/components/PageContainer.vue'
import PackageChannel from './components/Packagechannel.vue'
import ProductDetail from './components/ProductDetail.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  inventoryPackageDeleteApi,
  inventoryPackageGetApi,
  inventoryPackageStatusApi
} from '@/api/inventoryPackage.ts'
import { formatTimestamp } from '@/utils'

// 表格数据
const loading = ref(false)
const packageList = ref<InventoryPackage[]>([])

// 获取套餐列表
const getPackageList = async () => {
  loading.value = true
  const res = await inventoryPackageGetApi()
  packageList.value = res.data
  loading.value = false
}

// 对话框相关
const packageChannelRef = ref<InstanceType<typeof PackageChannel>>()
const productDetailRef = ref<InstanceType<typeof ProductDetail>>()

// 新增套餐
const handleAdd = () => {
  packageChannelRef.value?.open()
}

// 编辑套餐
const handleEdit = (row: InventoryPackage) => {
  packageChannelRef.value?.open(row)
}

// 删除套餐
const handleDelete = async (row: InventoryPackage) => {
  ElMessageBox.confirm(`确定要删除套餐"${row.name}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'el-button--danger'
  })
    .then(async () => {
      // 调用删除接口
      if (row._id) await inventoryPackageDeleteApi(row._id)
      ElMessage.success('删除成功')
      await getPackageList()
    })
    .catch(() => {
      // 用户取消删除
    })
}

// 切换状态
const handleStatusChange = async (row: InventoryPackage) => {
  try {
    // 调用接口
    console.log(row.status)
    if (row._id) {
      const res = await inventoryPackageStatusApi(row._id, row.status)
      ElMessage.success(`已${res.data.status === 'ENABLE' ? '启用' : '停用'}套餐`)
    }
    await getPackageList()
  } catch {
    // 恢复原状态
    row.status = row.status === 'ENABLE' ? 'DISABLE' : 'ENABLE'
    ElMessage.error('操作失败')
  }
}

// 查看详情
const handleViewDetail = (row: InventoryPackage) => {
  productDetailRef.value?.open(row)
}

// 表单提交成功回调
const handleSuccess = () => {
  getPackageList()
}

onMounted(() => {
  getPackageList()
})
</script>

<template>
  <PageContainer title="库存套餐配置">
    <template #extra>
      <el-button type="danger" :icon="Plus" @click="handleAdd">新增套餐</el-button>
    </template>

    <!-- 表格 -->
    <el-table :data="packageList" v-loading="loading" style="width: 100%">
      <el-table-column label="序号" type="index" width="60" align="center" />
      <el-table-column
        label="套餐名称"
        prop="name"
        min-width="180"
        show-overflow-tooltip
        align="center"
      />
      <el-table-column
        label="套餐说明"
        prop="desc"
        min-width="200"
        show-overflow-tooltip
        align="center"
      />
      <el-table-column label="包含商品数" align="center" width="180">
        <template #default="{ row }">
          <div style="display: flex; align-items: center; justify-content: center; gap: 8px">
            <span>{{ row.items?.length || 0 }} 个</span>
            <el-button type="primary" link size="default" @click="handleViewDetail(row)">
              查看详情
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            active-value="ENABLE"
            inactive-value="DISABLE"
            style="--el-switch-on-color: #f56c6c"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createdAt" width="180" align="center">
        <template #default="{ row }">
          {{ formatTimestamp(row.createdAt, 2) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="handleEdit(row)" />
          <el-button :icon="Delete" circle plain type="danger" @click="handleDelete(row)" />
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无套餐数据" />
      </template>
    </el-table>

    <!-- 新增/编辑套餐对话框 -->
    <PackageChannel ref="packageChannelRef" @success="handleSuccess" />

    <!-- 查看套餐商品列表 -->
    <ProductDetail ref="productDetailRef" />
  </PageContainer>
</template>

<style scoped lang="scss">
@use 'sass:color';

// 表格样式
:deep(.el-table) {
  // 查看详情链接样式
  .el-button--primary.is-link {
    color: #f56c6c;
  }

  // 操作按钮样式
  .el-button.is-circle {
    &.el-button--primary {
      &:hover {
        background-color: color.adjust($jel-brandColor, $lightness: -10%);
        border-color: color.adjust($jel-brandColor, $lightness: -10%);
      }
    }

    &.el-button--danger {
      &:hover {
        background-color: color.adjust(#f56c6c, $lightness: -10%);
        border-color: color.adjust(#f56c6c, $lightness: -10%);
      }
    }
  }
}
</style>
