<template>
  <div>
    <Title>子账户</Title>
    <a-form layout="inline" :form="form">
      <a-form-item label="账号">
        <a-input v-decorator="['userName']" placeholder="请输入账号" allowClear></a-input>
      </a-form-item>
      <a-form-item label="手机号">
        <a-input v-decorator="['contactPhone']" placeholder="请输入手机号" allowClear></a-input>
      </a-form-item>
      <a-form-item label="姓名">
        <a-input v-decorator="['contactName']" placeholder="请输入姓名" allowClear></a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="search">查询</a-button>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="addClick">添加</a-button>
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
      </a-table>
    </div>
    <FormDrawer
      :visible.sync="visible"
      @refresh="getChildUserList"
    />
  </div>
</template>

<script>
import Title from '@/components/Title'
import TableMixIn from '@/mixins'
import { clildUser } from '@/api'
import FormDrawer from './formDrawer'

const columns = [
  { title: '账号', dataIndex: 'userName' },
  { title: '姓名', dataIndex: 'contactName' },
  { title: '手机号', dataIndex: 'contactPhone' },
  { title: '部门', dataIndex: 'department' }
]

export default {
  mixins: [TableMixIn],
  components: {
    Title,
    FormDrawer
  },
  created() {
    this.getChildUserList()
  },
  data() {
    return {
      columns,
      data: [],
      visible: false,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    search() {
      this.pagination.current = 1
      const value = this.form.getFieldsValue()
      this.searchData = value
      this.getChildUserList()
    },
    addClick() {
      this.visible = true
    },
    async getChildUserList() {
      try {
        const params = {
          pageRows: this.pagination.pageSize,
          pageNum: this.pagination.current,
          ...this.searchData
        }
        this.tableLoading = true
        const result = await clildUser(params)
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
      this.getChildUserList()
    }
  }
}
</script>