<template>
  <div>
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" :key="refreshKey" />
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Main'
}
</script>
<script lang="ts" setup>
import { computed } from 'vue'
import useLayoutSettingStore from '@/store/modules/setting.ts'

const useSettingStore = useLayoutSettingStore()
const refreshKey = computed(() => {
  return useSettingStore.refreshKey
})
</script>
<style lang="scss" scoped>
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: all 1s;
}
.fade-enter-to {
  opacity: 1;
}
</style>
