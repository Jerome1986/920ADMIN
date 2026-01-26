<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import type { CateItem } from '@/types/CateItem'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { JelRateChannel } from '@/types/Components'
import PageContainer from '@/components/PageContainer.vue'
import RateChannel from './components/RateChannel.vue'
import type { RateRulesItem } from '@/types/RateRulesItem'
import { rateRuleDeleteApi, rateRuleGetApi } from '@/api/rate.ts'

const loading = ref(false)
// 获取子组件
const dialog = ref<JelRateChannel>()

// 获取积分规则
const rateRuleList = ref<RateRulesItem[]>([])
const rateRuleGet = async () => {
  const res = await rateRuleGetApi()
  rateRuleList.value = res.data
}

// 添加
const onAddChannel = () => {
  dialog.value?.open({})
}

// 编辑
const onEditChannel = (row: RateRulesItem) => {
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
      const delRes = await rateRuleDeleteApi(row._id)
      if (delRes.code === 200) ElMessage.success('删除成功')
      await rateRuleGet()
    })
    .catch((err) => {
      // catch error
      console.error('异常错误', err)
    })
}

// 处理子组件操作成功
const handleSuccess = () => {
  console.log('onSuccess')
  rateRuleGet()
}

onMounted(() => rateRuleGet())
</script>

<template>
  <PageContainer title="积分规则设置">
    <template #extra>
      <el-button type="danger" @click="onAddChannel">添加规则</el-button>
    </template>
    <el-table :data="rateRuleList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" align="center" width="60" type="index"></el-table-column>
      <el-table-column label="返积分比例" align="center" prop="earnRate"></el-table-column>
      <el-table-column label="积分抵扣换算率" align="center" prop="useRate"></el-table-column>
      <el-table-column label="抵扣比例" align="center" prop="maxUsePercent"></el-table-column>
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
  <RateChannel ref="dialog" @success="handleSuccess"></RateChannel>
</template>

<style scoped lang="scss"></style>
