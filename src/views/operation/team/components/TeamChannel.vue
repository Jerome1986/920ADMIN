<script setup lang="ts">
import { ref } from 'vue'
import {
  ElMessage,
  genFileId,
  type UploadInstance,
  type UploadProps,
  type UploadRawFile,
  type UploadUserFile
} from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { TeamFormModel, TeamItem } from '@/types/TeamItem.d.ts'
import { teamListAddApi, teamListUpdateApi } from '@/api/team.ts'

// 对话框可见与标题
const dialogVisible = ref(false)
const dialogTitle = ref('编辑')

// 弹窗表单
const formModel = ref<TeamFormModel>({
  _id: '',
  name: '',
  image: '',
  status: 'active'
})

// 获取上传组件
const uploadCover = ref<UploadInstance>()
// 上传 - 封面
const coverFileList = ref<UploadUserFile[]>([])
const handleCoverSuccess: UploadProps['onSuccess'] = (response) => {
  console.log('上传成功返回', response)
  // 拿到返回的url
  formModel.value.image = response
}
//  覆盖上一张图
const handleCoverExceed: UploadProps['onExceed'] = (files) => {
  console.log('覆盖上一张图', files)
  uploadCover.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadCover.value!.handleStart(file)
  uploadCover.value!.submit()
}
// 移除图片
const handleCoverRemove: UploadProps['onRemove'] = () => {
  formModel.value.image = ''
  coverFileList.value = []
}

// 打开弹窗
const open = (row: Partial<TeamItem> = {}) => {
  dialogVisible.value = true

  const isEdit = !!row._id
  dialogTitle.value = isEdit ? '编辑' : '新增'
  console.log(formModel.value, coverFileList.value)
  formModel.value = {
    _id: row._id ?? '',
    name: row.name ?? '',
    image: row.image ?? '',
    status: row.status ?? 'active'
  }
  // 回显
  coverFileList.value = formModel.value.image ? [{ name: 'cover', url: formModel.value.image }] : []
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
      const upRes = await teamListUpdateApi(
        formModel.value._id,
        formModel.value.name,
        formModel.value.image,
        formModel.value.status || 'active'
      )
      console.log('更新', upRes)
      ElMessage.success('更新成功')
    } catch (error) {
      console.error('error', error)
    }
  } else {
    try {
      //  新增
      const addRes = await teamListAddApi(formModel.value.name, formModel.value.image)
      console.log('新增成功', addRes)
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
        <!-- 标题 -->
        <el-form-item label="名称" prop="name">
          <el-input v-model="formModel.name" placeholder="请输入标题"></el-input>
        </el-form-item>
        <!-- 是否显示  -->
        <el-form-item label="显示" prop="status">
          <el-switch
            v-model="formModel.status"
            style="--el-switch-on-color: #f56c6c"
            active-value="active"
            inactive-value="inactive"
          />
        </el-form-item>
        <!-- 图片上传 -->
        <el-form-item label="图片上传" prop="url">
          <el-upload
            ref="uploadCover"
            action="https://i2dkfjxqvm.gzg.sealos.run/admin/upload"
            list-type="picture-card"
            :limit="1"
            :file-list="coverFileList"
            :on-success="handleCoverSuccess"
            :on-remove="handleCoverRemove"
            :on-exceed="handleCoverExceed"
            :data="{ folder: 'team' }"
          >
            <el-icon>
              <Plus />
            </el-icon>
          </el-upload>
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
