import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'virtual:svg-icons-register' // svg
import App from './App.vue'
import gloablComponent from './components/index'

import '@/styles/index.scss'

const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn
})
app.use(gloablComponent)

app.mount('#app')
