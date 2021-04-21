import { post, get } from '@/axios'

// 注册
const register = post('/user/register')
const registerInfo = get('/user/getUserInfo')
const getUsefulLife = post('/expoShowMainController/getSubjectAuthentication')
const validateUserName = get('/user/validUserName')
const registerUpdate = post('/user/updateUserInfo')
const orgLogin = post('/user/login')
const orgLogout = get('/user/logout')
const updatePassword = post('/user/updatePass')
// 社会统一信用码重复校验
const validCompanyCode = get('/user/validCompanyCode')

// 订单支付
const orderReservation = get('/certificatesOrderTransactionController/orderReservation')
const orderCacel = post('/certificatesOrderTransactionController/orderCacel')
// 系统管理
const clildUser = post('/user/selectChildUser')
const clildUserAdd = post('/user/insertChildUser')
const systemLogList = post('/user/selectSysLogList')
// 图纸管理
const addDrawingInfo = post('/drawingController/addDrawingInfo')
const updateDrawing = post('/drawingController/updateDrawing')
const deleteDrawing = get('/drawingController/deleteDrawing')
const updateUse = post('/drawingController/updateUse')

// 主场管理系统
const generatePayFeeNotice = get('/expoOrderListController/getPayNotice')
const backoutPayFeeNotice = get('expoOrderListController/canclePaymentBill')
const orgReportHall = post('/serviceItem/getSubmitService')
const reportHallSubmit = post('/serviceItem/submitServiceList')
const reportImportFile = post('/file/insertSubmitList')
const orgExp = post('/builder/getBuilderPage')
const getPriceList = post('/serviceItem/list')
const getServiceByBigId = get('/serviceItem/getServiceByBigId')
const saveChildService = post('/serviceItem/openTarget')
const addInserBig = post('/serviceItem/insertBig')
const updateBig = post('/serviceItem/updateBig')
const deleteBig = get('/serviceItem/deleteBig')
const insertSmall = post('/serviceItem/insertSmall')
const updateSmall = post('/serviceItem/updateSmall')
const deleteSmall = get('/serviceItem/deleteSmall')
const updatePrice = post('/serviceItem/updatePrice')
const pullServiceItem = post('/serviceItem/pullServiceItem')
const fileDownload = get('/file/fileDownload')

const financialList = post('/expoOrderListController/getPayList')
const financialConfirmList = post('/expoOrderListController/financialCollection')
const financialConfirmBase = get('/expoOrderListController/getPayBasicData')
const financialAdd = post('/expoOrderListController/commitCollection')

// 场地验收
const orgAcceptanceList = post('/homeBuildingSiteAcceptanceController/mainAcceptanceList')
const orgAcceptanceApply = get('/homeBuildingSiteAcceptanceController/acceptanceApplyForHall')
const orgAcceptanceAction = get('/homeBuildingSiteAcceptanceController/mainDispatchAndAcceptance')
const orgAcceptanceStadium = post('/homeBuildingSiteAcceptanceController/getHallSiteAccept')

// 参展商管理
const exhibitorsList = post('/expoExhibitorsController/getList')
const exhibitorsUpload = post('/file/importExhibitorsExcel')
// 图纸设置
const getDrawingList = get('/drawingController/getDrawingList')
const getNewDrawingList = get('/drawingController/getUseAbleDrawingList')
const setDrawing = post('/drawingController/setDrawing')
const mainDrawingApproveList = post('/drawingApprovalController/mainDrawingApproveList')
const mainGetDetail = get('/drawingApprovalController/getDetail')
const approveDrawing = post('/drawingApprovalController/approveDrawing')
// 展会列表
const getExhibition = post('/expoShowController/getExpoShowList')
const saveExhibition = get('/expoShowController/getShowById')

// 搭建商管理系统
const getDrawings = post('/drawingApprovalController/getDrawingReviewList')
const getDrawingsDetail = post('/drawingApprovalController/getList') // 图纸查询
const drawingsAll = post('/drawingController/getExhibitionDrawingList')
const getExpoExhibitors = post('/expoExhibitorsController/getExpoExhibitors')
const expExhibitorAdd = post('/expoExhibitorsController/insterExpoExhibitors')
const drawingsAuditResult = post('/drawingApprovalController/getList')
const drawingsUpload = post('/drawingApprovalController/insertDrawingApproval')
const orderList = post('/expoOrderListController/getList')
const orderDetail = post('/expoOrderListController/getDetails')
const orderDelete = post('/expoOrderListController/deleteExpoOrderList')
const orderBill = get('/expoOrderListController/getPayNotice')
const expOrderBill = get('/expoOrderListController/selectPayNotice')
const orderBillUpload = post('/expoOrderListController/insertOrderPaymentBill')
const expDrawingsFileList = post('/drawingController/getUploadDrawings')
const expOrderSave = post('/expoOrderListController/updateExpoOrderList')
const serviceClassify = post('/serviceItem/list')
const exhibitorsListAll = post('/expoExhibitorsController/getExpoExhibitorsList')
const orderNumber = post('/expoOrderListController/generateOrderNumber')
const orderAdd = post('/expoOrderListController/insertExpoOrderList')
const acceptanceList = post('/homeBuildingSiteAcceptanceController/getPageInfoList')
const acceptanceAdd = post('/homeBuildingSiteAcceptanceController/insertSiteAcceptance')
const certificateOrderList = post('/certificatesOrderTransactionController/selectOrderList')
const certificateDetail = post('/certificatesOrderTransactionController/selectOrderDetails')

// 报修管理
const repairAdd = post('/homeBuildingGuaranteeController/insert')
const repairList = post('/homeBuildingGuaranteeController/getPageInfoList')
const repairReq = post('/homeBuildingGuaranteeController/guaranteeForMain')

// 开票申请
const orgInvoiceList = post('/invoice/getInvoiceList')
const orgInvoiceAction = post('/invoice/updateInvoiceList')
const orgInvoiceDetail = get('/invoice/getInvoiceDetail')
const expInvoiceList = post('/invoice/getPageInfoList')
const expInvoiceHomeCourtList = post('/expoShowMainController/getNotInvoicedList')
const expInvoiceOrderList = post('/expoOrderListController/getNotInvoicedOrderList')
const expInvoiceCompany = post('/expoShowMainController/getCompanyDetails')
const expInvoiceSave = post('/invoice/insertInvoiceApplication')
const certificateInvoiceList = post('/certificatePreparationInvoiceApplicationController/getList')
const certificateUnInvoice = post('/certificatesOrderTransactionController/selectInvoiceOrderList')
const certificateSubmit = post('/certificatePreparationInvoiceApplicationController/insertInvoice')

// 结算
const settleList = post('/settle/getSettleList')
const batchSettleBill = post('/settle/getBatchSettleBill')
const settleDetail = get('/settle/getBuilderSettleBill')
const settleSure = get('/settle/confirmSettledForMain')
const settleExpSure = post('/settle/settleCollection')
// 结算-场馆结算
const stadiumSettleList = post('/settle/getSettlementList')
// 主场-搭建商-结算
const orgExpSettle = post('/settle/getSettleBill')
const settleAdd = post('/settle/insertSettle')
const expSettleList = get('/settle/getHomeSettleList')
const expSettleSure = get('/settle/comfirmSettle')
const expSettleRefund = get('/settle/getAccountInfo')
const expSettleRefundApply = post('/settle/refundApply')

// 退款
const orgRefundList = post('/settle/getRefundListForMain')
const orgRefundAction = get('/settle/refundForMainOne')
const expRefundList = post('/homeBuildingSettlementRefundController/getPageInfoList')

// 搭建商系统管理
const expSysPersonnelAdd = post('/certificatesPersonController/insertCertificatesPerson')
const expSysPersonnelEdit = post('/certificatesPersonController/updateCertificatesPerson')
const expSysPersonnelDelete = post('/certificatesPersonController/deleteCertificatesPerson')

// 证件申请
const personCertificate = post('/certificatesPersonneExhibitionController/getCertificatesPersonneExhibitionList')
const carCertificate = post('/certificatesVehicleController/getCertificatesVehicleList')
const getPersonnel = post('/certificatesPersonController/getCertificatesPersonList') // 系统管理内
const getPersonnelList = post('/certificatesPersonController/getList') //  展会内部
const jobLevel = post('/dictionaryTypeDetailsController/getDictionaryTypeDetailsList') // 工种
const personCertificateAdd = post('/certificatesPersonneExhibitionController/insertCertificatesPersonneExhibition')
const personCertificateEdit = post('/certificatesPersonneExhibitionController/update')
const personnelBatchAdd = post('/certificatesPersonneExhibitionController/insertBatch')
const personCertificateDelete = post('/certificatesPersonneExhibitionController/deletePerson')
const personCertificateSubmit = post('/certificatesOrderTransactionController/insertCertificatesOrderTransaction')
const personSubmitRecord = post('/certificatesOrderTransactionController/getCertificatesOrderTransactionList')
const personPay = post('/certificatesOrderTransactionController/insertOrderPayment')
const carCertificateTime = post('/certificatesVehicleController/getVehicleSetUp')
const carCertificateAdd = post('/certificatesVehicleController/insertCertVehicleInfo')
const carCertificateEdit = post('/certificatesVehicleController/updateCertVehicleInfo')
const carCertificateDelete = get('/certificatesVehicleController/deleteCertVehicleInfo')
const getAllAmount = post('/logisticsOrderListController/getListAmount')
// 查询支付结果接口
const getPayResult = post('/certificatesOrderTransactionController/payResultQuery')
// 结算支付
const paySettlementAPI = get('/settle/orderReservation')
// 查询结算支付结果
const querySettlementResultAPI = post('/settle/payResultQuery')
// 服务订单支付接口
const serviceOrderPay = get('/expoOrderListController/orderReservation')
// 收款流水查询接口
const getBankFlowAPI = post('/expoOrderListController/collectionRecord')
// 业务系统认款接口
const payClaimAPI = post('/expoOrderListController/payClaim')
// 取消认款接口
const payClaimCacelAPI = post('/expoOrderListController/payClaimCacel')
export {
  payClaimCacelAPI,
  payClaimAPI,
  getBankFlowAPI,
  querySettlementResultAPI,
  serviceOrderPay,
  paySettlementAPI,
  getPayResult,
  orderReservation,
  orderCacel,
  getNewDrawingList,
  getAllAmount,
  getExhibition,
  saveExhibition,
  register,
  registerInfo,
  getUsefulLife,
  validateUserName,
  registerUpdate,
  orgLogin,
  orgLogout,
  updatePassword,
  clildUser,
  clildUserAdd,
  systemLogList,
  addDrawingInfo,
  updateDrawing,
  deleteDrawing,
  updateUse,
  generatePayFeeNotice,
  backoutPayFeeNotice,
  orgReportHall,
  reportHallSubmit,
  reportImportFile,
  orgExp,
  getPriceList,
  getServiceByBigId,
  saveChildService,
  addInserBig,
  updateBig,
  deleteBig,
  insertSmall,
  updateSmall,
  deleteSmall,
  updatePrice,
  pullServiceItem,
  fileDownload,
  financialList,
  financialConfirmList,
  financialConfirmBase,
  financialAdd,
  orgAcceptanceList,
  orgAcceptanceApply,
  orgAcceptanceAction,
  orgAcceptanceStadium,
  exhibitorsList,
  exhibitorsUpload,
  getDrawingList,
  setDrawing,
  mainDrawingApproveList,
  mainGetDetail,
  approveDrawing,
  getDrawings,
  getDrawingsDetail,
  drawingsAll,
  getExpoExhibitors,
  expExhibitorAdd,
  drawingsAuditResult,
  drawingsUpload,
  orderList,
  orderDetail,
  orderDelete,
  orderBill,
  expOrderBill,
  orderBillUpload,
  expDrawingsFileList,
  expOrderSave,
  serviceClassify,
  exhibitorsListAll,
  orderNumber,
  orderAdd,
  acceptanceList,
  acceptanceAdd,
  certificateOrderList,
  certificateDetail,
  repairAdd,
  repairList,
  repairReq,
  expInvoiceOrderList,
  expInvoiceCompany,
  expInvoiceSave,
  certificateInvoiceList,
  certificateUnInvoice,
  certificateSubmit,
  expInvoiceList,
  orgInvoiceList,
  orgInvoiceAction,
  orgInvoiceDetail,
  expInvoiceHomeCourtList,
  settleList,
  batchSettleBill,
  settleDetail,
  settleSure,
  settleExpSure,
  stadiumSettleList,
  orgExpSettle,
  settleAdd,
  expSettleList,
  expSettleSure,
  expSettleRefund,
  expSettleRefundApply,
  orgRefundList,
  orgRefundAction,
  expRefundList,
  expSysPersonnelAdd,
  expSysPersonnelEdit,
  expSysPersonnelDelete,
  personCertificate,
  carCertificate,
  getPersonnel,
  getPersonnelList,
  jobLevel,
  personCertificateAdd,
  personCertificateEdit,
  personnelBatchAdd,
  personCertificateDelete,
  personCertificateSubmit,
  personSubmitRecord,
  personPay,
  carCertificateTime,
  carCertificateAdd,
  carCertificateEdit,
  carCertificateDelete,
  validCompanyCode
}
