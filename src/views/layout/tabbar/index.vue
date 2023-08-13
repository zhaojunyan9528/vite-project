<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <el-icon @click="handleExpand">
        <Component :is="!expand ? 'Fold' : 'Expand'"></Component>
      </el-icon>
      <el-breadcrumb separator-icon="ArrowRight" class="myBread">
        <el-breadcrumb-item
          v-for="(item, index) in $route.matched"
          v-show="item.meta.title"
          :to="item.path"
          :key="index"
          class="myBread_item"
        >
          <el-icon class="center">
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span>{{ item.meta.title }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="tabbar_right">
      <el-button
        size="small"
        icon="Refresh"
        circle
        @click="handleRefresh"
      ></el-button>
      <el-button
        size="small"
        icon="FullScreen"
        circle
        @click="fullScreen"
      ></el-button>
      <el-button size="small" icon="Setting" circle></el-button>
      <img src="@/assets/vue.svg" alt="" />
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ userStore.username }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useUserStore from '@/store/modules/user.ts'
import useLayoutSettingStore from '@/store/modules/setting.ts'
const useSettingStore = useLayoutSettingStore()
const userStore = useUserStore()

const expand = computed(() => {
  return useSettingStore.expand
})
const handleExpand = () => {
  useSettingStore.expand = !useSettingStore.expand
}
const $route = useRoute()
const $router = useRouter()
const handleRefresh = () => {
  useSettingStore.refreshKey = useSettingStore.refreshKey + 1
}

//全屏按钮点击的回调
const fullScreen = () => {
  //DOM对象的一个属性:可以用来判断当前是不是全屏模式[全屏:true,不是全屏:false]
  let full = document.fullscreenElement
  //切换为全屏模式
  if (!full) {
    //文档根节点的方法requestFullscreen,实现全屏模式
    document.documentElement.requestFullscreen()
  } else {
    //变为不是全屏模式->退出全屏模式
    document.exitFullscreen()
  }
}
//退出登录点击回调
const logout = async () => {
  //第一件事情:需要向服务器发请求[退出登录接口]******
  //第二件事情:仓库当中关于用于相关的数据清空[token|username|avatar]
  //第三件事情:跳转到登录页面
  await userStore.userLogout()
  //跳转到登录页面
  $router.push({ path: '/login', query: { redirect: $route.path } })
}
</script>
<script lang="ts">
export default {
  name: 'Tabbar'
}
</script>
<style lang="scss" scoped>
@mixin flex {
  display: flex;
  align-items: center;
}
.tabbar {
  @include flex;
  justify-content: space-between;
  height: 100%;
  padding: 20px;
  .tabbar_left {
    @include flex;
    .myBread {
      margin-left: 20px;
    }
  }
  .tabbar_right {
    @include flex;
    img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      vertical-align: middle;
      margin: 0 10px 0 20px;
    }
  }
}
.center {
  vertical-align: bottom;
  margin-right: 5px;
}
</style>