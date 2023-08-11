import Layout from '@/views/layout/index.vue'

export const constantRoute = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      hidden: true,
      icon: 'Avatar'
    }
  },
  {
    path: '/',
    redirect: '/home',
    component: Layout,
    meta: { title: 'layout', icon: 'Setting' },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          icon: 'House'
        }
      }
    ]
  },
  {
    path: '/screen',
    name: 'Screen',
    component: () => import('@/views/screen/index.vue'),
    meta: {
      title: '数据大屏',
      icon: 'DataAnalysis'
    }
  },
  {
    path: '/auth',
    redirect: '/auth/user',
    component: Layout,
    meta: { title: '权限管理', icon: 'Lock' },
    children: [
      {
        path: '/auth/user',
        name: 'User',
        component: () => import('@/views/auth/user.vue'),
        meta: {
          title: '用户管理',
          icon: 'User'
        }
      },
      {
        path: '/auth/role',
        name: 'Role',
        component: () => import('@/views/auth/role.vue'),
        meta: {
          title: '角色管理',
          icon: 'UserFilled'
        }
      },
      {
        path: '/auth/menu',
        name: 'Menu',
        component: () => import('@/views/auth/menu.vue'),
        meta: {
          title: '菜单管理',
          icon: 'Menu'
        }
      }
    ]
  },
  {
    path: '/goods',
    redirect: '/goods/trade',
    component: Layout,
    meta: { title: '商品管理', icon: 'Goods' },
    children: [
      {
        path: '/goods/trade',
        name: 'Trade',
        component: () => import('@/views/product/trademark.vue'),
        meta: {
          title: '品牌管理',
          icon: 'QuartzWatch'
        }
      },
      {
        path: '/goods/attr',
        name: 'Attr',
        component: () => import('@/views/product/attr.vue'),
        meta: {
          title: '属性管理',
          icon: 'Grid'
        }
      },
      {
        path: '/goods/sku',
        name: 'Sku',
        component: () => import('@/views/product/sku.vue'),
        meta: {
          title: 'SKU管理',
          icon: 'TakeawayBox'
        }
      },
      {
        path: '/goods/spu',
        name: 'Spu',
        component: () => import('@/views/product/spu.vue'),
        meta: {
          title: 'SPU管理',
          icon: 'ShoppingBag'
        }
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404/index.vue'),
    meta: { title: '404', hidden: true }
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/404',
    meta: { hidden: true }
  }
]
