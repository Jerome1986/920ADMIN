<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { RateRulesItem } from '@/types/RateRulesItem'
import { rateRuleAddApi, rateRuleUpdateApi } from '@/api/rate.ts'

// 对话框可见与标题
const dialogVisible = ref(false)
const dialogTitle = ref('编辑规则')

// 弹窗表单
const formModel = ref<RateRulesItem>({
  _id: '',
  earnRate: undefined,
  useRate: 1,
  maxUsePercent: undefined
})

// 打开弹窗
const open = (row: Partial<RateRulesItem> = {}) => {
  dialogVisible.value = true

  const isEdit = !!row._id
  dialogTitle.value = isEdit ? '编辑' : '新增'

  formModel.value = {
    _id: row._id ?? '',
    earnRate: row.earnRate || undefined,
    useRate: row.useRate || undefined,
    maxUsePercent: row.maxUsePercent || undefined
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
      console.log('提交', formModel.value)
      if (formModel.value.earnRate && formModel.value.useRate && formModel.value.maxUsePercent) {
        const upRes = await rateRuleUpdateApi(
          formModel.value._id,
          formModel.value.earnRate,
          formModel.value.useRate,
          formModel.value.maxUsePercent
        )
        console.log('更新结果', upRes)
      }
      ElMessage.success('更新成功')
    } catch (error) {
      console.error('error', error)
    }
  } else {
    try {
      //  新增
      const res = await rateRuleAddApi(
        formModel.value.earnRate || 0,
        formModel.value.useRate || 1,
        formModel.value.maxUsePercent || 0
      )
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
        <!-- 返积分比例 -->
        <el-form-item label="返积分比例" prop="earnRate">
          <el-input
            v-model="formModel.earnRate"
            placeholder="消费商品返回积分的比例，如0.1等于10%，0.05等于5%，以此类推"
          ></el-input>
        </el-form-item>
        <!-- 积分抵扣换算率 -->
        <el-form-item label="积分换算比例" prop="useRate">
          <el-input
            v-model="formModel.useRate"
            placeholder="积分和人民币换算的比例，默认为1：1，也可以设置1：0.5，及1积分=0.5元"
          ></el-input>
        </el-form-item>
        <!-- 抵扣比例 -->
        <el-form-item label="抵扣比例" prop="maxUsePercent">
          <el-input
            v-model="formModel.maxUsePercent"
            placeholder="每笔消费订单可抵扣积分上限比例，0.1等于10%，0.05等于5%，以此类推"
          ></el-input>
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
