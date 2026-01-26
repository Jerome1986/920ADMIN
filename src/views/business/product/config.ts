import { ref } from 'vue'
import type { ProductFormModel, SkuItem } from '@/types/ProductItem.d.ts'
import { ElMessage, type FormRules, type UploadUserFile } from 'element-plus'

// 基础表单
export const formModel = ref<ProductFormModel>({
  _id: '',
  skuNo: '',
  name: '',
  dec: '',
  models: [],
  categoryId: '',
  subCategoryId: '',
  thirdCategoryId: '',
  originalPrice: 0,
  currentPrice: 0,
  cover: '',
  proImages: [],
  skus: [],
  status: 'active',
  hot: 'disable',
  type: 'both'
})

// 重置表单
export const resetFormModel = (categoryId: string) => {
  formModel.value = {
    _id: '',
    skuNo: '',
    name: '',
    dec: '',
    models: [],
    categoryId,
    subCategoryId: '',
    thirdCategoryId: '',
    originalPrice: 0,
    currentPrice: 0,
    cover: '',
    proImages: [],
    skus: [],
    status: 'active',
    hot: 'disable',
    type: 'both'
  }
}

// 默认产品类型对应的角色
export const defaultProductType = ['user', 'manager', 'vip', 'both']

// 产品可用角色类型映射
export const productTypeMap = (type: string) => {
  switch (type) {
    case 'user':
      return '用户'
    case 'vip':
      return '会员'
    case 'manager':
      return '店长'
    case 'both':
      return '全部'
  }
}

// 产品表单规则
export const productRules: FormRules = {
  // 描述
  dec: [
    { required: true, message: '请输入商品描述', trigger: 'blur' },
    { max: 200, message: '描述不能超过 200 字', trigger: 'blur' }
  ],

  // 原价
  originalPrice: [
    { required: true, message: '请输入原价', trigger: 'change' },
    { type: 'number', min: 0, message: '原价不能为负数', trigger: 'change' }
  ],

  // 现价
  currentPrice: [
    { required: true, message: '请输入现价', trigger: 'change' },
    {
      validator: (rule, value, callback, model) => {
        if (value < 0) return callback(new Error('现价不能为负数'))
        if (model.originalPrice && value > model.originalPrice) {
          return callback(new Error('现价不能高于原价'))
        }
        callback()
      },
      trigger: 'change'
    }
  ],

  // 封面图
  cover: [{ required: true, message: '请上传封面图', trigger: 'change' }],

  // 详情图
  proImages: [{ required: true, message: '请上传至少一张详情图', trigger: 'change' }]
}

// SKU 校验函数（在 onSubmit 前调用）
export const validateSkuList = (
  skuList: (SkuItem & { skuFileList?: UploadUserFile[] })[]
): boolean => {
  // if (!skuList.length) {
  //   ElMessage.error('请至少添加一个规格')
  //   return false
  // }

  // 没有 SKU，直接通过
  if (!skuList.length) {
    return true
  }

  for (const [index, sku] of skuList.entries()) {
    if (!sku.attrs?.value) {
      ElMessage.error(`第 ${index + 1} 个规格缺少名称`)
      return false
    }
    if (sku.price == null || sku.price < 0) {
      ElMessage.error(`第 ${index + 1} 个规格价格无效`)
      return false
    }
    if (!sku.image) {
      ElMessage.error(`第 ${index + 1} 个规格缺少封面图`)
      return false
    }
    if (sku.unit_count == null || sku.unit_count < 0) {
      ElMessage.error(`第 ${index + 1} 个规格库存无效`)
      return false
    }
  }
  return true
}
