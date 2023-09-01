<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input v-model="skuParams.skuName" placeholder="SKU名称"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input
        v-model="skuParams.price"
        placeholder="价格(元)"
        type="number"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(g)">
      <el-input
        v-model="skuParams.weight"
        placeholder="重量(g)"
        type="number"
      ></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input
        v-model="skuParams.skuDesc"
        placeholder="SKU描述"
        type="textarea"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item
          v-for="(item, index) in attrArr"
          :key="index"
          :label="item.attrName"
        >
          <el-select v-model="item.attrIdAndValueId">
            <el-option
              v-for="(attrValue, jindex) in item.attrValueList"
              :key="jindex"
              :value="`${item.id}:${attrValue.id}`"
              :label="attrValue.valueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item
          v-for="(item, index) in saleArr"
          :key="item.id + index"
          :label="item.saleAttrName"
        >
          <el-select v-model="item.saleIdAndValueId">
            <el-option
              v-for="(saleAttrValue, iindex) in item.spuSaleAttrValueList"
              :key="saleAttrValue.id + iindex"
              :value="`${item.id}:${saleAttrValue.id}`"
              :label="saleAttrValue.saleAttrValueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table ref="tableRef" border :data="imgArr">
        <el-table-column
          type="selection"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="图片">
          <template #default="{ row }">
            <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleDefault(row)">
              设置默认
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="handleSave">
        保存
      </el-button>
      <el-button size="default" @click="handleCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, reactive, inject } from 'vue'
import type { SpuImage, SkuData, AttrResponseData } from '@/api/product/type.ts'
import { reqAttr } from '@/api/product/attr'
import {
  reqSpuHasSaleAttr,
  reqSpuImageList,
  reqAddSpuSku
} from '@/api/product/spu.ts'
const $emit = defineEmits(['changeScene'])
const $message: any = inject('$message')
let skuParams = reactive<SkuData>({
  category3Id: '', //三级分类的ID
  spuId: '', //已有的SPU的ID
  tmId: '', //SPU品牌的ID
  // v-model
  skuName: '',
  price: '',
  weight: '',
  skuDesc: '',
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuDefaultImg: ''
})
let attrArr = ref<any>([])
let saleArr = ref<any>([])
let imgArr = ref<SpuImage[]>([])
let tableRef = ref()

const initSkuData = (
  c1Id: number | string,
  c2Id: number | string,
  spu: any
) => {
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id
  skuParams.tmId = spu.tmId
  // 获取平台属性
  reqAttr(c1Id, c2Id, spu.category3Id).then((res: AttrResponseData) => {
    attrArr.value = res.data
  })
  // 获取spu的销售属性
  reqSpuHasSaleAttr(spu.id).then((res: any) => {
    saleArr.value = res.data
  })
  // 获取spu的图片
  reqSpuImageList(spu.id as number).then((result: any) => {
    imgArr.value = result.data
  })
}
const handleDefault = (row: any) => {
  //点击的时候,全部图片的的复选框不勾选
  imgArr.value.forEach((item: any) => {
    tableRef.value.toggleRowSelection(item, false)
  })
  //选中的图片才勾选
  tableRef.value.toggleRowSelection(row, true)
  //收集图片地址
  skuParams.skuDefaultImg = row.imgUrl
}
const handleCancel = () => {
  $emit('changeScene', { flag: 0, params: 'update' })
}
const handleSave = () => {
  // 整理平台属性
  skuParams.skuAttrValueList = attrArr.value
    .map((item: any) => {
      if (item.attrIdAndValueId) {
        const [attrId, valueId] = item.attrIdAndValueId.split(':')
        return { attrId, valueId }
      }
    })
    .filter((v: any) => v)
  // 整理销售属性
  skuParams.skuSaleAttrValueList = saleArr.value
    .map((item: any) => {
      if (item.saleIdAndValueId) {
        const [saleAttrId, saleAttrValueId] = item.saleIdAndValueId.split(':')
        return { saleAttrId, saleAttrValueId }
      }
    })
    .filter((v: any) => v)
  reqAddSpuSku(skuParams).then(() => {
    $message.success('添加成功')
    $emit('changeScene', { flag: 0, params: 'update' })
  })
}

defineExpose({ initSkuData })
</script>
<style lang="scss" scoped></style>
