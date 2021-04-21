<template>
  <a-modal
    :title="title"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    :width="520"
    @cancel="handleCancel"
  >
    <a-table
      bordered
      :columns="columns"
      :data-source="data"
      :pagination="pagination"
      :loading="tableLoading"
      @change="paginationChange"
      :scroll="{y: 550}"
    >
      <span slot="paymentStatus" slot-scope="text">{{text && text === '0' ? '未付款' : '已付款' }}</span>
      <span slot="action" slot-scope="text, record">
        <template v-if="record.paymentStatus === '0'">
          <a @click="showConfirm(record)">支付</a>
        </template>
        <template v-if="record.paymentStatus === '1'">
          <!-- <a>已支付</a> -->
          <a-button type="link" disabled>已支付</a-button>
        </template>
      </span>
    </a-table>
    <qr-code
      ref="qrCodeModal"
    />
  </a-modal>
</template>

<script>
import TableMixIn from '@/mixins'
import { personSubmitRecord, personPay } from '@/api'
import { getLocalInfo } from '@/utils'
import qrCode from './qrCode'

const columns = [
  { title: '订单号', dataIndex: 'orderNumber' },
  { title: '支付状态', dataIndex: 'paymentStatus', scopedSlots: { customRender: 'paymentStatus' } },
  { title: '金额', dataIndex: 'totalAmount' },
  { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'center' }
]

export default {
  mixins: [TableMixIn],
  components: {
    qrCode
  },
  data() {
    return {
      title: '订单列表',
      visible: false,
      confirmLoading: false,
      data: [],
      columns
    }
  },
  methods: {
    handleOk() {
      this.visible = false
    },
    async getSubmitRecordList() {
      const localInfo = getLocalInfo()
      const params = {
        showId: localInfo.showId,
        dataCategoryId: localInfo.userId,
        dataCategory: '0',
        certificatesType: '0', // 人证
        pageRows: this.pagination.pageSize,
        pageNum: this.pagination.current
      }
      try {
        this.tableLoading = true
        const result = await personSubmitRecord(params)
        this.tableLoading = false
        const { code, data } = result
        if (code === 1000) {
          this.data = data.list.map(item => {
            item.key = item.id
            return item
          })
        }
      } catch (error) {
        this.tableLoading = false
        console.log(error)
      }
    },
    showConfirm(record) {
      const qrCodeModal = this.$refs.qrCodeModal
      qrCodeModal.visible = true
      this.handlePay(record)
    },
    async handlePay(record) {
      const params = {
        id: record.id,
        orderNumber: record.orderNumber
      }
      try {
        const result = await personPay(params)
        console.log(result)
      } catch (error) {
        console.log(error)
      }
    },
    paginationChange(pagination) {
      this.pagination.current = pagination.current
      this.getSubmitRecordList()
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>
