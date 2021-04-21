<template>
  <div class="exp-invoice">
    <Title>场馆开票申请</Title>
    <a-form layout="inline" :form="form">
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
import { expInvoiceList } from '@/api'
import { statusConfig } from '@/utils/config'

const columns = [
  { title: '时间', dataIndex: 'invoiceApplicationTime' },
  { title: '金额（元）', dataIndex: 'invoiceAmount' },
  // { title: '主场名称', dataIndex: 'homeCourtName' },
  // { title: '搭建商名称', dataIndex: 'standFittingContractorName' },
  { title: '发票类型', dataIndex: 'invoiceType', scopedSlots: { customRender: 'invoiceType' } },
  { title: '开票状态', dataIndex: 'invoiceState', scopedSlots: { customRender: 'invoiceState' } }
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
    getInvoiceList() {
      const params = {
        pageRows: this.pagination.pageSize,
        pageNum: this.pagination.current,
        source: 1,
        ...this.searchData
      }
      this.tableLoading = true
      expInvoiceList(params).then(res => {
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

<style lang="less" scoped>

</style>
