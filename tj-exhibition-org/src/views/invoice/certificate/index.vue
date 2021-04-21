<template>
  <div>
    <Title>证件开票</Title>
    <a-form layout="inline" :form="form">
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
      <a-form-item label="发票类型">
        <a-select v-decorator="['invoiceType']" placeholder="请选择发票类型" allowClear style="width:145px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option
            v-for="(status, key) in invoiceType"
            :value="key"
            :key="key"
          >
            {{status}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="search">查询</a-button>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="add">新增</a-button>
      </a-form-item>
    </a-form>
    <div class="table-wrapper">
      <a-table
        bordered
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        :loading="tableLoading"
        @change="paginationChange"
        rowKey="id"
        :scroll="{y: 550}"
      >
        <span slot="invoiceType" slot-scope="invoiceType">{{formateInvoiceType(invoiceType)}}</span>
        <span slot="invoiceState" slot-scope="invoiceState">{{formateInvoiceState(invoiceState)}}</span>
      </a-table>
    </div>
  </div>
</template>

<script>
import Title from '@/components/Title'
import TableMixIn from '@/mixins'
import { certificateInvoiceList } from '@/api'
import { statusConfig } from '@/utils/config'

const columns = [
  { title: '订单号', dataIndex: 'invoiceAccountNumber' },
  { title: '收件人', dataIndex: 'invoiceShippingName' },
  { title: '金额（元）', dataIndex: 'invoiceAmount' },
  { title: '开票状态', dataIndex: 'invoiceState', scopedSlots: { customRender: 'invoiceState' } },
  { title: '发票类型', dataIndex: 'invoiceType', scopedSlots: { customRender: 'invoiceType' } },
  { title: '申请时间', dataIndex: 'invoiceApplicationTime' }
]

const invoiceType = {
  0: '专用发票',
  1: '普通发票'
}

const invoiceState = statusConfig.invoiceState

export default {
  mixins: [TableMixIn],
  components: {
    Title
  },
  data() {
    return {
      columns,
      data: [],
      invoiceState,
      invoiceType,
      orderVisible: false,
      form: this.$form.createForm(this)
    }
  },
  created() {
    this.getInvoiceList()
  },
  methods: {
    search() {
      this.pagination.current = 1
      const value = this.form.getFieldsValue()
      this.searchData = value
      this.getInvoiceList()
    },
    add() {
      this.$router.push({
        path: '/home/invoice/certificate/list'
      })
    },
    getInvoiceList() {
      const params = {
        pageRows: this.pagination.pageSize,
        pageNum: this.pagination.current,
        ...this.searchData
      }
      this.tableLoading = true
      certificateInvoiceList(params).then(res => {
        const { data } = res
        this.tableLoading = false
        this.data = data.list
        this.pagination.total = data.total
      }).catch(err => {
        console.log(err)
        this.tableLoading = false
      })
    },
    paginationChange(pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getInvoiceList()
    },
    formateInvoiceType(state) {
      if (state == null) return
      return this.invoiceType[state]
    },
    formateInvoiceState(state) {
      if (state == null) return
      return this.invoiceState[state]
    }
  }
}
</script>
