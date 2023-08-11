<template>
  <div v-if="config.logoShow" class="logo">
    <img :src="config.logo" class="logo_img" />
    <p>{{ config.title }}</p>
  </div>
</template>

<script langs="ts" setup>
import config from '@/config.ts'
</script>
<style lang="scss" scoped>
.logo {
  width: 100%;
  height: 50px;
  padding: 0 20px;
  display: flex;
  color: white;
  align-items: center;
  .logo_img {
    height: 30px;
    margin-right: 10px;
  }
}
</style>
