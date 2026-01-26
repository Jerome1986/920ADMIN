<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { UserItem } from '@/types/UserItem.d.ts'
import { formatGender, formatName, formatRole, formatTimestamp } from '@/utils'
import { Delete, Edit } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import UserChannel from '@/views/user/components/UserChannel.vue'
import { userDataDeleteApi, userDataGetApi, userSearchApi } from '@/api/user.ts'
import { ElMessage, ElMessageBox, type TabsPaneContext } from 'element-plus'

// 加载
const loading = ref(true)
// 弹窗组件
const dialog = ref()

// 分页
const params = ref({
  pageNum: 1,
  pageSize: 10
})

const total = ref(0)

// 条数改变
const handleSizeChange = (size: number) => {
  console.log(size)
  params.value.pageNum = 1
  // 如果搜索有值就请求搜索结果，反之直接渲染
  if (searchValue.value) {
    searchMaterialGet()
  } else {
    userListGet(role.value, params.value.pageNum, size)
  }
}

// 页数改变
const handleCurrentChange = (pageNum: number) => {
  console.log(pageNum)
  if (searchValue.value) {
    searchMaterialGet()
  } else {
    userListGet(role.value, pageNum, params.value.pageSize)
  }
}

// 搜索
const searchValue = ref('')
const searchMaterialGet = async () => {
  loading.value = true
  params.value.pageNum = 1
  const res = await userSearchApi(
    searchValue.value,
    role.value,
    params.value.pageNum,
    params.value.pageSize
  )
  console.log(res.data)
  userList.value = res.data.list
  total.value = res.data.total
  loading.value = false
}

// 清除搜索
const handleClearSearch = () => {
  params.value.pageNum = 1
  userListGet(role.value, params.value.pageNum, params.value.pageSize)
}

// 用户数据
const userList = ref<UserItem[]>([])
const userListGet = async (role: string | number, pageNum: number, pageSize: number) => {
  loading.value = true
  const res = await userDataGetApi(role, pageNum, pageSize)
  userList.value = res.data.list
  total.value = res.data.total
  loading.value = false
}

// 编辑
const onEditChannel = (row: UserItem) => {
  console.log(row)
  dialog.value.open(row)
}

// 删除
const onDelChannel = (row: UserItem) => {
  console.log(row)
  ElMessageBox.confirm('你确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'el-button--danger' // Element 内置类
  })
    .then(async () => {
      const delRes = await userDataDeleteApi(row._id)
      if (delRes.data.acknowledged) {
        ElMessage.success('删除成功')
        await userListGet(role.value, params.value.pageNum, params.value.pageSize)
      } else {
        ElMessage.error('删除失败')
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

// 子组件提交提交成功
const handleSuccess = () => {
  userListGet(role.value, params.value.pageNum, params.value.pageSize)
}

// TAB 栏 根据用户身份渲染用户信息
const activeName = ref('all')
const role = ref<string | number>('all')
const handleClick = (tab: TabsPaneContext) => {
  params.value.pageNum = 1 // 重置页码
  searchValue.value = '' // 重置搜索
  role.value = tab.paneName ?? 'all'
  userListGet(role.value, params.value.pageNum, params.value.pageSize)
}

onMounted(() => userListGet(role.value, params.value.pageNum, params.value.pageSize))
</script>

<template>
  <!-- 非会员用户 -->
  <PageContainer title="用户列表">
    <div class="header">
      <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick">
        <el-tab-pane label="所有" name="all"></el-tab-pane>
        <el-tab-pane label="用户" name="user"></el-tab-pane>
        <el-tab-pane label="会员" name="vip"></el-tab-pane>
        <el-tab-pane label="店长" name="manager"></el-tab-pane>
      </el-tabs>
      <!--   搜索   -->
      <div class="search">
        <el-input
          v-model="searchValue"
          style="width: 240px; margin-right: 8px"
          placeholder="根据手机号或邀请码搜索"
          clearable
          @clear="handleClearSearch"
        />
        <el-button type="danger" @click="searchMaterialGet">查询</el-button>
      </div>
    </div>
    <el-table :data="userList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" align="center" width="60" type="index"></el-table-column>
      <el-table-column label="角色" align="center" prop="role">
        <template #default="{ row }">
          {{ formatRole(row.role) }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" prop="name" width="80">
        <template #default="{ row }">
          {{ formatName(row.name) }}
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" prop="gender" width="60">
        <template #default="{ row }">
          {{ formatGender(row.gender) }}
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" prop="mobile"></el-table-column>
      <el-table-column label="头像" align="center" prop="avatarUrl">
        <template #default="{ row }">
          <img
            style="width: 50px; height: 50px; border-radius: 50%"
            :src="row.avatarUrl"
            alt="avatar"
          />
        </template>
      </el-table-column>
      <el-table-column label="邀请码" align="center" prop="referralCode"></el-table-column>
      <el-table-column label="上级" align="center" prop="inviterCode">
        <template #default="{ row }">
          {{ row.inviterCode ? row.inviterCode : '无' }}
        </template>
      </el-table-column>
      <el-table-column label="积分" align="center" prop="score"> </el-table-column>
      <el-table-column label="注册时间" align="center" prop="registerTime" width="160">
        <template #default="{ row }">
          {{ formatTimestamp(row.registerTime, 2) }}
        </template>
      </el-table-column>
      <el-table-column label="账号状态" align="center" prop="status">
        <template #default="{ row }">
          {{ row.status === 'active' ? '正常' : '禁用' }}
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
  <!-- 编辑组件 -->
  <UserChannel ref="dialog" @success="handleSuccess"></UserChannel>
</template>

<style scoped lang="scss">
.page-container {
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

    .search {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
}
</style>
