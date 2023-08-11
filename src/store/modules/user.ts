import { defineStore } from 'pinia'
import type { loginForm, loginResponseData } from '@/api/user/type'
import type { UserState } from './types/type'
import { SET_TOKEN, GET_TOKEN } from '@/utils/token'
import { reqLogin } from '@/api/user'
import { constantRoute } from '@/router/routes'

const userStore = defineStore('User', {
  state: (): UserState => {
    return {
      token: GET_TOKEN(),
      menuRoutes: constantRoute
    }
  },
  getters: {
    TOKEN: state => state.token
  },
  actions: {
    async userLogin(data: loginForm) {
      const result: loginResponseData = await reqLogin(data)
      console.log('打印--login', result)
      this.token = result.data.token as string
      SET_TOKEN(result.data.token as string)
      return true
    }
  }
})

export default userStore
