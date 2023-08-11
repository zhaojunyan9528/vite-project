<template>
  <div class="layout_container">
    <div class="layout_slide">
      <Logo />
      <Navbar :menu-list="userStore.menuRoutes"/>
    </div>
    <div class="layout_tabbar">
      顶部
    </div>
    <div class="layout_main">
      <Main />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Logo from './logo/index.vue'
import Navbar from './navbar/index.vue'
import Main from './main/index.vue'

import useUserStore from '@/store/modules/user.ts'

let userStore = useUserStore()
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
  }
  .layout_tabbar {
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    position: fixed;
    top: 0;
    left: $base-menu-width;
    border-bottom: 1px solid $base-tabbar-border-color;
  }
  .layout_main {
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    position: absolute;
    left: $base-menu-width;
    top: $base-tabbar-height;
    padding: 20px;
    overflow-y: auto;
  }
}
</style>
