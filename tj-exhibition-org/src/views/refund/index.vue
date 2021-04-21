<template>
  <div class="repair">
    <Title>退款申请列表</Title>
    <a-form layout="inline" :form="form">
      <a-form-item label="搭建商名称">
        <a-input v-decorator="['standFittingContractorName']" placeholder="请输入搭建商名称" allowClear></a-input>
      </a-form-item>
      <a-form-item label="退款状态">
        <a-select v-decorator="['refundStatus']" placeholder="请选择退款状态" allowClear style="width:145px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option
            v-for="(status, key) in refundState"
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
        <span slot="refundStatus" slot-scope="status">{{formateRefundState(status)}}</span>
        <span slot="action" slot-scope="action, record">
          <a v-if="record.refundStatus === '0'" @click="refundClick(record)">退款</a>
          <a-button v-else type="link" disabled style="padding: 0">已退款</a-button>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
import Title from '@/components/Title'
import TableMixIn from '@/mixins'
import { orgRefundList, orgRefundAction } from '@/api'
import { getLocalInfo } from '@/utils'
import { statusConfig } from '@/utils/config'

const refundState = statusConfig.refundState

const columns = [
  { title: '结算单号', dataIndex: 'settlementNumber', align: 'center' },
  { title: '搭建商名称', dataIndex: 'standFittingContractorName' },
  { title: '退款金额', dataIndex: 'refundAmount' },
  { title: '退款状态', dataIndex: 'refundStatus', scopedSlots: { customRender: 'refundStatus' } },
  { title: '操作', key: 'action', align: 'center', scopedSlots: { customRender: 'action' } }
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
      refundState,
      form: this.$form.createForm(this)
    }
  },
  created() {
    this.localInfo = getLocalInfo()
    this.getRefundList()
  },
  methods: {
    search() {
      this.pagination.current = 1
      const value = this.form.getFieldsValue()
      this.searchData = value
      this.getRefundList()
    },
    async getRefundList() {
      try {
        const { showId, userId } = this.localInfo
        const params = {
          showId,
          homeCourtId: userId,
          pageRows: this.pagination.pageSize,
          pageNum: this.pagination.current,
          ...this.searchData
        }
        this.tableLoading = true
        const result = await orgRefundList(params)
        const { code, data } = result
        this.tableLoading = false
        if (code === 1000) {
          this.data = data.list
          this.pagination.total = data.total
        }
      } catch (error) {
        this.tableLoading = false
        console.log(error)
      }
    },
    paginationChange(pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getRefundList()
    },
    refundClick(record) {
      this.$confirm({
        title: '确定进行退款操作吗？',
        content: '点击确定进行退款',
        onOk: () => {
          this.orgRefundAction(record)
        }
      })
    },
    orgRefundAction(record) {
      orgRefundAction({ id: record.id }).then(res => {
        const { message } = res
        this.$message.success(message)
        this.getRefundList()
      }).catch(err => {
        console.log(err)
      })
    },
    formateRefundState(status) {
      if (status == null) return
      return this.refundState[status]
    }
  }
}
</script>