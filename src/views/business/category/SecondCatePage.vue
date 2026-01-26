<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import type { CateItem } from '@/types/CateItem'
import { ElMessage, ElMessageBox, type TabsPaneContext } from 'element-plus'
import type { JelSubCateChannel } from '@/types/Components'
import { useCateStore } from '@/stores/modules/cate.ts'
import PageContainer from '@/components/PageContainer.vue'
import SubCateChannel from '@/views/business/category/SubCateChannel.vue'
import { cateDeleteApi } from '@/api/cate.ts'

// 定义store
const cateStore = useCateStore()
// 获取子组件
const dialog = ref<JelSubCateChannel>()

// 分页
const params = ref({
  pageNum: 1,
  pageSize: 10
})

const handleSizeChange = (size: number) => {
  console.log(size)
  params.value.pageSize = size
  // 重置到第 1 页，避免当前页超出最大页数后数据为空
  params.value.pageNum = 1
  cateStore.subCateListGet(params.value.pageNum, params.value.pageSize, categoryId.value) // 子级分类
}

const handleCurrentChange = (num: number) => {
  params.value.pageNum = num
  // 重新获取数据
  cateStore.subCateListGet(params.value.pageNum, params.value.pageSize, categoryId.value) // 子级分类
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
      const delRes = await cateDeleteApi(row._id)
      console.log('onDelChannel', row, delRes)
      await cateStore.subCateListGet(params.value.pageNum, params.value.pageSize, categoryId.value) // 子级分类
      ElMessage.success('删除成功')
    })
    .catch((err) => {
      // catch error
      console.error('异常错误', err)
    })
}

// 处理子组件操作成功
const handleSuccess = () => {
  console.log('onSuccess')
  cateStore.subCateListGet(params.value.pageNum, params.value.pageSize, categoryId.value) // 子级分类
}

// 分类标签
const categoryId = ref('')
const handleClick = (tab: TabsPaneContext) => {
  console.log(tab.paneName)
  categoryId.value = tab.paneName as string
  params.value.pageNum = 1 // 切换分类时重置页码
  cateStore.subCateListGet(params.value.pageNum, params.value.pageSize, categoryId.value) // 子级分类
}

onMounted(async () => {
  await cateStore.cateListGet(1, 100) // 一级分类
  categoryId.value = cateStore.cateList[0]?._id ?? '' // 父级分类ID
  await cateStore.subCateListGet(params.value.pageNum, params.value.pageSize, categoryId.value) // 子级分类
})
</script>

<template>
  <PageContainer title="分类管理">
    <div class="header">
      <el-tabs v-model="categoryId" class="tabs" @tab-click="handleClick">
        <el-tab-pane
          v-for="item in cateStore.cateList"
          :key="item._id"
          :label="item.name"
          :name="item._id"
        ></el-tab-pane>
      </el-tabs>
    </div>
    <template #extra>
      <el-button type="danger" @click="onAddChannel">添加分类</el-button>
    </template>
    <!--  对应一级分类的二级分类  -->
    <el-table :data="cateStore.subCateList" style="width: 100%" v-loading="cateStore.loading">
      <el-table-column label="序号" align="center" width="60" type="index"></el-table-column>
      <el-table-column label="分类名称" align="center" prop="name"></el-table-column>
      <el-table-column label="所属分类" align="center" prop="parentId">
        <template #default="{ row }">
          {{ cateStore.mapCateParentName(row.parentId) }}
        </template>
      </el-table-column>
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
  <SubCateChannel ref="dialog" @success="handleSuccess" :parentId="categoryId"></SubCateChannel>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  width: 100%;
  color: $jel-font-title;

  .tabs ::v-deep(.el-tabs__item):hover {
    color: $jel-brandColor;
  }
  .tabs ::v-deep(.el-tabs__item.is-active) {
    color: $jel-brandColor;
  }
  .tabs ::v-deep(.el-tabs__active-bar.is-top) {
    background-color: $jel-brandColor;
  }
  .tabs ::v-deep(.el-tabs__item.is-active) {
    color: $jel-brandColor;
  }
}
</style>
