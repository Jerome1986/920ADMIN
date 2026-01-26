<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { commissionRuleUpdateApi, totalRateSetApi } from '@/api/commissionRule.ts'
import { formatTimestamp } from '@/utils'
import { ElMessage } from 'element-plus'
import { useCommissionStore } from '@/stores'
import type { CommissionRule } from '@/types/CommissionRule'
import PageContainer from '@/components/PageContainer.vue'

// 定义store
const commissionStore = useCommissionStore()

// 定义提交数据
const form = ref<CommissionRule>({
  _id: '',
  level1Rate: 0,
  level2Rate: 0,
  platformRate: 0,
  totalRate: 0,
  createdAt: new Date(),
  updatedAt: new Date()
})

// 更新佣金设置（TIPS:总佣金是单独设置的）
const handleSave = async () => {
  if (form.value._id) {
    await commissionRuleUpdateApi(
      form.value._id,
      form.value.level1Rate,
      form.value.level2Rate,
      form.value.platformRate
    )
      .then((res) => {
        ElMessage.success(res.message || '更新成功')
        commissionStore.setCommission(form.value)
        commissionStore.commissionGet()
      })
      .catch((err) => {
        console.log(err)
      })
  }
}

// 控制总比例处的按钮显示
const isTotalRate = ref(false)

// 设置总佣金
const setTotalRate = () => {
  isTotalRate.value = true
}

// 保存总佣金

const saveTotalRate = async () => {
  isTotalRate.value = false
  console.log('总佣金', form.value.totalRate)
  if (form.value._id) {
    await totalRateSetApi(form.value._id, form.value.totalRate)
      .then(() => {
        commissionStore.setTotalRate(form.value.totalRate)
        ElMessage.success('设置成功')
      })
      .catch((e) => {
        ElMessage.error(e)
      })
  }
}

onMounted(async () => {
  await commissionStore.commissionGet()
  form.value = { ...commissionStore.commission }
})
</script>

<template>
  <PageContainer title="佣金设置">
    <template #extra>
      <el-button class="save-btn" type="primary" @click="handleSave">保存设置</el-button>
    </template>

    <el-card class="setting-card" shadow="never">
      <div class="header-tips">
        <p>请设置各级佣金比例与平台抽成，单位为比例（例如 0.03 表示 3%）。</p>
        <p>请先设置好总佣金，再平均分配。所有佣金之和不可超过总佣金</p>
      </div>

      <el-form label-width="140px" label-position="right" class="setting-form">
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="一级佣金比例">
              <el-input-number v-model="form.level1Rate" :step="0.01" :min="0" :max="1" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="二级佣金比例">
              <el-input-number v-model="form.level2Rate" :step="0.01" :min="0" :max="1" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="平台抽成比例">
              <el-input-number v-model="form.platformRate" :step="0.01" :min="0" :max="1" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="总比例">
              <div class="total-rate-row">
                <el-input v-model="form.totalRate" :disabled="!isTotalRate" class="total-input" />
                <div class="total-actions">
                  <el-button
                    v-if="!isTotalRate"
                    class="brand-btn"
                    type="primary"
                    @click="setTotalRate"
                    >设置
                  </el-button>
                  <el-button v-else class="brand-btn" type="primary" @click="saveTotalRate"
                    >保存
                  </el-button>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider />

        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="创建时间">
              <el-input :model-value="formatTimestamp(form.createdAt, 2)" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="更新时间">
              <el-input :model-value="formatTimestamp(form.updatedAt, 2)" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </PageContainer>
</template>

<style scoped lang="scss">
.setting-card {
  border: none;
}

.header-tips {
  margin-bottom: 12px;
  font-size: 13px;
  color: #909399;
}

.save-btn {
  background-color: $jel-brandColor;
  border-color: $jel-brandColor;
}

.setting-form :deep(.el-form-item) {
  margin-bottom: 16px;
}

.total-rate-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.total-input {
  flex: 1;
}

.brand-btn {
  background-color: $jel-brandColor;
  border-color: $jel-brandColor;
}
</style>
