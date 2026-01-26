<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { FormInstance, UploadProps, UploadUserFile } from 'element-plus'
import { ElMessage, genFileId, type UploadInstance, type UploadRawFile } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { ProductFormModel, SkuItem } from '@/types/ProductItem.d.ts'
import { useCateStore } from '@/stores/modules/cate.ts'
import { productAddApi, productUpdateApi } from '@/api/product.ts'
import {
  defaultProductType,
  formModel,
  productRules,
  productTypeMap,
  resetFormModel,
  validateSkuList
} from '../config.ts'
import { filterModels } from '@/views/business/product/components/composable.ts'

const props = defineProps({
  parentId: {
    type: String
  }
})

// 取出element selected 的取消默认搜索函数
const { filteredModels, filterPhoneModel } = filterModels()

// 定义store
const cateStore = useCateStore()

// 获取表单组件
const formRef = ref<FormInstance>()

// 对话框可见与标题
const dialogVisible = ref(false)
const dialogTitle = ref('编辑用户')

// 分类选择
const onSubCategoryIdChange = (cateId: string) => {
  console.log('分类选择', cateId)
  formModel.value.subCategoryId = cateId
  formModel.value.thirdCategoryId = '' // 每次切换二级分类时，重置一下三级分类
  cateStore.thirdCateListGet(1, 100, formModel.value.subCategoryId)
}
const onThirdCategoryIdChange = (cateId: string) => {
  formModel.value.thirdCategoryId = cateId
}

// 产品可见类型选择
const changeType = (type: string) => {
  console.log('changeType', type)
}

// 新增Sku
const skuList = ref<(SkuItem & { skuFileList?: UploadUserFile[] })[]>([])
const skuFileList = ref<UploadUserFile[]>([])
const addSku = () => {
  console.log('新增SKU', formModel.value.skus)
  skuList.value.push({
    skuCode: '',
    price: 0,
    unit_count: 0,
    image: '',
    attrs: {
      label: '规格',
      value: ''
    },
    skuFileList: []
  })
}

// 从Sku数组移除
const removeSku = (index: number) => {
  skuList.value.splice(index, 1)
}
//  Sku封面覆盖上一张图
const uploadCoverSku = ref<UploadInstance>()
const handleCoverSkuExceed: UploadProps['onExceed'] = (files) => {
  console.log('覆盖上一张图', files)
  uploadCoverSku.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadCoverSku.value!.handleStart(file)
  uploadCoverSku.value!.submit()
}

// 获取上传组件
const uploadCover = ref<UploadInstance>()

// 上传 - 封面
const coverFileList = ref<UploadUserFile[]>([])
const handleCoverSuccess: UploadProps['onSuccess'] = (response) => {
  console.log('上传成功返回', response)
  // 拿到返回的url
  formModel.value.cover = response
}
//  覆盖上一张图
const handleCoverExceed: UploadProps['onExceed'] = (files) => {
  console.log('覆盖上一张图', files)
  uploadCover.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadCover.value!.handleStart(file)
  uploadCover.value!.submit()
}
// 移除图片
const handleCoverRemove: UploadProps['onRemove'] = () => {
  formModel.value.cover = ''
  coverFileList.value = []
}

// 上传 - 详情图
const detailFileList = ref<UploadUserFile[]>([])
const handleDetailCardPreview = () => {
  console.log('预览详情图')
}
const handleDetailSuccess: UploadProps['onSuccess'] = (response) => {
  console.log('上传详情成功返回', response)
  // 拿到返回的url追加到素组
  formModel.value.proImages.push(response)
}
const handleDetailRemove: UploadProps['onRemove'] = (uploadFile) => {
  console.log('删除', uploadFile)
  // 过滤掉删除的链接
  formModel.value.proImages = formModel.value.proImages.filter(
    (url: string) => url !== uploadFile.url
  )
  console.log('删除后的数组', formModel.value.proImages)
}

// 打开弹窗
const open = async (row: Partial<ProductFormModel>) => {
  dialogVisible.value = true

  // 先拉二级分类
  await cateStore.subCateListGet(1, 100, props.parentId)

  // 如果是编辑
  if (row._id) {
    dialogTitle.value = '编辑'

    // 先赋值除三级分类外的字段
    formModel.value = {
      ...formModel.value,
      ...row,
      currentPrice: (row.currentPrice ?? 0) / 100,
      originalPrice: (row.originalPrice ?? 0) / 100,
      thirdCategoryId: '' //  先清空
    }

    // 再根据二级分类拉三级分类
    if (row.subCategoryId) {
      await cateStore.thirdCateListGet(1, 100, row.subCategoryId)
    }

    // 最后再设置三级分类的 v-model
    formModel.value.thirdCategoryId = row.thirdCategoryId || ''

    // SKU 回显
    skuList.value = (row.skus || []).map((s: SkuItem) => ({
      ...s,
      skuFileList: s.image ? [{ name: 'skuCover', url: s.image }] : []
    }))
  } else {
    dialogTitle.value = '新增'
    if (props.parentId) resetFormModel(props.parentId)
    skuList.value = []
    formModel.value.models = []
  }

  // 同步文件列表
  coverFileList.value = formModel.value.cover ? [{ name: 'cover', url: formModel.value.cover }] : []

  detailFileList.value = formModel.value.proImages.map((u) => ({
    name: u,
    url: u
  }))
}

// 暴露方法
defineExpose({
  open
})

// 提交事件
const emits = defineEmits(['success'])

// 提交
const onSubmit = async () => {
  console.log('提交', formModel.value, 'sku', formModel.value.skus)
  formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return

    // 手动校验 SKU
    if (!validateSkuList(skuList.value)) return

    if (formModel.value._id) {
      console.log('更新SKU', skuList.value)
      const upRes = await productUpdateApi(
        'toB',
        formModel.value._id,
        formModel.value.skuNo,
        formModel.value.name,
        formModel.value.dec,
        formModel.value.models,
        formModel.value.categoryId!,
        formModel.value.subCategoryId!,
        formModel.value.thirdCategoryId!,
        formModel.value.originalPrice,
        formModel.value.currentPrice,
        formModel.value.cover,
        formModel.value.proImages,
        skuList.value,
        formModel.value.hot!,
        formModel.value.type!
      )
      console.log(upRes)
      ElMessage.success('更新成功')
    } else {
      // 新增前，追加本地的sku数据
      const addRes = await productAddApi(
        'toB',
        formModel.value.name,
        formModel.value.skuNo,
        formModel.value.dec,
        formModel.value.models,
        formModel.value.categoryId!,
        formModel.value.subCategoryId!,
        formModel.value.thirdCategoryId!,
        formModel.value.originalPrice,
        formModel.value.currentPrice,
        formModel.value.cover,
        formModel.value.proImages,
        skuList.value,
        formModel.value.hot!,
        formModel.value.type!
      )
      console.log(addRes)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    emits('success', formModel.value.categoryId)
  })
}

onMounted(async () => {})
</script>

<template>
  <div class="proChannel">
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="40%">
      <el-form
        ref="formRef"
        :rules="productRules"
        :model="formModel"
        label-width="100px"
        style="padding-right: 30px"
      >
        <!-- 商品名称 -->
        <el-form-item label="名称" prop="name" v-if="dialogTitle === '编辑'">
          <el-input v-model="formModel.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <!-- 商品货号 -->
        <el-form-item label="货号" prop="skuNo">
          <el-input v-model="formModel.skuNo" placeholder="请输入货号"></el-input>
        </el-form-item>
        <!-- 商品描述 -->
        <el-form-item label="描述" prop="dec">
          <el-input
            v-model="formModel.dec"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="支持的型号" prop="models">
          <el-select
            v-model="formModel.models"
            multiple
            filterable
            :filter-method="filterPhoneModel"
            placeholder="请选择支持的型号"
            style="width: 100%"
          >
            <el-option v-for="item in filteredModels" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>

        <!-- 热门推荐  -->
        <el-form-item label="推荐">
          <el-switch
            v-model="formModel.hot"
            active-color="#f56c6c"
            active-value="enable"
            inactive-value="disable"
          />
        </el-form-item>
        <!-- 价格 -->
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="原价" prop="originalPrice">
              <el-input-number v-model="formModel.originalPrice" :min="0" :step="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="现价" prop="currentPrice">
              <el-input-number v-model="formModel.currentPrice" :min="0" :step="1" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 封面上传 -->
        <el-form-item label="封面图" prop="cover">
          <el-upload
            ref="uploadCover"
            action="https://i2dkfjxqvm.gzg.sealos.run/admin/upload"
            list-type="picture-card"
            :limit="1"
            :file-list="coverFileList"
            :on-success="handleCoverSuccess"
            :on-remove="handleCoverRemove"
            :on-exceed="handleCoverExceed"
            :data="{ folder: 'cover' }"
          >
            <el-icon>
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <!-- 详情图上传 -->
        <el-form-item label="详情图" prop="proImages">
          <el-upload
            v-model:file-list="detailFileList"
            action="https://i2dkfjxqvm.gzg.sealos.run/admin/upload"
            list-type="picture-card"
            :on-success="handleDetailSuccess"
            :on-preview="handleDetailCardPreview"
            :on-remove="handleDetailRemove"
          >
            <el-icon>
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <!-- 分类 -->
        <el-row :gutter="12">
          <el-col :span="12">
            <!--  二级分类  -->
            <el-form-item label="二级分类" prop="subCategoryId">
              <el-select
                v-model="formModel.subCategoryId"
                placeholder="请选择对应的分类"
                style="width: 100%"
                @change="onSubCategoryIdChange"
              >
                <el-option
                  v-for="item in cateStore.subCateList"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!--  三级分类  -->
            <el-form-item label="三级分类" prop="thirdCategoryId">
              <el-select
                v-model="formModel.thirdCategoryId"
                placeholder="请选择对应的分类"
                style="width: 100%"
                @change="onThirdCategoryIdChange"
              >
                <el-option
                  v-for="item in cateStore.thirdCateList"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--  可见角色  -->
        <el-form-item label="可见角色" prop="type">
          <el-select
            v-model="formModel.type"
            placeholder="请选择对应的角色"
            style="width: 100%"
            @change="changeType"
          >
            <el-option
              v-for="item in defaultProductType"
              :key="item"
              :label="productTypeMap(item)"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <!-- 规格 SKU -->
        <el-divider>规格 SKU</el-divider>
        <div class="sku-section">
          <el-button type="primary" plain size="small" @click="addSku">新增规格</el-button>
          <el-table :data="skuList" class="sku-table" border style="width: 100%; margin-top: 12px">
            <el-table-column label="规格名称" width="160" align="center">
              <template #default="{ row }">
                <el-input
                  v-model="row.attrs.value"
                  placeholder="请输入规格名称"
                  class="sku-name-input"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="封面图" min-width="200" align="center">
              <template #default="{ row }">
                <el-upload
                  ref="uploadCoverSku"
                  action="https://i2dkfjxqvm.gzg.sealos.run/admin/upload"
                  v-model:file-list="row.skuFileList"
                  list-type="picture-card"
                  :limit="1"
                  :on-success="
                    (resp: any) => {
                      const url = resp?.url ?? resp
                      row.image = url
                      row.skuFileList = url ? [{ name: 'skuCover', url }] : []
                    }
                  "
                  :on-exceed="handleCoverSkuExceed"
                  :on-remove="() => ((row.image = ''), (skuFileList = []))"
                >
                  <el-icon>
                    <Plus />
                  </el-icon>
                </el-upload>
              </template>
            </el-table-column>
            <el-table-column label="价格(元)" width="120" align="center">
              <template #default="{ row }">
                <el-input-number v-model="row.price" :min="0" :step="1" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="库存规格/片" width="120" align="center">
              <template #default="{ row }">
                <el-input-number v-model="row.unit_count" :min="0" :step="1" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template #default="scope">
                <el-button type="danger" link size="small" @click="removeSku(scope.$index)"
                  >移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
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
  :deep(.el-upload--picture-card) {
    width: 120px;
    height: 120px;
    line-height: 120px;
  }
}

/* 紧凑的 SKU 表格样式 */
.sku-section {
  margin-top: 8px;

  :deep(.sku-table) {
    width: 100% !important;
  }

  :deep(.el-table .cell) {
    padding: 6px 8px;
  }

  :deep(.el-input__wrapper) {
    padding: 0 8px;
  }

  :deep(.el-input-number) {
    width: 100px;
  }

  /* 缩小规格封面卡片尺寸，避免占位过大 */
  :deep(.el-table .el-upload--picture-card) {
    width: 80px;
    height: 80px;
    line-height: 80px;
  }

  /* 规格名称输入：去掉外边框，突出占位提示，并居中 */
  :deep(.sku-name-input .el-input__wrapper) {
    box-shadow: none !important;
    background-color: transparent;
    padding-left: 0;
  }

  :deep(.sku-name-input .el-input__inner) {
    text-align: center;
  }
}
</style>
