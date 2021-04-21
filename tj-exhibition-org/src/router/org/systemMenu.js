import SystemLayout from '@/views/system/layout'
import ViewLayout from '@/views/system/layout/viewLayout'

const systemMenuList = [
  {
    path: '/system',
    name: 'system',
    component: SystemLayout,
    redirect: '/system/user/info',
    children: [
      {
        path: 'user',
        name: 'user',
        component: ViewLayout,
        meta: {
          title: '用户中心'
        },
        children: [
          {
            path: 'info',
            name: 'userInfo',
            meta: {
              title: '用户信息'
            },
            component: () => import(/* webpackChunkName: "userInfo" */ '@/views/system/info')
          },
          {
            path: 'account',
            name: 'userAccount',
            meta: {
              title: '账号安全'
            },
            component: () => import(/* webpackChunkName: "userAccount" */ '@/views/system/account')
          },
          {
            path: 'child-account',
            name: 'userChildAccount',
            meta: {
              title: '子账户'
            },
            component: () => import(/* webpackChunkName: "userChildAccount" */ '@/views/system/childAccount')
          },
          {
            path: 'log',
            name: 'userLog',
            meta: {
              title: '系统日志'
            },
            component: () => import(/* webpackChunkName: "userLog" */ '@/views/system/log')
          },
          {
            path: 'credibility',
            name: 'userCredibility',
            meta: {
              title: '信誉查询'
            },
            component: () => import(/* webpackChunkName: "userCredibility" */ '@/views/system/credibility')
          },
          {
            path: 'classify',
            name: 'userClassify',
            meta: {
              title: '主体分类认证'
            },
            component: () => import(/* webpackChunkName: "userClassify" */ '@/views/system/classify')
          }
        ]
      },
      {
        path: 'drawings',
        name: 'systemDrawings',
        meta: {
          title: '图纸管理'
        },
        component: () => import(/* webpackChunkName: "systemDrawings" */ '@/views/system/drawings')
      },
      {
        path: 'personnel',
        name: 'systemPersonnel',
        meta: {
          title: '人员资料库'
        },
        component: () => import(/* webpackChunkName: "systemPersonnel" */ '@/views/system/personnel')
      }
      // {
      //   path: 'template',
      //   name: 'systemTemplate',
      //   meta: {
      //     title: '模板管理'
      //   },
      //   component: () => import(/* webpackChunkName: "systemTemplate" */ '@/views/system/template')
      // }
    ]
  }
]

export default systemMenuList
