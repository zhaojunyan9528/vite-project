import request from '@/utils/request.ts'
import { loginForm, loginResponseData, userinfoResponseData } from './type'
enum API {
  LOGIN_URL = '/user/login',
  USERINFO_URL = '/user/info'
}

export const reqLogin = (data: loginForm) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, data)

export const reqUserInfo = () =>
  request.get<any, userinfoResponseData>(API.USERINFO_URL)
