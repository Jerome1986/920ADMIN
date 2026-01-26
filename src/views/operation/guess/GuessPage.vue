<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { JelGuessChannel } from '@/types/Components'
import PageContainer from '@/components/PageContainer.vue'
import type { GuessItem } from '@/types/GuessItem.d.ts'
import GuessChannel from './components/GuessChannel.vue'
import { guessListDeleteApi, guessListGetApi } from '@/api/guess.ts'

// 获取子组件
const dialog = ref<JelGuessChannel>()
const loading = ref(false)
// 分页
const params = ref({
  pageNum: 1,
  pageSize: 10
})
const total = ref(0)

const handleSizeChange = async (size: number) => {
  console.log(size)
  params.value.pageSize = size
  // 重置到第 1 页，避免当前页超出最大页数后数据为空
  params.value.pageNum = 1
  await guessListGet(params.value.pageNum, params.value.pageSize)
}

const handleCurrentChange = (num: number) => {
  params.value.pageNum = num
  // 重新获取数据
  guessListGet(params.value.pageNum, params.value.pageSize)
}

// 获取猜你想搜数据
const guessList = ref<GuessItem[]>([])
const guessListGet = async (pageNum: number, pageSize: number) => {
  loading.value = true
  const res = await guessListGetApi(pageNum, pageSize)
  guessList.value = res.data.list
  total.value = res.data.total
  loading.value = false
}

// 添加
const onAddChannel = () => {
  dialog.value?.open({})
}

// 编辑
const onEditChannel = (row: GuessItem) => {
  console.log('onEditChannel', row)
  dialog.value?.open(row)
}

// 删除
const onDelChannel = (row: GuessItem) => {
  console.log('onDelChannel', row)
  ElMessageBox.confirm('你确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'el-button--danger' // Element 内置类
  })
    .then(async () => {
      console.log('onDelChannel', row)
      if (row._id) {
        const del = await guessListDeleteApi(row._id)
        if (del.data.acknowledged) await guessListGet(params.value.pageNum, params.value.pageSize)
        ElMessage.success('删除成功')
      }
    })
    .catch((err) => {
      // catch error
      console.error('异常错误', err)
    })
}

// 处理子组件操作成功
const handleSuccess = () => {
  guessListGet(params.value.pageNum, params.value.pageSize)
}

onMounted(() => guessListGet(params.value.pageNum, params.value.pageSize))
</script>

<template>
  <PageContainer title="猜你想搜">
    <template #extra>
      <el-button type="danger" @click="onAddChannel">添加</el-button>
    </template>
    <el-table :data="guessList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" align="center" width="60" type="index"></el-table-column>
      <el-table-column label="名称" align="center" prop="name"></el-table-column>
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
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </PageContainer>
  <!-- 弹窗 -->
  <GuessChannel ref="dialog" @success="handleSuccess"></GuessChannel>
</template>

<style scoped lang="scss"></style>
