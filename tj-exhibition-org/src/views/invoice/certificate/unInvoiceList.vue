<template>
  <div>
    <Title>新增开票</Title>
    <a-form-model layout="inline" :model="form">
      <a-form-model-item label="订单号">
        <a-input v-model.trim="form.orderNumber" placeholder="请输入订单号" />
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" @click="search">查询</a-button>
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" @click="applyInvoice">申请开票</a-button>
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" @click="()=> {$router.back()}">返回</a-button>
      </a-form-model-item>
    </a-form-model>
    <div class="table-wrapper">
      <a-table
        bordered
        rowKey="orderNumber"
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        :loading="tableLoading"
        @change="paginationChange"
        :row-selection="{
          selectedRowKeys,
          onChange
        }"
        :scroll="{y: 550}"
      >
      </a-table>
    </div>
    <ApplyInvoiceForm
      :visible.sync="visible"
      :totalAmount="totalAmount"
      @cancel="handleCancel"
      :orderNumberList="selectedRowKeys"
      v-bind="$attrs"
      v-on="$listeners"
    />
  </div>
</template>

<script>
import Title from '@/components/Title'
import ApplyInvoiceForm from './applyInvoiceForm'
import TableMixIn from '@/mixins'
import { certificateUnInvoice } from '@/api'

const columns = [
  { title: '订单号', dataIndex: 'orderNumber' },
  { title: '金额', dataIndex: 'totalAmount' },
  { title: '展位号', dataIndex: 'expoExhibitors', key: 'exhibitors015', scopedSlots: { customRender: 'expoExhibitors' } },
  { title: '展商名', dataIndex: 'expoExhibitors', key: 'exhibitors002', scopedSlots: { customRender: 'expoExhibitors' } },
  { title: '主场名', dataIndex: 'expoExhibitors', key: 'itmaIdP', scopedSlots: { customRender: 'expoExhibitors' } }
]

export default {
  mixins: [TableMixIn],
  components: {
    Title,
    ApplyInvoiceForm
  },
  data() {
    return {
      columns,
      data: [],
      selectedRowKeys: [],
      form: {
        orderNumber: ''
      },
      visible: false,
      totalAmount: 0
    }
  },
  created() {
    this.getUnInoviceList()
  },
  methods: {
    search() {
      this.pagination.current = 1
      this.getUnInoviceList()
    },
    getUnInoviceList() {
      const params = {
        pageRows: this.pagination.pageSize,
        pageNum: this.pagination.current,
        ...this.form
      }
      this.tableLoading = true
      certificateUnInvoice(params).then(res => {
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
      this.getUnInoviceList()
    },
    onChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    applyInvoice() {
      let totalAmount = 0
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请勾选开票的订单')
        return
      }
      this.selectedRowKeys.forEach(item => {
        this.data.forEach(record => {
          if (record.orderNumber === item) {
            totalAmount += Number(record.totalAmount)
          }
        })
      })
      this.totalAmount = totalAmount
      this.visible = true
    },
    handleCancel() {
      this.selectedRowKeys = []
      this.$router.back()
    }
  }
}
</script>