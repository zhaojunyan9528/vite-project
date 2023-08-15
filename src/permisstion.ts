import router from './router'
import pinia from './store/index'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import { getAuth, getUserName } from './utils/auth.ts'
import config from './config.ts'
import useUserStore from './store/modules/user'
const userStore = useUserStore(pinia)

router.beforeEach(async (to: any, _from: any, next: any) => {
  document.title = `${config.title} - ${to.meta.title}`
  NProgress.start()
  // 登录
  if (getAuth()) {
    if (to.path == '/login') {
      next({
        path: '/'
      })
    } else {
      // 已获取用户信息
      if (getUserName()) {
        next()
      } else {
        // token过期
        try {
          await userStore.userInfo()
          next({ ...to })
        } catch (error) {
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    // 未登录
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
