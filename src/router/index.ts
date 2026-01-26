import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      children: [
        {
          path: '/home',
          component: () => import('@/views/home/HomePage.vue')
        },
        // 运营管理
        {
          path: '/operation',
          component: () => import('@/views/operation/OperationPage.vue'),
          children: [
            {
              path: '/operation/banner',
              component: () => import('@/views/operation/banner/BannerPage.vue')
            },
            {
              path: '/operation/guess',
              component: () => import('@/views/operation/guess/GuessPage.vue')
            },
            {
              path: '/operation/team',
              component: () => import('@/views/operation/team/TeamPage.vue')
            }
          ]
        },

        { path: '/user', component: () => import('@/views/user/UserPages.vue') },
        { path: '/store', component: () => import('@/views/manager/StoreManager.vue') },
        // B端业务管理
        {
          path: '/toB',
          component: () => import('@/views//business/BusinessManagement.vue'),
          redirect: '/toB/category',
          children: [
            {
              path: '/toB/category', // 产品分类
              component: () => import('@/views/business/category/CategoryPage.vue'),
              children: [
                {
                  path: '/toB/category/firstCategory', // 一级分类
                  component: () => import('@/views/business/category/FirstCatePage.vue')
                },
                {
                  path: '/toB/category/secondCategory', // 二级分类
                  component: () => import('@/views/business/category/SecondCatePage.vue')
                },
                {
                  path: '/toB/category/thirdCategory', // 三级分类
                  component: () => import('@/views/business/category/ThirdCatePage.vue')
                }
              ]
            },
            {
              path: '/toB/product',
              component: () => import('@/views/business/product/ProductPage.vue')
            },
            {
              path: '/toB/managerOrder',
              component: () => import('@/views/business/managerOrder/ManagerOrder.vue')
            },
            {
              path: '/toB/offlineOrder',
              component: () => import('@/views/business/offlineOrder/OfflineOrder.vue')
            }
          ]
        },

        // C端业务管理
        {
          path: '/toC',
          component: () => import('@/views/consumerBusiness/ConsumerBusiness.vue'),
          children: [
            // 分类管理
            {
              path: '/toC/category',
              component: () => import('@/views/consumerBusiness/category/CategoryPage.vue'),
              children: [
                {
                  path: '/toC/category/firstCategory',
                  component: () => import('@/views/consumerBusiness/category/FirstCatePage.vue')
                },
                {
                  path: '/toC/category/secondCategory',
                  component: () => import('@/views/consumerBusiness/category/SecondCatePage.vue')
                }
              ]
            },
            // 商品管理
            {
              path: '/toC/product',
              component: () => import('@/views/consumerBusiness/tocProduct/TocProductPage.vue')
            },
            {
              path: '/toC/order',
              redirect: '/order/productOrder',
              component: () => import('@/views/consumerBusiness/order/OrderPage.vue'),
              children: [
                {
                  path: '/toC/order/productOrder',
                  component: () =>
                    import('@/views/consumerBusiness/order/components/ProductOrder.vue')
                },
                {
                  path: '/toC/order/vipOrder',
                  component: () => import('@/views/consumerBusiness/order/components/VipOrder.vue')
                }
              ]
            }
          ]
        },

        { path: '/vipPro', component: () => import('@/views/vipProduct/VipProductPage.vue') },
        { path: '/rate', component: () => import('@/views/rate/RateManager.vue') },
        {
          path: '/inventory',
          component: () => import('@/views/inventorySet/InventorySetting.vue')
        },
        // 佣金设置
        {
          path: '/commission',
          component: () => import('@/views/commission/CommissionSetting.vue')
        },
        {
          path: '/settlement',
          component: () => import('@/views/settlement/SettlementPage.vue')
        }
      ]
    },
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') }
  ]
})

// 全局路由守卫
router.beforeEach((to) => {
  const userStore = useUserStore()
  const remainingMs = userStore.expiresAt - Date.now() // 毫秒数

  if ((!userStore.token || remainingMs <= 0) && to.path !== '/login') {
    return '/login'
  }
})

export default router
