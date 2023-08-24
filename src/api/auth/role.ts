import request from '@/utils/request'
import type { RoleResponseData, Role, MenuResponseData } from './type.ts'

enum API {
  ROLE_URL = '/admin/acl/role/',
  ADD_URL = '/admin/acl/role/save',
  UPDATE_URL = '/admin/acl/role/update',
  DELETE_URL = '/admin/acl/role/remove/',
  MENUBYID_URL = '/admin/acl/permission/toAssign/',
  ASSIGNROLE_URL = '/admin/acl/permission/doAssignAcl'
}

export const reqRoleList = (page: number, limit: number, roleName: string) =>
  request.get<any, RoleResponseData>(
    API.ROLE_URL + `${page}/${limit}/?roleName=${roleName}`
  )

export const reqAddOrUpdateRole = (data: Role) =>
  data.id
    ? request.put<any, any>(API.UPDATE_URL, data)
    : request.post<any, any>(API.ADD_URL, data)

export const reqDeleteRole = (roldId: number) =>
  request.delete<any, any>(API.DELETE_URL + roldId)

export const reqMenuById = (roldId: number) =>
  request.get<any, MenuResponseData>(API.MENUBYID_URL + roldId)

export const reqDoAssignMenu = (roleId: number, permissionIdList: number[]) =>
  request.post<any, MenuResponseData>(API.ASSIGNROLE_URL, {
    roleId,
    permissionIdList
  })
