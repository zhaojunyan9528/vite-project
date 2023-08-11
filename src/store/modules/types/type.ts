import { RouteRecordRaw } from 'vue-router'

export interface UserState {
  token: null | string
  menuRoutes: RouteRecordRaw[]
}
