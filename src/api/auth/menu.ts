import request from '@/utils/request'
import type { MenuResponseData, Menu } from './type.ts'
enum API {
  MENU_URL = '/admin/acl/permission',
  ADD_URL = '/admin/acl/permission/save',
  UPDATE_URL = '/admin/acl/permission/update',
  DELETE_URL = '/admin/acl/permission/remove/'
}

export const reqMenuList = () =>
  request.get<any, MenuResponseData>(API.MENU_URL)

export const reqAddOrUpdateMenu = (data: Menu) =>
  data.id
    ? request.put<any, any>(API.UPDATE_URL, data)
    : request.post<any, any>(API.ADD_URL, data)

export const reqDeleteMenu = (id: number) =>
  request.delete<any, any>(API.DELETE_URL + id)
