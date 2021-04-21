export const USER_COOKIE = 'userCookie'

export const statusConfig = {
  certificateApplicationStatus: {
    0: '未付款',
    1: '已付款',
    2: '部分付款',
    3: '已取消'
  },
  orderStatus: {
    2: '生成缴费单',
    3: '缴费单已上传',
    1: '正常',
    // 5: '已完成',
    0: '已取消'
  },
  payStatus: {
    0: '未付款',
    1: '已付款',
    2: '部分付款'
  },
  certificateApplyStatus: {
    0: '未付款',
    1: '已付款',
    2: '部分付款',
    3: '已取消'
  },
  acceptanceStatus: {
    0: '已申请',
    1: '已派工',
    2: '已验收'
  },
  guaranteeState: {
    0: '已申请',
    1: '已报修',
    // 2: '已派单',
    3: '已完成'
  },
  settlementState: {
    0: '未结算',
    3: '已结算'
  },
  invoiceState: {
    0: '未开票',
    1: '已开票'
  },
  refundState: {
    0: '未退款',
    1: '已退款'
  }
}
