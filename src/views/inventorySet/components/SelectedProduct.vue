<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import type { ProductItem } from '@/types/ProductItem'
import { productTobAllGetApi } from '@/api/product.ts'
import type { TableInstance } from 'element-plus'

// 商品列表数据
const productList = ref<ProductItem[]>([])
const isLoading = ref(false)
let productLoadPromise: Promise<void> | null = null

const productGet = async () => {
  isLoading.value = true
  try {
    const res = await productTobAllGetApi()
    productList.value = res.data
  } finally {
    isLoading.value = false
  }
}

// 保存加载 Promise，用于等待
productLoadPromise = productGet()

// 表格 ref
const productTableRef = ref<TableInstance>()

// 已选中的商品ID列表
const selectedProductIds = ref<string[]>([])

// 商品数量映射 { product_id: quantity }
const productQuantities = ref<Record<string, number>>({})

// SKU 选择映射 { product_id: sku_id }
const selectedSkuIds = ref<Record<string, string>>({})

// 搜索商品
const searchKeyword = ref('')
const filteredProductList = computed(() => {
  if (!searchKeyword.value) {
    return productList.value
  }
  return productList.value.filter((product) =>
    product.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

// 处理商品选择变化
const handleSelectionChange = (selection: ProductItem[]) => {
  console.log('选择了')
  const newSelectedIds = selection.map((item) => item._id || '')

  // 为新选中的商品设置默认数量和默认SKU
  newSelectedIds.forEach((id) => {
    if (!productQuantities.value[id]) {
      productQuantities.value[id] = 1
    }

    // 自动选择第一个 SKU
    if (!selectedSkuIds.value[id]) {
      const product = productList.value.find((p) => p._id === id)
      if (product?.skus && product.skus.length > 0 && product.skus[0]) {
        selectedSkuIds.value[id] = product.skus[0]._id || ''
      }
    }
  })

  selectedProductIds.value = newSelectedIds
}

// 获取选中 SKU 的价格
const price = ref(0)
const getSelectedSkuPrice = (product: ProductItem) => {
  const skuId = selectedSkuIds.value[product._id || '']
  if (!skuId || !product.skus || product.skus.length === 0) {
    return product.minPrice || product.currentPrice || 0
  }
  const sku = product.skus.find((s) => s._id === skuId)
  price.value = sku?.price || 0
  return sku?.price || product.minPrice || product.currentPrice || 0
}

// 获取选中 SKU 对应的单位数量
const unit_count = ref(0)
const getSelectedSkuUnitCount = (product?: ProductItem): number => {
  if (!product?._id) return 0

  const skuId = selectedSkuIds.value[product._id]
  if (!skuId) return 0

  const skus = product.skus
  if (!Array.isArray(skus) || skus.length === 0) return 0

  const sku = skus.find((s) => s._id === skuId)
  if (!sku?.unit_count) return 0

  const quantity = productQuantities.value[product._id] ?? 0
  unit_count.value = sku.unit_count * quantity
  return sku.unit_count * quantity
}

// 设置已选择的商品函数
const setSelectedProductIds = (val: string[]) => {
  selectedProductIds.value = val
}

// 重置商品数量
const resetProductQuantities = () => {
  productQuantities.value = {}
}

// 回填商品数量
const setProductQuantities = (id: string, quantity: number) => {
  productQuantities.value[id] = quantity
}

// 设置 SKU ID
const setSelectedSkuId = (productId: string, skuId: string) => {
  selectedSkuIds.value[productId] = skuId
}

// 重置 SKU 选择
const resetSelectedSkuIds = () => {
  selectedSkuIds.value = {}
}

// 重置所有值
const reset = () => {
  selectedProductIds.value = []
  productQuantities.value = {}
  selectedSkuIds.value = {}
}

// 重置搜索
const resetSearchKeyword = () => {
  searchKeyword.value = ''
}

// 设置表格选中状态（用于编辑时回填）
const setTableSelection = (productIds: string[]) => {
  if (!productTableRef.value) return

  productTableRef.value.clearSelection()
  productIds.forEach((productId) => {
    const product = productList.value.find((p) => p._id === productId)
    if (product && productTableRef.value) {
      productTableRef.value.toggleRowSelection(product, true)
    }
  })
}

// 清空表格选中状态
const clearTableSelection = () => {
  if (productTableRef.value) {
    productTableRef.value.clearSelection()
  }
}

// 等待商品列表加载完成
const waitForProductList = async () => {
  // 如果加载 Promise 存在，等待它完成
  if (productLoadPromise) {
    await productLoadPromise
    // 确保数据已经赋值
    await new Promise((resolve) => setTimeout(resolve, 50))
  }

  // 如果数据还是空的，等待 loading 完成
  if (productList.value.length === 0 && isLoading.value) {
    while (isLoading.value) {
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
}

defineExpose({
  selectedProductIds,
  productQuantities,
  selectedSkuIds,
  productList,
  isLoading,
  setSelectedProductIds,
  resetProductQuantities,
  setProductQuantities,
  setSelectedSkuId,
  unit_count,
  price,
  resetSelectedSkuIds,
  reset,
  resetSearchKeyword,
  setTableSelection,
  clearTableSelection,
  waitForProductList
})
</script>

<template>
  <!-- 选择商品 -->
  <el-form-item label="选择商品">
    <div class="product-select-container">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索商品名称"
          clearable
          :prefix-icon="Search"
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
                v-model="selectedSkuIds[row._id]"
                placeholder="请选择规格"
                size="small"
                style="width: 120px"
              >
                <el-option
                  v-for="sku in row.skus"
                  :key="sku._id"
                  :value="sku._id"
                  :label="sku.attrs.value"
                >
                  <div style="display: flex; justify-content: space-between; align-items: center">
                    <span>{{ sku.attrs.value }}</span>
                    <span style="color: #f56c6c; font-size: 12px">¥{{ sku.price }}</span>
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
                v-model="productQuantities[row._id]"
                :min="1"
                :max="9999"
                :step="1"
                size="small"
                controls-position="right"
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
