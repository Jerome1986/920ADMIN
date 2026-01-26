import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { CateItem } from '@/types/CateItem'
import { cateTocGetApi } from '@/api/cate'

export const useCateTocStore = defineStore('cateToC', () => {
  const loading2 = ref(true)
  const total = ref(0)
  // 获取一级分类分类
  const cateTocList = ref<CateItem[]>([])
  const cateTocListGet = async (pageNum: number, pageSize: number) => {
    loading2.value = true
    const res = await cateTocGetApi(pageNum, pageSize)
    console.log('获取成功', res)
    cateTocList.value = res.data.list
    total.value = res.data.total
    loading2.value = false
  }

  // 获取二级分类
  const subCateTocList = ref<CateItem[]>([])
  const subCateListTocGet = async (pageNum: number, pageSize: number, parentId: string = '') => {
    loading2.value = true
    const res = await cateTocGetApi(pageNum, pageSize, parentId)
    subCateTocList.value = res.data.list
    total.value = res.data.total
    loading2.value = false
  }

  // 映射一级分类名称
  const cateMap = computed(() => {
    const map = new Map()
    cateTocList.value.forEach((item) => map.set(item._id, item.name))
    return map
  })

  const mapCateParentName = (parentId: string) => cateMap.value.get(parentId) || ''

  return {
    loading2,
    total,
    cateTocList,
    cateTocListGet,
    subCateTocList,
    subCateListTocGet,
    mapCateParentName
  }
})
