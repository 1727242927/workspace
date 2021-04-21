<template>
  <div class="org-exp">
    <Title>搭建商列表</Title>
    <a-form layout="inline" :form="form">
      <a-form-item label="搭建商ID">
        <a-input class="exp-input" v-decorator="['builderNum']" placeholder="请输入搭建商ID" allowClear></a-input>
      </a-form-item>
      <a-form-item label="搭建商名称">
        <a-input class="exp-input" v-decorator="['builderName']" placeholder="请输入搭建商名称" allowClear></a-input>
      </a-form-item>
      <a-form-item label="结算状态">
        <a-select class="exp-input" v-decorator="['settleStatus']" placeholder="请输入结算状态" allowClear>
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="0">未结算</a-select-option>
          <a-select-option value="1">已结算</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="handleSearch">查询</a-button>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" :loading="btnLoading" @click="batchSettleClick">批量结算</a-button>
      </a-form-item>
    </a-form>
    <div class="table-wrapper">
      <a-table
        bordered
        rowKey="builderId"
        :columns="columns"
        :data-source="data"
        :loading="tableLoading"
        :pagination="pagination"
        @change="paginationChange"
        :row-selection="{
          selectedRowKeys,
          onChange: onSelectChange
        }"
        :scroll="{y: 550}"
      >
        <span slot="settleStatus" slot-scope="settleStatus">{{formateSettleStatus(settleStatus)}}</span>
        <!-- <span slot="action" slot-scope="text, record">
          <a @click="settleClick(record)">详情</a>
        </span> -->
      </a-table>
    </div>
    <Settle
      :settleVisible.sync="settleVisible"
      :builderId="builderId"
      @refresh="getExpList"
    />
  </div>
</template>

<script>
import Title from '@/components/Title'
import Settle from './settle'
import TableMixIn from '@/mixins'
import { orgExp, batchSettleBill } from '@/api'
import { getLocalInfo } from '@/utils'

const columns = [
  { title: '搭建商ID', dataIndex: 'builderNum' },
  { title: '搭建商名称', dataIndex: 'builderName' },
  // { title: '展位号', dataIndex: 'zwNum' },
  { title: '结算状态', dataIndex: 'settleStatus', scopedSlots: { customRender: 'settleStatus' } }
  // { title: '操作', dataIndex: 'action', align: 'center', scopedSlots: { customRender: 'action' } }
]

export default {
  mixins: [TableMixIn],
  components: {
    Title,
    Settle
  },
  data() {
    return {
      columns,
      data: [],
      settleVisible: false,
      builderId: -1,
      selectedRowKeys: [],
      btnLoading: false,
      form: this.$form.createForm(this, { name: 'exhibitorsList' })
    }
  },
  created() {
    this.getExpList()
  },
  methods: {
    async getExpList() {
      this.tableLoading = true
      const localInfo = getLocalInfo()
      const params = {
        showId: localInfo.showId,
        userId: localInfo.userId,
        pageRows: this.pagination.pageSize,
        pageNum: this.pagination.current,
        ...this.searchData
      }
      try {
        const result = await orgExp(params)
        this.tableLoading = false
        const { data } = result
        this.data = data.list
        this.pagination.total = data.total
      } catch (error) {
        this.tableLoading = false
        console.log(error)
      }
    },
    handleSearch() {
      this.pagination.current = 1
      const value = this.form.getFieldsValue()
      this.searchData = value
      this.getExpList()
    },
    paginationChange(pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getExpList()
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    batchSettleClick() {
      if (!this.selectedRowKeys.length) {
        return this.$message.warning('请勾选列表！')
      }
      this.tableLoading = true
      this.btnLoading = true
      batchSettleBill(this.selectedRowKeys).then(res => {
        this.tableLoading = false
        this.btnLoading = false
        this.$message.success(res.message)
        this.getExpList()
      }).catch(err => {
        console.log(err)
        this.tableLoading = false
        this.btnLoading = false
      })
    },
    settleClick(record) {
      this.settleVisible = true
      this.builderId = record.builderId
    },
    formateSettleStatus(status) {
      if (status == null) return
      const config = {
        0: '未结算',
        1: '已结算'
      }
      return config[status]
    }
  }
}
</script>

<style lang="less" scoped>
.org-exp {
  .exp-input {
    width: 160px;
  }
}
</style>