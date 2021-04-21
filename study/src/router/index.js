import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect:'/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login'),
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/index'),
  },
  {
    path: '/user',
    name: 'user',
    meta:{
      requireAuth:true
    },
    component: () => import('@/views/user'),
  },

]

const router = new VueRouter({
  routes
})

export default router
