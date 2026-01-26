<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import { validateUser } from '@/utils'
import { ElMessage } from 'element-plus'
import { loginApi } from '@/api/login.ts'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

// 定义store
const userStore = useUserStore()
// 定义路由
const router = useRouter()

// 基础数据
const userData = ref({
  username: '',
  password: ''
})

// 记住我
const remenber = ref(false)

// 点击登录
const login = async () => {
  // 验证字段
  const result = validateUser(userData.value)

  if (!result.valid) {
    ElMessage({
      type: 'error',
      message: result.message
    })
    return
  }

  // 验证通过开始登录
  try {
    const loginRes = await loginApi(userData.value.username, userData.value.password)
    console.log('登录结果', loginRes)
    // 成功：保存 token 并跳转
    userStore.setToken(loginRes.data.token, loginRes.data.expiresAt)
    if (remenber.value) {
      userStore.setUsername(loginRes.data.user.username)
    }
    await router.push('/')
    ElMessage({ type: 'success', message: loginRes.message })
  } catch (error: unknown) {
    // 失败：request 内已统一提示，这里不再重复弹窗
    console.error('登录失败', error)
  }
}

// 忘记密码
const forgetPassword = () => {
  ElMessage('请联系管理员')
}

// 页面加载完毕时
onMounted(() => {
  console.log('用户名', userStore.username)
  // 进页面检查是否勾选了记住我
  if (userStore.username) {
    remenber.value = true
    userData.value.username = userStore.username
  } else {
    remenber.value = false
  }

  //  只要进入到登录页就清除token
  if (userStore.token) {
    userStore.clearToken()
  }
})
</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <el-form size="large" autocomplete="off">
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="userData.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="userData.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            @keydown.enter="login"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox v-model="remenber">记住我</el-checkbox>
            <el-link type="primary" :underline="false" @click="forgetPassword">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;

  .bg {
    background:
      url('@/assets/images/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/images/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;

    .title {
      margin: 0 auto;
    }

    .button {
      width: 100%;
    }

    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
