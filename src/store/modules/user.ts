import { defineStore } from 'pinia'
import type { loginForm, loginResponseData, userinfoResponseData } from '@/api/user/type'
import type { UserState } from './types/type'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import { constantRoute } from '@/router/routes'

const userStore = defineStore('User', {
  state: (): UserState => {
    return {
      token: GET_TOKEN(),
      menuRoutes: constantRoute,
      username: '',
      avatar: ''
    }
  },
  getters: {
    TOKEN: state => state.token
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
      const { name: username, avatar } = result.data
      this.username = username
      this.avatar = avatar
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
