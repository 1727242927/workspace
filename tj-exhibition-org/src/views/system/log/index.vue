<template>
  <div class="exp-log">
    <Title>系统日志</Title>
    <a-form layout="inline" :form="form">
      <a-form-item label="用户名">
        <a-input v-decorator="['userName']" placeholder="请输入用户名" />
      </a-form-item>
      <a-form-item label="操作时间">
        <a-range-picker v-decorator="['createTime']" />
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
        <div slot="method" slot-scope="text">
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>{{text}}</span>
            </template>
            <div :style="{width: '88px',whiteSpace: 'nowrap',textOverflow: 'ellipsis',overflow: 'hidden'}">{{text}}</div>
          </a-tooltip>
        </div>
        <div slot="params" slot-scope="text">
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>{{text}}</span>
            </template>
            <div :style="{width: '88px',whiteSpace: 'nowrap',textOverflow: 'ellipsis',overflow: 'hidden'}">{{text}}</div>
          </a-tooltip>
        </div>
        <div slot="operationModule" slot-scope="text">
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>{{text}}</span>
            </template>
            <div :style="{width: '88px',whiteSpace: 'nowrap',textOverflow: 'ellipsis',overflow: 'hidden'}">{{text}}</div>
          </a-tooltip>
        </div>
        <span slot="visitState" slot-scope="text">
          <a-tag :color="text === 0 ? 'cyan': 'red'">
            {{text === 0 ? '成功' : '失败'}}
          </a-tag>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
import Title from '@/components/Title'
import TableMixIn from '@/mixins'
import { systemLogList } from '@/api'

const columns = [
  // { title: 'ID', dataIndex: 'id', align: 'center' },
  { title: '用户名', dataIndex: 'userName', align: 'center' },
  { title: '操作描述', dataIndex: 'operation', align: 'center' },
  { title: '请求方法', dataIndex: 'method', width: 120, scopedSlots: { customRender: 'method' }, align: 'center' },
  { title: '请求参数', dataIndex: 'params', width: 120, scopedSlots: { customRender: 'params' }, align: 'center' },
  { title: '执行时长（ms）', dataIndex: 'time', align: 'center' },
  { title: 'IP地址', dataIndex: 'ip', align: 'center' },
  { title: '操作时间', dataIndex: 'createTime', align: 'center' },
  { title: '操作模块', dataIndex: 'operationModule', width: 120, scopedSlots: { customRender: 'operationModule' }, align: 'center' },
  { title: '执行结果', dataIndex: 'visitState', scopedSlots: { customRender: 'visitState' }, align: 'center' }
]

export default {
  mixins: [TableMixIn],
  components: {
    Title
  },
  data() {
    return {
      columns,
      data: [],
      form: this.$form.createForm(this)
    }
  },
  mounted() {
    this.getLogList()
  },
  methods: {
    search() {
      this.pagination.current = 1
      const value = this.form.getFieldsValue()
      if (value.createTime && value.createTime.length > 0) {
        value.createTimeStart = value.createTime[0].format('YYYY-MM-DD 00:00:00')
        value.createTimeEnd = value.createTime[1].format('YYYY-MM-DD 23:59:59')
      }
      delete value.createTime
      this.searchData = value
      this.getLogList()
    },
    async getLogList() {
      try {
        const params = {
          pageRows: this.pagination.pageSize,
          pageNum: this.pagination.current,
          ...this.searchData
        }
        this.tableLoading = true
        const result = await systemLogList(params)
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
      this.getLogList()
    }
  }
}
</script>