import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '../views/layout/Layout'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

export const constantRouterMap = [
  {path: '/login', component: () => import('@/views/login/index'), hidden: true},
  {path: '/404', component: () => import('@/views/404'), hidden: true},

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/teacher',
    component: Layout,
    redirect: '/teacher/table',
    name: '讲师管理',
    meta: {title: '讲师管理', icon: 'example'},
    children: [
      {
        path: 'table',
        name: '讲师列表',
        component: () => import('@/views/edu/teacher/list'),
        meta: {title: '讲师列表', icon: 'table'}
      },
      {
        path: 'save',
        name: '添加讲师',
        component: () => import('@/views/edu/teacher/save'),
        meta: {title: '添加讲师', icon: 'tree'}
      },
      {
        path: 'edit/:id',
        name: '修改讲师',
        component: () => import('@/views/edu/teacher/save'),
        meta: {title: '添加讲师', icon: 'tree'},
        hidden: true
      }
    ]
  },
  {
    path: '/subject',
    component: Layout,
    name: '课程分类管理',
    redirect: '/subject/sublist',
    meta: {title: '课程分类管理', icon: 'form'},
    children: [
      {
        path: 'sublist',
        name: '课程分类列表',
        component: () => import('@/views/edu/subject/list'),
        meta: {title: '课程分类列表', icon: 'table'}
      },
      {
        path: 'subsave',
        name: '添加课程分类',
        component: () => import('@/views/edu/subject/save'),
        meta: {title: '添加课程分类', icon: 'tree'}
      }
    ]
  },
  {
    path: '/course',
    component: Layout,
    name: '课程管理',
    redirect: '/course/list',
    meta: {title: '课程管理', icon: 'form'},
    children: [
      {
        path: 'list',
        name: '课程列表',
        component: () => import('@/views/edu/course/list'),
        meta: {title: '课程列表', icon: 'table'}
      },
      {
        path: 'info',
        name: '添加课程',
        component: () => import('@/views/edu/course/info'),
        meta: {title: '添加课程', icon: 'tree'}
      },
      {
        path: 'info/:id',
        name: '编辑课程基本信息',
        component: () => import('@/views/edu/course/info'),
        meta: {title: '编辑课程基本信息', icon: 'tree'},
        hidden: true
      },
      {
        path: 'chapter/:id',
        name: '编辑课程大纲',
        component: () => import('@/views/edu/course/chapter'),
        meta: {title: '编辑课程大纲', icon: 'tree'},
        hidden: true
      },
      {
        path: 'publish/:id',
        name: '发布课程',
        component: () => import('@/views/edu/course/publish'),
        meta: {title: '发布课程', icon: 'tree'},
        hidden: true
      },
    ]
  },


  {path: '*', redirect: '/404', hidden: true}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})
