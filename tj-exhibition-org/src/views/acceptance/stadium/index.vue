<template>
  <div class="repair">
    <Title>场馆验收列表</Title>
    <div class="table-wrapper">
      <a-table
        bordered
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        :loading="tableLoading"
        @change="paginationChange"
        :scroll="{y: 550}"
      >
        <span slot="acceptanceState" slot-scope="acceptanceState">{{formateAcceptanceState(acceptanceState)}}</span>
      </a-table>
    </div>
  </div>
</template>

<script>
import Title from '@/components/Title'
import TableMixIn from '@/mixins'
import { orgAcceptanceStadium } from '@/api'
import { statusConfig } from '@/utils/config'

const acceptanceStatus = statusConfig.acceptanceStatus

const columns = [
  { title: '序号', align: 'center', customRender: (text, record, index) => `${index + 1}` },
  { title: '展厅号', dataIndex: 'exhibitionHallNo' },
  { title: '申请时间', dataIndex: 'startTimeAcceptance' },
  { title: '申请状态', dataIndex: 'acceptanceState', scopedSlots: { customRender: 'acceptanceState' } }
  // { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'center' }
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
      acceptanceStatus
    }
  },
  created() {
    this.getAcceptanceList()
  },
  methods: {
    async getAcceptanceList() {
      try {
        const params = {
          pageRows: this.pagination.pageSize,
          pageNum: this.pagination.current
        }
        this.tableLoading = true
        const result = await orgAcceptanceStadium(params)
        const { code, data } = result
        this.tableLoading = false
        if (code === 1000) {
          this.data = data.list.map((item, index) => {
            item.key = index
            return item
          })
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
      this.getAcceptanceList()
    },
    formateAcceptanceState(record) {
      if (record === null) {
        return ''
      }
      return this.acceptanceStatus[record]
    }
  }
}
</script>