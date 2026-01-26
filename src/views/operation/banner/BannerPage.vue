<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import BannerChannel from './components/BannerChannel.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { JelBannerChannel } from '@/types/Components'
import PageContainer from '@/components/PageContainer.vue'
import type { BannerItem } from '@/types/BannerItem.d.ts'
import { bannerListDeleteApi, bannerListGetApi } from '@/api/banner.ts'

// 获取子组件
const dialog = ref<JelBannerChannel>()
const loading = ref(false)
const bannerList = ref<BannerItem[]>([])
const bannerListGet = async () => {
  const res = await bannerListGetApi()
  bannerList.value = res.data
}

// 添加
const onAddChannel = () => {
  dialog.value?.open({})
}

// 编辑
const onEditChannel = (row: BannerItem) => {
  console.log('onEditChannel', row)
  dialog.value?.open(row)
}

// 删除
const onDelChannel = (row: BannerItem) => {
  console.log('onDelChannel', row)
  ElMessageBox.confirm('你确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'el-button--danger' // Element 内置类
  })
    .then(async () => {
      if (row._id) {
        const delRes = await bannerListDeleteApi(row._id)
        console.log(delRes.data)
        await bannerListGet()
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
  console.log('onSuccess')
  bannerListGet()
}

onMounted(() => bannerListGet())
</script>

<template>
  <PageContainer title="轮播图设置">
    <template #extra>
      <el-button type="danger" @click="onAddChannel">添加轮播图</el-button>
    </template>
    <el-table :data="bannerList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" align="center" width="60" type="index"></el-table-column>
      <el-table-column label="图片链接" align="center" prop="url">
        <template #default="{ row }">
          <img
            style="width: 100px; height: 50px; border-radius: 4px"
            :src="row.url"
            :alt="row.url"
          />
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
  <BannerChannel ref="dialog" @success="handleSuccess"></BannerChannel>
</template>

<style scoped lang="scss"></style>
