<template>
  <!-- <div class="navbar"> -->
  <template v-for="(menu, index) in menuList">
    <template v-if="!menu.meta.hidden">
      <el-menu-item
        v-if="!menu.children"
        :key="index"
        :index="menu.path"
        @click="menuClick"
      >
        <el-icon v-if="menu.meta.icon">
          <component :is="menu.meta.icon" />
        </el-icon>
        <template #title>
          <span>{{ menu.meta.title }}</span>
        </template>
      </el-menu-item>

      <el-menu-item
        v-else-if="menu.children && getChildLength(menu.children) <= 1"
        :key="index + 'one'"
        :index="menu.children[0].path"
        @click="menuClick"
      >
        <el-icon v-if="menu.children[0].meta.icon">
          <component :is="menu.children[0].meta.icon" />
        </el-icon>
        <template #title>
          <span>{{ menu.children[0].meta.title }}</span>
        </template>
      </el-menu-item>

      <el-sub-menu v-else :index="menu.path" :key="index + 'sub'">
        <template #title>
          <el-icon><component :is="menu.meta.icon" /></el-icon>
          <span>{{ menu.meta.title }}</span>
        </template>
        <Menu :menu-list="menu.children" />
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
    </template>
  </template>
  <!-- </div> -->
</template>

<script lang="ts">
export default {
  name: 'Menu'
}
</script>
<script lang="ts" setup>
defineProps(['menuList'])

const getChildLength = (arr: any) => {
  return arr.filter((item: any) => !item.meta.hidden).length
}
const menuClick = () => {
  // console.log('打印', v)
}
</script>
<style lang="scss" scoped>
.navbar {
  color: white;
  // height: 100%;
}

.el-sub-menu .el-menu-item {
  padding-left: 40px !important;
}
</style>
