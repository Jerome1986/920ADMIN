<script setup lang="ts">
import { ref } from 'vue'
import type { DrawerProps } from 'element-plus'
import { Picture, Warning } from '@element-plus/icons-vue'
import type { StoreInventoryGetResult, StoreItem } from '@/types/StoreItem'
import { storeGetInventoryApi } from '@/api/store.ts'

// 抽屉状态
const drawer = ref(false)
const direction = ref<DrawerProps['direction']>('rtl')

// 门店信息
const storeInfo = ref<StoreItem>({
  _id: '',
  address: '',
  inventory_config: false,
  managerId: '',
  managerName: '',
  operating_balance: 0,
  parentStoreId: '',
  parentStoreId2: '',
  phone: '',
  qrCodeUrl: '',
  settle_balance: 0,
  status: 'active',
  storeId: '',
  storeLogo: '',
  storeName: ''
})

// 库存商品列表
const inventoryList = ref<StoreInventoryGetResult[]>([])

// 打开抽屉
const open = async (store?: StoreItem) => {
  console.log('open', store)
  drawer.value = true

  if (store) {
    storeInfo.value = store
  }

  if (store?.storeId) {
    const res = await storeGetInventoryApi(store.storeId)
    console.log('res', res)
    inventoryList.value = res.data
  }
}

// 关闭抽屉
const close = () => {
  drawer.value = false
}

// 抽屉关闭前的回调
const handleClose = (done: () => void) => {
  done()
}

// 计算总数量/片
const getTotalUnitCount = () => {
  return inventoryList.value.reduce((sum, item) => sum + (item.unit_count || 0), 0)
}

// 计算库存价值总和（所有商品的进货单价 × 数量）
const getTotalInventoryValue = () => {
  return inventoryList.value.reduce((sum, item) => {
    return sum + item.currentPrice * item.unit_count
  }, 0)
}

// 判断库存是否低于预警线（≤5片）
const isLowStock = (unitCount: number) => {
  return unitCount <= 5
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
    title="门店库存列表"
    :direction="direction"
    :before-close="handleClose"
    size="720px"
    class="store-inventory-drawer"
  >
    <div class="inventory-container">
      <!-- 门店信息 -->
      <div class="info-section">
        <div class="section-title">门店信息</div>
        <div class="store-info-grid">
          <div class="info-item">
            <span class="info-label">门店名称：</span>
            <span class="info-value">{{ storeInfo.storeName }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">店长姓名：</span>
            <span class="info-value">{{ storeInfo.managerName }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">联系电话：</span>
            <span class="info-value">{{ storeInfo.phone }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">门店状态：</span>
            <el-tag :type="storeInfo.status === 'active' ? 'success' : 'info'" size="small">
              {{ storeInfo.status === 'active' ? '营业中' : '已关闭' }}
            </el-tag>
          </div>
          <div class="info-item full-width">
            <span class="info-label">门店地址：</span>
            <span class="info-value">{{ storeInfo.address }}</span>
          </div>
        </div>
      </div>

      <!-- 库存统计 -->
      <div class="stats-section">
        <div class="stat-card">
          <div class="stat-label">总单位数量</div>
          <div class="stat-value">{{ getTotalUnitCount() }}</div>
          <div class="stat-unit">片</div>
        </div>
        <div class="stat-card value-card">
          <div class="stat-label">市场价值总和</div>
          <div class="stat-value">¥{{ getTotalInventoryValue().toFixed(2) }}</div>
          <div class="stat-unit">进货成本</div>
        </div>
      </div>

      <!-- 库存商品列表 -->
      <div class="info-section">
        <div class="section-title">库存商品明细</div>
        <div v-if="inventoryList.length > 0" class="inventory-list">
          <div
            v-for="(item, index) in inventoryList"
            :key="item.product_id || index"
            class="inventory-item"
            :class="{ 'low-stock-warning': isLowStock(item.unit_count) }"
          >
            <div class="product-image">
              <el-image :src="item.productCover" fit="cover">
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
                <el-tooltip
                  :content="item.productName"
                  placement="top"
                  effect="dark"
                  :show-after="300"
                >
                  <div class="product-name">{{ item.productName }}</div>
                </el-tooltip>
                <el-tag v-if="isLowStock(item.unit_count)" type="danger" size="small" effect="dark">
                  <el-icon :size="12" style="vertical-align: middle; margin-right: 2px">
                    <Warning />
                  </el-icon>
                  库存预警
                </el-tag>
              </div>

              <div class="product-stats">
                <div class="stat-item">
                  <span class="stat-label">零售价：</span>
                  <span class="stat-retail">¥{{ item.currentPrice.toFixed(2) }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">库存单位(片)：</span>
                  <span class="stat-unit" :class="{ 'low-stock': isLowStock(item.unit_count) }">
                    {{ item.unit_count || 0 }} 片
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty-inventory">
          <el-empty description="暂无库存数据" />
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
// 库存抽屉样式
.inventory-container {
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

    // 门店信息网格布局
    .store-info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;

      .info-item {
        display: flex;
        align-items: center;
        line-height: 1.6;

        &.full-width {
          grid-column: 1 / -1;
        }

        .info-label {
          min-width: 80px;
          color: #606266;
          font-size: 14px;
          flex-shrink: 0;
        }

        .info-value {
          flex: 1;
          color: #303133;
          font-size: 14px;
          word-break: break-all;
        }
      }
    }
  }

  // 统计卡片区域
  .stats-section {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 24px;

    .stat-card {
      background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
      border: 1px solid #ffd4d4;
      border-radius: 8px;
      padding: 24px;
      text-align: center;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(245, 108, 108, 0.15);
      }

      .stat-label {
        font-size: 14px;
        color: #909399;
        margin-bottom: 10px;
        font-weight: 500;
      }

      .stat-value {
        font-size: 32px;
        font-weight: 700;
        color: #f56c6c;
        line-height: 1.2;
        margin-bottom: 6px;
      }

      .stat-unit {
        font-size: 13px;
        color: #606266;
      }

      // 库存价值卡片特殊样式
      &.value-card {
        background: linear-gradient(135deg, #fff9f0 0%, #fff0e0 100%);
        border: 1px solid #ffd4a0;

        .stat-value {
          color: #e6a23c;
          font-size: 30px;
        }

        &:hover {
          box-shadow: 0 4px 12px rgba(230, 162, 60, 0.15);
        }
      }
    }
  }

  // 库存商品列表样式
  .inventory-list {
    .inventory-item {
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

      // 低库存预警样式
      &.low-stock-warning {
        border-color: #f56c6c;
        background: linear-gradient(to right, #fff, #fff5f5);
        box-shadow: 0 0 0 1px rgba(245, 108, 108, 0.1);

        &:hover {
          border-color: #f56c6c;
          box-shadow: 0 2px 12px rgba(245, 108, 108, 0.25);
        }
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
            @include ellipsis(2);
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

        .product-stats {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;

          .stat-item {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 13px;

            .stat-label {
              color: #909399;
            }

            .stat-price {
              color: #e6a23c;
              font-weight: 600;
              font-size: 14px;
            }

            .stat-retail {
              color: #f56c6c;
              font-weight: 600;
              font-size: 14px;
            }

            .stat-stock {
              color: #67c23a;
              font-weight: 600;
            }

            .stat-unit {
              color: #409eff;
              font-weight: 600;

              // 低库存预警样式
              &.low-stock {
                color: #f56c6c !important;
                font-weight: 700;
                animation: pulse 2s ease-in-out infinite;
              }
            }
          }
        }
      }
    }
  }

  .empty-inventory {
    background: #fff;
    border-radius: 8px;
    padding: 40px 20px;
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
:deep(.store-inventory-drawer) {
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

// 低库存预警脉冲动画
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.6;
  }
}
</style>
