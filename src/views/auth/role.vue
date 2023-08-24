<template>
  <div>
    <el-card>
      <el-form inline>
        <el-form-item label="职位搜索" style="margin-bottom: 0">
          <el-input v-model="keyword" placeholder="请输入职位"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 0">
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0 0">
      <el-button type="primary" @click="handleAdd">添加</el-button>
      <el-table
        ref="tableRef"
        :data="tableData"
        border
        style="width: 100%; margin: 10px 0"
      >
        <el-table-column type="index" label="#" width="50" />
        <el-table-column label="Id" prop="id" width="80" />
        <el-table-column
          label="角色名称"
          prop="roleName"
          show-overflow-tooltip
        />
        <el-table-column
          label="创建时间"
          prop="createTime"
          show-overflow-tooltip
        />
        <el-table-column
          label="更新时间"
          prop="updateTime"
          show-overflow-tooltip
        />
        <el-table-column label="操作" width="300px" align="center">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              icon="User"
              @click="setAuth(row)"
            >
              分配权限
            </el-button>
            <el-button
              type="warning"
              size="small"
              icon="Edit"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`你确定要删除${row.roleName}?`"
              width="260px"
              @confirm="deleteRole(row.id)"
            >
              <template #reference>
                <el-button type="danger" size="small" icon="Delete">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="limit"
        :pager-count="9"
        :page-sizes="[10, 15, 30, 50]"
        :background="true"
        :total="total"
        layout="prev, pager, next, jumper,->,sizes,total"
        @size-change="sizeChange"
        @current-change="getList"
      />
    </el-card>
    <el-dialog v-model="dialogAdd" title="添加/编辑角色">
      <el-form ref="roleFormRef" :model="roleParams" :rules="rules">
        <el-form-item label="角色名称">
          <el-input v-model="roleParams.roleName" autocomplete="off" />
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
    <el-drawer v-model="drawer">
      <template #header>
        <h4>分配菜单与按钮的权限</h4>
      </template>
      <template #default>
        <!-- 树形控件 -->
        <el-tree
          ref="treeRef"
          v-loading="loadingDrawer"
          :data="menuArr"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="selectArr"
          :props="defaultProps"
        />
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer = false">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted, reactive, nextTick } from 'vue'
import useLayOutSettingStore from '@/store/modules/setting'
import {
  reqRoleList,
  reqAddOrUpdateRole,
  reqDeleteRole,
  reqMenuById,
  reqDoAssignMenu
} from '@/api/auth/role'
import type {
  RoleResponseData,
  Role,
  MenuResponseData,
  Menu
} from '@/api/auth/type.ts'
let settingStore = useLayOutSettingStore()
const $message: any = inject('$message')

let keyword = ref('')
let page = ref<number>(1)
let limit = ref<number>(10)
let total = ref<number>(0)
let tableData = ref<Role[]>([])
let roleParams = reactive<Role>({
  id: 0,
  roleName: ''
})
let dialogAdd = ref<boolean>(false)
let roleFormRef = ref()
let loading = ref<boolean>(false)
const rules = {
  roleName: { required: true, trigger: 'blur', message: '请输入角色名称' }
}
let drawer = ref<boolean>(false)
let menuArr = ref<Menu[]>([])
let selectArr = ref<number[]>([])
const defaultProps = {
  label: 'name'
}
const treeRef = ref()
let loadingDrawer = ref<boolean>(false)

onMounted(() => {
  getList()
})
const getList = (pager = 1) => {
  page.value = pager
  reqRoleList(page.value, limit.value, keyword.value).then(
    (result: RoleResponseData) => {
      total.value = result.data.total
      tableData.value = result.data.records
    }
  )
}
// 搜索按钮的回调
const search = () => {
  //根据关键字获取相应的用户数据
  getList()
  //清空关键字
  keyword.value = ''
}
//重置按钮
const reset = () => {
  settingStore.refreshKey = settingStore.refreshKey + 1
}
const handleAdd = () => {
  dialogAdd.value = true
  Object.assign(roleParams, {
    id: '',
    roleName: ''
  })
  nextTick(() => {
    roleFormRef.value.clearValidate('roleName')
  })
}
const setAuth = (row: Role) => {
  drawer.value = true
  Object.assign(roleParams, row)
  loadingDrawer.value = true
  reqMenuById(row.id)
    .then((result: MenuResponseData) => {
      menuArr.value = result.data
      selectArr.value = getSelectMenu(result.data, [])
      loadingDrawer.value = false
    })
    .catch(() => {
      loadingDrawer.value = false
    })
}
const getSelectMenu = (arr: any, initArr: any) => {
  arr.forEach((item: Menu) => {
    if (item.select && item.level == 4) {
      initArr.push(item.id)
    }
    if (item.children && item.children.length) {
      getSelectMenu(item.children, initArr)
    }
  })
  return initArr
}
const handleEdit = (row: Role) => {
  dialogAdd.value = true
  Object.assign(roleParams, {
    roleName: row.roleName,
    id: row.id
  })
  nextTick(() => {
    roleFormRef.value.clearValidate('roleName')
  })
}
const deleteRole = (id: number) => {
  reqDeleteRole(id).then(() => {
    $message.success('删除成功')
    getList(tableData.value.length > 1 ? page.value : page.value - 1)
  })
}
const sizeChange = () => {
  getList()
}
const handleSubmit = () => {
  if (loading.value) return
  loading.value = true
  roleFormRef.value.validate((valid: any) => {
    if (valid) {
      reqAddOrUpdateRole(roleParams)
        .then(() => {
          $message.success('操作成功')
          loading.value = false
          dialogAdd.value = false
          getList(roleParams.id ? page.value : 1)
        })
        .catch(() => {
          loading.value = false
        })
    } else {
      loading.value = false
    }
  })
}

const handleConfirm = () => {
  const permissionIdList = treeRef.value!.getCheckedKeys(false)
  reqDoAssignMenu(roleParams.id, permissionIdList).then(() => {
    $message.success('分配权限成功')
    drawer.value = false
    window.location.reload()
  })
}
</script>
<style lang="scss" scoped></style>
