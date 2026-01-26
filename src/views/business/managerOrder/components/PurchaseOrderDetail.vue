<script setup lang="ts">
import { ref } from 'vue'
import type { DrawerProps } from 'element-plus'
import { formatAmount, formatOrderState, formatRole } from '@/utils'
import type { PurchaseItem } from '@/types/PurchaseOrder'

const orderData = ref<PurchaseItem>()

// Emits
const emit = defineEmits(['confirm'])

// 抽屉状态
const drawer = ref(false)
const direction = ref<DrawerProps['direction']>('rtl')

// 打开抽屉
const open = (row: PurchaseItem) => {
  drawer.value = true
  orderData.value = row
}

// 关闭抽屉
const close = () => {
  drawer.value = false
}

// 抽屉关闭前的回调
const handleClose = (done: () => void) => {
  done()
}

// 确认发货
const handleConfirmShipment = () => {
  if (!orderData.value) {
    return
  }

  // 校验通过，触发确认事件
  emit('confirm', orderData.value)
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
    title="订单详情"
    :direction="direction"
    :before-close="handleClose"
    size="680px"
    class="order-detail-drawer"
  >
    <div v-if="orderData" class="order-detail-container">
      <!-- 订单基本信息 -->
      <div class="info-section">
        <div class="section-title">订单信息</div>
        <div class="info-row">
          <span class="info-label">业务订单号：</span>
          <span class="info-value">{{ orderData.out_trade_no }}</span>
        </div>

        <div class="info-row">
          <span class="info-label">订单状态：</span>
          <el-tag :type="orderData.status === 'PAID' ? 'warning' : 'success'">
            {{ formatOrderState(orderData.status) }}
          </el-tag>
        </div>
        <div class="info-row">
          <span class="info-label">下单时间：</span>
          <span class="info-value">{{ orderData.createdAt }}</span>
        </div>
      </div>

      <!-- 商品列表 -->
      <div class="info-section">
        <div class="section-title">商品信息</div>
        <div class="product-list">
          <div v-for="product in orderData.products" :key="product._id" class="product-item">
            <div class="product-image">
              <el-image :src="product.cover" fit="cover" />
            </div>
            <div class="product-info">
              <div class="product-name">{{ product.name }}</div>
              <div class="product-desc">货号：{{ product.skuNo }}</div>
              <div v-if="product.sku && product.sku.attrs" class="product-sku">
                <span class="sku-attr">
                  {{ product.sku.attrs.label }}：{{ product.sku.attrs.value }}
                </span>
              </div>
              <div class="product-price-quantity">
                <div class="price-info">
                  <span class="current-price">¥{{ formatAmount(product.currentPrice) }}</span>
                  <span
                    v-if="product.originalPrice !== product.currentPrice"
                    class="original-price"
                  >
                    ¥{{ formatAmount(product.originalPrice) }}
                  </span>
                </div>
                <div class="quantity-info">x{{ product.quantity }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="total-count">共 {{ orderData.totalCount }} 件商品</div>
      </div>

      <!-- 订单金额 -->
      <div class="info-section">
        <div class="section-title">订单金额</div>
        <div class="amount-info">
          <div class="amount-row">
            <span class="amount-label">商品总金额：</span>
            <span class="amount-value">¥{{ formatAmount(orderData.amount.totalPrice) }}</span>
          </div>
          <div class="amount-row">
            <span class="amount-label">积分抵扣：</span>
            <span class="amount-value discount">
              -¥{{ formatAmount(orderData.amount.deductAmount) }} ({{
                formatAmount(orderData.amount.usedScore ?? 0)
              }}
              积分)
            </span>
          </div>
          <div class="amount-row total">
            <span class="amount-label">实际支付金额：</span>
            <span class="amount-value actual">
              ¥{{ formatAmount(orderData.amount.actualPayment) }}
            </span>
          </div>
        </div>
      </div>

      <!-- 用户信息 -->
      <div class="info-section">
        <div class="section-title">用户信息</div>
        <div class="user-info">
          <div class="info-row">
            <span class="info-label">用户昵称：</span>
            <span class="info-value">{{ orderData.userInfo.nickname }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">联系电话：</span>
            <span class="info-value">{{ orderData.userInfo.mobile }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">用户角色：</span>
            <el-tag size="small">{{ formatRole(orderData.userInfo.role) }}</el-tag>
          </div>
        </div>
      </div>

      <!-- 备注信息 -->
      <div v-if="orderData.remark" class="info-section">
        <div class="section-title">订单备注</div>
        <div class="remark-content">
          {{ orderData.remark }}
        </div>
      </div>
    </div>

    <!-- 底部操作按钮 -->
    <template #footer>
      <div class="drawer-footer">
        <el-button @click="close">取消</el-button>
        <el-button v-if="orderData?.status === 'PAID'" type="danger" @click="handleConfirmShipment">
          发货
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss">
// 订单详情抽屉样式
.order-detail-container {
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
      border-left: 4px solid $jel-brandColor;
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

        .el-image {
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

        .product-name {
          font-size: 15px;
          font-weight: 500;
          color: #303133;
          margin-bottom: 4px;
          word-break: break-all;
          word-wrap: break-word;
          line-height: 1.5;
        }

        .product-desc {
          font-size: 13px;
          color: #909399;
          margin-bottom: 6px;
          word-break: break-all;
          word-wrap: break-word;
          line-height: 1.5;
        }

        .product-sku {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 8px;

          .sku-attr {
            padding: 2px 8px;
            background: #f0f0f0;
            border-radius: 4px;
            font-size: 12px;
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
              color: $jel-brandColor;
              white-space: nowrap;
            }

            .original-price {
              font-size: 13px;
              color: #909399;
              text-decoration: line-through;
              white-space: nowrap;
            }
          }

          .quantity-info {
            font-size: 14px;
            color: #606266;
            white-space: nowrap;
          }
        }
      }
    }
  }

  .total-count {
    text-align: right;
    padding-top: 12px;
    color: #606266;
    font-size: 14px;
    border-top: 1px dashed #dcdfe6;
    margin-top: 12px;
  }

  // 订单金额样式
  .amount-info {
    background: #fff;
    padding: 12px;
    border-radius: 6px;

    .amount-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      font-size: 14px;

      &:last-child {
        margin-bottom: 0;
      }

      .amount-label {
        color: #606266;
      }

      .amount-value {
        font-weight: 500;
        color: #303133;

        &.discount {
          color: #67c23a;
        }

        &.actual {
          font-size: 18px;
          font-weight: 600;
          color: $jel-brandColor;
        }
      }

      &.total {
        padding-top: 12px;
        border-top: 1px dashed #dcdfe6;
        margin-top: 4px;
      }
    }
  }

  // 用户信息样式
  .user-info {
    background: #fff;
    padding: 12px;
    border-radius: 6px;
  }

  // 备注样式
  .remark-content {
    background: #fff;
    padding: 12px;
    border-radius: 6px;
    color: #606266;
    font-size: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-all;
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
:deep(.order-detail-drawer) {
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
