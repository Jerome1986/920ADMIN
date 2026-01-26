<script setup lang="ts">
import { ref, nextTick, useTemplateRef } from 'vue'
import type { InventoryPackage, PackageForm } from '@/types/InventoryPackage'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import SelectedProduct from '@/views/inventorySet/components/SelectedProduct.vue'
import { inventoryPackageAddApi, inventoryPackageUpdateApi } from '@/api/inventoryPackage.ts'

defineOptions({
  name: 'PackageChannel'
})

// 对话框可见与标题
const dialogVisible = ref(false)
const dialogTitle = ref('新增套餐')

const selectedRef = useTemplateRef('selectedRef')

// 待回填的商品ID列表（用于对话框打开后设置表格选中状态）
const pendingSelectedProductIds = ref<string[]>([])

const formRef = ref<FormInstance>()
const formData = ref<PackageForm>({
  _id: '',
  name: '',
  desc: '',
  status: 'ENABLE',
  items: []
})

// 表单验证规则
const rules: FormRules = {
  name: [{ required: true, message: '请输入套餐名称', trigger: 'blur' }],
  desc: [{ required: true, message: '请输入套餐说明', trigger: 'blur' }],
  status: [{ required: true, message: '请选择套餐状态', trigger: 'change' }]
}

// 打开对话框
const open = async (data?: InventoryPackage) => {
  dialogVisible.value = true

  const isEdit = !!data?._id
  dialogTitle.value = isEdit ? '编辑套餐' : '新增套餐'

  // 等待商品列表加载完成
  await selectedRef.value?.waitForProductList()

  if (data) {
    formData.value = {
      _id: data._id,
      name: data.name,
      desc: data.desc,
      status: data.status,
      items: data.items
    }

    // 回填已选商品
    const selectedProductIds = data.items.map((item) => item.product_id)
    selectedRef.value?.setSelectedProductIds(selectedProductIds)

    // 回填商品数量和 SKU
    selectedRef.value?.resetProductQuantities()
    selectedRef.value?.resetSelectedSkuIds()
    data.items.forEach((item) => {
      selectedRef.value?.setProductQuantities(item.product_id, item.quantity)
      if (item.sku_id) {
        selectedRef.value?.setSelectedSkuId(item.product_id, item.sku_id)
      }
    })

    // 保存待回填的商品ID列表，在对话框打开后再设置表格选中状态
    pendingSelectedProductIds.value = selectedProductIds
  } else {
    formData.value = {
      name: '',
      desc: '',
      status: 'ENABLE',
      items: []
    }

    selectedRef.value?.reset()
    pendingSelectedProductIds.value = []
  }
  // 重置搜索
  selectedRef.value?.resetSearchKeyword()
}

// 对话框打开完成后的回调（此时表格已完全渲染）
const handleDialogOpened = () => {
  if (pendingSelectedProductIds.value.length > 0) {
    // 使用 nextTick 确保表格数据已渲染
    nextTick(() => {
      selectedRef.value?.setTableSelection(pendingSelectedProductIds.value)
    })
  } else {
    // 新增模式，清空表格选中状态
    nextTick(() => {
      selectedRef.value?.clearTableSelection()
    })
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
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    // 校验是否选择了商品
    if (selectedRef.value?.selectedProductIds.length === 0) {
      ElMessage.warning('请至少选择一个商品')
      return
    }

    // 校验商品数量
    const hasInvalidQuantity = selectedRef.value?.selectedProductIds.some((productId) => {
      const quantity = selectedRef.value?.productQuantities[productId]
      return !quantity || quantity <= 0
    })

    if (hasInvalidQuantity) {
      ElMessage.warning('请为所有选中的商品填写有效数量')
      return
    }

    // 校验 SKU 选择
    const hasInvalidSku = selectedRef.value?.selectedProductIds.some((productId) => {
      const product = selectedRef.value?.productList.find((p) => p._id === productId)
      if (product?.skus && product.skus.length > 0) {
        const skuId = selectedRef.value?.selectedSkuIds[productId]
        return !skuId
      }
      return false
    })

    if (hasInvalidSku) {
      ElMessage.warning('请为所有有规格的商品选择对应的规格')
      return
    }

    // 将选中的商品ID、SKU ID和数量转换为items格式
    formData.value.items = selectedRef.value!.selectedProductIds.map((productId) => ({
      product_id: productId,
      sku_id: selectedRef.value?.selectedSkuIds[productId] || '',
      quantity: selectedRef.value?.productQuantities[productId] || 1,
      unit_count: selectedRef.value?.unit_count,
      price: selectedRef.value?.price
    }))

    console.log('提交套餐：', formData.value)
    // 调用接口提交数据
    // 这里需要根据 formData.value._id 判断是新增还是编辑
    if (formData.value._id) {
      // 编辑
      await inventoryPackageUpdateApi(
        formData.value._id,
        formData.value.name,
        formData.value.desc,
        formData.value.status,
        formData.value.items
      )

      ElMessage.success('编辑成功')
    } else {
      // 新增
      const res = await inventoryPackageAddApi(
        formData.value.name,
        formData.value.desc,
        formData.value.status,
        formData.value.items
      )
      if (res.code === 200) {
        ElMessage.success('新增成功')
      }
    }
    // 通知父组件刷新&&关闭弹窗
    dialogVisible.value = false
    emits('success')
  } catch {
    ElMessage.warning('请完善表单信息')
  }
}
</script>

<template>
  <div class="proChannel">
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="900"
      @opened="handleDialogOpened"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
        style="padding-right: 30px"
      >
        <el-form-item label="套餐名称" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="例如：新手店长基础库存包"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="套餐说明" prop="desc">
          <el-input
            v-model="formData.desc"
            type="textarea"
            :rows="3"
            placeholder="请输入套餐说明，描述该套餐的适用场景"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="套餐状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio value="ENABLE">启用</el-radio>
            <el-radio value="DISABLE">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 商品列表组件  -->
        <SelectedProduct ref="selectedRef"></SelectedProduct>
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
  :deep(.el-dialog__body) {
    padding-bottom: 10px;
  }

  // 单选框样式
  :deep(.el-radio) {
    .el-radio__input {
      &.is-checked {
        .el-radio__inner {
          background-color: #f56c6c;
          border-color: #f56c6c;
        }
      }

      .el-radio__inner:hover {
        border-color: #f56c6c;
      }
    }

    &.is-checked {
      .el-radio__label {
        color: #f56c6c;
      }
    }
  }

  // 表格中的复选框样式
  :deep(.el-table) {
    // 表头和表体复选框通用样式
    .el-checkbox {
      .el-checkbox__inner {
        background-color: #fafafa !important;
        border-color: #d62731 !important;
      }

      .el-checkbox__inner:hover {
        border-color: #f56c6c !important;
      }

      &.is-checked .el-checkbox__inner {
        background-color: #f56c6c !important;
        border-color: #f56c6c !important;
      }

      &.is-indeterminate .el-checkbox__inner {
        background-color: #f56c6c !important;
        border-color: #f56c6c !important;
      }

      &span .el-checkbox__inner {
        background-color: #f56c6c !important;
        border-color: #f56c6c !important;
      }
    }

    // 数量输入框样式
    .el-input-number {
      .el-input__wrapper {
        &.is-focus {
          box-shadow: 0 0 0 1px #f56c6c inset !important;
        }
      }

      .el-input-number__decrease,
      .el-input-number__increase {
        &:hover {
          color: #f56c6c;
        }
      }
    }
  }
}

// 商品选择容器样式
.product-select-container {
  width: 100%;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;

  .search-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;

    .el-input {
      flex: 1;

      :deep(.el-input__wrapper) {
        &.is-focus {
          box-shadow: 0 0 0 1px #f56c6c inset;
        }
      }
    }

    .selected-count {
      color: #606266;
      font-size: 14px;
      white-space: nowrap;

      .count {
        color: #f56c6c;
        font-weight: 600;
        font-size: 16px;
      }
    }
  }

  .product-list {
    :deep(.el-table) {
      border-radius: 0;

      .el-table__body-wrapper {
        &::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        &::-webkit-scrollbar-thumb {
          background: #dcdfe6;
          border-radius: 3px;

          &:hover {
            background: #c0c4cc;
          }
        }
      }

      th {
        background: #fafafa;
        color: #606266;
        font-weight: 600;
      }

      td {
        padding: 12px 0;
      }

      // 表格行样式
      .el-table__row {
        transition: background-color 0.2s ease;

        &:hover {
          background-color: #f5f7fa;
        }

        // 选中行样式
        &.current-row {
          td.el-table__cell {
            background-color: rgba(245, 108, 108, 0.05);
          }
        }
      }
    }
  }

  .empty-result {
    padding: 40px 20px;
    text-align: center;
  }
}
</style>
