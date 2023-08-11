import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoute } from './routes'
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoute,
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    return { top: 0, left: 0 }
  }
})

export default router
