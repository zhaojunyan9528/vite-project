<template>
  <el-card>
    <el-table :data="tableData" border row-key="id" style="width: 100%">
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="code" label="权限值" />
      <el-table-column prop="updateTime" label="修改时间" />
      <el-table-column label="操作" width="300px" align="center">
        <template #default="{ row }">
          <el-button
            :disabled="row.level === 4"
            type="primary"
            size="small"
            icon="User"
            @click="handleAdd(row)"
          >
            {{ row.level === 3 ? '添加功能' : '添加菜单' }}
          </el-button>
          <el-button
            :disabled="row.level === 1"
            type="warning"
            size="small"
            icon="Edit"
            @click="handleEdit(row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            :title="`你确定要删除${row.name}?`"
            width="260px"
            @confirm="deleteRole(row.id)"
          >
            <template #reference>
              <el-button
                :disabled="row.level === 1"
                type="danger"
                size="small"
                icon="Delete"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogAdd" title="添加/编辑角色">
      <el-form ref="menuFormRef" :model="menuParams" :rules="rules">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="menuParams.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="权限值" prop="code">
          <el-input v-model="menuParams.code" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogAdd = false">取消</el-button>
          <el-button type="primary" :loading="loading" @click="handleSubmit">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted, reactive, nextTick } from 'vue'
import { reqMenuList, reqAddOrUpdateMenu, reqDeleteMenu } from '@/api/auth/menu'
import type { MenuResponseData, Menu } from '@/api/auth/type.ts'
const $message: any = inject('$message')

const tableData = ref<Menu[]>([])
let dialogAdd = ref<boolean>(false)
let loading = ref<boolean>(false)
let menuParams = reactive<Menu>({
  id: 0,
  name: '',
  code: ''
})
let menuFormRef = ref()
const rules = {
  name: { required: true, trigger: 'blur', message: '请输入权限名称' },
  code: { required: true, trigger: 'blur', message: '请输入权限值' }
}

onMounted(() => {
  getList()
})
const getList = () => {
  reqMenuList().then((result: MenuResponseData) => {
    tableData.value = result.data
  })
}
const handleAdd = (row: Menu) => {
  dialogAdd.value = true
  Object.assign(menuParams, {
    id: '',
    name: '',
    code: '',
    pid: row.id,
    level: (row.level as number) + 1
  })
  nextTick(() => {
    menuFormRef.value.clearValidate('name')
    menuFormRef.value.clearValidate('code')
  })
}
const handleEdit = (row: Menu) => {
  Object.assign(menuParams, row)
  nextTick(() => {
    menuFormRef.value.clearValidate('name')
    menuFormRef.value.clearValidate('code')
  })
  dialogAdd.value = true
}
const deleteRole = (id: number) => {
  reqDeleteMenu(id).then(() => {
    $message.success('删除成功')
    getList()
  })
}
const handleSubmit = () => {
  if (loading.value) return
  loading.value = true
  menuFormRef.value.validate((valid: any) => {
    if (valid) {
      reqAddOrUpdateMenu(menuParams)
        .then(() => {
          $message.success('操作成功')
          loading.value = false
          dialogAdd.value = false
          getList()
        })
        .catch(() => {
          loading.value = false
        })
    } else {
      loading.value = false
    }
  })
}
</script>
<style lang="scss" scoped></style>
