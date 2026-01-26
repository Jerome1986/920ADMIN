import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户模块
export const useUserStore = defineStore(
  'zero-user',
  () => {
    // 定义 token
    const token = ref('')
    // token的剩余时间
    const expiresAt = ref(Date.now())
    // 设置 token
    const setToken = (t: string, expires: number) => {
      token.value = t
      expiresAt.value = expires
    }

    // 设置记住我
    const username = ref('')
    const setUsername = (value: string) => {
      username.value = value
    }

    // 清空token
    const clearToken = () => (token.value = '')

    return {
      token,
      username,
      expiresAt,
      setUsername,
      setToken,
      clearToken
    }
  },
  {
    persist: true // 持久化
  }
)
