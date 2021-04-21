<template>
  <div>
    <Title>证件订单列表</Title>
    <a-form-model layout="inline" :model="form">
      <a-form-model-item label="订单号">
        <a-input v-model.trim="form.orderNumber" placeholder="请输入订单号" />
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" @click="search">查询</a-button>
      </a-form-model-item>
    </a-form-model>
    <div class="table-wrapper">
      <a-table
        bordered
        rowKey="id"
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        :loading="tableLoading"
        @change="paginationChange"
        :scroll="{y: 550}"
      >
        <span style="font-weight: bolder" slot="orderNumber" slot-scope="record">
          {{record}}
        </span>
        <span slot="applicationStatus" slot-scope="text">
          <a-tag :color="text && text === '0' ? 'blue' : 'purple'" style="font-size: 14px">
            {{formateApplicationStatus(text)}}
          </a-tag>
        </span>
        <span slot="certificatesType" slot-scope="text">{{text === '0' ? '人证' : '车证'}}</span>
        <span slot="action" slot-scope="record" href="javascript:;">
          <a @click="handleDetail(record)">订单详情</a>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
import Title from '@/components/Title'
import TableMixIn from '@/mixins'
import { certificateOrderList } from '@/api'
import { statusConfig } from '@/utils/config'

const columns = [
  { title: '订单号', dataIndex: 'orderNumber', scopedSlots: { customRender: 'orderNumber' } },
  // { title: '收款人', dataIndex: 'payeeName' },
  { title: '总金额', dataIndex: 'totalAmount' },
  { title: '订单状态', dataIndex: 'applicationStatus', scopedSlots: { customRender: 'applicationStatus' } },
  { title: '证件类型', dataIndex: 'certificatesType', scopedSlots: { customRender: 'certificatesType' } },
  { title: '订单生成时间', dataIndex: 'orderGenerationDate' },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 100,
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  mixins: [TableMixIn],
  components: {
    Title
  },
  data() {
    return {
      columns,
      data: [],
      form: {
        orderNumber: ''
      }
    }
  },
  mounted() {
    this.getOrderList()
  },
  methods: {
    search() {
      this.pagination.current = 1
      this.getOrderList()
    },
    async getOrderList() {
      this.tableLoading = true
      try {
        const params = {
          pageRows: this.pagination.pageSize,
          pageNum: this.pagination.current,
          ...this.form
        }
        const result = await certificateOrderList(params)
        this.tableLoading = false
        const code = result.code
        if (code === 1000) {
          this.data = result.data.list
          this.pagination.total = result.data.total
        }
      } catch (error) {
        console.log(error)
      }
    },
    paginationChange(pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getOrderList()
    },
    handleDetail(record) {
      this.$router.push({
        path: '/home/order/certificate/detail',
        query: {
          id: record.id
        }
      })
    },
    formateApplicationStatus(text) {
      if (text) {
        return statusConfig.certificateApplicationStatus[text]
      }
    }
  }
}
</script>
