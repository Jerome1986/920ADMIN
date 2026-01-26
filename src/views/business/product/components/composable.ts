import { PHONE_MODELS } from '@/utils'
import { ref } from 'vue'

// element Ui selected选择器搜索时取出空格去除符号，取消默认搜索规则
export const filterModels = () => {
  const filteredModels = ref([...PHONE_MODELS])

  const normalize = (str: string) =>
    str
      .toLowerCase()
      .replace(/\s+/g, '') // 干掉所有空格
      .replace(/[-_]/g, '') // 顺手把常见符号也干掉

  const filterPhoneModel = (query: string) => {
    if (!query) {
      filteredModels.value = [...PHONE_MODELS]
      return
    }

    const q = normalize(query)

    filteredModels.value = PHONE_MODELS.filter((item) => normalize(item).includes(q))
  }

  return {
    filteredModels,
    normalize,
    filterPhoneModel
  }
}
