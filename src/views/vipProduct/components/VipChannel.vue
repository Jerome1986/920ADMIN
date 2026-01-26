<!-- VipDialog.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import type { VipProduct } from '@/types/ProductItem.d.ts'
import { vipProductListAddApi, vipProductUpdateApi } from '@/api/product.ts'
import { ElMessage } from 'element-plus'

const visible = ref(false)
const form = ref<VipProduct>({
  _id: '',
  levelText: '',
  price: 0,
  discount: 10,
  cashbackRate: 0,
  term: '',
  rights: '',
  status: 'enable',
  maxUsers: 1,
  limit: 1
})

const open = (row?: VipProduct) => {
  visible.value = true
  form.value = row ? { ...row, price: row.price / 100 } : { ...form.value, _id: '' }
}

const emit = defineEmits(['success'])
const handleSubmit = async () => {
  if (form.value._id) {
    console.log('编辑')
    const upRes = await vipProductUpdateApi(
      form.value._id,
      form.value.levelText,
      form.value.price,
      form.value.discount,
      form.value.cashbackRate,
      form.value.term,
      form.value.rights,
      Number(form.value.maxUsers),
      Number(form.value.limit),
      form.value.status
    )
    console.log('更新', upRes)
    if (upRes.code === 200) ElMessage.success('更新成功')
  } else {
    const addRes = await vipProductListAddApi(
      form.value.levelText,
      form.value.price,
      form.value.discount,
      form.value.cashbackRate,
      form.value.term,
      form.value.rights,
      Number(form.value.maxUsers),
      Number(form.value.limit),
      form.value.status
    )
    console.log('新增', addRes)
    if (addRes.code === 200) ElMessage.success('新增成功')
  }
  visible.value = false
  emit('success')
}

defineExpose({ open })
</script>

<template>
  <el-dialog v-model="visible" :title="form._id ? '编辑会员产品' : '新增会员产品'" width="480px">
    <el-form :model="form" label-width="100px">
      <el-form-item label="等级名称">
        <el-input v-model="form.levelText" />
      </el-form-item>
      <el-form-item label="售价">
        <el-input-number v-model="form.price" :min="0" />
      </el-form-item>
      <el-form-item label="折扣">
        <el-input-number v-model="form.discount" :min="0" :max="10" />
      </el-form-item>
      <el-form-item label="返现比例">
        <el-input-number v-model="form.cashbackRate" :min="0" :max="0.2" />
      </el-form-item>
      <el-form-item label="有效期">
        <el-input v-model="form.term" placeholder="如 365天 / 永久" />
      </el-form-item>
      <el-form-item label="权益说明">
        <el-input v-model="form.rights" placeholder="如 每月免费贴膜1次" />
      </el-form-item>
      <el-form-item label="共享人数">
        <el-input v-model="form.maxUsers" placeholder="绑定人数" />
      </el-form-item>
      <el-form-item label="每月限制">
        <el-input v-model="form.limit" placeholder="每月限制免费贴膜次数" />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="form.status" active-value="enable" inactive-value="disable" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button
        type="primary"
        @click="handleSubmit"
        style="background-color: #f89898; border: none"
        >保存</el-button
      >
    </template>
  </el-dialog>
</template>
