<template>
  <div class="financical-confirm">
    <Title>财务认款</Title>
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
          <div class="value">{{item.value}}</div>
        </div>
<!--        <a-button type="primary" @click="add">添加</a-button>-->
        <a-button type="primary" @click="showSubscription = true">认款</a-button>
        <a-button type="primary" :style="{marginLeft: '18px'}" @click="()=>{$router.back()}">返回</a-button>
      </div>
    </div>
    <div class="table-wrapper">
      <a-table
        bordered
        :columns="columns"
        :data-source="data"
        :loading="tableLoading"
        :pagination="pagination"
        @change="paginationChange"
        rowKey="id"
        :scroll="{y: 550}"
      >
        <template slot="state05" slot-scope="text,record">
          {{$formatMoney(record.state05)}}
        </template>
        <template slot="paytype" slot-scope="text,record">
          {{record.paytype == 1 ? '展费' : '押金'}}
        </template>
        <template slot="state00" slot-scope="text,record">
          {{record.state00 == 0 ? '未取消' : '已取消'}}
        </template>
        <span slot="action" slot-scope="action, record">
          <a :disabled="record.state00 ==1" @click="cancel(record)">取消认款</a>
        </span>
      </a-table>
    </div>
    <ConfirmModal
      :visible.sync="visible"
      @refreshList="financialConfirmList"
      @refreshBase="financialConfirmBase"
    />
    <a-modal
      title="收款流水"
      :width="1000"
      :maskClosable="false"
      :visible="showSubscription"
      @cancel="handleCancel"
    >
      <template slot="footer">
        <a-button @click="handleCancel">关闭</a-button>
      </template>
     <SubscriptionList :builderName="builderName"/>
    </a-modal>
  </div>
</template>

<script>
import Title from '@/components/Title'
import ConfirmModal from './confirmModal'
import { financialConfirmBase, financialConfirmList, payClaimCacelAPI } from '@/api'
import tableMixin from '@/mixins'
import SubscriptionList from '@/views/financial/SubscriptionList'

const columns = [
  { title: '认款日期', dataIndex: 'date', scopedSlots: { customRender: 'date' } },
  { title: '认款金额', dataIndex: 'state05', scopedSlots: { customRender: 'state05' } },
  { title: '认款类型', dataIndex: 'paytype', scopedSlots: { customRender: 'paytype' } },
  { title: '认款交易流水号', dataIndex: 'state04' },
  { title: '是否取消', dataIndex: 'state00', scopedSlots: { customRender: 'state00' } },
  { title: '操作', key: 'operate', scopedSlots: { customRender: 'action' }, align: 'center' }
]

export default {
  name: 'financialConfirm',
  mixins: [tableMixin],
  components: {
    Title,
    ConfirmModal,
    SubscriptionList
  },
  created() {
    this.orderId = this.$route.query.orderId
    this.financialConfirmBase()
    this.financialConfirmList()
  },
  data() {
    return {
      columns,
      data: [],
      visible: false,
      baseInfo: [
        { fields: '展位号', label: 'financial901' },
        { fields: '展商名称', label: 'financial004' },
        { fields: '搭建商名称', label: 'financial003' }
      ],
      orderInfo: [
        { fields: '订单号', label: 'financial902' },
        { fields: '应付金额', label: 'financial001' },
        { fields: '已付金额', label: 'financial002' }
      ],
      // 搭建商名称
      builderName: this.$route.query.builderName,
      // 控制认款弹窗隐藏显示
      showSubscription: false
    }
  },
  methods: {
    /**
    * @description: 取消认款
    * @author: 潘慧敏
    * @time: 2021-03-25 18:14:33
    */
    cancel(record) {
      this.$confirm({
        title: '提醒',
        content: '确认是否取消认款',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          payClaimCacelAPI({
            transactionRecordSerialNumber: record.state04
          }).then(res => {
            if (res.code == 1000) {
              this.$message.success('操作成功')
              this.financialConfirmList()
            } else {
              this.$message.warning(res.message)
            }
          })
        }
      })
    },
    /**
    * @description: 关闭
    * @author: 潘慧敏
    * @time: 2021-03-25 10:02:40
    */
    handleCancel() {
      this.financialConfirmBase()
      this.financialConfirmList()
      this.showSubscription = false
    },
    add() {
      this.visible = true
    },
    financialConfirmList() {
      const params = {
        pageRows: this.pagination.pageSize,
        pageNum: this.pagination.current,
        orderId: this.orderId
      }
      this.tableLoading = true
      financialConfirmList(params).then(res => {
        this.tableLoading = false
        const { data } = res
        this.data = data.list
        this.pagination.total = data.total
      }).catch(err => {
        this.tableLoading = false
        console.log(err)
      })
    },
    paginationChange(pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.financialConfirmList()
    },
    financialConfirmBase() {
      financialConfirmBase({ orderId: this.orderId }).then(res => {
        const { code, data } = res
        if (code === 1000) {
          this.baseInfo = this.mapList(this.baseInfo, data)
          this.orderInfo = this.mapList(this.orderInfo, data)
        }
      })
    },
    mapList(list, data) {
      return list.map(item => {
        item.value = data[item.label]
        return item
      })
    }
  }
}
</script>

<style lang="less" scoped>
.financical-confirm {
  width: 100%;
}
</style>
