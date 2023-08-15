export interface loginForm {
  username: string
  password: string
}

export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
export interface loginResponseData extends ResponseData {
  data: string
}

interface userInfo {
  avatar: string
  name: string
  roles: string[]
  buttons: string[]
  routes: string[]
}

export interface userinfoResponseData extends ResponseData {
  data: userInfo
}
