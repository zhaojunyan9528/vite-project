<template>
  <el-card>
    <el-table :data="skuArr" border style="margin: 10px 0">
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="80px"
      ></el-table-column>
      <el-table-column
        label="名称"
        show-overflow-tooltip
        prop="skuName"
      ></el-table-column>
      <el-table-column
        label="描述"
        show-overflow-tooltip
        prop="skuDesc"
      ></el-table-column>
      <el-table-column label="图片" width="150px">
        <template #default="{ row }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>
      <el-table-column label="重量" prop="weight"></el-table-column>
      <el-table-column label="价格" prop="price"></el-table-column>
      <el-table-column label="操作" width="250px" fixed="right">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            title="上架/下架"
            :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
            @click="updateSale(row)"
          ></el-button>
          <el-button
            type="warning"
            size="small"
            icon="Edit"
            title="更新Sku"
            @click="updateSku"
          ></el-button>
          <el-button
            type="info"
            size="small"
            icon="InfoFilled"
            title="查看Sku"
            @click="findSku(row)"
          ></el-button>
          <el-popconfirm
            :title="`你确定要删除${row.skuName}?`"
            width="200px"
            @confirm="removeSku(row.id)"
          >
            <template #reference>
              <el-button type="danger" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="page"
      v-model:page-size="limit"
      :page-sizes="[5, 10, 20, 30, 40]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="getList"
      @size-change="handleSizeChange"
    />
    <el-drawer v-model="drawer">
      <!-- 标题部分 -->
      <template #header>
        <h4>查看商品的详情</h4>
      </template>
      <template #default>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag
              v-for="item in skuInfo.skuAttrValueList"
              :key="item.id"
              style="margin: 5px"
            >
              {{ item.valueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag
              v-for="item in skuInfo.skuSaleAttrValueList"
              :key="item.id"
              style="margin: 5px"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item
                v-for="item in skuInfo.skuImageList"
                :key="item.id"
              >
                <img
                  :src="item.imgUrl"
                  alt=""
                  style="width: 100%; height: 100%"
                />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, onMounted, inject } from 'vue'
import {
  reqSkuData,
  reqCancelSale,
  reqSaleSku,
  reqSkuInfo,
  reqDeleteSku
} from '@/api/product/sku.ts'
import type { SkuData, SkuResponseData } from '@/api/product/type.ts'

const $message: any = inject('$message')
let skuArr = ref<SkuData[]>([])
let page = ref<number>(1)
let limit = ref<number>(5)
let total = ref<number>(0)
let skuInfo = ref<any>({})
let drawer = ref(false)
onMounted(() => {
  getList()
})
const getList = (pager = 1) => {
  page.value = pager
  reqSkuData(page.value, limit.value).then((res: SkuResponseData) => {
    skuArr.value = res.data.records
    total.value = res.data.total
  })
}
const handleSizeChange = () => {
  getList()
}
// 上下架
const updateSale = (row: any) => {
  if (row.isSale == 1) {
    //下架操作
    reqCancelSale(row.id as number).then(() => {
      $message.success('下架成功')
      //发请求获取当前更新完毕的全部已有的SKU
      getList(page.value)
    })
  } else {
    //下架操作
    reqSaleSku(row.id as number).then(() => {
      $message.success('上架成功')
      //发请求获取当前更新完毕的全部已有的SKU
      getList(page.value)
    })
  }
}
// todo
const updateSku = (val: any) => {
  console.log('打印', val)
}
const findSku = (val: any) => {
  console.log('打印', val)
  drawer.value = true
  reqSkuInfo(val.id).then((res) => {
    skuInfo.value = res.data
  })
}
const removeSku = (id: any) => {
  console.log('打印', id)
  reqDeleteSku(id).then(() => {
    $message.success('删除成功')
    getList(skuArr.value.length > 1 ? page.value : page.value - 1)
  })
}
</script>
<style lang="scss" scoped></style>
