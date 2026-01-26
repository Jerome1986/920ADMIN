<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { JelTeamChannel } from '@/types/Components'
import PageContainer from '@/components/PageContainer.vue'
import TeamChannel from './components/TeamChannel.vue'
import type { TeamItem } from '@/types/TeamItem.d.ts'
import { teamListDeleteApi, teamListGetApi } from '@/api/team.ts'
import { formatTimestamp } from '@/utils'

// 获取子组件
const dialog = ref<JelTeamChannel>()
const loading = ref(false)
const teamList = ref<TeamItem[]>([])
const teamListGet = async () => {
  const res = await teamListGetApi()
  console.log('team', res)
  teamList.value = res.data
}

// 添加
const onAddChannel = () => {
  dialog.value?.open({})
}

// 编辑
const onEditChannel = (row: TeamItem) => {
  console.log('onEditChannel', row)
  dialog.value?.open(row)
}

// 删除
const onDelChannel = (row: TeamItem) => {
  console.log('onDelChannel', row)
  ElMessageBox.confirm('你确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'el-button--danger' // Element 内置类
  })
    .then(async () => {
      if (row._id) {
        await teamListDeleteApi(row._id)
        await teamListGet()
        ElMessage.success('删除成功')
      }
    })
    .catch((err) => {
      if (err === 'cancel') ElMessage.warning('已取消')
      // catch error
      console.error('异常错误', err)
    })
}

// 处理子组件操作成功
const handleSuccess = () => {
  console.log('onSuccess')
  teamListGet()
}

onMounted(() => teamListGet())
</script>

<template>
  <PageContainer title="团队风采">
    <template #extra>
      <el-button type="danger" @click="onAddChannel">添加</el-button>
    </template>
    <el-table :data="teamList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" align="center" width="60" type="index"></el-table-column>
      <el-table-column label="标题" align="center" prop="name" min-width="120"></el-table-column>
      <el-table-column label="图片链接" align="center" prop="image">
        <template #default="{ row }">
          <img
            style="width: 100px; height: 50px; border-radius: 4px"
            :src="row.image"
            :alt="row.image"
          />
        </template>
      </el-table-column>
      <el-table-column label="显示" align="center" width="100" prop="status">
        <template #default="{ row }">
          <el-tag type="success" v-if="row.status === 'active'">是</el-tag>
          <el-tag type="info" v-else>否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createdAt">
        <template #default="{ row }">
          {{ formatTimestamp(row.createdAt, 2) }}
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
  </PageContainer>
  <!-- 弹窗 -->
  <TeamChannel ref="dialog" @success="handleSuccess"></TeamChannel>
</template>

<style scoped lang="scss"></style>
