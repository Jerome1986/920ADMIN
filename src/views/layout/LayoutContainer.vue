<script setup lang="ts">
import {
  Box,
  CaretBottom,
  Cellphone,
  ChatSquare,
  Coin,
  Collection,
  Crop,
  EditPen,
  GoldMedal,
  Goods,
  Guide,
  House,
  Iphone,
  Monitor,
  OfficeBuilding,
  Picture,
  PieChart,
  Search,
  Ship,
  ShoppingBag,
  Star,
  SwitchButton,
  User
} from '@element-plus/icons-vue'

const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const loginOut = () => {
  console.log('退出登录')
}
</script>

<template>
  <!-- 单一容器：左侧 Aside + 右侧内容容器（Header/Main/Footer） -->
  <el-container class="layoutContainer">
    <el-aside width="180px" style="background-color: #ffffff; border-right: 2px solid #f1f1f1">
      <div class="logo">
        <img class="logoPic" src="@/assets/images/logo.png" alt="logo" />
        <p style="color: #d62731">管理系统</p>
      </div>
      <el-menu
        active-text-color="#d62731"
        background-color="#ffffff"
        class="el-menu-vertical-demo"
        :default-active="$route.path"
        text-color="#333"
        :router="true"
        @select="handleSelect"
      >
        <el-menu-item index="/home">
          <el-icon><House /></el-icon>
          <span>首页统计</span>
        </el-menu-item>
        <!-- 运营管理 -->
        <el-sub-menu index="/operation">
          <template #title>
            <el-icon>
              <Monitor />
            </el-icon>
            <span>运营管理</span>
          </template>

          <el-menu-item index="/operation/banner">
            <el-icon><Picture /></el-icon>
            <span>轮播图管理</span>
          </el-menu-item>
          <el-menu-item index="/operation/guess">
            <el-icon><Search /></el-icon>
            <span>猜你想搜</span>
          </el-menu-item>
          <!--团队风采-->
          <el-menu-item index="/operation/team">
            <el-icon><Ship /></el-icon>
            <span>团队风采</span>
          </el-menu-item>
        </el-sub-menu>
        <!--门店管理-->
        <el-menu-item index="/store">
          <el-icon><ShoppingBag /></el-icon>
          <span>门店管理</span>
        </el-menu-item>
        <!--用户管理-->
        <el-menu-item index="/user">
          <el-icon>
            <User />
          </el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <!--  B端业务--一级菜单   -->
        <el-sub-menu index="/toB">
          <template #title>
            <el-icon><OfficeBuilding /></el-icon>
            <span>B端业务</span>
          </template>
          <!--  分类--二级菜单  -->
          <el-sub-menu index="/toB/category">
            <template #title>
              <el-icon><Iphone /></el-icon>
              <span>产品分类</span>
            </template>
            <el-menu-item index="/toB/category/firstCategory">
              <span>一级分类</span>
            </el-menu-item>
            <el-menu-item index="/toB/category/secondCategory">
              <span>二级分类</span>
            </el-menu-item>
            <el-menu-item index="/toB/category/thirdCategory">
              <span>三级分类</span>
            </el-menu-item>
          </el-sub-menu>
          <!--商品管理-->
          <el-menu-item index="/toB/product">
            <el-icon>
              <Box />
            </el-icon>
            <span>商品管理</span>
          </el-menu-item>
          <el-menu-item index="/toB/managerOrder">
            <el-icon>
              <Cellphone />
            </el-icon>
            <span>店长订单</span>
          </el-menu-item>
          <el-menu-item index="/toB/offlineOrder">
            <el-icon><Guide /></el-icon>
            <span>门店订单</span>
          </el-menu-item>
        </el-sub-menu>
        <!--  C端业务--一级菜单   -->
        <el-sub-menu index="/toC">
          <template #title>
            <el-icon><ChatSquare /></el-icon>
            <span>C端业务</span>
          </template>
          <!--  分类--二级菜单  -->
          <el-sub-menu index="/toC/category">
            <template #title>
              <el-icon><Iphone /></el-icon>
              <span>商品分类</span>
            </template>
            <el-menu-item index="/toC/category/firstCategory">
              <span>一级分类</span>
            </el-menu-item>
            <el-menu-item index="/toC/category/secondCategory">
              <span>二级分类</span>
            </el-menu-item>
          </el-sub-menu>
          <!--商品管理-->
          <el-menu-item index="/toC/product">
            <el-icon>
              <Box />
            </el-icon>
            <span>商品管理</span>
          </el-menu-item>
          <!--订单管理-->
          <el-sub-menu index="/toC/order">
            <template #title>
              <el-icon>
                <Collection />
              </el-icon>
              <span>订单管理</span>
            </template>
            <el-menu-item index="/toC/order/productOrder">
              <el-icon>
                <Cellphone />
              </el-icon>
              <span>商品订单</span>
            </el-menu-item>
            <el-menu-item index="/toC/order/vipOrder">
              <el-icon>
                <Cellphone />
              </el-icon>
              <span>会员订单</span>
            </el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
        <!--办理会员-->
        <el-menu-item index="/vipPro">
          <el-icon>
            <Star />
          </el-icon>
          <span>会员产品</span>
        </el-menu-item>

        <!-- 积分设置 -->
        <el-menu-item index="/rate">
          <el-icon><GoldMedal /></el-icon>
          <span>积分管理</span>
        </el-menu-item>
        <!-- 库存配置 -->
        <el-menu-item index="/inventory">
          <el-icon><Goods /></el-icon>
          <span>库存设置</span>
        </el-menu-item>
        <!-- 佣金设置 -->
        <el-menu-item index="/commission">
          <el-icon>
            <Coin />
          </el-icon>
          <span>佣金设置</span>
        </el-menu-item>
        <!--  结算管理  settlement-->
        <el-menu-item index="/settlement">
          <el-icon>
            <PieChart />
          </el-icon>
          <span>结算管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 右侧内容容器 -->
    <el-container class="contentContainer">
      <el-header>
        <div class="header-left">早安，今天又是充满活力的一天</div>
        <el-dropdown placement="bottom-end">
          <span class="el-dropdown__box">
            <el-avatar />
            <el-icon>
              <CaretBottom />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile" :icon="User">基本资料</el-dropdown-item>
              <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
              <el-dropdown-item command="password" :icon="EditPen">重置密码</el-dropdown-item>
              <el-dropdown-item @click="loginOut" command="logout" :icon="SwitchButton"
                >退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.layoutContainer {
  height: 100vh;
  color: #ffffff;
  background-color: $jel-backGroudColor;
}

/* 右侧内容容器：列布局 + 自身滚动，让 Header sticky 生效 */
.contentContainer {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  overflow: auto;
}

.logo {
  padding: 0 4px;
  display: flex;
  align-items: center;
  font-size: 20px;

  .logoPic {
    margin-right: 10px;
    width: fit-content;
    height: 50px;
    border-radius: 50%;
  }
}

.el-menu-vertical-demo {
  border: none;
}

.el-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: $jel-font-title;
  padding: 0 12px;

  .header-left {
    font-size: 20px;
    color: $jel-font-dec2;
  }

  .el-dropdown__box {
    display: flex;
    align-items: center;

    .el-icon {
      color: $jel-font-dec2;
      margin-left: 10px;
    }

    &:active,
    &:focus {
      outline: none;
    }
  }
}

.el-main {
  flex: 1;
  overflow: auto;
}
</style>
