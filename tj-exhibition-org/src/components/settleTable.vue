<template>
  <a-spin :spinning="spinning">
    <table class="settle-table" border="1" cellspacing="0">
      <tr>
        <th width='100px'>序号</th>
        <th>服务项目名称</th>
        <th>数量</th>
        <th>单价</th>
        <th>小计</th>
      </tr>
      <template v-if="data.settleSeviceItemVos">
        <tr v-for="(item, index) in data.settleSeviceItemVos" :key="item.serviceItemId">
          <td>{{index + 1}}</td>
          <td>{{item.serviceItemName}}</td>
          <td>{{item.serviceItemNum}}</td>
          <td>{{item.serviceItemPrice}}</td>
          <td>{{item.serviceItemTotal}}</td>
        </tr>
      </template>
      <tr>
        <td colspan="4">合计</td>
        <td>{{data.totalPrice}}</td>
      </tr>
      <tr>
        <td colspan="2">应付金额（人民币）</td>
        <td>{{data.yingfuPrice}}</td>
        <td>大写（人民币）</td>
        <td>
          <span v-if="data.yingfuPrice">{{price2UpperCase(data.yingfuPrice)}}</span>
        </td>
      </tr>
      <tr>
        <td colspan="2">已付金额</td>
        <td>{{data.yifuPrice}}</td>
        <td>大写（人民币）</td>
        <td>
          <span v-if="data.yifuPrice">{{price2UpperCase(data.yifuPrice)}}</span>
        </td>
      </tr>
      <tr>
        <td colspan="2">余额</td>
        <td>{{data.yuPrice}}</td>
        <td></td>
        <td></td>
      </tr>
    </table>
  </a-spin>
</template>

<script>
import { price2UpperCase } from '@/utils'

export default {
  props: {
    spinning: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    price2UpperCase
  }
}
</script>

<style lang="less" scoped>
.settle-table {
  width:100%;
  border-top: 1px solid #e8e8e8;
  border-left: 1px solid #e8e8e8;
  border-collapse: collapse;
  td, th {
    border-bottom: 1px solid #e8e8e8;
    border-right: 1px solid #e8e8e8;
    padding:16px;
  }
}
</style>