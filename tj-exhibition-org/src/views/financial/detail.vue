<template>
  <div class="order-detail">
    <Title>财务收款详情</Title>
    <div style="padding: 0 8px">
      <div class="base-info-wrap">
        <div class="info-item" v-for="(item, index) in baseInfo" :key="index">
          <div class="fields">{{item.fields}}：</div>
          <div class="value">{{item.value}}</div>
        </div>
      </div>
      <div class="base-info-wrap">
        <div class="info-item" v-for="(item, index) in orderInfo" :key="index">
          <div class="fields">{{item.fields}}：</div>
          <div class="value">
            <span v-if="!item.tag">
              {{item.value}}
            </span>
            <a-tag v-else color="blue" style="font-size: 14px">
              {{item.value}}
            </a-tag>
          </div>
        </div>
        <a-button type="primary" @click="()=>{$router.back()}">返回</a-button>
      </div>
    </div>
    <div class="table-wrapper">
      <a-table
        bordered
        :columns="columns"
        :data-source="data"
        :loading="tableLoading"
        :pagination="false"
        rowKey="id"
      >
        <span slot="otsNameCn" slot-scope="text, record">
          {{record.expoOrderTypesSmall.otsNameCn}}
        </span>
        <template slot="footer">
          <div class="footer-price">
            总金额（元）：<span style="color: #fa541c">{{orderItemInfo.totalAmount}}</span>
            （其中TBD展费{{orderItemInfo.orderPrice}}，押金{{orderItemInfo.orderDeposit}}）
          </div>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import Title from '@/components/Title'
import { orderDetail } from '@/api'
import { statusConfig } from '@/utils/config'

const columns = [
  { title: '服务名称', dataIndex: 'otsNameCn', key: 'otsNameCn', scopedSlots: { customRender: 'otsNameCn' } },
  { title: '实际数量', dataIndex: 'orderNums', key: 'orderNums' },
  { title: '展费单价（元）', dataIndex: 'listPriceRmb', key: 'listPriceRmb' },
  { title: '折扣', dataIndex: 'orderDiscount', key: 'orderDiscount' },
  { title: '付款金额（元）', dataIndex: 'orderPrice', key: 'orderPrice' },
  { title: '押金单价（元）', dataIndex: 'listPriceRmbDeposit', key: 'listPriceRmbDeposit' },
  { title: '押金付款金额（元）', dataIndex: 'orderDeposit', key: 'orderDeposit' },
  { title: '备注', dataIndex: 'orderRemarks', align: 'center', key: 'orderRemarks' }
]
export default {
  components: {
    Title
  },
  data() {
    return {
      columns,
      data: [],
      tableLoading: false,
      orderItemInfo: {},
      baseInfo: [
        { fields: '展位号', label: 'exhibitors015', level: 1 },
        { fields: '展馆号', label: 'hallNumber', level: 0 },
        { fields: '展商名称', label: 'exhibitors002', level: 1 },
        { fields: '搭建商名称', label: 'exhibitors017', level: 1 }
      ],
      orderInfo: [
        { fields: '订单号', label: 'orderId', level: 0 },
        { fields: '订单状态', label: 'orderStatus', level: 0, tag: true },
        { fields: '付款状态', label: 'payStatus', level: 0, tag: true },
        { fields: '订单时间', label: 'orderDate', level: 0 },
        { fields: '订单最后操作人', label: 'userName', level: 0 }
      ]
    }
  },
  created() {
    this.getOrderDetailList()
  },
  methods: {
    async getOrderDetailList() {
      const orderId = this.$route.query.orderId
      const params = { orderId }
      this.tableLoading = true
      try {
        const result = await orderDetail(params)
        this.tableLoading = false
        const { code, data } = result
        if (code === 1000) {
          this.orderItemInfo = data
          this.data = data.exhibitorOrderFinancialVoList
          this.baseInfo.map(item => {
            item.value = item.level === 0 ? data[item.label] : data.expoExhibitors[item.label]
            return item
          })
          this.orderInfo.map(item => {
            const label = item.label
            if (label === 'orderStatus' || label === 'payStatus') {
              item.value = statusConfig[label][data[label]]
            } else {
              item.value = data[label]
            }
            return item
          })
        }
      } catch (error) {
        this.tableLoading = false
        console.log(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.footer-price {
  text-align: right;
  font-weight: 600;
}
</style>
