const menuList = [
  {
    key: '/system/user',
    title: '用户中心',
    icon: 'user',
    path: '/system/user',
    children: [
      {
        key: '/system/user/info',
        title: '用户信息',
        path: '/system/user/info',
        icon: 'smile'
      },
      {
        key: '/system/user/account',
        title: '账号安全',
        path: '/system/user/account',
        icon: 'safety-certificate'
      },
      {
        key: '/system/user/child-account',
        title: '子账户',
        path: '/system/user/child-account'
      },
      {
        key: '/system/user/log',
        title: '系统日志',
        path: '/system/user/log',
        icon: 'ordered-list'
      },
      {
        key: '/system/user/credibility',
        title: '信誉查询',
        path: '/system/user/credibility',
        icon: 'crown'
      }
      // {
      //   key: '/system/user/classify',
      //   title: '主体分类认证',
      //   path: '/system/user/classify',
      //   icon: 'sliders'
      // }
    ]
  },
  {
    key: '/system/drawings',
    title: '图纸管理',
    path: '/system/drawings',
    icon: 'picture'
  },
  {
    key: '/system/personnel',
    title: '人员资料库',
    path: '/system/personnel',
    icon: 'usergroup-add'
  }
  // {
  //   key: '/system/template',
  //   title: '模板管理',
  //   path: '/system/template',
  //   icon: 'credit-card'
  // }
]

export default menuList
