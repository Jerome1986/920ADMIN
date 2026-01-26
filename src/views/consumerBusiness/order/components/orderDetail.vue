<script setup lang="ts">
import { ref } from 'vue'
import type { ProductOrderItem } from '@/types/OrderItem.d.ts'
import type { DrawerProps } from 'element-plus'
import { formatOrderState, formatRole } from '@/utils'
import { InfoFilled, Box, Promotion, Document, Phone, CopyDocument } from '@element-plus/icons-vue'
import { expressList, validateLogistics } from '../config.ts'
import { ElMessage } from 'element-plus'

// Props
interface Props {
  orderData?: ProductOrderItem | null
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits(['confirm'])

// 抽屉状态
const drawer = ref(false)
const direction = ref<DrawerProps['direction']>('rtl')

// 打开抽屉
const open = () => {
  drawer.value = true
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
  if (!props.orderData) {
    return
  }

  // 物流信息校验
  const validateResult = validateLogistics(
    logistics_type.value,
    tracking_no.value,
    express_company.value
  )

  if (!validateResult.valid) {
    ElMessage.warning(validateResult.message || '物流信息填写不完整')
    return
  }

  // 校验通过，触发确认事件
  emit(
    'confirm',
    props.orderData,
    Number(logistics_type.value),
    tracking_no.value,
    express_company.value
  )
}

// 物流相关
const logistics_type = ref('1') // 物流模式：1-实体物流快递 2-同城配送 3-虚拟商品 4-用户自提
const tracking_no = ref('') // 物流单号
const express_company = ref('') // 快递公司编码

// 初始化
const reset = () => {
  logistics_type.value = '1'
  tracking_no.value = ''
  express_company.value = ''
}

// 复制物流单号
const copyTrackingNo = async (trackingNo: string) => {
  try {
    await navigator.clipboard.writeText(trackingNo)
    ElMessage.success('物流单号已复制到剪贴板')
  } catch {
    ElMessage.error('复制失败，请手动复制')
  }
}

// 暴露方法给父组件
defineExpose({
  open,
  close,
  reset
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
          <span class="info-label">微信交易单号：</span>
          <span class="info-value">{{ orderData.transaction_id }}</span>
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
              <div class="product-desc">{{ product.model }}</div>
              <div v-if="product.sku && product.sku.attrs" class="product-sku">
                <span class="sku-attr">
                  {{ product.sku.attrs.label }}：{{ product.sku.attrs.value }}
                </span>
              </div>
              <div class="product-price-quantity">
                <div class="price-info">
                  <span class="current-price">¥{{ (product.currentPrice / 100).toFixed(2) }}</span>
                  <span
                    v-if="product.originalPrice !== product.currentPrice"
                    class="original-price"
                  >
                    ¥{{ (product.originalPrice / 100).toFixed(2) }}
                  </span>
                </div>
                <div class="quantity-info">x{{ product.quantity }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="total-count">共 {{ orderData.totalCount }} 件商品</div>
      </div>

      <!-- 收货信息 -->
      <div class="info-section">
        <div class="section-title">收货信息</div>
        <div class="address-info">
          <div class="info-row">
            <span class="info-label">收货人：</span>
            <span class="info-value">{{ orderData.addressInfo.userName }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">联系电话：</span>
            <span class="info-value">{{ orderData.addressInfo.telNumber }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">收货地址：</span>
            <span class="info-value">
              {{ orderData.addressInfo.provinceName }}{{ orderData.addressInfo.cityName
              }}{{ orderData.addressInfo.countyName }}{{ orderData.addressInfo.detailInfo }}
            </span>
          </div>
        </div>
      </div>

      <!-- 订单金额 -->
      <div class="info-section">
        <div class="section-title">订单金额</div>
        <div class="amount-info">
          <div class="amount-row">
            <span class="amount-label">商品总金额：</span>
            <span class="amount-value">¥{{ (orderData.amount.totalPrice / 100).toFixed(2) }}</span>
          </div>
          <div v-if="orderData.amount.usedScore" class="amount-row">
            <span class="amount-label">积分抵扣：</span>
            <span class="amount-value discount">
              -¥{{ (orderData.amount.deductAmount / 100).toFixed(2) }}
            </span>
          </div>
          <div class="amount-row total">
            <span class="amount-label">实际支付金额：</span>
            <span class="amount-value actual">
              ¥{{ (orderData.amount.actualPayment / 100).toFixed(2) }}
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

      <!-- 物流信息查看（已发货、已完成订单） -->
      <div v-if="['SHIPPED', 'COMPLETED'].includes(orderData.status)" class="info-section">
        <div class="section-title">物流信息</div>
        <div class="logistics-view">
          <!-- 有物流信息时显示 -->
          <template v-if="orderData.logistics && orderData.logistics.length > 0">
            <div
              v-for="(logisticsItem, index) in orderData.logistics"
              :key="index"
              class="logistics-item"
            >
              <div class="logistics-card">
                <div class="logistics-header"></div>

                <div class="logistics-body">
                  <!-- 快递公司 -->
                  <div v-if="logisticsItem.express_company" class="logistics-row">
                    <div class="row-label">
                      <el-icon>
                        <Box />
                      </el-icon>
                      <span>快递公司：</span>
                    </div>
                    <div class="row-value">
                      <el-tag>
                        {{
                          expressList.find((item) => item.value === logisticsItem.express_company)
                            ?.label || logisticsItem.express_company
                        }}
                      </el-tag>
                    </div>
                  </div>

                  <!-- 物流单号 -->
                  <div v-if="logisticsItem.tracking_no" class="logistics-row">
                    <div class="row-label">
                      <el-icon>
                        <Promotion />
                      </el-icon>
                      <span>物流单号：</span>
                    </div>
                    <div class="row-value tracking-no">
                      <span class="tracking-text">{{ logisticsItem.tracking_no }}</span>
                      <el-button
                        type="primary"
                        link
                        size="small"
                        @click="copyTrackingNo(logisticsItem.tracking_no)"
                      >
                        <el-icon>
                          <CopyDocument />
                        </el-icon>
                        复制
                      </el-button>
                    </div>
                  </div>

                  <!-- 物流备注 -->
                  <div v-if="logisticsItem.item_desc" class="logistics-row">
                    <div class="row-label">
                      <el-icon>
                        <Document />
                      </el-icon>
                      <span>物流备注：</span>
                    </div>
                    <div class="row-value">
                      {{ logisticsItem.item_desc }}
                    </div>
                  </div>

                  <!-- 收货人电话 -->
                  <div v-if="logisticsItem.contact?.receiver_contact" class="logistics-row">
                    <div class="row-label">
                      <el-icon>
                        <Phone />
                      </el-icon>
                      <span>收货人电话：</span>
                    </div>
                    <div class="row-value">
                      {{ logisticsItem.contact.receiver_contact }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- 没有物流信息时显示空状态 -->
          <div v-else class="no-logistics">
            <el-empty description="暂无物流信息" :image-size="60" />
          </div>
        </div>
      </div>

      <!-- 物流信息编辑（待发货订单） -->
      <div v-if="orderData?.status === 'PAID'" class="info-section">
        <div class="section-title">物流信息</div>
        <div class="logistics-info">
          <!-- 物流方式选择 -->
          <div class="form-item">
            <div class="form-label">
              <span class="required">*</span>
              <span>发货方式：</span>
            </div>
            <el-radio-group v-model="logistics_type" class="logistics-radio-group">
              <el-radio value="1" size="large">
                <span class="radio-label">实体物流配送</span>
              </el-radio>
              <el-radio value="2" size="large">
                <span class="radio-label">同城配送</span>
              </el-radio>
              <el-radio value="4" size="large">
                <span class="radio-label">用户自提</span>
              </el-radio>
              <el-radio value="3" size="large">
                <span class="radio-label">虚拟商品</span>
              </el-radio>
            </el-radio-group>
          </div>

          <!-- 快递公司选择（仅物流快递时显示） -->
          <div v-if="logistics_type === '1'" class="form-item">
            <div class="form-label">
              <span class="required">*</span>
              <span>快递公司：</span>
            </div>
            <el-select
              v-model="express_company"
              placeholder="请选择快递公司"
              filterable
              clearable
              class="form-input"
            >
              <el-option
                v-for="item in expressList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>

          <!-- 物流单号输入（仅物流快递时显示） -->
          <div v-if="logistics_type === '1'" class="form-item">
            <div class="form-label">
              <span class="required">*</span>
              <span>物流单号：</span>
            </div>
            <el-input
              v-model="tracking_no"
              placeholder="请输入物流单号（示例：323244567777）"
              clearable
              maxlength="128"
              show-word-limit
              class="form-input"
            />
          </div>

          <!-- 温馨提示 -->
          <div class="logistics-tips">
            <el-icon class="tips-icon">
              <InfoFilled />
            </el-icon>
            <div class="tips-content">
              <p v-if="logistics_type === '1'">
                <strong>实体物流配送：</strong
                >使用快递公司进行实体物流配送，需要填写快递公司和物流单号。
              </p>
              <p v-else-if="logistics_type === '2'">
                <strong>同城配送：</strong>通过同城配送服务完成订单配送。
              </p>
              <p v-else-if="logistics_type === '4'">
                <strong>用户自提：</strong>用户到指定地点自行提货。
              </p>
              <p v-else-if="logistics_type === '3'">
                <strong>虚拟商品：</strong>无需实体配送的商品，如话费充值、点卡等。
              </p>
            </div>
          </div>
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

  // 收货信息样式
  .address-info {
    background: #fff;
    padding: 12px;
    border-radius: 6px;
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

  // 物流信息样式
  .logistics-info {
    background: #fff;
    padding: 16px;
    border-radius: 6px;

    .form-item {
      margin-bottom: 20px;

      &:last-of-type {
        margin-bottom: 16px;
      }

      .form-label {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        font-size: 14px;
        font-weight: 500;
        color: #303133;

        .required {
          color: #f56c6c;
          margin-right: 4px;
          font-size: 14px;
        }
      }

      .logistics-radio-group {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 12px;

        :deep(.el-radio) {
          margin-right: 0;
          padding: 10px 16px;
          border: 1px solid #dcdfe6;
          border-radius: 6px;
          background-color: #fff;
          transition: all 0.3s;

          &:hover {
            border-color: #c0c4cc;
            background-color: #f5f7fa;
          }

          &.is-checked {
            border-color: $jel-brandColor;
            background-color: #fff;
            box-shadow: 0 0 0 1px $jel-brandColor;

            .el-radio__label {
              color: $jel-brandColor;
              font-weight: 600;
            }
          }

          .el-radio__input {
            display: none;
          }

          .el-radio__label {
            padding-left: 0;
            color: #606266;
          }
        }

        .radio-label {
          font-size: 14px;
          font-weight: 500;
        }
      }

      .form-input {
        width: 100%;

        :deep(.el-input__wrapper) {
          &.is-focus {
            box-shadow: 0 0 0 1px $jel-brandColor inset;
          }
        }

        :deep(.el-select__wrapper) {
          &.is-focused {
            box-shadow: 0 0 0 1px $jel-brandColor inset;
          }
        }
      }
    }

    .logistics-tips {
      display: flex;
      gap: 8px;
      padding: 12px;
      background: #f0f9ff;
      border: 1px solid #d1e7fb;
      border-radius: 6px;
      margin-top: 12px;

      .tips-icon {
        flex-shrink: 0;
        font-size: 16px;
        color: #409eff;
        margin-top: 2px;
      }

      .tips-content {
        flex: 1;
        font-size: 13px;
        line-height: 1.6;
        color: #606266;

        p {
          margin: 0;

          strong {
            font-weight: 600;
            color: #303133;
          }
        }
      }
    }
  }

  // 物流信息查看样式
  .logistics-view {
    .logistics-item {
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }

      .logistics-card {
        background: #fff;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid #e4e7ed;
        transition: all 0.3s;

        &:hover {
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          border-color: #dcdfe6;
        }

        .logistics-header {
          background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px solid $jel-brandColor;

          .el-tag {
            background: #fff;
            border: 1px solid #dcdfe6;
            color: #303133;
            font-weight: 600;
            padding: 8px 16px;
            display: flex;
            align-items: center;

            .el-icon {
              color: $jel-brandColor;
            }
          }
        }

        .logistics-body {
          padding: 20px;

          .logistics-row {
            display: flex;
            margin-bottom: 16px;
            align-items: flex-start;

            &:last-child {
              margin-bottom: 0;
            }

            .row-label {
              min-width: 120px;
              display: flex;
              align-items: center;
              gap: 6px;
              color: #606266;
              font-size: 14px;
              font-weight: 500;
              flex-shrink: 0;

              .el-icon {
                font-size: 16px;
                color: #909399;
              }
            }

            .row-value {
              flex: 1;
              color: #303133;
              font-size: 14px;
              line-height: 1.6;
              word-break: break-all;

              &.tracking-no {
                display: flex;
                align-items: center;
                gap: 12px;
                flex-wrap: wrap;

                .tracking-text {
                  font-family: 'Courier New', monospace;
                  font-weight: 600;
                  color: $jel-brandColor;
                  font-size: 15px;
                  letter-spacing: 1px;
                  padding: 6px 12px;
                  background: #f5f7fa;
                  border: 1px solid #e4e7ed;
                  border-radius: 4px;
                }

                .el-button {
                  padding: 4px 8px;

                  &:hover {
                    color: $jel-brandColor;
                  }
                }
              }

              // 统一物流公司标签样式
              .el-tag {
                background: #f5f7fa;
                border: 1px solid #e4e7ed;
                color: #303133;
                font-weight: 500;
                padding: 4px 12px;
              }
            }
          }
        }
      }
    }

    .no-logistics {
      background: #fff;
      padding: 40px 20px;
      border-radius: 8px;
      text-align: center;
    }
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
