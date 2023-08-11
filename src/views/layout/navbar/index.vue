<template>
  <div class="navbar">
    <el-scrollbar max-height="100%">
      <el-menu
        :default-active="activeMenu"
        :active-text-color="variables.menuActiveText"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        router
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
      >
        <template v-for="(menu, index) in menuList">
          <div v-if="!menu.meta.hidden" :key="index">
            <el-menu-item v-if="!menu.children" :index="menu.path" @click="menuClick">
              <template #title>
                <el-icon v-if="menu.meta.icon">
                  <component :is="menu.meta.icon" />
                </el-icon>
                <span>{{ menu.meta.title }}</span>
              </template>
            </el-menu-item>

            <el-menu-item
              v-else-if="menu.children && getChildLength(menu.children) <= 1"
              :index="menu.children[0].path"
              @click="menuClick"
            >
              <template #title>
                <el-icon v-if="menu.children[0].meta.icon">
                  <component :is="menu.children[0].meta.icon" />
                </el-icon>
                <span>{{ menu.children[0].meta.title }}</span>
              </template>
            </el-menu-item>

            <el-sub-menu v-else :index="menu.path">
              <template #title>
                <el-icon><component :is="menu.meta.icon" /></el-icon>
                <span>{{ menu.meta.title }}</span>
              </template>
              <MenuBar :menu-list="menu.children" />
              <!-- <template v-for="child in menu.children">
                <el-menu-item
                  v-if="!child.hidden"
                  :key="child.path"
                  :index="child.path"
                >
                  {{ child.meta.title }}
                </el-menu-item>
              </template> -->
            </el-sub-menu>
          </div>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
export default {
  name: 'MenuBar'
}
</script>
<script lang="ts" setup>
import { ref } from 'vue'
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting
} from '@element-plus/icons-vue'
import variables from '../variable.module.scss'
defineProps(['menuList'])

const activeMenu = ref('2')
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const getChildLength = (arr: any) => {
  return arr.filter((item) => !item.meta.hidden).length
}
const menuClick = (v) => {
  console.log('打印', v)
}
</script>
<style lang="scss" scoped>
.navbar {
  color: white;
  // height: 100%;
}

.el-menu {
  border-right: none;
}
.el-sub-menu .el-menu-item {
  padding-left: 40px !important;
}
</style>
