import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persist)

export default pinia

export * from './modules/users.ts'
export * from './modules/cate.ts'
export * from './modules/cateToC.ts'
export * from './modules/commission.ts'
