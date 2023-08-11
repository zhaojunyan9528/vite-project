import { createApp } from 'vue'
import router from './router'
import pinia from './store/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// @ts-expect-error
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'virtual:svg-icons-register' // svg
import App from './App.vue'
import gloablComponent from './components/index'

import '@/styles/index.scss'

import { ElMessage } from 'element-plus'

const app = createApp(App)

const $message = {
  success: function (msg: string) {
    return ElMessage({
      message: msg,
      duration: 1500,
      type: 'success'
    })
  },
  error: function (msg: string) {
    return ElMessage({
      message: msg,
      duration: 1500,
      type: 'error'
    })
  },
  warning: function (msg: string) {
    return ElMessage({
      message: msg,
      duration: 1500,
      type: 'warning'
    })
  }
}
app.provide('$message', $message)
app.use(ElementPlus, {
  locale: zhCn
})
app.use(gloablComponent)
app.use(router)
app.use(pinia)
app.mount('#app')
