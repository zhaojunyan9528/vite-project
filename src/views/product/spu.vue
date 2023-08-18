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
          <el-table-column label="操作" width="200px">
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
        v-show="scene == 1"
        ref="spuRef"
        @changeScene="changeScene"
      ></SpuForm>
      <!-- 添加SKU的子组件 -->
      <SkuForm
        v-show="scene == 2"
        ref="skuRef"
        @changeScene="changeScene"
      ></SkuForm>
      <!-- 查看spu -->
      <el-dialog v-model="showDialog" title="SKU列表">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #default="{ row }">
              <img
                :src="row.skuDefaultImg"
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onBeforeUnmount, inject, onMounted } from 'vue'
import { reqHasSpu, reqDeleteSpu, reqFindSkuById } from '@/api/product/spu.ts'
import type { SpuResponseData, SpuRecord, SkuData } from '@/api/product/type.ts'
import useCategoryStore from '@/store/modules/category.ts'
const $message: any = inject('$message')

import SpuForm from '@/views/product/components/SpuForm.vue'
import SkuForm from '@/views/product/components/SkuForm.vue'

const categoryStore = useCategoryStore()
let scene = ref<number>(0)
let spuArr = ref([])
let pageNo = ref<number>(1)
let pageSize = ref<number>(3)
let total = ref<number>(0)
let records = ref<SpuRecord[]>([])
const spuRef = ref()
const skuRef = ref()
let showDialog = ref(false)
let skuArr = ref<SkuData[]>([])
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
  //清空仓库的数据
  categoryStore.$reset()
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
  scene.value = 2
  skuRef.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}
// 修改SPU
const updateSpu = (row: any) => {
  scene.value = 1
  spuRef.value.initUpdateSpu(row)
}
// 查看SKU
const findSku = (row: any) => {
  reqFindSkuById(row.id).then((res) => {
    skuArr.value = res.data
    showDialog.value = true
  })
}
// 删除SPU
const deleteSpu = (row: any) => {
  console.log('打印', row)
  reqDeleteSpu(row.id).then(() => {
    $message.success('删除成功')
    getList(records.value.length > 1 ? pageNo.value : 1)
  })
}

const changeScene = (v: any) => {
  console.log('打印', v)
  scene.value = v.flag
  if (v.params === 'update') {
    // 更新留在当前页面
    getList(pageNo.value)
  } else {
    getList()
  }
}
</script>
<style lang="scss" scoped></style>
