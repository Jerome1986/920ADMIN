<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import type { CateItem } from '@/types/CateItem'
import CateChannel from './CateChannel.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { JelCateChannel } from '@/types/Components'
import { useCateStore } from '@/stores/modules/cate.ts'
import PageContainer from '@/components/PageContainer.vue'
import { cateDeleteApi } from '@/api/cate.ts'

// 定义store
const cateStore = useCateStore()
// 获取子组件
const dialog = ref<JelCateChannel>()

// 分页
const params = ref({
  pageNum: 1,
  pageSize: 10
})

const handleSizeChange = async (size: number) => {
  console.log(size)
  params.value.pageSize = size
  // 重置到第 1 页，避免当前页超出最大页数后数据为空
  params.value.pageNum = 1
  await cateStore.cateListGet(params.value.pageNum, params.value.pageSize)
}

const handleCurrentChange = (num: number) => {
  params.value.pageNum = num
  // 重新获取数据
  cateStore.cateListGet(num, params.value.pageSize)
}

// 添加
const onAddChannel = () => {
  dialog.value?.open({})
}

// 编辑
const onEditChannel = (row: CateItem) => {
  console.log('onEditChannel', row)
  dialog.value?.open(row)
}

// 删除
const onDelChannel = (row: CateItem) => {
  console.log('onDelChannel', row)
  ElMessageBox.confirm('你确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'el-button--danger' // Element 内置类
  })
    .then(async () => {
      console.log('onDelChannel', row)
      const delRes = await cateDeleteApi(row._id)
      if (delRes.code === 200) {
        ElMessage.success('删除成功')
        await cateStore.cateListGet(params.value.pageNum, params.value.pageSize)
      }
    })
    .catch((err) => {
      // catch error
      console.error('异常错误', err)
    })
}

// 处理子组件操作成功
const handleSuccess = () => {
  cateStore.cateListGet(params.value.pageNum, params.value.pageSize)
}

onMounted(() => cateStore.cateListGet(params.value.pageNum, params.value.pageSize))
</script>

<template>
  <PageContainer title="分类管理">
    <template #extra>
      <el-button type="danger" @click="onAddChannel">添加分类</el-button>
    </template>
    <el-table :data="cateStore.cateList" style="width: 100%" v-loading="cateStore.loading">
      <el-table-column label="序号" align="center" width="60" type="index"></el-table-column>
      <el-table-column label="分类名称" align="center" prop="name"></el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditChannel(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDelChannel(row)"
          ></el-button>
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
        :total="cateStore.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </PageContainer>
  <!-- 弹窗 -->
  <CateChannel ref="dialog" @success="handleSuccess"></CateChannel>
</template>

<style scoped lang="scss"></style>
