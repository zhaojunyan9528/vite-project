<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input
        v-model="SpuParams.spuName"
        placeholder="请你输入SPU名称"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select v-model="SpuParams.tmId">
        <el-option
          v-for="item in AllTradeMark"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        v-model="SpuParams.description"
        type="textarea"
        placeholder="请你输入SPU描述"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <el-upload
        v-model:file-list="imgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handleUpload"
      >
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img
          w-full
          :src="dialogImageUrl"
          alt="Preview Image"
          style="width: 100%; height: 100%"
        />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <!-- 展示销售属性的下拉菜单 -->
      <el-select
        v-model="saleAttrIdAndValueName"
        :placeholder="
          unSelectSaleAttr.length
            ? `还未选择${unSelectSaleAttr.length}个`
            : '无'
        "
      >
        <el-option
          v-for="item in unSelectSaleAttr"
          :key="item.id"
          :value="`${item.id}:${item.name}`"
          :label="item.name"
        ></el-option>
      </el-select>
      <el-button
        :disabled="saleAttrIdAndValueName ? false : true"
        style="margin-left: 10px"
        type="primary"
        size="default"
        icon="Plus"
        @click="addSaleAttr"
      >
        添加属性
      </el-button>
      <el-table border style="margin: 10px 0px" :data="saleAttr">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="销售属性名字"
          width="120px"
          prop="saleAttrName"
        ></el-table-column>
        <el-table-column label="销售属性值">
          <!-- row:即为当前SPU已有的销售属性对象 -->
          <template #default="{ row }">
            <el-tag
              v-for="(item, index) in row.spuSaleAttrValueList"
              :key="index"
              class="mx-1"
              closable
              style="margin: 0px 5px"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input
              v-if="row.flag == true"
              ref="attrRef"
              v-model="row.saleAttrValueNameTemp"
              placeholder="请你输入属性值"
              size="small"
              style="width: 100px"
              @blur="toLook(row)"
            ></el-input>
            <el-button
              v-else
              type="primary"
              size="small"
              icon="Plus"
              @click="toEdit(row)"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #default="{ $index }">
            <el-button
              type="primary"
              size="small"
              icon="Delete"
              @click="saleAttr.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button
        :disabled="saleAttr.length > 0 ? false : true"
        type="primary"
        size="default"
        @click="handleSave"
      >
        保存
      </el-button>
      <el-button size="default" @click="handleCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import type { UploadProps, UploadUserFile } from 'element-plus'
import { ref, inject, computed, nextTick } from 'vue'
import {
  reqAllTradeMark,
  reqAllSaleAttr,
  reqAddOrUpdateSpu,
  reqSpuImageList,
  reqSpuHasSaleAttr
} from '@/api/product/spu.ts'
import type {
  SpuRecord,
  TradeMark,
  SaleAttrResponseData,
  SaleAttr,
  SpuAttr,
  SpuImage,
  TradeMarkAllResponseData
} from '@/api/product/type.ts'
const attrRef = ref()
const $message: any = inject('$message')
let $emit = defineEmits(['changeScene'])
let SpuParams = ref<SpuRecord>({
  category3Id: '', //收集三级分类的IDd
  spuName: '', //SPU的名字
  description: '', //SPU的描述
  tmId: '', //品牌的ID
  spuImageList: [],
  spuSaleAttrList: []
})
let AllTradeMark = ref<TradeMark[]>([])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
let imgList = ref<UploadUserFile[]>([])
let saleAttr = ref<SpuAttr[]>([])
let saleAttrIdAndValueName = ref<string>('')
let allSaleAttr = ref<SaleAttr[]>([])
//计算出当前SPU还未拥有的销售属性
let unSelectSaleAttr = computed(() => {
  //全部销售属性:颜色、版本、尺码
  //已有的销售属性:颜色、版本
  let unSelectArr = allSaleAttr.value.filter((item) => {
    return saleAttr.value.every((item1) => {
      return item.name != item1.saleAttrName
    })
  })
  return unSelectArr
})
// 初始化新增spu
const initAddSpu = (c3Id: number | string) => {
  //清空数据
  Object.assign(SpuParams.value, {
    category3Id: c3Id, //收集三级分类的ID
    spuName: '', //SPU的名字
    description: '', //SPU的描述
    tmId: '', //品牌的ID
    spuImageList: [],
    spuSaleAttrList: []
  })
  imgList.value = []
  saleAttr.value = []
  saleAttrIdAndValueName.value = ''
  reqAllTradeMark().then((res: TradeMarkAllResponseData) => {
    AllTradeMark.value = res.data
  })
  reqAllSaleAttr().then((res: SaleAttrResponseData) => {
    allSaleAttr.value = res.data
  })
}
// 初始化编辑spu
const initUpdateSpu = (spu: SpuRecord) => {
  Object.assign(SpuParams.value, spu)
  // 获取spu的图片
  reqSpuImageList(spu.id as number).then((result: any) => {
    imgList.value = result.data.map((item: SpuImage) => ({
      name: item.imgName,
      url: item.imgUrl
    }))
  })
  // 获取spu的属性
  reqSpuHasSaleAttr(spu.id as number).then((res: any) => {
    saleAttr.value = res.data
  })
  saleAttrIdAndValueName.value = ''
  reqAllTradeMark().then((res: TradeMarkAllResponseData) => {
    AllTradeMark.value = res.data
  })
  reqAllSaleAttr().then((res: SaleAttrResponseData) => {
    allSaleAttr.value = res.data
  })
}
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}
const handleUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/gif'
  ) {
    if (rawFile.size / 1024 / 1024 < 3) {
      return true
    } else {
      $message.error('上传文件大小小于3M')
      return false
    }
  } else {
    $message.error('上传文件格式务必PNG|JPG|GIF')
    return false
  }
}
const handleSave = () => {
  // category3Id: number
  // spuName: string
  // tmId: number
  // id?: number
  // description: string
  // spuImageList: SpuImageList
  // spuPosterList?: SpuImageList
  // spuSaleAttrList: SpuAttrList
  SpuParams.value.spuImageList = imgList.value.map((item: any) => ({
    imgName: item.name,
    imgUrl: (item.response && item.response.data) || item.url
  }))
  SpuParams.value.spuSaleAttrList = saleAttr.value
  reqAddOrUpdateSpu(SpuParams.value).then(() => {
    $message.success('操作成功')
    $emit('changeScene', {
      flag: 0,
      params: SpuParams.value.id ? 'update' : 'add'
    })
  })
}
const handleCancel = () => {
  $emit('changeScene', { flag: 0, params: 'update' })
}
// 添加属性
const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  let newSaleAttr: SpuAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: []
  }
  //追加到数组当中
  saleAttr.value.push(newSaleAttr)
  // 清空收集的数据
  saleAttrIdAndValueName.value = ''
}
// 添加销售属性值
const toEdit = (row: any) => {
  row.flag = true
  row.saleAttrValueNameTemp = ''
  nextTick(() => {
    attrRef.value.focus()
  })
}
// 失焦新增销售属性值
const toLook = (row: any) => {
  const { baseSaleAttrId, saleAttrValueNameTemp: saleAttrValueName } = row
  const newSaleAttrValue: any = {
    baseSaleAttrId,
    saleAttrValueName
  }
  if (saleAttrValueName.trim() == '') {
    $message.error('属性值不能为空')
    return
  }
  const isRepeat = row.spuSaleAttrValueList.find((item: any) => {
    return item.saleAttrValueName == saleAttrValueName
  })
  if (isRepeat) {
    $message.error('属性值不能重复')
    return
  }
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  row.saleAttrValueNameTemp = ''
  row.flag = false
}

defineExpose({ initAddSpu, initUpdateSpu })
</script>
<style lang="scss" scoped></style>
