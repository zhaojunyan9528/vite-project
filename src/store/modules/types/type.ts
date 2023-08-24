import { RouteRecordRaw } from 'vue-router'
import type { CategoryObj } from '@/api/product/type'

export interface UserState {
  token: null | string
  menuRoutes: RouteRecordRaw[]
  username: string
  avatar: string
}

export interface SettingState {
  expand: boolean
  refreshKey: number
}

export interface CategoryState {
  c1Arr: CategoryObj[]
  c1Id: string | number
  c2Arr: CategoryObj[]
  c2Id: string | number
  c3Arr: CategoryObj[]
  c3Id: string | number
}
