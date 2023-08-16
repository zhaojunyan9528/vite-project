<template>
  <div>
    <Category :scene="scene" />
    <el-card style="margin: 10px 0px">
      <div v-show="scene == 0">
        <!-- 选择三级分类可添加 -->
        <el-button
          :disabled="!categoryStore.c3Id"
          type="primary"
          size="default"
          icon="Plus"
          @click="addSpu"
        >
          添加SPU
        </el-button>
        <el-table border style="margin: 10px 0px" :data="records">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          />
          <el-table-column label="SPU名称" prop="spuName" />
          <el-table-column
            label="SPU描述"
            prop="description"
            show-overflow-tooltip
          />
          <el-table-column label="操作" width="180px">
            <template #default="{ row }">
              <el-button
                type="primary"
                size="small"
                icon="Plus"
                title="添加SKU"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="warning"
                size="small"
                icon="Edit"
                title="修改SPU"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="info"
                size="small"
                icon="View"
                title="查看SKU列表"
                @click="findSku(row)"
              ></el-button>
              <el-popconfirm
                :title="`你确定删除${row.spuName}?`"
                width="200px"
                @confirm="deleteSpu(row)"
              >
                <template #reference>
                  <el-button
                    type="danger"
                    size="small"
                    icon="Delete"
                    title="删除SPU"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @current-change="getList"
          @size-change="getList()"
        />
      </div>
      <!-- 添加SPU|修改SPU子组件 -->
      <SpuForm
        ref="spuRef"
        v-show="scene == 1"
        @changeScene="changeScene"
      ></SpuForm>
      <!-- 添加SKU的子组件 -->
      <SkuForm
        ref="skuRef"
        v-show="scene == 2"
        @changeScene="changeScene"
      ></SkuForm>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import { reqHasSpu } from '@/api/product/spu.ts'
import type { SpuResponseData, SpuRecord } from '@/api/product/type.ts'
import useCategoryStore from '@/store/modules/category.ts'

import SpuForm from './components/SpuForm.vue'
import SkuForm from './components/SkuForm.vue'

const categoryStore = useCategoryStore()
let scene = ref<number>(0)
let spuArr = ref([])
let pageNo = ref<number>(1)
let pageSize = ref<number>(3)
let total = ref<number>(0)
let records = ref<SpuRecord[]>([])
const spuRef = ref()
const skuRef = ref()

watch(
  () => categoryStore.c3Id,
  () => {
    //清空上一次查询的属性与属性值
    spuArr.value = []
    //保证三级分类得有才能发请求
    if (!categoryStore.c3Id) return
    //获取分类的ID
    getList()
  }
)
//路由组件销毁的时候，把仓库分类相关的数据清空
onBeforeUnmount(() => {
  //清空仓库的数据 todo
  // categoryStore.$reset()
})

const getList = (pageNo = 1) => {
  reqHasSpu(pageNo, pageSize.value, categoryStore.c3Id).then(
    (result: SpuResponseData) => {
      total.value = result.data.total
      records.value = result.data.records
    }
  )
}
// 添加spu
const addSpu = () => {
  scene.value = 1
  spuRef.value.initAddSpu(categoryStore.c3Id)
}
// 添加SKU
const addSku = (row: any) => {
  console.log('打印', row)
}
// 修改SPU
const updateSpu = (row: any) => {
  console.log('打印', row)
}
// 查看SKU
const findSku = (row: any) => {
  console.log('打印', row)
}
// 删除SPU
const deleteSpu = (row: any) => {
  console.log('打印', row)
}

const changeScene = (v: any) => {
  console.log('打印', v)
}
</script>
<style lang="scss" scoped></style>
