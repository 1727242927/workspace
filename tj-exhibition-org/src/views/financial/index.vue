<template>
  <div class="financial">
    <Title>财务收款列表</Title>
    <a-form layout="inline" :form="form">
      <a-form-item label="订单号">
        <a-input v-decorator="['financial902']" placeholder="请输入订单号" allowClear style="width:145px"></a-input>
      </a-form-item>
      <a-form-item label="付款状态">
        <a-select v-decorator="['financial000']" placeholder="请选择付款状态" allowClear style="width:145px">
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
        <a-input v-decorator="['financial004']" placeholder="请输入展商名称" allowClear style="width:145px"></a-input>
      </a-form-item>
      <a-form-item label="展位号">
        <a-input v-decorator="['financial901']" placeholder="请输入展位号" allowClear style="width:145px"></a-input>
      </a-form-item>
      <a-form-item label="搭建商">
        <a-input v-decorator="['financial003']" placeholder="请输入搭建商" allowClear style="width:145px"></a-input>
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
        <div slot="financial004" slot-scope="text">
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>{{text}}</span>
            </template>
            <div :style="{width: '112px',whiteSpace: 'nowrap',textOverflow: 'ellipsis',overflow: 'hidden'}">{{text}}</div>
          </a-tooltip>
        </div>
        <div slot="financial003" slot-scope="text">
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>{{text}}</span>
            </template>
            <div :style="{width: '112px',whiteSpace: 'nowrap',textOverflow: 'ellipsis',overflow: 'hidden'}">{{text}}</div>
          </a-tooltip>
        </div>
        <span slot="payStatus" slot-scope="payStatus">{{formatePayStatus(payStatus)}}</span>
        <span slot="action" slot-scope="record">
          <a @click="handleDetail(record)">详情</a>
          <a-divider type="vertical"  v-if="record.financial000!=1"/>
          <a @click="confirmClick(record)" v-if="record.financial000!=1">认款</a>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
import Title from '@/components/Title'
import { financialList } from '@/api'
import { getLocalInfo } from '@/utils'
import TableMixIn from '@/mixins'
import { statusConfig } from '@/utils/config'

const columns = [
  { title: '订单号', dataIndex: 'financial902' },
  { title: '展位号', dataIndex: 'financial901' },
  { title: '展商名称', dataIndex: 'financial004', width: 150, scopedSlots: { customRender: 'financial004' } },
  { title: '应付总金额', dataIndex: 'financial001' },
  { title: '已付总金额', dataIndex: 'financial002' },
  // { title: '付款方式', dataIndex: 'payMethod' },
  // { title: '最后认款时间', dataIndex: 'financial900', width: 170 },
  { title: '付款状态', dataIndex: 'financial000', width: 120, scopedSlots: { customRender: 'payStatus' } },
  { title: '搭建商', dataIndex: 'financial003', width: 150, scopedSlots: { customRender: 'financial003' } },
  {
    title: '操作',
    key: 'operation',
    scopedSlots: { customRender: 'action' },
    align: 'center',
    width: 130
  }
]

export default {
  mixins: [TableMixIn],
  components: {
    Title
  },
  data() {
    return {
      data: [],
      columns,
      payStatus: statusConfig.payStatus,
      form: this.$form.createForm(this)
    }
  },
  created() {
    this.getFinancialList()
  },
  methods: {
    search() {
      this.pagination.current = 1
      const value = this.form.getFieldsValue()
      this.searchData = value
      this.getFinancialList()
    },
    async getFinancialList() {
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
        const result = await financialList(params)
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
      this.getFinancialList()
    },
    confirmClick(record) {
      this.$router.push({
        path: '/home/financial/confirm',
        query: {
          orderId: record.financial902,
          builderName: record.financial003
        }
      })
    },
    handleDetail(record) {
      localStorage.setItem('currentOrder', JSON.stringify(record))
      this.$router.push({
        path: '/home/financial/detail',
        query: {
          orderId: record.financial902
        }
      })
    },
    formatePayStatus(status) {
      if (status == null) return
      return this.payStatus[status]
    }
  }
}
</script>
