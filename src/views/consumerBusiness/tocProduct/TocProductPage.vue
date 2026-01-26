<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type TabsPaneContext } from 'element-plus'
import PageContainer from '@/components/PageContainer.vue'
import type { ProductItem } from '@/types/ProductItem.d.ts'
import type { JelTocProductChannel } from '@/types/Components'
import TocProductChannel from './components/TocProductChannel.vue'
import { productTypeMap } from './config.ts'
import { useCateTocStore } from '@/stores'
import { productGetApi, searchProductApi } from '@/api/product.ts'

// 定义store
const tocCateStore = useCateTocStore()

// 组件
const dialog = ref<JelTocProductChannel>()

// 根据货号或商品名称搜索
const searchValue = ref('')
const searchMaterialGet = async (pageNum: number, pageSize: number) => {
  console.log('搜索', searchValue.value)
  if (!searchValue.value) params.value.pageNum = 1 // 搜索之前重置页码--如果搜索内容为空就代表不是搜索

  if (activeName.value) {
    const searchRes = await searchProductApi(
      'toC',
      activeName.value,
      searchValue.value,
      pageNum,
      pageSize
    )
    productList.value = searchRes.data.list
    total.value = searchRes.data.total
  }
}

// 清除搜索
const handleClearSearch = () => {
  searchValue.value = ''
  params.value.pageNum = 1
  tocProductListGet(activeName.value, params.value.pageNum, params.value.pageSize)
}

// 加载
const loading = ref(false)
// 获取产品列表函数
const total = ref(0)
const productList = ref<ProductItem[]>([])
const tocProductListGet = async (cateId: string, pageNum: number, pageSize: number) => {
  console.log('获取产品', cateId, pageNum, pageSize)
  loading.value = true
  const res = await productGetApi('toC', cateId, pageNum, pageSize)
  console.log('产品列表', res)
  productList.value = res.data.list
  total.value = res.data.total
  loading.value = false
}

// 分页
const params = ref({
  pageNum: 1,
  pageSize: 10
})

// 处理每页条数改变
const handleSizeChange = (size: number) => {
  params.value.pageSize = size
  // 重置到第 1 页，避免当前页超出最大页数后数据为空
  params.value.pageNum = 1
  // 重新获取数据
  tocProductListGet(activeName.value, params.value.pageNum, params.value.pageSize)
}

// 处理页码改变
const handleCurrentChange = (num: number) => {
  params.value.pageNum = num
  // 重新获取数据
  tocProductListGet(activeName.value, params.value.pageNum, params.value.pageSize)
}

// 添加
const onAddChannel = () => {
  console.log('添加')
  dialog.value?.open({})
}

// 编辑
const onEditChannel = (row: ProductItem) => {
  dialog.value?.open(row)
}

// 删除
const onDelChannel = (row: ProductItem) => {
  console.log('onDelChannel', row)
  ElMessageBox.confirm('你确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'el-button--danger' // Element 内置类
  })
    .then(async () => {
      // 删除逻辑
    })
    .catch((err) => {
      // catch error
      console.error('异常错误', err)
      ElMessage.error(err)
    })
}

// 处理子组件操作成功
const handleSuccess = (cateId: string) => {
  console.log('成功', cateId)
  activeName.value = cateId
  tocProductListGet(activeName.value, params.value.pageNum, params.value.pageSize)
}

// 当前激活的一级分类
const activeName = ref(tocCateStore.cateTocList[0]?.name || '')
// 标签点击选择
const handleClick = (tab: TabsPaneContext) => {
  console.log(tab.paneName)
  // 切换分类时 重置搜索和页码
  searchValue.value = ''
  params.value.pageNum = 1

  activeName.value = tab.paneName as string // 当前激活的分类ID
  tocProductListGet(activeName.value, params.value.pageNum, params.value.pageSize)
}

onMounted(async () => {
  await tocCateStore.cateTocListGet(1, 100)
  if (tocCateStore.cateTocList.length > 0) {
    activeName.value = tocCateStore.cateTocList[0]!._id // TAB默认激活第一项
    await tocProductListGet(activeName.value, params.value.pageNum, params.value.pageSize)
  }
})
</script>

<template>
  <!-- 非会员用户 -->
  <PageContainer title="商品管理">
    <div class="header">
      <!--  一级分类  -->
      <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick">
        <el-tab-pane
          v-for="item in tocCateStore.cateTocList"
          :key="item._id"
          :label="item.name"
          :name="item._id"
        ></el-tab-pane>
      </el-tabs>

      <!--   搜索   -->
      <div class="search">
        <el-input
          v-model="searchValue"
          style="width: 240px; margin-right: 8px"
          placeholder="根据货号或者商品名称搜索"
          clearable
          @clear="handleClearSearch"
        />
        <el-button type="danger" @click="searchMaterialGet(params.pageNum, params.pageSize)"
          >查询</el-button
        >
      </div>
    </div>
    <template #extra>
      <el-button type="danger" @click="onAddChannel">添加产品</el-button>
    </template>

    <el-table :data="productList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" align="center" width="60" type="index"></el-table-column>
      <el-table-column
        label="商品名称"
        align="center"
        prop="name"
        min-width="120"
        show-overflow-tooltip
        :tooltip-options="{ placement: 'top', effect: 'light', popperClass: 'addr-tooltip' }"
      ></el-table-column>
      <el-table-column label="货号" align="center" prop="skuNo" min-width="80"></el-table-column>
      <el-table-column
        label="规格"
        align="center"
        prop="skuList"
        min-width="200"
        show-overflow-tooltip
        :tooltip-options="{ placement: 'top', effect: 'light', popperClass: 'addr-tooltip' }"
      >
        <template #default="{ row }">
          <div
            class="sku"
            style="display: flex; align-items: center; justify-content: center; gap: 4px"
          >
            <template v-for="(sku, index) in row.skus" :key="index">
              <span>{{ sku.attrs.value }}</span>
              <span v-if="index < row.skus.length - 1">/</span>
            </template>
          </div>
        </template>
      </el-table-column>
      <!--  可见角色  -->
      <el-table-column label="可见角色" align="center" prop="type" width="80">
        <template #default="{ row }">
          {{ productTypeMap(row.type) }}
        </template>
      </el-table-column>

      <el-table-column
        label="商品描述"
        align="center"
        prop="dec"
        min-width="200"
        show-overflow-tooltip
        :tooltip-options="{ placement: 'top', effect: 'light', popperClass: 'addr-tooltip' }"
      ></el-table-column>
      <el-table-column
        label="型号范围"
        align="center"
        prop="models"
        width="120"
        sortable
        show-overflow-tooltip
        :tooltip-options="{ placement: 'top', effect: 'light', popperClass: 'addr-tooltip' }"
      >
        <template #default="{ row }">
          {{ row.models.join('/') }}
        </template>
      </el-table-column>
      <el-table-column label="最低价格" align="center" prop="minPrice" width="120" sortable>
        <template #default="{ row }">
          {{ Number(row.minPrice / 100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="最高价格" align="center" prop="maxPrice" width="120" sortable>
        <template #default="{ row }">
          {{ Number(row.maxPrice / 100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="原价" align="center" prop="originalPrice" width="100" sortable>
        <template #default="{ row }">
          {{ Number(row.originalPrice / 100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="售价" align="center" prop="currentPrice" width="100" sortable>
        <template #default="{ row }">
          {{ Number(row.currentPrice / 100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="封面图" align="center" prop="cover" width="100">
        <template #default="{ row }">
          <img style="width: 50px; height: 50px; border-radius: 4px" :src="row.cover" alt="cover" />
        </template>
      </el-table-column>
      <el-table-column label="详情图" align="center" prop="proImages" min-width="200">
        <template #default="{ row }">
          <img
            style="width: 50px; height: 50px; border-radius: 4px"
            v-for="item in row.proImages"
            :key="item"
            :src="item"
            alt="detailPic"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="总库存"
        align="center"
        prop="totalStock"
        width="100"
        sortable
      ></el-table-column>
      <el-table-column
        label="浏览量"
        align="center"
        prop="lookNum"
        width="100"
        sortable
      ></el-table-column>
      <el-table-column label="推荐" align="center" width="100">
        <template #default="{ row }">
          <el-tag type="success" v-if="row.hot === 'enable'">是</el-tag>
          <el-tag type="info" v-else>否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditChannel(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDelChannel(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <!-- 页码 -->
    <div style="margin-top: 20px">
      <el-pagination
        style="margin-top: 20px; justify-content: flex-end"
        v-model:current-page="params.pageNum"
        v-model:page-size="params.pageSize"
        :page-sizes="[1, 10, 30, 50, 100]"
        layout="jumper,total, sizes, prev, pager, next "
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </PageContainer>
  <!-- 弹窗 -->
  <TocProductChannel
    ref="dialog"
    @success="handleSuccess"
    :parent-id="activeName"
  ></TocProductChannel>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  width: 100%;
  color: $jel-font-title;

  .tabs ::v-deep(.el-tabs__item.is-active) {
    color: $jel-brandColor;
  }
  .tabs ::v-deep(.el-tabs__active-bar.is-top) {
    background-color: $jel-brandColor;
  }
  ::v-deep(.el-tabs__item:hover) {
    color: $jel-brandColor;
  }

  .search {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}

.list {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  font-size: 14px;
  color: $jel-font-title;
  cursor: pointer;
}

.item {
  padding: 4px 8px;
  width: fit-content;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.brandActiveItem {
  padding: 4px 8px;
  width: fit-content;
  border: 1px solid $jel-brandColor;
  border-radius: 8px;
}

.typeActiveItem {
  padding: 4px 8px;
  width: fit-content;
  border: 1px solid #f56c6c;
  border-radius: 8px;
}
</style>
