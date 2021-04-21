<template>
  <div class="exp-settlement">
    <Title>场馆结算</Title>
    <div class="table-wrapper">
      <a-table
        bordered
        rowKey="id"
        :columns="columns"
        :data-source="data"
        :loading="tableLoading"
        :pagination="pagination"
        @change="paginationChange"
        :scroll="{y: 550}"
      >
        <span slot="refundStatus" slot-scope="state">
          {{formateRefundState(state)}}
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="detailClick(record)">详情</a>
          <a-divider type="vertical" />
          <a @click="invoiceClick(record)">开票</a>
          <a-divider type="vertical" />
          <a @click="pay(record)">支付</a>
          <!-- <a-divider type="vertical" />
          <a @click="refundClick(record)">申请退款</a> -->
        </span>
      </a-table>
    </div>
    <Settle
      :settleVisible.sync="settleVisible"
      :recordId="recordId"
      @refresh="expSettleList"
    />
    <!-- 开票 -->
    <InvoiceForm
      :visible.sync="invoiceVisible"
      :totalAmount="totalAmount"
      :orderNumberList="orderNumberList"
      @refresh="expSettleList"
    />
    <!-- 退款 -->
<!--    <Refund-->
<!--      :refundVisible.sync="refundVisible"-->
<!--      :recordId="recordId"-->
<!--      @refresh="expSettleList"-->
<!--    />-->
    <!--支付结果查询遮罩-->
    <a-modal
      :visible="showResult"
      :maskClosable="false"
      @ok="payOver"
      @cancel="payOver"
    >
      <PayDialog/>
      <template  slot="footer">
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
import Settle from './detail'
import Refund from './refund'
import InvoiceForm from './invoiceForm'
import TableMixIn from '@/mixins'
import PayDialog from '@/views/certificates/PayDialog.vue'
import { stadiumSettleList, getPayResult, paySettlementAPI, querySettlementResultAPI } from '@/api'
import { statusConfig } from '@/utils/config'

const refundState = statusConfig.refundState

const columns = [
  { title: '结算单号', dataIndex: 'settlementNumber' },
  { title: '主场名称', dataIndex: 'homeCourtName' },
  { title: '应付总金额（元）', dataIndex: 'settlementReceivableAmount' },
  { title: '已付金额（元）', dataIndex: 'settlementActualCollectionAmount' },
  { title: '余额（元）', dataIndex: 'settlementOutstandingAmount' },
  // { title: '退款状态', dataIndex: 'refundStatus', scopedSlots: { customRender: 'refundStatus' } },
  // { title: '结算状态', dataIndex: 'settlementState', scopedSlots: { customRender: 'settlementState' } },
  // { title: '结算单生成时间', dataIndex: 'settlementEstablishDate' },
  { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'center' }
]

export default {
  mixins: [TableMixIn],
  components: {
    Title,
    Settle,
    // Refund,
    InvoiceForm,
    PayDialog
  },
  data() {
    return {
      columns,
      data: [],
      settleVisible: false,
      refundVisible: false,
      invoiceVisible: false,
      totalAmount: 0,
      recordId: -1,
      refundState,
      orderNumberList: [],
      form: this.$form.createForm(this),
      showResult: false,
      // 支付系统订单编号
      paySysOrderNumber: '',
      submitBtnLoading: false
    }
  },
  created() {
    this.expSettleList()
  },
  methods: {
    /**
    * @description: 支付
    * @author: 潘慧敏
    * @time: 2021-03-23 16:09:12
    */
    pay(record) {
      this.$confirm({
        title: '确认支付?',
        content: '确认支付后，将以1s后跳转支付页面',
        onOk: () => {
          return new Promise((resolve, reject) => {
            this.submitBtnLoading = true
            paySettlementAPI({ settlementId: record.id }).then(res => {
              if (res.code == '1000' && res.data) {
                this.paySysOrderNumber = res.data && res.data.orderNumber
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
            }).catch(err => {
              resolve('失败')
              this.submitBtnLoading = false
              console.log(err)
            })
          })
        },
        onCancel() {}
      })
    },
    /**
     * @description: 查询支付结果
     * @author: 潘慧敏
     * @time: 2021-03-13 15:16:20
     * @param transactionType 支付类型：1-支付，2-退款
     * @param paySysOrderNumber 支付系统订单编号
     */
    payOver() {
      querySettlementResultAPI({ paySysOrderNumber: this.paySysOrderNumber, transactionType: '1' }).then((res) => {
        if (res.code == 1000) {
          this.expSettleList()
          this.showResult = false
        }
      })
    },
    expSettleList() {
      const params = {
        source: 2,
        pageRows: this.pagination.pageSize,
        pageNum: this.pagination.current
      }
      this.tableLoading = true
      stadiumSettleList(params).then(res => {
        const { data } = res
        this.tableLoading = false
        this.data = data.list
        this.pagination.total = data.total
      }).catch(err => {
        this.tableLoading = false
        console.log(err)
      })
    },
    paginationChange(pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.expSettleList()
    },
    detailClick(record) {
      this.settleVisible = true
      this.recordId = record.id
    },
    invoiceClick(record) {
      this.invoiceVisible = true
      this.totalAmount = record.settlementActualCollectionAmount ? Number(record.settlementActualCollectionAmount) : 0
      this.orderNumberList = [record.settlementNumber]
    },
    refundClick(record) {
      this.refundVisible = true
      this.recordId = record.id
    },
    formateRefundState(status) {
      if (status == null) return
      return this.refundState[status]
    }
  }
}
</script>

<style lang="less" scoped>
</style>
