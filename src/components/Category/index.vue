<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select
          v-model="categoryStore.c1Id"
          :disabled="scene != 0"
          @change="handleChange"
        >
          <el-option
            v-for="(c1, index) in categoryStore.c1Arr"
            :key="Number(c1.id) + index"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="二级分类">
        <el-select
          v-model="categoryStore.c2Id"
          :disabled="scene != 0"
          @change="handleChange1"
        >
          <el-option
            v-for="(c2, index) in categoryStore.c2Arr"
            :key="Number(c2.id) + index"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="三级分类">
        <el-select v-model="categoryStore.c3Id" :disabled="scene != 0">
          <el-option
            v-for="(c3, index) in categoryStore.c3Arr"
            :key="Number(c3.id) + index"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import useCategoryStore from '@/store/modules/category'
const categoryStore = useCategoryStore()
defineProps(['scene'])

onMounted(() => {
  categoryStore.getC1()
})

const handleChange = () => {
  // 需要将二级、三级分类的数据清空
  categoryStore.c2Id = ''
  categoryStore.c3Arr = []
  categoryStore.c3Id = ''
  //通知仓库获取二级分类的数据
  categoryStore.getC2()
}
const handleChange1 = () => {
  categoryStore.c3Id = ''
  categoryStore.getC3()
}
</script>
<style lang="scss" scoped></style>
