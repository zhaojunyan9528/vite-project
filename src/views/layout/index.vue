<template>
  <div class="layout_container">
    <div class="layout_slide" :class="useSettingStore.expand ? 'fold' : ''">
      <Logo />
      <el-scrollbar max-height="100%">
        <el-menu
          :default-active="$route.path"
          :active-text-color="variables.menuActiveText"
          :background-color="variables.menuBg"
          :text-color="variables.menuText"
          :collapse="expand"
          router
          class="el-menu-vertical-demo"
        >
          <Menu :menu-list="userStore.menuRoutes" />
        </el-menu>
      </el-scrollbar>
    </div>
    <div class="layout_tabbar" :class="useSettingStore.expand ? 'fold' : ''">
      <Tabbar />
    </div>
    <div class="layout_main" :class="useSettingStore.expand ? 'fold' : ''">
      <Main />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import Logo from './logo/index.vue'
import Menu from './navbar/index.vue'
import Main from './main/index.vue'
import Tabbar from './tabbar/index.vue'

import useUserStore from '@/store/modules/user.ts'
import useLayoutSettingStore from '@/store/modules/setting.ts'
import variables from './variable.module.scss'
import { useRoute } from 'vue-router'
const useSettingStore = useLayoutSettingStore()
let userStore = useUserStore()
const expand = computed(() => {
  return useSettingStore.expand
})
const $route = useRoute()
</script>
<script lang="ts">
export default {
  name: 'Layout'
}
</script>

<style lang="scss" scoped>
@import './variable.module.scss';
.layout_container {
  width: 100%;
  height: 100vh;
  // background: hotpink;
  .layout_slide {
    width: $base-menu-width;
    height: 100%;
    background-color: $base-menu-bgcolor;
    transition: all 0.3s;
    &.fold {
      width: $base-menu-min-width;
    }
  }
  .layout_tabbar {
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    position: fixed;
    top: 0;
    left: $base-menu-width;
    border-bottom: 1px solid $base-tabbar-border-color;
    transition: all 0.3s;
    &.fold {
      width: calc(100% - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
  .layout_main {
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    position: absolute;
    left: $base-menu-width;
    top: $base-tabbar-height;
    padding: 20px;
    overflow-y: auto;
    &.fold {
      width: calc(100% - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
}
.el-menu {
  border-right: none;
}
</style>
