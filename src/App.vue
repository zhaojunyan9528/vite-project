<template>
  <div class="box">
    <h1>hello world</h1>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const a = ref('123')
let b = 123
console.log(a, b)
const str = 'aaaa';
console.log(str)
</script>
<style lang="scss" scoped>
.box {
  width: 600px;
  height: 400px;
  background-color: hotpink;
  h1{
    color: yellow;
  }
}
</style>
