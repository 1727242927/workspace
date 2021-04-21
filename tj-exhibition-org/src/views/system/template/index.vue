<template>
  <div class="template-wrap">
    <Title>模板管理</Title>
    <div>
      <a-button type="primary" @click="add">创建模板</a-button>
    </div>
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
      </a-table>
    </div>
    <TemplateModel
      :visible.sync="visible"
    />
  </div>
</template>

<script>
import Title from '@/components/Title'
import TemplateModel from './templateModel'
import TableMixIn from '@/mixins'

const columns = [
  { title: '模板名称', dataIndex: 'templateName' },
  { title: '创建时间', dataIndex: 'time' },
  { title: '操作', dataIndex: 'action' }
]

export default {
  mixins: [TableMixIn],
  components: {
    Title,
    TemplateModel
  },
  data() {
    return {
      columns,
      data: [],
      visible: false
    }
  },
  methods: {
    add() {
      this.visible = true
    },
    paginationChange(pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getReportHallList()
    }
  }
}
</script>