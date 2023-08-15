<template>
  <div>
    <el-card class="box-card">
      <el-button type="primary" icon="Plus" @click="handleAdd">添加</el-button>
      <el-table
        :data="trademarkArr"
        border
        style="width: 100%; margin: 10px 0px"
      >
        <el-table-column
          width="80px"
          align="center"
          type="index"
          label="序号"
        />
        <el-table-column prop="tmName" label="品牌名称" />
        <el-table-column label="LOGO">
          <template #default="{ row }">
            <img :src="row.logoUrl" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作">
          <template #default="{ row }">
            <el-button
              type="warning"
              size="small"
              icon="Edit"
              @click="updateTrademark(row)"
            ></el-button>
            <el-popconfirm
              :title="`您确定要删除${row.tmName}?`"
              width="250px"
              icon="Delete"
              @confirm="removeTradeMark(row.id)"
            >
              <template #reference>
                <el-button
                  type="primary"
                  size="small"
                  icon="Delete"
                ></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        @size-change="sizeChange"
        @current-change="getHasTrademark"
        :pager-count="9"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        :total="total"
        layout="prev, pager, next, jumper,->,sizes,total"
      />
    </el-card>
    <el-dialog
      v-model="dialogAddVisible"
      :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
    >
      <el-form
        style="width: 80%"
        :model="trademarkParams"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input
            placeholder="请您输入品牌名称"
            v-model="trademarkParams.tmName"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- upload组件属性:action图片上传路径书写/api,代理服务器不发送这次post请求  -->
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkParams.logoUrl"
              :src="trademarkParams.logoUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 具名插槽:footer -->
      <template #footer>
        <el-button size="default" @click="handleCancel">取消</el-button>
        <el-button type="primary" size="default" @click="handleConfirm">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, inject } from 'vue'
import { UploadProps } from 'element-plus'
import type {
  TradeMarkResponseData,
  TradeMark,
  Records
} from '@/api/product/type.ts'
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark
} from '@/api/product/trademark.ts'

const $message: any = inject('$message')
// 引入组合式API函数ref
//当前页码
let pageNo = ref<number>(1)
//每一页展示多少条数据
let limit = ref<number>(3)
//存储已有品牌数据总数
let total = ref<number>(0)
let trademarkArr = ref<Records>([])
let dialogAddVisible = ref<boolean>(false)
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: ''
})
const formRef = ref()
//品牌自定义校验规则方法
const validatorTmName = (_rule: any, value: any, callBack: any) => {
  //是当表单元素触发blur时候,会触发此方法
  //自定义校验规则
  if (value.trim().length >= 2) {
    callBack()
  } else {
    //校验未通过返回的错误的提示信息
    callBack(new Error('品牌名称位数大于等于两位'))
  }
}
//品牌LOGO图片的自定义校验规则方法
const validatorLogoUrl = (_rule: any, value: any, callBack: any) => {
  //如果图片上传
  if (value) {
    callBack()
  } else {
    callBack(new Error('LOGO图片务必上传'))
  }
}
const rules = {
  tmName: [{ required: true, trigger: 'blur', validator: validatorTmName }],
  logoUrl: [{ required: true, validator: validatorLogoUrl }]
}
onMounted(() => {
  getHasTrademark()
})
const updateTrademark = (row: any) => {
  console.log('打印', row)
  Object.assign(trademarkParams, row)
  dialogAddVisible.value = true
}
const removeTradeMark = (id: number) => {
  console.log('打印', id)
  reqDeleteTrademark(id).then(() => {
    //再次获取已有的品牌数据
    getHasTrademark(
      trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1
    )
  })
}
const sizeChange = () => {
  //当前每一页的数据量发生变化的时候，当前页码归1
  getHasTrademark()
}
const getHasTrademark = async (pager = 1) => {
  //当前页码
  pageNo.value = pager
  let result: TradeMarkResponseData = await reqHasTrademark(
    pageNo.value,
    limit.value
  )
  //存储已有品牌总个数
  total.value = result.data.total
  trademarkArr.value = result.data.records
}
const handleAdd = () => {
  dialogAddVisible.value = true
}
//图片上传成功钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  console.log('打印', uploadFile)
  //response:即为当前这次上传图片post请求服务器返回的数据
  //收集上传图片的地址,添加一个新的品牌的时候带给服务器
  trademarkParams.logoUrl = response.data
  //图片上传成功,清除掉对应图片校验结果
  formRef.value.clearValidate('logoUrl')
}
const beforeAvatarUpload: UploadProps['beforeUpload'] = rawFile => {
  if (
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/gif'
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      $message.error('上传文件大小小于4M')
      return false
    }
  } else {
    $message.error('上传文件格式务必PNG|JPG|GIF')
    return false
  }
}
const handleConfirm = () => {
  formRef.value.validate((valid: any) => {
    if (valid) {
      reqAddOrUpdateTrademark(trademarkParams).then(() => {
        dialogAddVisible.value = false
        $message.success('操作成功')
        getHasTrademark(trademarkParams.id ? pageNo.value : 1)
      })
    } else {
      return false
    }
  })
}
const handleCancel = () => {
  formRef.value.resetFields()
  dialogAddVisible.value = false
}
</script>
<style lang="scss" scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
