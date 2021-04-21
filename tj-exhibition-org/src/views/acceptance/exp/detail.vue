<template>
  <div class="order">
    <Title>搭建商验收详情</Title>
    <a-form layout="inline" :form="form">
      <a-form-item label="展商名称">
        <a-input v-decorator="['exhibitors002']" placeholder="请输入展商名称" allowClear></a-input>
      </a-form-item>
      <a-form-item label="展位号">
        <a-input v-decorator="['exhibitors015']" placeholder="请输入展位号" allowClear></a-input>
      </a-form-item>
      <a-form-item label="验收状态">
        <a-select v-decorator="['acceptanceState']" placeholder="请选择验收状态" allowClear style="width:145px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option
            v-for="(status, key) in acceptanceStatus"
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
      <a-form-item>
        <a-button type="primary" @click="()=> {$router.back()}">返回</a-button>
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
        <span slot="acceptanceState" slot-scope="status">{{formateAcceptanceStatus(status)}}</span>
        <span slot="action" slot-scope="action, record">
          <a v-if="record.acceptanceState === '0'" @click="handleAction(record, 1)">派工</a>
          <a-button v-else disabled type="link" style="padding: 0">已派工</a-button>
          <a-divider type="vertical" />
          <a v-if="record.acceptanceState !== '2'" @click="handleAction(record, 2)">验收</a>
          <a-button v-else disabled type="link" style="padding: 0">已验收</a-button>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
import Title from '@/components/Title'
import TableMixIn from '@/mixins'
import { acceptanceList, orgAcceptanceAction } from '@/api'
import { getLocalInfo } from '@/utils'
import { statusConfig } from '@/utils/config'

const acceptanceStatus = statusConfig.acceptanceStatus

const columns = [
  { title: '序号', customRender: (text, record, index) => `${index + 1}` },
  { title: '展位号', dataIndex: 'boothNo' },
  { title: '展商名称', dataIndex: 'exhibitorsName' },
  { title: '申请验收时间', dataIndex: 'startTimeAcceptance' },
  { title: '验收状态', dataIndex: 'acceptanceState', scopedSlots: { customRender: 'acceptanceState' } },
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
      acceptanceStatus,
      form: this.$form.createForm(this)
    }
  },
  created() {
    this.getAcceptanceList()
  },
  methods: {
    search() {
      this.pagination.current = 1
      const value = this.form.getFieldsValue()
      this.searchData = value
      this.getAcceptanceList()
    },
    async getAcceptanceList() {
      try {
        const { showId } = getLocalInfo()
        const { builderId, ztNum, homeCourtId } = this.$route.query
        const params = {
          showId,
          standFittingContractorId: builderId,
          exhibitionHallNo1: ztNum,
          homeCourtId,
          pageRows: this.pagination.pageSize,
          pageNum: this.pagination.current,
          ...this.searchData
        }
        this.tableLoading = true
        const result = await acceptanceList(params)
        this.tableLoading = false
        const code = result.code
        if (code === 1000) {
          this.data = result.data.list
          this.pagination.total = result.data.total
        }
      } catch (error) {
        this.tableLoading = false
        console.log(error)
      }
    },
    paginationChange(pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getAcceptanceList()
    },
    handleAction(record, status) {
      const params = {
        id: record.id,
        status
      }
      orgAcceptanceAction(params).then(res => {
        const { message } = res
        this.$message.success(message)
        this.getAcceptanceList()
      }).catch(err => {
        console.log(err)
      })
    },
    formateAcceptanceStatus(status) {
      if (status == null) return
      return this.acceptanceStatus[status]
    }
  }
}
</script>
