const menuList = [
  {
    key: '/home/init',
    title: '初始化设置',
    path: '/home/init',
    icon: 'rocket',
    children: [
      {
        key: '/home/init/drawingsSetting',
        title: '图纸设置',
        path: '/home/init/drawingsSetting',
        icon: 'file-image'
      }
    ]
  },
  {
    key: '/home/price',
    title: '价格体系',
    path: '/home/price',
    icon: 'pay-circle'
  },
  {
    key: '/home/exp',
    title: '搭建商管理',
    path: '/home/exp',
    icon: 'team'
  },
  {
    key: '/home/exhibitor',
    title: '参展商管理',
    path: '/home/exhibitor',
    icon: 'team'
  },
  {
    key: '/home/drawings-audit',
    title: '图纸审核',
    path: '/home/drawings-audit',
    icon: 'picture'
  },
  {
    key: '/home/order',
    title: '订单管理',
    path: '/home/order',
    icon: 'bell',
    children: [
      {
        key: '/home/order/service',
        title: '服务订单',
        path: '/home/order/service'
      },
      {
        key: '/home/order/certificate',
        title: '证件订单',
        path: '/home/order/certificate'
      }
    ]
  },
  {
    key: '/home/financial',
    title: '财务收款',
    path: '/home/financial',
    icon: 'audit'
  },
  {
    key: '/home/report-hall',
    title: '一键报馆',
    path: '/home/report-hall',
    icon: 'play-circle'
  },
  {
    key: '/home/certificates',
    title: '证件申请',
    path: '/home/certificates',
    icon: 'idcard',
    children: [
      {
        key: '/home/certificates/person',
        title: '人证申请',
        path: '/home/certificates/person',
        icon: 'solution'
      },
      {
        key: '/home/certificates/car',
        title: '车证申请',
        path: '/home/certificates/car',
        icon: 'car'
      }
    ]
  },
  {
    key: '/home/repair',
    title: '报修管理',
    path: '/home/repair',
    icon: 'tool'
  },
  {
    key: '/home/acceptance',
    title: '场地验收',
    path: '/home/acceptance',
    icon: 'project',
    children: [
      {
        key: '/home/acceptance/exp',
        title: '搭建商验收',
        path: '/home/acceptance/exp'
      },
      {
        key: '/home/acceptance/stadium',
        title: '场馆验收',
        path: '/home/acceptance/stadium'
      }
    ]
  },
  {
    key: '/home/settlement',
    title: '结算管理',
    path: '/home/settlement',
    icon: 'snippets',
    children: [
      {
        key: '/home/settlement/exp',
        title: '搭建商结算',
        path: '/home/settlement/exp'
      },
      {
        key: '/home/settlement/stadium',
        title: '场馆结算',
        path: '/home/settlement/stadium'
      }
    ]
  },
  {
    key: '/home/invoice',
    title: '开票申请',
    path: '/home/invoice',
    children: [
      {
        key: '/home/invoice/exp',
        title: '搭建商开票',
        path: '/home/invoice/exp'
      },
      {
        key: '/home/invoice/stadium',
        title: '场馆开票',
        path: '/home/invoice/stadium'
      },
      {
        key: '/home/invoice/certificate',
        title: '证件开票',
        path: '/home/invoice/certificate'
      }
    ]
  },
  {
    key: '/home/refund',
    title: '退款处理',
    path: '/home/refund',
    icon: 'safety'
  }
]

export default menuList