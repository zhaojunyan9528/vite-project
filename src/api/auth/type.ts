export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

export interface User {
  id?: number
  createTime: string
  updateTime: string
  username: string
  name: string
  phone?: string
  roleName: string
  password: string
}

export interface UserResponseData extends ResponseData {
  data: {
    records: User[]
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

export interface Role {
  id: number
  roleName: string
  createTime?: string
  updateTime?: string
}

export interface UserRoleResponseData extends ResponseData {
  data: {
    assignRoles: Role[]
    allRolesList: Role[]
  }
}

export interface SetRoleData {
  roleIdList: Array<number>
  userId: number
}

export interface RoleResponseData extends ResponseData {
  data: {
    records: Role[]
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

export interface Menu {
  id: number
  createTime?: string
  updateTime?: string
  pid?: number
  name?: string
  code?: string
  toCode?: string
  type?: number
  status?: number
  level?: number
  select?: boolean
  children?: Menu[]
}

export interface MenuResponseData extends ResponseData {
  data: Menu[]
}
