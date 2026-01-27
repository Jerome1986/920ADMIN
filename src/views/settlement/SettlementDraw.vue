<script setup lang="ts">
import { ref } from 'vue'
import {
  type DrawerProps,
  genFileId,
  type UploadInstance,
  type UploadProps,
  type UploadRawFile
} from 'element-plus'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { formatAmount } from '@/utils'
import type { SettlementItem } from '@/types/Settlement'

interface Props {
  modelValue: boolean
  userData?: SettlementItem | null
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  userData: null
})

const emit = defineEmits(['update:modelValue', 'confirm'])

// 抽屉状态
const direction = ref<DrawerProps['direction']>('rtl')

// 结算表单数据
const settlementRemark = ref('')

// 上传凭证
const receiptFiles = ref<string>()

// 关闭抽屉
const handleClose = () => {
  emit('update:modelValue', false)
  // 重置表单数据
  settlementRemark.value = ''
  receiptFiles.value = ''
}

// 上传组件
const upload = ref<UploadInstance>()
// 覆盖上一个文件
const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

// 文件上传成功
const handleUploadSuccess = (file: string) => {
  console.log('上传结果', file)
  receiptFiles.value = file
  console.log('数组追加', receiptFiles.value)
  ElMessage.success('上传成功')
}

// 文件上传失败
const handleUploadError = (error: Error) => {
  console.error('上传失败:', error)
  ElMessage.error('上传失败，请重试')
}

// 预览文件
const dialogVisible = ref(false)
const previewImg = ref('')
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  previewImg.value = uploadFile.url!
  console.log('预览文件', receiptFiles.value)
  dialogVisible.value = true
}

// 确认结算
const handleConfirmSettlement = () => {
  if (!props.userData) return

  emit('confirm', {
    out_trade_no: props.userData.out_trade_no,
    userId: props.userData.userId,
    mobile: props.userData.mobile,
    amount: props.userData.should_settlement_amount,
    remark: settlementRemark.value,
    receiptFiles: receiptFiles.value,
    settlementStatus: props.userData.settlementStatus
  })

  // 关闭抽屉
  handleClose()
}
</script>

<template>
  <el-drawer
    :model-value="modelValue"
    title="用户结算"
    :direction="direction"
    :before-close="handleClose"
    size="600px"
    class="settlement-drawer"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="drawer-content" v-if="userData">
      <!-- 用户基本信息 -->
      <div class="user-info-section">
        <div class="section-title">用户信息</div>
        <div class="user-info-card">
          <div class="user-details">
            <div class="user-mobile">手机号：{{ userData.mobile }}</div>
          </div>
        </div>
      </div>

      <!-- 结算信息 -->
      <div class="settlement-section">
        <div class="section-title">结算信息</div>
        <div class="settlement-card">
          <div class="settlement-item total">
            <span class="item-label">待结算金额：</span>
            <span class="item-value">¥{{ formatAmount(userData.actual_settlement_amount) }}</span>
          </div>
        </div>
      </div>

      <!-- 结算操作 -->
      <div class="operation-section">
        <div class="section-title">结算操作</div>
        <div class="operation-form">
          <!-- 结算备注 -->
          <div class="form-item">
            <label class="form-label">结算备注：</label>
            <el-input
              v-model="settlementRemark"
              type="textarea"
              :rows="3"
              placeholder="请输入结算备注"
              maxlength="200"
              show-word-limit
            />
          </div>

          <!-- 结账凭证上传 -->
          <div class="form-item">
            <label class="form-label">结账凭证：</label>
            <el-upload
              ref="upload"
              action="https://i2dkfjxqvm.gzg.sealos.run/upload-images"
              list-type="picture-card"
              :on-success="handleUploadSuccess"
              :on-exceed="handleExceed"
              :on-error="handleUploadError"
              :on-preview="handlePictureCardPreview"
              :limit="1"
              accept="image/*"
              class="receipt-upload"
            >
              <el-icon>
                <Plus />
              </el-icon>
            </el-upload>
            <div class="upload-tips">
              <p>支持上传图片格式，最多3张，每张不超过5MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 抽屉底部按钮 -->
    <template #footer>
      <div class="drawer-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="danger" @click="handleConfirmSettlement">确认结算</el-button>
      </div>
    </template>
  </el-drawer>

  <el-dialog v-model="dialogVisible">
    <img style="width: 100%; height: 100%" :src="previewImg" alt="Preview Image" />
  </el-dialog>
</template>

<style scoped lang="scss">
// 结算抽屉样式
.settlement-drawer {
  .drawer-content {
    padding: 20px;

    .user-info-section,
    .settlement-section,
    .operation-section {
      margin-bottom: 24px;

      .section-title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 2px solid #f56c6c;
      }
    }

    // 用户信息卡片
    .user-info-card {
      display: flex;
      align-items: center;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #ebeef5;

      .user-details {
        flex: 1;

        .user-mobile {
          font-size: 14px;
          color: #606266;
          margin-bottom: 4px;
        }
      }
    }

    // 结算信息卡片
    .settlement-card {
      padding: 16px;
      background: #fff;
      border-radius: 8px;
      border: 1px solid #ebeef5;

      .settlement-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #f5f7fa;

        &:last-child {
          border-bottom: none;
        }

        .item-label {
          font-size: 14px;
          color: #606266;
        }

        .item-value {
          font-size: 14px;
          color: #303133;
          font-weight: 500;
        }

        &.total {
          .item-label,
          .item-value {
            font-size: 16px;
            font-weight: 600;
            color: #f56c6c;
          }
        }
      }
    }

    // 操作表单
    .operation-form {
      .form-item {
        margin-bottom: 16px;

        .form-label {
          display: block;
          font-size: 14px;
          color: #606266;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .unit {
          margin-left: 8px;
          font-size: 14px;
          color: #909399;
        }

        // 上传组件样式
        .receipt-upload {
          ::v-deep(.el-upload) {
            width: 80px;
            height: 80px;
            border: 1px dashed #d9d9d9;
            border-radius: 6px;

            &:hover {
              border-color: #f56c6c;
            }
          }

          ::v-deep(.el-upload-list__item) {
            width: 80px;
            height: 80px;
            margin: 0 8px 8px 0;
          }

          .upload-text {
            font-size: 12px;
            color: #909399;
            margin-top: 8px;
          }
        }

        .upload-tips {
          margin-top: 8px;

          p {
            margin: 0;
            font-size: 12px;
            color: #909399;
            line-height: 1.4;
          }
        }
      }
    }
  }

  // 抽屉底部
  .drawer-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 24px;
    border-top: 1px solid #ebeef5;
  }
}
</style>
