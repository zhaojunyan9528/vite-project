<template>
  <div class="page">
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts" setup></script>
<style lang="scss" scoped>
.page {
  height: 100vh;
  overflow: hidden;
}
</style>
