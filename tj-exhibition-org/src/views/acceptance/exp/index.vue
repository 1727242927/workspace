<template>
  <div class="repair">
    <Title>搭建商验收列表</Title>
    <a-form layout="inline" :form="form">
      <a-form-item label="展厅号">
        <a-input v-decorator="['ztNum']" placeholder="请输入展厅号" allowClear></a-input>
      </a-form-item>
      <a-form-item label="搭建商名称">
        <a-input v-decorator="['builderName']" placeholder="请输入搭建商名称" allowClear></a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="search">查询</a-button>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="acceptanceApply">申请场馆验收</a-button>
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
        :scroll="{y: 550}"
      >
        <span slot="guaranteeDate" slot-scope="guaranteeDate, record">
          {{record.yanshouNum}} / {{record.tijiaoNum}} / {{record.totalNum}}
        </span>
        <span slot="action" slot-scope="action, record">
          <a @click="detailClick(record)">详情</a>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
import Title from '@/components/Title'
import TableMixIn from '@/mixins'
import { orgAcceptanceList, orgAcceptanceApply } from '@/api'
import { getLocalInfo } from '@/utils'

const columns = [
  { title: '序号', align: 'center', customRender: (text, record, index) => `${index + 1}` },
  { title: '展厅号', dataIndex: 'ztNum' },
  { title: '搭建商名称', dataIndex: 'builderName' },
  { title: '申请进度（已验收数量/提交数量/总数量）', dataIndex: 'guaranteeDate', scopedSlots: { customRender: 'guaranteeDate' } },
  { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, align: 'center' }
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
        const localInfo = getLocalInfo()
        const params = {
          showId: localInfo.showId,
          homeCourtId: localInfo.userId,
          pageRows: this.pagination.pageSize,
          pageNum: this.pagination.current,
          ...this.searchData
        }
        this.tableLoading = true
        const result = await orgAcceptanceList(params)
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
    acceptanceApply() {
      orgAcceptanceApply().then(res => {
        const { message } = res
        this.$message.success(message)
      })
    },
    detailClick(record) {
      const { builderId, ztNum, homeCourtId } = record
      this.$router.push({
        path: '/home/acceptance/exp/detail',
        query: {
          builderId,
          ztNum,
          homeCourtId
        }
      })
    }
  }
}
</script>