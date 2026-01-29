<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import type { ProductItem } from '@/types/ProductItem'
import { productTobAllGetApi } from '@/api/product.ts'
import type { TableInstance } from 'element-plus'
import { formatAmount } from '@/utils'

// Props 定义
interface Props {
  selectedProductIds: string[]
  productQuantities: Record<string, number>
  selectedSkuIds: Record<string, string>
  searchKeyword: string
}

const props = withDefaults(defineProps<Props>(), {
  selectedProductIds: () => [],
  productQuantities: () => ({}),
  selectedSkuIds: () => ({}),
  searchKeyword: ''
})

// Emits 定义
const emits = defineEmits<{
  'update:selectedProductIds': [value: string[]]
  'update:productQuantities': [value: Record<string, number>]
  'update:selectedSkuIds': [value: Record<string, string>]
  'update:searchKeyword': [value: string]
  selectionChange: [selection: ProductItem[]]
  quantityChange: [productId: string, quantity: number]
  skuChange: [productId: string, skuId: string]
  searchChange: [keyword: string]
}>()

// 商品列表数据
const productList = ref<ProductItem[]>([])
const isLoading = ref(false)

const productGet = async () => {
  isLoading.value = true
  try {
    const res = await productTobAllGetApi()
    productList.value = res.data
  } finally {
    isLoading.value = false
  }
}

onMounted(() => productGet())

// 表格 ref
const productTableRef = ref<TableInstance>()

// 标志：是否正在程序化更新选中状态
const isUpdatingSelection = ref(false)

// 搜索商品
const filteredProductList = computed(() => {
  if (!props.searchKeyword) {
    return productList.value
  }
  return productList.value.filter((product) =>
    product.name.toLowerCase().includes(props.searchKeyword.toLowerCase())
  )
})

// 处理商品选择变化
const handleSelectionChange = (selection: ProductItem[]) => {
  // 如果正在程序化更新选中状态，跳过以避免循环
  if (isUpdatingSelection.value) return

  const newSelectedIds = selection.map((item) => item._id || '')

  // 为新选中的商品设置默认数量和默认SKU
  const updatedQuantities = { ...props.productQuantities }
  const updatedSkuIds = { ...props.selectedSkuIds }

  newSelectedIds.forEach((id) => {
    if (!updatedQuantities[id]) {
      updatedQuantities[id] = 1
    }

    // 自动选择第一个 SKU
    if (!updatedSkuIds[id]) {
      const product = productList.value.find((p) => p._id === id)
      if (product?.skus && product.skus.length > 0 && product.skus[0]) {
        updatedSkuIds[id] = product.skus[0]._id || ''
      }
    }
  })

  // 更新父组件状态
  emits('update:selectedProductIds', newSelectedIds)
  emits('update:productQuantities', updatedQuantities)
  emits('update:selectedSkuIds', updatedSkuIds)
}

// 获取选中 SKU 的价格
const getSelectedSkuPrice = (product: ProductItem) => {
  const skuId = props.selectedSkuIds[product._id || '']
  if (!skuId || !product.skus || product.skus.length === 0) {
    return formatAmount(product.minPrice ?? 0) || formatAmount(product.currentPrice)
  }
  const sku = product.skus.find((s) => s._id === skuId)
  return (
    formatAmount(sku?.price ?? 0) ||
    formatAmount(product.minPrice ?? 0) ||
    formatAmount(product.currentPrice)
  )
}

// 获取选中 SKU 对应的单位数量
const getSelectedSkuUnitCount = (product?: ProductItem): number => {
  if (!product?._id) return 0

  const skuId = props.selectedSkuIds[product._id]
  if (!skuId) return 0

  const skus = product.skus
  if (!Array.isArray(skus) || skus.length === 0) return 0

  const sku = skus.find((s) => s._id === skuId)
  if (!sku?.unit_count) return 0

  const quantity = props.productQuantities[product._id] ?? 0
  return sku.unit_count * quantity
}

// 处理数量变化
const handleQuantityChange = (productId: string, quantity: number) => {
  const updatedQuantities = { ...props.productQuantities }
  updatedQuantities[productId] = quantity
  emits('update:productQuantities', updatedQuantities)
  emits('quantityChange', productId, quantity)
}

// 处理 SKU 变化
const handleSkuChange = (productId: string, skuId: string) => {
  const updatedSkuIds = { ...props.selectedSkuIds }
  updatedSkuIds[productId] = skuId
  emits('update:selectedSkuIds', updatedSkuIds)
  emits('skuChange', productId, skuId)
}

// 处理搜索变化
const handleSearchChange = (keyword: string) => {
  emits('update:searchKeyword', keyword)
  emits('searchChange', keyword)
}

// 更新表格选中状态的函数
const updateTableSelection = (selectedIds: string[]) => {
  if (!productTableRef.value || productList.value.length === 0) return

  // 设置标志，避免触发 selection-change 事件
  isUpdatingSelection.value = true

  try {
    productTableRef.value.clearSelection()
    selectedIds.forEach((productId) => {
      const product = productList.value.find((p) => p._id === productId)
      if (product) {
        productTableRef.value!.toggleRowSelection(product, true)
      }
    })
  } finally {
    // 重置标志
    isUpdatingSelection.value = false
  }
}

// 监听 props 变化，更新表格选中状态
watch(
  () => props.selectedProductIds,
  (newIds) => {
    updateTableSelection(newIds)
  },
  { immediate: true }
)

// 商品列表加载完成后，更新选中状态
watch(
  () => productList.value.length,
  (length) => {
    if (length > 0 && props.selectedProductIds.length > 0) {
      nextTick(() => {
        updateTableSelection(props.selectedProductIds)
      })
    }
  }
)

// 暴露给父组件的数据和方法
defineExpose({
  productList,
  isLoading,
  productGet
})
</script>

<template>
  <!-- 选择商品 -->
  <el-form-item label="选择商品">
    <div class="product-select-container">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-input
          :model-value="searchKeyword"
          placeholder="搜索商品名称"
          clearable
          :prefix-icon="Search"
          @update:model-value="handleSearchChange"
        />
        <div class="selected-count">
          已选择 <span class="count">{{ selectedProductIds.length }}</span> 个商品
        </div>
      </div>

      <!-- 商品列表 -->
      <div class="product-list">
        <el-table
          ref="productTableRef"
          :data="filteredProductList"
          @selection-change="handleSelectionChange"
          max-height="400"
          :row-key="(row: ProductItem) => row._id"
        >
          <el-table-column type="selection" width="55" :reserve-selection="true" />
          <el-table-column label="商品图片" width="100">
            <template #default="{ row }">
              <el-image
                :src="row.cover"
                fit="cover"
                style="width: 60px; height: 60px; border-radius: 4px"
              />
            </template>
          </el-table-column>
          <el-table-column label="货号" prop="skuNo" min-width="80" show-overflow-tooltip />
          <el-table-column label="选择规格" width="160" align="center">
            <template #default="{ row }">
              <el-select
                v-if="row.skus && row.skus.length > 0"
                :model-value="selectedSkuIds[row._id] || ''"
                placeholder="请选择规格"
                size="small"
                style="width: 120px"
                @change="(skuId: string) => handleSkuChange(row._id, skuId)"
              >
                <el-option
                  v-for="sku in row.skus"
                  :key="sku._id"
                  :value="sku._id"
                  :label="sku.attrs.value"
                >
                  <div style="display: flex; justify-content: space-between; align-items: center">
                    <span>{{ sku.attrs.value }}</span>
                    <span style="color: #f56c6c; font-size: 12px"
                      >¥{{ formatAmount(sku.price) }}</span
                    >
                  </div>
                </el-option>
              </el-select>
              <span v-else style="color: #909399; font-size: 12px">无规格</span>
            </template>
          </el-table-column>
          <el-table-column label="价格" width="80" align="center">
            <template #default="{ row }">
              <span style="color: #f56c6c; font-weight: 600">¥{{ getSelectedSkuPrice(row) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="数量" min-width="150" align="center">
            <template #default="{ row }">
              <el-input-number
                :model-value="productQuantities[row._id] || 1"
                :min="1"
                :max="9999"
                :step="1"
                size="small"
                controls-position="right"
                @change="(quantity: number) => handleQuantityChange(row._id, quantity)"
              />
            </template>
          </el-table-column>
          <el-table-column label="单位/片" width="100" align="center">
            <template #default="{ row }">
              <span style="color: #f56c6c; font-weight: 600">{{
                getSelectedSkuUnitCount(row)
              }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 提示信息 -->
      <div v-if="filteredProductList.length === 0" class="empty-result">
        <el-empty description="暂无匹配的商品" :image-size="60" />
      </div>
    </div>
  </el-form-item>
</template>

<style scoped lang="scss">
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

      // 复选框样式
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

      // SKU 选择框样式
      .el-select {
        .el-input__wrapper {
          &.is-focus {
            box-shadow: 0 0 0 1px #f56c6c inset !important;
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
