<template>
  <div class="order">
    <Title>订单列表</Title>
    <a-form layout="inline" :form="form">
      <a-form-item label="订单号">
        <a-input v-decorator="['orderId']" placeholder="请输入订单号" allowClear></a-input>
      </a-form-item>
      <a-form-item label="订单状态">
        <a-select v-decorator="['orderStatus']" placeholder="请选择订单状态" allowClear style="width:145px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option
            v-for="(status, key) in orderStatus"
            :value="key"
            :key="key"
          >
            {{status}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="付款状态">
        <a-select v-decorator="['payStatus']" placeholder="请选择付款状态" allowClear style="width:145px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option
            v-for="(status, key) in payStatus"
            :value="key"
            :key="key"
          >
            {{status}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="展商名称">
        <a-input v-decorator="['exhibitors002']" placeholder="请输入参展商名称" allowClear></a-input>
      </a-form-item>
      <a-form-item label="展位号">
        <a-input v-decorator="['exhibitors015']" placeholder="请输入展位号" allowClear></a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="search">查询</a-button>
      </a-form-item>
    </a-form>
<!--    <div style="width: 100%;text-align: right">-->
<!--      总金额:-->
<!--    </div>-->
    <div class="table-wrapper">
      <a-table
        bordered
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        :loading="tableLoading"
        @change="paginationChange"
        :scroll="{x: 1550, y: 500}"
      >
         <span style="font-weight: bolder" slot="orderId" slot-scope="record">
          {{record}}
        </span>
        <span slot="companyName" slot-scope="text">
          <a-tooltip placement="bottom">
            <template slot="title">
              <div>{{text.exhibitors002}}</div>
            </template>
            <div
              :style="{width: '158px',whiteSpace: 'nowrap',textOverflow: 'ellipsis',overflow: 'hidden'}"
            >
              {{text.exhibitors002}}
            </div>
          </a-tooltip>
        </span>
        <span slot="orderStatus" slot-scope="orderStatus">{{formateOrderStatus(orderStatus)}}</span>
        <span slot="payStatus" slot-scope="payStatus">{{formatePayStatus(payStatus)}}</span>
        <span slot="exhibitors014" slot-scope="text">{{text.exhibitors014}}</span>
        <span slot="exhibitors015" slot-scope="text">{{text.exhibitors015}}</span>
        <span slot="action" slot-scope="record" href="javascript:;">
          <a @click="handleDetail(record)">订单详情</a>
          <!-- <a-divider type="vertical" /> -->
        </span>
      </a-table>

    </div>
  </div>
</template>

<script>
import Title from '@/components/Title'
import { orderList, getAllAmount } from '@/api'
import { getLocalInfo } from '@/utils'
import TableMixIn from '@/mixins'
import { statusConfig } from '@/utils/config'

const columns = [
  { title: '订单号', dataIndex: 'orderId', scopedSlots: { customRender: 'orderId' } },
  { title: '订单状态', dataIndex: 'orderStatus', scopedSlots: { customRender: 'orderStatus' } },
  { title: '付款状态', dataIndex: 'payStatus', scopedSlots: { customRender: 'payStatus' } },
  { title: '参展商名称', dataIndex: 'expoExhibitors', width: 190, key: 'companyName', scopedSlots: { customRender: 'companyName' } },
  { title: '展馆号', dataIndex: 'expoExhibitors', key: 'exhibitors014', scopedSlots: { customRender: 'exhibitors014' } },
  { title: '展位号', dataIndex: 'expoExhibitors', key: 'exhibitors015', scopedSlots: { customRender: 'exhibitors015' } },
  { title: '订单时间', dataIndex: 'orderDate', width: 200 },
  { title: '数量', dataIndex: 'orderNums' },
  { title: '展费', dataIndex: 'orderPrice' },
  { title: '总金额', dataIndex: 'totalAmount' },
  { title: '录入员', dataIndex: 'userName' },
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
      allAmount: '',
      data: [],
      columns,
      orderStatus: statusConfig.orderStatus,
      payStatus: statusConfig.payStatus,
      form: this.$form.createForm(this, { name: 'orgOrderList' })
    }
  },
  created() {
    this.getOrderList()
    // this.getAllAmount()
  },
  methods: {
    getAllAmount() {
      const localInfo = getLocalInfo()
      let params = {
        showId: localInfo.showId,
        pageRows: this.pagination.pageSize,
        pageNum: this.pagination.current,
        ...this.searchData
      }
      getAllAmount(params).then(res => {
        console.log(res)
        this.allAmount = res.data
      })
    },
    search() {
      this.pagination.current = 1
      const value = this.form.getFieldsValue()
      this.searchData = value
      this.getOrderList()
    },
    async getOrderList() {
      this.tableLoading = true
      try {
        const localInfo = getLocalInfo()
        const params = {
          showId: localInfo.showId,
          homeCourtId: localInfo.userId,
          pageRows: this.pagination.pageSize,
          pageNum: this.pagination.current,
          ...this.searchData
        }
        const result = await orderList(params)
        this.tableLoading = false
        const code = result.code
        if (code === 1000) {
          this.data = result.data.list.map(list => {
            list.key = list.id
            return list
          })
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
        path: '/home/order/service/detail',
        query: {
          orderId: record.orderId
        }
      })
    },
    formatePayStatus(status) {
      if (status == null) return
      return this.payStatus[status]
    },
    formateOrderStatus(status) {
      if (status == null) return
      return this.orderStatus[status]
    }
  }
}
</script>

<style lang="less" scoped>

</style>
