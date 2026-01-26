<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PageContainer from '@/components/PageContainer.vue'
import { displayValue, formatTimestamp } from '@/utils'
import VipChannel from '@/views/vipProduct/components/VipChannel.vue'
import type { VipProduct } from '@/types/ProductItem.d.ts'
import { vipProductDeleteApi, vipProductGetApi } from '@/api/product.ts'

// 获取子组件
const dialog = ref()

// 获取会员产品列表
const vipProductList = ref<VipProduct[]>([])
const vipProductGet = async () => {
  const res = await vipProductGetApi()
  vipProductList.value = res.data
}

// 添加
const onAddChannel = () => {
  dialog.value?.open({})
}

// 编辑
const onEditChannel = (row: VipProduct) => {
  console.log('onEditChannel', row)
  dialog.value?.open(row)
}

// 删除
const onDelChannel = (row: VipProduct) => {
  console.log('onDelChannel', row)
  ElMessageBox.confirm('你确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'el-button--danger' // Element 内置类
  })
    .then(async () => {
      console.log('onDelChannel', row)
      const del = await vipProductDeleteApi(row._id)
      if (del.code === 200) ElMessage.success('删除成功')
      await vipProductGet()
    })
    .catch((err) => {
      // catch error
      console.error('异常错误', err)
    })
}

// 处理子组件操作成功
const handleSuccess = () => {
  console.log('onSuccess')
  vipProductGet()
}

onMounted(() => vipProductGet())
</script>

<template>
  <!-- 非会员用户 -->
  <PageContainer title="会员产品设置">
    <template #extra>
      <el-button type="danger" @click="onAddChannel">添加产品</el-button>
    </template>
    <el-table :data="vipProductList" style="width: 100%">
      <el-table-column label="序号" type="index" width="60" align="center" />
      <el-table-column prop="levelText" label="等级" align="center" min-width="120" />
      <el-table-column label="售价" align="center" width="100">
        <template #default="{ row }">¥{{ Number((row.price / 100).toFixed(2)) }}</template>
      </el-table-column>
      <el-table-column label="商品折扣" align="center" width="100">
        <template #default="{ row }">
          <span v-if="row.discount && row.discount < 10">{{ row.discount }}折</span>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column label="消费返积分比例" align="center" min-width="120">
        <template #default="{ row }">
          {{ displayValue(row.cashbackRate) }}
        </template>
      </el-table-column>
      <el-table-column prop="term" label="有效期" align="center" width="120" />
      <el-table-column prop="maxUsers" label="可共享人数" align="center" min-width="80" />
      <el-table-column prop="limit" label="每月免费次数" align="center" min-width="80" />
      <el-table-column prop="rights" label="权益说明" align="center" min-width="200" />
      <el-table-column label="状态" align="center" width="100">
        <template #default="{ row }">
          <el-tag type="success" v-if="row.status === 'enable'">启用</el-tag>
          <el-tag type="info" v-else>停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" width="160">
        <template #default="{ row }">{{ formatTimestamp(row.updatedAt) }}</template>
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
        <el-empty description="暂无会员产品" />
      </template>
    </el-table>
  </PageContainer>
  <!-- 弹窗 -->
  <VipChannel ref="dialog" @success="handleSuccess"></VipChannel>
</template>

<style scoped lang="scss"></style>
