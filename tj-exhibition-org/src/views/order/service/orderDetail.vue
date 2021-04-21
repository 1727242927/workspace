<template>
  <div class="order-detail">
    <Title>订单详情</Title>
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
            <span v-if="!item.tag">{{item.value}}</span>
            <a-tag v-else color="blue" style="font-size: 14px">
              {{item.value}}
            </a-tag>
          </div>
        </div>
      </div>
    </div>
    <div class="table-wrapper">
      <div style="margin-bottom: 20px; text-align:right;padding-right:50px">
        <a-button type="primary" style="margin-right:20px" @click="()=>{$router.back()}">返回</a-button>
        <a-button type="primary" @click="handleSave" :loading="saveLoading">保存</a-button>
        <a-button type="primary" icon="download" style="margin:0 20px" @click="generatePayFeeNotice">
          生成缴费通知
        </a-button>
        <!-- <a-button type="primary" @click="payFeeClick" style="margin:0 20px">生成缴费通知</a-button> -->
        <a-button type="primary" @click="backoutFeeClick" :loading="backoutLoading">撤销缴费通知</a-button>
      </div>
      <a-table
        :columns="columns"
        :data-source="data"
        bordered
        :loading="tableLoading"
        :pagination="false"
      >
        <span slot="otsNameCn" slot-scope="text, record">
          {{record.expoOrderTypesSmall.otsNameCn}}
        </span>
        <span slot="listPriceRmb" slot-scope="text, record">
          {{$formatMoney(record.listPriceRmb? record.listPriceRmb : 0)}}
        </span>
        <span slot="orderPrice" slot-scope="text, record">
          {{$formatMoney(record.orderPrice? record.orderPrice : 0)}}
        </span>
        <span slot="listPriceRmbDeposit" slot-scope="text, record">
          {{$formatMoney(record.listPriceRmbDeposit? record.listPriceRmbDeposit : 0)}}
        </span>
        <span slot="orderDeposit" slot-scope="text, record">
          {{$formatMoney(record.orderDeposit? record.orderDeposit : 0)}}
        </span>
        <span slot="orderDiscount" slot-scope="orderDiscount">{{formatterOrderDiscount(orderDiscount)}}</span>
        <span slot="orderDiscountChange" slot-scope="orderDiscountChange, record, index">
          <a-input-number
            class="ediable-input"
            :disabled="orderItemInfo.orderStatus!=1"
            :min="0"
            :max="1000"
            :value="orderDiscountChange"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
            @change="value => handleChange(value, index, 'orderDiscountChange')"
          />
        </span>
        <template slot="footer">
          <div class="footer-price">总金额(元): <span style="color: #fa541c">{{$formatMoney(orderItemInfo.totalAmount? orderItemInfo.totalAmount : 0)}}</span>  (其中TBD展费{{$formatMoney(orderItemInfo.orderPrice? orderItemInfo.orderPrice : 0)}} , 押金{{$formatMoney(orderItemInfo.orderDeposit? orderItemInfo.orderDeposit : 0)}}) </div>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import Title from '@/components/Title'
import { orderDetail, expOrderSave, generatePayFeeNotice, backoutPayFeeNotice } from '@/api'
import { statusConfig } from '@/utils/config'

const columns = [
  { title: '服务名称', dataIndex: 'otsNameCn', key: 'otsNameCn', scopedSlots: { customRender: 'otsNameCn' } },
  { title: '实际数量', dataIndex: 'orderNums', key: 'orderNums' },
  { title: '使用量', dataIndex: 'orderNumsUsage', key: 'orderNumsUsage' },
  { title: '展费单价（元）', dataIndex: 'listPriceRmb', key: 'listPriceRmb', scopedSlots: { customRender: 'listPriceRmb' } },
  { title: '折扣', dataIndex: 'orderDiscount', key: 'orderDiscount', scopedSlots: { customRender: 'orderDiscount' } },
  { title: '折扣变更（%）', dataIndex: 'orderDiscountChange', key: 'orderDiscountChange', scopedSlots: { customRender: 'orderDiscountChange' } },
  { title: '付款金额（元）', dataIndex: 'orderPrice', key: 'orderPrice', scopedSlots: { customRender: 'orderPrice' } },
  { title: '押金单价（元）', dataIndex: 'listPriceRmbDeposit', key: 'listPriceRmbDeposit', scopedSlots: { customRender: 'listPriceRmbDeposit' } },
  { title: '押金付款金额（元）', dataIndex: 'orderDeposit', key: 'orderDeposit', scopedSlots: { customRender: 'orderDeposit' } },
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
      backoutLoading: false,
      saveLoading: false,
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
        { fields: '订单时间', label: 'orderDate', level: 0 }
        // { fields: '订单最后操作人', label: 'userName', level: 0 }
      ]
    }
  },
  created() {
    this.orderId = this.$route.query.orderId || ''
    this.getOrderDetailList()
  },
  methods: {
    async getOrderDetailList() {
      const params = { orderId: this.orderId }
      this.tableLoading = true
      try {
        const result = await orderDetail(params)
        this.tableLoading = false
        const { code, data } = result
        if (code === 1000) {
          this.orderItemInfo = data
          this.data = data.exhibitorOrderFinancialVoList.map(item => {
            item.key = item.id
            return item
          })
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
    },
    async generatePayFeeNotice() {
      try {
        const params = { orderId: this.orderId }
        const config = { responseType: 'blob' }
        const result = await generatePayFeeNotice(params, config)
        const downBlob = new Blob([result])
        const downFileName = '缴费通知书.docx'
        if ('download' in document.createElement('a')) {
          // 非IE下载
          const elink = document.createElement('a')
          elink.download = downFileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(downBlob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else {
          // IE10+下载
          navigator.msSaveBlob(downBlob, downFileName)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async handleSave() {
      this.saveLoading = true
      this.tableLoading = true
      const expoOrderListRequestList = this.data.map(item => {
        if (item.orderDiscountChange !== null && item.orderDiscountChange !== undefined) {
          item.orderDiscount = String(item.orderDiscountChange)
        }
        return item
      })
      const params = { expoOrderListRequestList }
      try {
        const result = await expOrderSave(params)
        this.tableLoading = false
        this.saveLoading = false
        const { code, message } = result
        if (code === 1000) {
          this.getOrderDetailList()
          this.$message.success(message)
        } else {
          this.$message.error(message)
        }
      } catch (error) {
        this.saveLoading = false
        this.tableLoading = false
        console.log(error)
      }
    },
    handleChange(value, index, columns) {
      const newData = [...this.data]
      newData[index][columns] = value
      this.data = newData
    },
    payFeeClick() {
      const query = this.$route.query
      this.$router.push({
        path: '/home/order/service/bill',
        query: {
          orderId: query.orderId || ''
        }
      })
    },
    backoutFeeClick() {
      this.requestFeeNotice(backoutPayFeeNotice)
    },
    async requestFeeNotice(requestFn) {
      this.backoutLoading = true
      const query = this.$route.query
      const orderId = query.orderId
      const params = { orderId }
      try {
        const result = await requestFn(params)
        this.backoutLoading = false
        const { message } = result
        this.$message.success(message)
      } catch (error) {
        console.log(error)
        this.backoutLoading = false
      }
    },
    formatterOrderDiscount(text) {
      if (text !== undefined) {
        if (text.includes('%')) {
          return text
        } else {
          return text + '%'
        }
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
