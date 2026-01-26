<script setup lang="ts">
import { ref } from 'vue'
import type { CateItem } from '@/types/CateItem.d.ts'
import { cateAddApi, cateUpdateApi } from '@/api/cate.ts'
import { ElMessage } from 'element-plus'

// 对话框可见与标题
const dialogVisible = ref(false)
const dialogTitle = ref('编辑用户')

type CateFormModel = Pick<CateItem, '_id' | 'name'>

// 弹窗表单
const formModel = ref<CateFormModel>({
  _id: '',
  name: ''
})

// 打开弹窗
const open = (row: Partial<CateItem> = {}) => {
  dialogVisible.value = true

  const isEdit = !!row._id
  dialogTitle.value = isEdit ? '编辑' : '新增'

  formModel.value = {
    _id: row._id ?? '',
    name: row.name ?? ''
  }
}

// 暴露方法
defineExpose({
  open
})

// 提交事件
const emits = defineEmits(['success'])

// 提交
const onSubmit = async () => {
  console.log('提交用户：', formModel.value)
  // 更新
  if (formModel.value._id) {
    try {
      console.log('提交', formModel.value._id, formModel.value.name)
      const res = await cateUpdateApi(formModel.value._id, formModel.value.name)
      console.log('更新成功', res)
      ElMessage.success('更新成功')
    } catch (error) {
      console.error('error', error)
    }
  } else {
    try {
      //  新增
      const res = await cateAddApi(formModel.value.name)
      console.log('新增成功', res)
      ElMessage.success('新增成功')
    } catch (error) {
      console.error('error', error)
    }
  }
  // 通知父组件刷新&&关闭弹窗
  dialogVisible.value = false
  emits('success')
}
</script>

<template>
  <div class="proChannel">
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="40%">
      <el-form ref="formRef" :model="formModel" label-width="100px" style="padding-right: 30px">
        <!-- 分类名称 -->
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="formModel.name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="danger" @click="onSubmit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.proChannel {
  .upload-container {
    display: flex;
    align-items: center;
    gap: 16px;

    :deep(.el-upload--picture-card) {
      width: 120px;
      height: 120px;
      line-height: 120px;
    }

    .el-button {
      height: 40px;
      margin-top: 40px; // 垂直居中对齐
      padding: 0 20px;
      font-size: 14px;
    }
  }

  :deep(.el-upload) {
    .el-button {
      margin-right: 12px;
    }
  }

  :deep(.el-upload__tip) {
    margin-top: 8px;
    color: #909399;
    font-size: 13px;
  }
}
</style>
