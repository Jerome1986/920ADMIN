<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { AddressInfo } from '@/types/OrderItem.d.ts'
import { regionData, codeToText } from 'element-china-area-data'
import { updateProductOrderAddressApi } from '@/api/order.ts'

// 对话框可见与标题
const dialogVisible = ref(false)
const dialogTitle = ref('修改地址')

// 级联选择器--省市区选择器
const selected = ref<[string, string, string]>(['', '', ''])
const handleChange = () => {
  console.log('已选择', selected.value)
  if (!selected.value || selected.value.length !== 3) return

  const [provinceCode, cityCode, countyCode] = selected.value
  // 将选择号的省市区填回表单
  formModel.value.provinceName = codeToText[provinceCode] || ''
  formModel.value.cityName = codeToText[cityCode] || ''
  formModel.value.countyName = codeToText[countyCode] || ''

  formModel.value.nationalCode = selected.value[2]
}

// 弹窗表单
const formModel = ref<AddressInfo>({
  userName: '',
  telNumber: '',
  provinceName: '',
  cityName: '',
  countyName: '',
  detailInfo: '',
  postalCode: '',
  nationalCode: ''
})

// 对应的订单号
const orderNo = ref('')

// 打开弹窗
const open = (addressInfo: AddressInfo, out_trade_no: string) => {
  dialogVisible.value = true
  formModel.value = addressInfo
  orderNo.value = out_trade_no // 接收父组件传过来的订单号
  // 同步区域代码：微信只返回nationalCode，所以拆开分配
  const areaCode = addressInfo.nationalCode! // 420106
  const cityCode = addressInfo.nationalCode!.slice(0, 4) // 4201
  const provinceCode = addressInfo.nationalCode!.slice(0, 2) // 42
  selected.value = [provinceCode, cityCode, areaCode]
  // console.log('打开弹窗', selected.value)
  console.log('打开弹窗', formModel.value, orderNo.value)
}

// 暴露方法
defineExpose({
  open
})

// 提交
const onSubmit = async () => {
  console.log('提交地址：', formModel.value, orderNo.value)
  // 调用接口入库
  const res = await updateProductOrderAddressApi(orderNo.value, formModel.value)
  console.log('更新结果', res)
  ElMessage.success('修改成功')
  dialogVisible.value = false
}
</script>

<template>
  <div class="proChannel">
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="40%">
      <el-form ref="formRef" :model="formModel" label-width="100px" style="padding-right: 30px">
        <el-form-item label="收货人姓名" prop="userName">
          <el-input v-model="formModel.userName" placeholder="请输入收货人姓名"></el-input>
        </el-form-item>
        <el-form-item label="收货人电话" prop="telNumber">
          <el-input v-model="formModel.telNumber" placeholder="请输入收货人电话"></el-input>
        </el-form-item>
        <el-form-item label="省市区">
          <el-cascader
            v-model="selected"
            :options="regionData"
            placeholder="选择省/市/区"
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item label="街道地址" prop="detailInfo">
          <el-input v-model="formModel.detailInfo" placeholder="街道地址，具体到门牌号"></el-input>
        </el-form-item>
        <el-form-item label="邮编" prop="detailInfo">
          <el-input v-model="formModel.postalCode" placeholder="请输入对应的城市邮编"></el-input>
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
