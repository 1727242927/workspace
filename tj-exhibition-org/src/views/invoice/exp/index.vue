<template>
  <div class="repair">
    <Title>搭建商开票</Title>
    <a-form layout="inline" :form="form">
      <a-form-item label="搭建商名称">
        <a-input v-decorator="['standFittingContractorName']" placeholder="请输入搭建商名称" allowClear></a-input>
      </a-form-item>
      <a-form-item label="开票状态">
        <a-select v-decorator="['invoiceState']" placeholder="请选择开票状态" allowClear style="width:145px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option
            v-for="(status, key) in invoiceState"
            :value="key"
            :key="key"
          >
            {{status}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="search">查询</a-button>
        <a-button type="primary" :loading="invoiceLoading" @click="handleInvoice" style="margin-left: 18px">开票</a-button>
      </a-form-item>
    </a-form>
    <div class="table-wrapper">
      <a-table
        bordered
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        :loading="tableLoading"
        :row-selection="{
          selectedRowKeys,
          onChange,
          getCheckboxProps: record => ({
            props: {
              disabled: record.invoiceState !== '0'
            }
          })
        }"
        @change="paginationChange"
        rowKey="id"
        :scroll="{y: 550}"
      >
        <span slot="invoiceState" slot-scope="status">{{formateInvoiceState(status)}}</span>
        <span slot="action" slot-scope="action, record">
          <a @click="detailClick(record)">详情</a>
        </span>
      </a-table>
    </div>
    <InvoiceDetail
      :visible.sync="visible"
      :recordId="recordId"
      :invoiceType="invoiceType"
    />
  </div>
</template>

<script>
import Title from '@/components/Title'
import TableMixIn from '@/mixins'
import InvoiceDetail from './invoiceDetail'
import { orgInvoiceList, orgInvoiceAction } from '@/api'
import { getLocalInfo } from '@/utils'
import { statusConfig } from '@/utils/config'

const invoiceState = statusConfig.invoiceState

const invoiceType = {
  0: '专用发票',
  1: '普通发票'
}

const columns = [
  { title: '搭建商名称', dataIndex: 'standFittingContractorName' },
  { title: '开票金额', dataIndex: 'invoiceAmount' },
  { title: '开票时间', dataIndex: 'invoiceApplicationTime' },
  { title: '开票状态', dataIndex: 'invoiceState', scopedSlots: { customRender: 'invoiceState' } },
  { title: '操作', key: 'action', scopedSlots: { customRender: 'action' } }
  // { title: '检测结果', dataIndex: 'guaranteeDetectionResult' },
  // { title: '维修意见', dataIndex: 'guaranteeMaintenanceOpinion' },
  // { title: '收费金额', dataIndex: 'guaranteeChargeAmount' },
  // { title: '维修完成时间', dataIndex: 'guaranteeCompletionTime' }
]

export default {
  mixins: [TableMixIn],
  components: {
    Title,
    InvoiceDetail
  },
  data() {
    return {
      data: [],
      columns,
      selectedRowKeys: [],
      invoiceState,
      invoiceType,
      visible: false,
      recordId: null,
      invoiceLoading: false,
      form: this.$form.createForm(this)
    }
  },
  created() {
    this.localInfo = getLocalInfo()
    this.getInvoiceList()
  },
  methods: {
    search() {
      this.pagination.current = 1
      const value = this.form.getFieldsValue()
      this.searchData = value
      this.getInvoiceList()
    },
    async getInvoiceList() {
      try {
        const { showId, userId } = this.localInfo
        const params = {
          showId,
          homeCourtId: userId,
          pageRows: this.pagination.pageSize,
          pageNum: this.pagination.current,
          ...this.searchData
        }
        this.tableLoading = true
        const result = await orgInvoiceList(params)
        const { code, data } = result
        this.tableLoading = false
        if (code === 1000) {
          this.data = data.list
          this.pagination.total = data.total
        }
      } catch (error) {
        this.tableLoading = false
        console.log(error)
      }
    },
    paginationChange(pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getInvoiceList()
    },
    onChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    handleInvoice() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请勾选信息！')
        return
      }
      this.orgInvoiceAction()
    },
    detailClick(record) {
      this.visible = true
      this.recordId = record.id
    },
    orgInvoiceAction() {
      this.invoiceLoading = true
      orgInvoiceAction(this.selectedRowKeys).then(res => {
        this.invoiceLoading = false
        const { message } = res
        this.$message.success(message)
        this.selectedRowKeys = []
        this.getInvoiceList()
      }).catch(err => {
        this.invoiceLoading = false
        console.log(err)
      })
    },
    formateInvoiceState(status) {
      if (status == null) return
      return this.invoiceState[status]
    }
  }
}
</script>