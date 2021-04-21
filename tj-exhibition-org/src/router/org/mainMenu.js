import MainLayout from '@/views/layout'
import ViewLayout from '@/views/layout/viewLayout'

const orgMainMenuList = [
  {
    path: '/exhibition',
    name: 'exhibition',
    component: () => import(/* webpackChunkName: "exhibition" */ '@/views/exhibitionList')
  },
  {
    path: '/home',
    name: 'orgHome',
    component: MainLayout,
    redirect: '/home/init/drawingsSetting',
    children: [
      {
        path: 'init',
        name: 'init',
        meta: {
          title: '初始化设置'
        },
        component: ViewLayout,
        children: [
          {
            path: 'drawingsSetting',
            name: 'drawingsSetting',
            meta: {
              title: '图纸设置'
            },
            component: () => import(/* webpackChunkName: "drawingsSetting" */ '@/views/drawingsSetting')
          }
        ]
      },
      {
        path: 'drawings-audit',
        name: 'drawingsAudit',
        meta: {
          title: '图纸审核'
        },
        component: () => import(/* webpackChunkName: "drawingsAudit" */ '@/views/drawingsAudit')
      },
      {
        path: 'drawings-audit/detail',
        name: 'drawingsAuditDetail',
        meta: {
          title: '图纸审核-详情'
        },
        component: () => import(/* webpackChunkName: "drawingsAuditDetail" */ '@/views/drawingsAudit/detail')
      },
      {
        path: 'report-hall',
        name: 'reportHall',
        meta: {
          title: '一键报馆'
        },
        component: () => import(/* webpackChunkName: "reportHall" */ '@/views/reportHall')
      },
      {
        path: 'exp',
        name: 'exp',
        meta: {
          title: '搭建商管理'
        },
        component: () => import(/* webpackChunkName: "exp" */ '@/views/exp')
      },
      {
        path: 'exhibitor',
        name: 'exhibitor',
        meta: {
          title: '参展商管理'
        },
        component: () => import(/* webpackChunkName: "exhibitor" */ '@/views/exhibitor')
      },
      {
        path: 'price',
        name: 'price',
        meta: {
          title: '价格体系'
        },
        component: () => import(/* webpackChunkName: "price" */ '@/views/price')
      },
      {
        path: 'order',
        name: 'order',
        component: ViewLayout,
        meta: {
          title: '订单管理'
        },
        children: [
          {
            path: 'service',
            name: 'orderService',
            meta: {
              title: '服务订单'
            },
            component: () => import(/* webpackChunkName: "orderService" */ '@/views/order/service')
          },
          {
            path: 'service/detail',
            name: 'orderServiceDetail',
            meta: {
              title: '服务订单-详情'
            },
            component: () => import(/* webpackChunkName: "orderServiceDetail" */ '@/views/order/service/orderDetail')
          },
          {
            path: 'service/bill',
            name: 'orderServiceBill',
            meta: {
              title: '缴费单'
            },
            component: () => import(/* webpackChunkName: "orderServiceBill" */ '@/views/order/service/bill')
          },
          {
            path: 'certificate',
            name: 'orderCertificate',
            meta: {
              title: '证件订单'
            },
            component: () => import(/* webpackChunkName: "orderCertificate" */ '@/views/order/certificate')
          },
          {
            path: 'certificate/detail',
            name: 'orderCertificateDetail',
            meta: {
              title: '证件订单-详情'
            },
            component: () => import(/* webpackChunkName: "orderCertificateDetail" */ '@/views/order/certificate/detail')
          }
        ]
      },
      {
        path: 'financial',
        name: 'financial',
        meta: {
          title: '财务收款'
        },
        component: () => import(/* webpackChunkName: "financial" */ '@/views/financial')
      },
      {
        path: 'financial/confirm',
        name: 'financialConfirm',
        meta: {
          title: '财务收款-认款'
        },
        component: () => import(/* webpackChunkName: "financialConfirm" */ '@/views/financial/confirm')
      },
      {
        path: 'financial/detail',
        name: 'financialDetail',
        meta: {
          title: '财务收款-详情'
        },
        component: () => import(/* webpackChunkName: "financialDetail" */ '@/views/financial/detail')
      },
      {
        path: 'certificates',
        name: 'certificates',
        component: ViewLayout,
        meta: {
          title: '证件申请'
        },
        children: [
          {
            path: 'person',
            name: 'certificatesPerson',
            meta: {
              title: '人证申请'
            },
            component: () => import(/* webpackChunkName: "certificatesPerson" */ '@/views/certificates/person')
          },
          {
            path: 'car',
            name: 'certificatesCar',
            meta: {
              title: '车证申请'
            },
            component: () => import(/* webpackChunkName: "certificatesCar" */ '@/views/certificates/car')
          },
          {
            path: 'car/card',
            name: 'certificatesCarCard',
            meta: {
              title: '车证申请-详情'
            },
            component: () => import(/* webpackChunkName: "certificatesCarCard" */ '@/views/certificates/carCard')
          },
          {
            path: 'personnel',
            name: 'certificatesPersonnel',
            meta: {
              title: '人员资料库'
            },
            component: () => import(/* webpackChunkName: "certificatesPersonnel" */ '@/views/certificates/personnel')
          }
        ]
      },
      {
        path: 'repair',
        name: 'repair',
        meta: {
          title: '报修管理'
        },
        component: () => import(/* webpackChunkName: "repair" */ '@/views/repair')
      },
      {
        path: 'acceptance',
        name: 'acceptance',
        component: ViewLayout,
        meta: {
          title: '场地验收'
        },
        children: [
          {
            path: 'exp',
            name: 'acceptanceExp',
            meta: {
              title: '搭建商验收'
            },
            component: () => import(/* webpackChunkName: "acceptanceExp" */ '@/views/acceptance/exp')
          },
          {
            path: 'exp/detail',
            name: 'acceptanceExpDetail',
            meta: {
              title: '搭建商验收-详情'
            },
            component: () => import(/* webpackChunkName: "acceptanceExpDetail" */ '@/views/acceptance/exp/detail')
          },
          {
            path: 'stadium',
            name: 'acceptanceStadium',
            meta: {
              title: '场馆验收'
            },
            component: () => import(/* webpackChunkName: "acceptanceStadium" */ '@/views/acceptance/stadium')
          }
        ]
      },
      {
        path: 'settlement',
        name: 'settlement',
        component: ViewLayout,
        meta: {
          title: '结算管理'
        },
        children: [
          {
            path: 'exp',
            name: 'settlementExp',
            meta: {
              title: '搭建商结算'
            },
            component: () => import(/* webpackChunkName: "settlementExp" */ '@/views/settlement/exp')
          },
          {
            path: 'exp/detail',
            name: 'settlementExpDetail',
            meta: {
              title: '搭建商结算-详情'
            },
            component: () => import(/* webpackChunkName: "settlementExpDetail" */ '@/views/settlement/exp/detail')
          },
          {
            path: 'stadium',
            name: 'settlementStadium',
            meta: {
              title: '场馆结算'
            },
            component: () => import(/* webpackChunkName: "settlementStadium" */ '@/views/settlement/stadium')
          }
        ]
      },
      {
        path: 'invoice',
        name: 'invoice',
        component: ViewLayout,
        meta: {
          title: '开票申请'
        },
        children: [
          {
            path: 'exp',
            name: 'invoiceExp',
            meta: {
              title: '搭建商开票'
            },
            component: () => import(/* webpackChunkName: "invoiceExp" */ '@/views/invoice/exp')
          },
          {
            path: 'stadium',
            name: 'invoiceStadium',
            meta: {
              title: '场馆开票'
            },
            component: () => import(/* webpackChunkName: "invoiceStadium" */ '@/views/invoice/stadium')
          },
          {
            path: 'certificate',
            name: 'invoiceService',
            meta: {
              title: '证件开票'
            },
            component: () => import(/* webpackChunkName: "invoiceService" */ '@/views/invoice/certificate')
          },
          {
            path: 'certificate/list',
            name: 'invoiceServiceList',
            meta: {
              title: '证件开票-新增'
            },
            component: () => import(/* webpackChunkName: "invoiceServiceList" */ '@/views/invoice/certificate/unInvoiceList')
          }
        ]
      },
      {
        path: 'refund',
        name: 'refund',
        meta: {
          title: '退款处理'
        },
        component: () => import(/* webpackChunkName: "refund" */ '@/views/refund')
      }
    ]
  }
]

export default orgMainMenuList