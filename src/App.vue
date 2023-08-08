<template>
  <div class="box">
    <h1>
      hello world
      <img src="@/assets/vue.svg" alt="" />
      <img src="@/assets/icons/icon_steel.svg" alt="" />
      <svg :style="{ width: 100, height: 100 }">
        <use xlink:href="#icon-pencil" fill="#00AC72"></use>
      </svg>
      <SvgIcon
        width="100"
        height="100"
        prefix="#icon-"
        name="pencil"
        color="#ff00ff"
      />
    </h1>
    <Button />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/Button.vue'
const a = ref('123')
let b = 123
console.log(a, b)
const str = 'aaaa'
console.log(str)
</script>
<style lang="scss" scoped>
.box {
  width: 600px;
  height: 400px;
  // background-color: hotpink;
  h1 {
    color: $--primary-color;
  }
}
</style>
