<template>
  <div>
    <el-card>
      <el-form inline>
        <el-form-item label="用户名：" style="margin-bottom: 0">
          <el-input v-model="keyword" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 0">
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0 0">
      <el-button type="primary" @click="handleAdd">添加</el-button>
      <el-button
        type="danger"
        :disabled="!multipleSelection.length"
        @click="deleteSelectUser"
      >
        批量删除
      </el-button>
      <el-table
        ref="tableRef"
        :data="tableData"
        border
        style="width: 100%; margin: 10px 0"
        @selection-change="selectChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="#" width="50" />
        <el-table-column label="Id" prop="id" width="80" />
        <el-table-column
          label="用户名字"
          prop="username"
          show-overflow-tooltip
        />
        <el-table-column label="用户名称" prop="name" show-overflow-tooltip />
        <el-table-column
          label="用户角色"
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
              @click="setRole(row)"
            >
              分配角色
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
              :title="`你确定要删除${row.username}?`"
              width="260px"
              @confirm="deleteUser(row.id)"
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
    <el-drawer
      ref="drawerRef"
      v-model="dialogAdd"
      title="I have a nested form inside!"
      :before-close="handleClose"
      direction="rtl"
      class="demo-drawer"
    >
      <template #header>
        <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
      </template>
      <template #default>
        <el-form ref="userFormRef" :model="userParams" :rules="rules">
          <el-form-item label="用户姓名" prop="username">
            <el-input
              v-model="userParams.username"
              placeholder="请您输入用户姓名"
            />
          </el-form-item>
          <el-form-item label="用户昵称" prop="name">
            <el-input
              v-model="userParams.name"
              placeholder="请您输入用户昵称"
            />
          </el-form-item>
          <el-form-item v-if="!userParams.id" label="用户密码" prop="password">
            <el-input
              v-model="userParams.password"
              placeholder="请您输入用户密码"
            />
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="cancelForm">取消</el-button>
          <el-button type="primary" :loading="loading" @click="handleSubmit">
            确定
          </el-button>
        </div>
      </template>
    </el-drawer>
    <!-- 抽屉结构:用户某一个已有的账号进行职位分配 -->
    <el-drawer v-model="drawer1">
      <template #header>
        <h4>分配角色(职位)</h4>
      </template>
      <template #default>
        <el-form>
          <el-form-item label="用户姓名">
            <el-input v-model="userParams.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="职位列表" class="self_formitem">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >
              全选
            </el-checkbox>
            <!-- 显示职位的的复选框 -->
            <el-checkbox-group
              v-model="userRole"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox
                v-for="(role, index) in allRole"
                :key="index"
                :label="role"
              >
                {{ role.roleName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer1 = false">取消</el-button>
          <el-button type="primary" @click="confirmClick">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, inject } from 'vue'
import {
  reqUserList,
  reqAddOrUpdateUser,
  reqDeleteUser,
  reqAllRole,
  reqSetUserRole,
  reqSelectUser
} from '@/api/auth/user'
import type {
  UserResponseData,
  User,
  UserRoleResponseData,
  Role,
  SetRoleData
} from '@/api/auth/type.ts'
import { ElDrawer } from 'element-plus'
import useLayOutSettingStore from '@/store/modules/setting'
const $message: any = inject('$message')
let settingStore = useLayOutSettingStore()
let keyword = ref('')
let page = ref<number>(1)
let limit = ref<number>(10)
let total = ref<number>(0)

const tableRef = ref()
let tableData = ref<User[]>([])
const multipleSelection = ref<User[]>([])
const drawerRef = ref<InstanceType<typeof ElDrawer>>()

let dialogAdd = ref<boolean>(false)
let userParams = ref<any>({
  username: '',
  name: '',
  password: ''
})
const loading = ref<boolean>(false)
const userFormRef = ref()
//校验用户名字回调函数
const validatorUsername = (_rule: any, value: any, callBack: any) => {
  //用户名字|昵称,长度至少五位
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户名字至少五位'))
  }
}
//校验用户名字回调函数
const validatorname = (_rule: any, value: any, callBack: any) => {
  //用户名字|昵称,长度至少五位
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户昵称至少五位'))
  }
}
const validatorPassword = (_rule: any, value: any, callBack: any) => {
  //用户名字|昵称,长度至少五位
  if (value.trim().length >= 6) {
    callBack()
  } else {
    callBack(new Error('用户密码至少六位'))
  }
}
//表单校验的规则对象
const rules = {
  //用户名字
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  //用户昵称
  name: [{ required: true, trigger: 'blur', validator: validatorname }],
  //用户的密码
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }]
}
let allRole = ref<Role[]>([])
let userRole = ref<Role[]>([])
let drawer1 = ref<boolean>(false)
//收集顶部复选框全选数据
const checkAll = ref<boolean>(false)
//控制顶部全选复选框不确定的样式
const isIndeterminate = ref<boolean>(true)

onMounted(() => {
  getList()
})
const getList = (pager = 1) => {
  console.log('打印', pager)
  page.value = pager
  reqUserList(page.value, limit.value, keyword.value).then(
    (result: UserResponseData) => {
      total.value = result.data.total
      tableData.value = result.data.records
    }
  )
}
const sizeChange = (limit: any) => {
  console.log('打印', limit)
  getList()
}
const handleClose = () => {
  if (loading.value) {
    return
  }
  //清除上一次的错误的提示信息
  nextTick(() => {
    userFormRef.value.clearValidate('username')
    userFormRef.value.clearValidate('name')
    userFormRef.value.clearValidate('password')
  })
  dialogAdd.value = false
}
const cancelForm = () => {
  //清除上一次的错误的提示信息
  nextTick(() => {
    userFormRef.value.clearValidate('username')
    userFormRef.value.clearValidate('name')
    userFormRef.value.clearValidate('password')
  })
  loading.value = false
  dialogAdd.value = false
}
const handleSubmit = () => {
  if (loading.value) return
  loading.value = true
  userFormRef.value.validate((valid: any) => {
    if (valid) {
      reqAddOrUpdateUser(userParams.value)
        .then(() => {
          $message.success('操作成功')
          loading.value = false
          dialogAdd.value = false
          // getList(page.value)
          window.location.reload() // 防止修改当前登录账号信息，token失效
        })
        .catch(() => {
          loading.value = false
        })
    } else {
      loading.value = false
    }
  })
}
const handleAdd = () => {
  dialogAdd.value = true
  //清空数据
  Object.assign(userParams.value, {
    id: 0,
    username: '',
    name: '',
    password: ''
  })
  //清除上一次的错误的提示信息
  nextTick(() => {
    userFormRef.value.clearValidate('username')
    userFormRef.value.clearValidate('name')
    userFormRef.value.clearValidate('password')
  })
}
const handleEdit = (row: any) => {
  dialogAdd.value = true
  //清空数据
  const { id, username, name, password } = row
  Object.assign(userParams.value, { id, username, name, password })
  //清除上一次的错误的提示信息
  nextTick(() => {
    userFormRef.value.clearValidate('username')
    userFormRef.value.clearValidate('name')
  })
}
const deleteUser = (id: number) => {
  reqDeleteUser(id).then(() => {
    $message.success('删除成功')
    getList(tableData.value.length > 1 ? page.value : page.value - 1)
  })
}
//分配角色按钮的回调
const setRole = async (row: User) => {
  //存储已有的用户信息
  Object.assign(userParams.value, row)
  //获取全部的职位的数据与当前用户已有的职位的数据
  let result: UserRoleResponseData = await reqAllRole(
    userParams.value.id as number
  )
  if (result.code == 200) {
    //存储全部的职位
    allRole.value = result.data.allRolesList
    //存储当前用户已有的职位
    userRole.value = result.data.assignRoles
    //抽屉显示出来
    drawer1.value = true
  }
}

//顶部的全部复选框的change事件
const handleCheckAllChange = (val: boolean) => {
  //val:true(全选)|false(没有全选)
  userRole.value = val ? allRole.value : []
  //不确定的样式(确定样式)
  isIndeterminate.value = false
}
//顶部全部的复选框的change事件
const handleCheckedCitiesChange = (value: string[]) => {
  //顶部复选框的勾选数据
  //代表:勾选上的项目个数与全部的职位个数相等，顶部的复选框勾选上
  checkAll.value = value.length === allRole.value.length
  //不确定的样式
  isIndeterminate.value = value.length !== allRole.value.length
}
//确定按钮的回调(分配职位)
const confirmClick = async () => {
  //收集参数
  let data: SetRoleData = {
    userId: userParams.value.id as number,
    roleIdList: userRole.value.map((item) => {
      return item.id as number
    })
  }
  //分配用户的职位
  let result: any = await reqSetUserRole(data)
  if (result.code == 200) {
    //提示信息
    $message.success('分配职务成功')
    //关闭抽屉
    drawer1.value = false
    //获取更新完毕用户的信息,更新完毕留在当前页
    getList(page.value)
  }
}
//table复选框勾选的时候会触发的事件
const selectChange = (value: any) => {
  multipleSelection.value = value
}
//批量删除按钮的回调
const deleteSelectUser = async () => {
  //整理批量删除的参数
  let idsList: any = multipleSelection.value.map((item) => {
    return item.id
  })
  //批量删除的请求
  let result: any = await reqSelectUser(idsList)
  if (result.code == 200) {
    $message.success('删除成功')
    getList(tableData.value.length > 1 ? page.value : page.value - 1)
  }
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
</script>
<style lang="scss">
.self_formitem .el-form-item__content {
  flex-direction: column;
  align-items: flex-start;
}
</style>
