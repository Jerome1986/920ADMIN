import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { CateItem } from '@/types/CateItem'
import { cateGetApi } from '@/api/cate'

export const useCateStore = defineStore('cate', () => {
  const loading = ref(true)
  const total = ref(0)
  // 获取一级分类分类
  const cateList = ref<CateItem[]>([])
  const cateListGet = async (pageNum: number, pageSize: number) => {
    loading.value = true
    const res = await cateGetApi(pageNum, pageSize)
    cateList.value = res.data.list
    total.value = res.data.total
    loading.value = false
  }

  // 获取二级分类
  const subCateList = ref<CateItem[]>([])
  const subCateListGet = async (pageNum: number, pageSize: number, parentId: string = '') => {
    loading.value = true
    const res = await cateGetApi(pageNum, pageSize, parentId)
    subCateList.value = res.data.list
    total.value = res.data.total
    loading.value = false
  }

  // 获取三级分类
  const thirdCateList = ref<CateItem[]>([])
  const thirdCateListGet = async (pageNum: number, pageSize: number, parentId: string = '') => {
    loading.value = true
    const res = await cateGetApi(pageNum, pageSize, parentId)
    console.log('三级分类', res.data.list)
    thirdCateList.value = res.data.list
    total.value = res.data.total
    loading.value = false
  }

  // 映射一级分类名称
  const cateMap = computed(() => {
    const map = new Map()
    cateList.value.forEach((item) => map.set(item._id, item.name))
    return map
  })

  const mapCateParentName = (parentId: string) => cateMap.value.get(parentId) || ''

  return {
    loading,
    total,
    cateList,
    cateListGet,
    subCateList,
    subCateListGet,
    mapCateParentName,
    thirdCateList,
    thirdCateListGet
  }
})
