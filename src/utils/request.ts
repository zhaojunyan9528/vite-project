import axios from 'axios'
import { ElMessage } from 'element-plus'
import { debounce } from 'throttle-debounce'
import useUserStore from '@/store/modules/user.ts'
const errorMessage = debounce(500, message => {
  ElMessage({
    message: message,
    duration: 1500,
    type: 'error',
    offset: 60
  })
})
// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 6000
})

// 请求拦截器
request.interceptors.request.use(config => {
  const userStore = useUserStore()
  config.headers['token'] = userStore.token || ''
  return config
})

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // console.log('打印', response.data)
    const code = response.data.code
    if (code === 200) {
      return response.data
    } else {
      errorMessage(response.data.message)
      return Promise.reject(response.data)
    }
  },
  (error) => {
    let msg = ''
    const status = error.response.status
    switch (status) {
      case 401:
        msg = '401 token过期'
        break
      case 403:
        msg = '403 无权访问'
        break
      case 404:
        msg = '404 Not Found'
        break
      case 500:
        msg = '500 服务器出现问题'
        break
      default:
        msg = '网络错误'
        break
    }
    errorMessage(msg)
    return Promise.reject(error)
  }
)
export default request
