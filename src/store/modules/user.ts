import { defineStore } from 'pinia'
import type {
  loginForm,
  loginResponseData,
  userinfoResponseData
} from '@/api/user/type'
import type { UserState } from './types/type'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import { constantRoute, asyncRoutes, anyRoutes } from '@/router/routes'
import router from '@/router/index.ts'
import cloneDeep from 'lodash/cloneDeep'
// 过滤动态路由，根据接口返回权限
function filterAsyncRoute(asyncRoutes: any, routes: string[]): any {
  return asyncRoutes.filter((route: any) => {
    if (routes.includes(route.name)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRoute(route.children, routes)
      }
      return true
    }
  })
}
const userStore = defineStore('User', {
  state: (): UserState => {
    return {
      token: GET_TOKEN(),
      menuRoutes: constantRoute,
      username: '',
      avatar: '',
      buttons: []
    }
  },
  getters: {
    TOKEN: (state) => state.token
  },
  actions: {
    async userLogin(data: loginForm) {
      const result: loginResponseData = await reqLogin(data)
      console.log('打印--login', result)
      this.token = result.data as string
      SET_TOKEN(result.data as string)
      this.userInfo()
      return true
    },
    async userInfo() {
      const result: userinfoResponseData = await reqUserInfo()
      console.log('打印', result)
      const { name: username, avatar, buttons, routes } = result.data
      this.username = username
      this.avatar = avatar
      this.buttons = buttons
      const userAsyncRoute = filterAsyncRoute(cloneDeep(asyncRoutes), routes)
      //菜单需要的数据整理完毕
      const addRoutes = [...userAsyncRoute, ...anyRoutes]
      this.menuRoutes = [...constantRoute, ...addRoutes]
      //目前路由器管理的只有常量路由:用户计算完毕异步路由、任意路由动态追加
      addRoutes.forEach((route: any) => {
        router.addRoute(route)
      })
      return true
    },
    // 退出登录
    async userLogout() {
      await reqLogout()
      this.token = ''
      this.username = ''
      this.avatar = ''
      REMOVE_TOKEN()
      return true
    }
  }
})

export default userStore
