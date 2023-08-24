import request from '@/utils/request'
import type { UserResponseData, User, SetRoleData } from './type.ts'

enum API {
  USER_URL = '/admin/acl/user/',
  ADD_URL = '/admin/acl/user/save',
  UPDATE_URL = '/admin/acl/user/update',
  DELETE_URL = '/admin/acl/user/remove/',
  GETROLL_URL = '/admin/acl/user/toAssign/',
  SETROLE_URL = '/admin/acl/user/doAssignRole',
  BATCHREMOVE_URL = '/admin/acl/user/batchRemove'
}

export const reqUserList = (page: number, limit: number, username: string) =>
  request.get<any, UserResponseData>(
    API.USER_URL + `${page}/${limit}/?username=${username}`
  )

export const reqAddOrUpdateUser = (data: User) =>
  data.id
    ? request.put<any, any>(API.UPDATE_URL, data)
    : request.post<any, any>(API.ADD_URL, data)

export const reqDeleteUser = (id: number) =>
  request.delete<any, any>(API.DELETE_URL + id)

export const reqAllRole = (userId: number) =>
  request.get<any, any>(API.GETROLL_URL + userId)

export const reqSetUserRole = (data: SetRoleData) =>
  request.post<any, any>(API.SETROLE_URL, data)

export const reqSelectUser = (idList: number[]) =>
  request.delete<any, any>(API.BATCHREMOVE_URL, { data: idList })
