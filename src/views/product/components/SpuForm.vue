<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input
        placeholder="请你输入SPU名称"
        v-model="SpuParams.spuName"
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
        type="textarea"
        placeholder="请你输入SPU描述"
        v-model="SpuParams.description"
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
          :value="`${item.id}:${item.name}`"
          v-for="item in unSelectSaleAttr"
          :key="item.id"
          :label="item.name"
        ></el-option>
      </el-select>
      <el-button
        @click="addSaleAttr"
        :disabled="saleAttrIdAndValueName ? false : true"
        style="margin-left: 10px"
        type="primary"
        size="default"
        icon="Plus"
      >
        添加属性
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-button
        :disabled="saleAttr.length > 0 ? false : true"
        type="primary"
        size="default"
        @click="save"
      >
        保存
      </el-button>
      <el-button size="default" @click="handleCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import type { UploadProps, UploadUserFile } from 'element-plus'
import { ref, onMounted, inject, computed } from 'vue'
import { reqAllTradeMark, reqAllSaleAttr } from '@/api/product/spu.ts'
import type {
  SpuRecord,
  TradeMark,
  SaleAttrResponseData,
  SaleAttr
} from '@/api/product/type.ts'
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
let saleAttr = ref([])
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
  reqAllTradeMark().then((res: TradeMark[]) => {
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
const handleCancel = () => {
  $emit('changeScene', { flag: 0, params: 'update' })
}
defineExpose({ initAddSpu })
const addSaleAttr = () => {}
</script>
<style lang="scss" scoped></style>
