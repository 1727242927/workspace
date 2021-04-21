<template>
  <div class="certificates-car">
    <Title>车证列表</Title>
    <div class="top" style="text-align: right; padding-right: 50px">
      <a-button type="primary" @click="handleAdd">添加</a-button>
      <a-button
        type="primary"
        style="margin-left: 20px"
        :loading="submitBtnLoading"
        @click="handleSubmitBtnClick"
        >支付</a-button
      >
    </div>
    <div class="table-wrapper">
      <a-table
        :row-selection="rowSelection"
        bordered
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        :loading="tableLoading"
        :scroll="{ x: 1550, y: 550 }"
        @change="paginationChange"
      >
        <span slot="applyStatus" slot-scope="applyStatus">{{
          formateApplyStatus(applyStatus)
        }}</span>
        <span slot="gender" slot-scope="gender">{{
          gender === "1" ? "男" : "女"
        }}</span>
        <span slot="whetherMechanicalVehicle" slot-scope="text">{{
          text === "0" ? "否" : "是"
        }}</span>
        <span slot="admissionTime" slot-scope="text, record">
          {{ record.admissionStartTime }} : 00 - {{ record.admissionEndTime }} :
          00
        </span>
        <template slot="applyStatus" slot-scope="text, record">
          <span>
            {{
              record.applyStatus == 0
                ? "待支付"
                : record.applyStatus == 1
                ? "已付款"
                : record.applyStatus == 4
                ? "待提交"
                : record.applyStatus == 3
                ? "已制证"
                : ""
            }}
          </span>
        </template>
        <span slot="licensePlateNumber" slot-scope="licensePlateNumber">{{
          licensePlateNumber.toUpperCase()
        }}</span>
        <span slot="action" slot-scope="text, record">
          <!-- <a>详情</a>
          <a-divider type="vertical" /> -->
          <a v-if="record.applyStatus == 4" @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <a @click="viewClick(record)">查看</a>
          <a-divider type="vertical" />
          <a v-if="record.applyStatus == 4" @click="showDeleteConfirm(record)"
            >删除</a
          >
        </span>
      </a-table>
    </div>
    <!-- 添加弹框 -->
    <car-form
      :visible.sync="visible"
      @refresh="getCarCertificateList"
      :isAdd="isAdd"
      :record="record"
    />
    <!--支付结果查询遮罩-->
    <a-modal
      :visible="showResult"
      :maskClosable="false"
      @ok="payOver"
      @cancel="payOver"
    >
      <PayDialog />
      <template slot="footer">
        <div style="text-align: center">
          <a-button type="danger" @click="payOver">支付失败</a-button>
          <a-button type="primary" @click="payOver">支付成功</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script>
import Title from '@/components/Title'
import CarForm from './carForm'
import PayDialog from './PayDialog'
import TableMixIn from '@/mixins'
import {
  carCertificate,
  carCertificateDelete,
  personCertificateSubmit,
  getPayResult
} from '@/api'
import { getLocalInfo } from '@/utils'
import { handleFileList } from '@/utils/fileData'
import { statusConfig } from '@/utils/config'

const columns = [
  // { title: '参展商', dataIndex: 'exName', scopedSlots: { customRender: 'exName' }, align: 'center' },
  // { title: '展位号', dataIndex: 'zwNum', align: 'center', width: 120 },
  { title: '驾驶员姓名', dataIndex: 'driverName', align: 'center', width: 120 },
  {
    title: '性别',
    dataIndex: 'gender',
    align: 'center',
    scopedSlots: { customRender: 'gender' },
    width: 120
  },
  { title: '身份证号', dataIndex: 'idCard', align: 'center' },
  {
    title: '车牌号',
    dataIndex: 'licensePlateNumber',
    align: 'center',
    scopedSlots: { customRender: 'licensePlateNumber' }
  },
  {
    title: '申请证件类型',
    dataIndex: 'certTypeName',
    align: 'center',
    width: 130
  },
  {
    title: '证件种类',
    dataIndex: 'certCategoryName',
    align: 'center',
    width: 110
  },
  {
    title: '是否需要机力',
    dataIndex: 'whetherMechanicalVehicle',
    align: 'center',
    scopedSlots: { customRender: 'whetherMechanicalVehicle' },
    width: 120
  },
  {
    title: '进场日期',
    dataIndex: 'admissionDate',
    align: 'center',
    width: 125
  },
  {
    title: '进场时间',
    dataIndex: 'admissionTime',
    align: 'center',
    scopedSlots: { customRender: 'admissionTime' },
    width: 140
  },
  {
    title: '申请状态',
    dataIndex: 'applyStatus',
    scopedSlots: { customRender: 'applyStatus' },
    align: 'center',
    width: 120
  },
  {
    title: '操作',
    key: 'Action',
    scopedSlots: { customRender: 'action' },
    width: 170,
    align: 'center',
    fixed: 'right'
  }
]

export default {
  mixins: [TableMixIn],
  components: {
    Title,
    CarForm,
    PayDialog
  },
  data() {
    return {
      submitBtnLoading: false,
      selectedRowKeys: [],
      columns,
      data: [],
      isAdd: true,
      visible: false,
      record: {},
      showResult: false,
      // 支付系统订单编号
      paySysOrderNumber: ''
    }
  },
  created() {
    this.getCarCertificateList()
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
          this.selectedRows = selectedRows
        },
        /**
         * @description: 非待提交状态的不能勾选
         * @author: 潘慧敏
         * @time: 2021-03-13 13:49:45
         */
        getCheckboxProps: (record) => ({
          props: {
            disabled: record.applyStatus != '4'
          }
        })
      }
    }
  },
  methods: {
    /**
     * @description: 查询支付结果
     * @author: 潘慧敏
     * @time: 2021-03-13 15:16:20
     * @param transactionType 支付类型：1-支付，2-退款
     * @param paySysOrderNumber 支付系统订单编号
     */
    payOver() {
      getPayResult({
        paySysOrderNumber: this.paySysOrderNumber,
        transactionType: '1'
      }).then((res) => {
        if (res.code == 1000) {
          this.getCarCertificateList()
          this.showResult = false
        }
      })
    },
    handleAdd() {
      this.isAdd = true
      this.visible = true
      this.record = {}
    },
    handleSubmitBtnClick() {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.error('请选择证件')
        return
      }
      this.$confirm({
        title: '确认支付?',
        content: '确认支付后，将以1s后跳转支付页面',
        onOk: () => {
          return new Promise((resolve, reject) => {
            let rows = this.selectedRows
            let ids = []
            for (let item of rows) ids.push(item.id)
            this.submitBtnLoading = true
            const localInfo = getLocalInfo()
            const params = {
              showId: localInfo.showId,
              dataCategoryId: localInfo.userId,
              dataCategory: '0',
              certificatesPersonneExhibitionIdList: ids,
              certificatesType: '1',
              orderSource: '0'
            }
            personCertificateSubmit(params)
              .then((res) => {
                if (res.code == '1000' && res.data) {
                  this.paySysOrderNumber = res.data && res.data.orderNumber
                  this.$message.success(res.message)
                  setTimeout(() => {
                    resolve('成功')
                    window.open(res.data.payUrl)
                  }, 1000)
                  setTimeout(() => {
                    this.showResult = true
                  }, 1000)
                } else {
                  this.$message.error(res.message)
                  resolve('接口失败')
                }
                this.submitBtnLoading = false
              })
              .catch((err) => {
                resolve('失败')
                this.submitBtnLoading = false
                console.log(err)
              })
          })
        },
        onCancel() {}
      })
      // 显示假弹框
      // const qrCodeModal = this.$refs.qrCodeModal
      // qrCodeModal.visible = true
      // this.tableLoading = true
      // this.submitBtnLoading = true
    },
    async getCarCertificateList() {
      const localInfo = getLocalInfo()
      this.tableLoading = true
      const params = {
        showId: localInfo.showId,
        userId: localInfo.userId,
        pageRows: this.pagination.pageSize,
        pageNum: this.pagination.current,
        ...this.searchData
      }
      try {
        const result = await carCertificate(params)
        this.tableLoading = false
        const { code, data } = result
        if (code === 1000) {
          this.data = data.list.map((list) => {
            list.key = list.certRelateId
            return list
          })
          this.pagination.total = data.total
        }
      } catch (error) {
        console.log(error)
        this.tableLoading = false
      }
    },
    handleEdit(record) {
      this.isAdd = false
      this.visible = true
      this.record = record
    },
    paginationChange(pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getCarCertificateList()
    },
    showDeleteConfirm(record) {
      this.$confirm({
        title: '您确定要删除这条数据吗？',
        content: '删除后不可恢复！是否要删除？',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          this.handleDelete(record)
        }
      })
    },
    viewClick(record) {
      sessionStorage.setItem('carLicense', JSON.stringify(record))
      this.$router.push({
        path: '/home/certificates/car/card'
      })
    },
    handleDelete(record) {
      const params = {
        certVehicleId: record.certVehicleId,
        certRelateId: record.certRelateId
      }
      carCertificateDelete(params).then((res) => {
        const { message } = res
        this.getCarCertificateList()
        this.$message.success(message)
      })
    },
    formateApplyStatus(status) {
      if (status == null) return
      return statusConfig.certificateApplyStatus[status]
    }
  }
}
</script>
