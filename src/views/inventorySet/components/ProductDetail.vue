<script setup lang="ts">
import { ref } from 'vue'
import type { DrawerProps } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'
import type {
  InventoryPackage,
  PackageDetailData,
  PackageProductDetail
} from '@/types/InventoryPackage'
import { inventoryPackageProductDetailApi } from '@/api/inventoryPackage.ts'

const packageData = ref<PackageDetailData>({
  desc: '',
  items: [],
  name: '',
  status: 'ENABLE'
})

// 抽屉状态
const drawer = ref(false)
const direction = ref<DrawerProps['direction']>('rtl')

// 打开抽屉
const open = async (row: InventoryPackage) => {
  drawer.value = true
  packageData.value.name = row.name
  packageData.value.desc = row.desc
  packageData.value.status = row.status
  const res = await inventoryPackageProductDetailApi(row.items)
  packageData.value.items = res.data
}

// 关闭抽屉
const close = () => {
  drawer.value = false
}

// 抽屉关闭前的回调
const handleClose = (done: () => void) => {
  done()
}

// 暴露方法给父组件
defineExpose({
  open,
  close
})
</script>

<template>
  <el-drawer
    v-model="drawer"
    title="套餐商品列表"
    :direction="direction"
    :before-close="handleClose"
    size="680px"
    class="package-detail-drawer"
  >
    <div v-if="packageData" class="package-detail-container">
      <!-- 套餐基本信息 -->
      <div class="info-section">
        <div class="section-title">套餐信息</div>
        <div class="info-row">
          <span class="info-label">套餐名称：</span>
          <span class="info-value">{{ packageData.name }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">套餐说明：</span>
          <span class="info-value">{{ packageData.desc }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">套餐状态：</span>
          <el-tag :type="packageData.status === 'ENABLE' ? 'success' : 'info'">
            {{ packageData.status === 'ENABLE' ? '启用' : '停用' }}
          </el-tag>
        </div>
      </div>

      <!-- 商品列表 -->
      <div class="info-section">
        <div class="section-title">商品列表</div>
        <div v-if="packageData.items && packageData.items.length > 0" class="product-list">
          <div
            v-for="(product, index) in packageData.items"
            :key="product.product_id || index"
            class="product-item"
          >
            <div class="product-image">
              <el-image :src="product.cover" fit="cover">
                <template #error>
                  <div class="image-placeholder">
                    <el-icon :size="40" color="#c0c4cc">
                      <Picture />
                    </el-icon>
                  </div>
                </template>
              </el-image>
            </div>
            <div class="product-info">
              <div class="product-name-wrapper">
                <div class="product-name">
                  {{ product.name || '商品名称待加载' }}
                </div>
                <div v-if="product.skus?.attrs?.value" class="product-sku-tag">
                  {{ product.skus.attrs.value }}
                </div>
              </div>
              <div class="product-meta">
                <span v-if="product.skuNo" class="meta-item">货号：{{ product.skuNo }}</span>
                <span v-if="product.skus?.attrs" class="meta-item sku-spec">
                  {{ product.skus.attrs.label }}：{{ product.skus.attrs.value }}
                </span>
              </div>
              <div v-if="product.remark" class="product-remark">
                <span class="remark-label">备注：</span>
                <span class="remark-text">{{ product.remark }}</span>
              </div>
              <div class="product-price-quantity">
                <div class="price-info">
                  <span class="current-price">
                    ¥{{ (product.skus?.price || product.currentPrice).toFixed(2) }}
                  </span>
                </div>
                <div class="quantity-info">单位/片：{{ product.quantity }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty-product">
          <el-empty description="暂无商品数据" />
        </div>
        <div v-if="packageData.items && packageData.items.length > 0" class="total-count">
          共 {{ packageData.items.length }} 个商品，总库存
          {{
            packageData.items.reduce(
              (sum: number, item: PackageProductDetail) => sum + item.quantity,
              0
            )
          }}
          件
        </div>
      </div>
    </div>

    <!-- 底部操作按钮 -->
    <template #footer>
      <div class="drawer-footer">
        <el-button type="danger" @click="close">关闭</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss">
// 套餐详情抽屉样式
.package-detail-container {
  padding: 0 4px;

  .info-section {
    margin-bottom: 24px;
    background: #f8f9fa;
    border-radius: 8px;
    padding: 16px;

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 16px;
      padding-left: 12px;
      border-left: 4px solid #f56c6c;
      line-height: 1.4;
    }

    .info-row {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      line-height: 1.6;

      &:last-child {
        margin-bottom: 0;
      }

      .info-label {
        min-width: 110px;
        color: #606266;
        font-size: 14px;
      }

      .info-value {
        flex: 1;
        color: #303133;
        font-size: 14px;
        word-break: break-all;
      }
    }
  }

  // 商品列表样式
  .product-list {
    .product-item {
      display: flex;
      gap: 12px;
      padding: 12px;
      background: #fff;
      border-radius: 8px;
      margin-bottom: 12px;
      border: 1px solid #ebeef5;
      transition: all 0.3s;
      min-height: 120px;
      align-items: stretch;

      &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        border-color: #f56c6c;
      }

      &:last-child {
        margin-bottom: 0;
      }

      .product-image {
        width: 100px;
        height: 100px;
        border-radius: 6px;
        overflow: hidden;
        flex-shrink: 0;
        background: #f5f7fa;
        display: flex;
        align-items: center;
        justify-content: center;

        .el-image {
          width: 100%;
          height: 100%;
        }

        .image-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
      }

      .product-info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .product-name-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
          flex-wrap: wrap;

          .product-name {
            font-size: 15px;
            font-weight: 500;
            color: #303133;
            word-break: break-all;
            word-wrap: break-word;
            line-height: 1.5;
          }

          .product-sku-tag {
            padding: 2px 10px;
            background: linear-gradient(135deg, #fef0f0 0%, #fde2e2 100%);
            border: 1px solid #f56c6c;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            color: #f56c6c;
            white-space: nowrap;
            flex-shrink: 0;
          }
        }

        .product-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 8px;
          font-size: 13px;
          line-height: 1.5;

          .meta-item {
            color: #909399;
            word-break: break-all;
            word-wrap: break-word;

            &.sku-spec {
              color: #606266;
              font-weight: 500;
              padding: 1px 8px;
              background: #f5f7fa;
              border-radius: 4px;
            }
          }
        }

        .product-remark {
          display: flex;
          margin-bottom: 8px;
          font-size: 13px;
          line-height: 1.5;

          .remark-label {
            color: #909399;
            flex-shrink: 0;
          }

          .remark-text {
            color: #606266;
            word-break: break-all;
            word-wrap: break-word;
          }
        }

        .product-price-quantity {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;

          .price-info {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;

            .current-price {
              font-size: 16px;
              font-weight: 600;
              color: #f56c6c;
              white-space: nowrap;
            }
          }

          .quantity-info {
            font-size: 14px;
            font-weight: 500;
            color: #606266;
            white-space: nowrap;
            background: #f0f2f5;
            padding: 2px 12px;
            border-radius: 4px;
          }
        }
      }
    }
  }

  .empty-product {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
  }

  .total-count {
    text-align: right;
    padding-top: 12px;
    color: #606266;
    font-size: 14px;
    font-weight: 500;
    border-top: 1px dashed #dcdfe6;
    margin-top: 12px;
  }
}

// 抽屉底部按钮
.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #ebeef5;
}

// 自定义抽屉样式
:deep(.package-detail-drawer) {
  .el-drawer__header {
    margin-bottom: 16px;
    padding: 20px;
    border-bottom: 1px solid #ebeef5;

    .el-drawer__title {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
    }
  }

  .el-drawer__body {
    padding: 20px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #dcdfe6;
      border-radius: 3px;

      &:hover {
        background-color: #c0c4cc;
      }
    }
  }

  .el-drawer__footer {
    padding: 0;
  }
}
</style>
