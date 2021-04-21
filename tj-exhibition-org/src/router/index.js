import Vue from 'vue'
import VueRouter from 'vue-router'
import orgMenuList from './org'
import { message } from 'ant-design-vue'
import Cookies from 'js-cookie'
import { USER_COOKIE } from '@/utils/config'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  ...orgMenuList,
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "Login" */ '@/views/login'),
    meta: { unAuth: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "register" */ '@/views/register'),
    meta: { unAuth: true }
  },
  {
    path: '*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "notFound" */ '@/views/notFound'),
    meta: { unAuth: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  // base: '/tj-view/',
  routes
})

router.beforeEach((to, from, next) => {
  // 不需要登录
  const unAuth = to.matched.some(record => record.meta.unAuth)
  if (unAuth) {
    next()
  } else {
    const isLogin = Cookies.get(USER_COOKIE)
    if (!isLogin) {
      next('/login')
    } else {
      const permissionRoutes = store.getters.permissionRoutes
      const currentExhibition = store.getters.currentExhibition
      // 设置 展会信息
      if (!(currentExhibition && currentExhibition.id)) {
        const data = localStorage.getItem('currentExhibition') || '{}'
        const dataParse = JSON.parse(data)
        store.dispatch('user/setExhibition', dataParse)
      }
      // 设置 权限路由信息
      if (permissionRoutes && permissionRoutes.length > 0) {
        next()
      } else {
        try {
          // const { username } = await store.dispatch('user/getInfo');
          // 刷新获取路由信息
          // const accountRoute = await store.dispatch('permission/getRoute', routes)
          // router.addRoutes(accountRoute)
          // next({ ...to, replace: true })
          store.dispatch('permission/getRoute', routes)
          next()
        } catch (error) {
          message.error('获取用户信息失败')
          next('/login')
        }
      }
    }
  }
})

export default router
