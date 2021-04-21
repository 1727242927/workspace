<template>
  <div class="personnel">
    <Title>人员资料库信息</Title>
    <a-form layout="inline" :form="form">
      <a-form-item label="姓名">
        <a-input v-decorator="['personName']" placeholder="请输入姓名" allowClear></a-input>
      </a-form-item>
      <a-form-item label="身份证号">
        <a-input v-decorator="['idcard']" placeholder="请输入身份证号" allowClear></a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="handleSearch">查询</a-button>
      </a-form-item>
    </a-form>
    <div class="table-wrapper">
      <div style="margin: 0 0 15px;text-align:right;padding-right:50px">
        <a-button type="primary" :loading="btnLoading" @click="handleAdd">添加</a-button>
      </div>
      <a-table
        bordered
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        :loading="tableLoading"
        @change="paginationChange"
        :scroll="{y: 550}"
      >
        <span slot="avatar" slot-scope="avatar">
          <img width="30" height="30" :src="avatar" style="border-radius: 50%"/>
        </span>
        <span slot="personSex" slot-scope="text">{{text === 0 ? '男' : '女'}}</span>
        <span slot="qualificationsExpiryDate" slot-scope="text">{{text && text.slice(0, 11)}}</span>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <a @click="showDeleteConfirm(record)">删除</a>
        </span>
      </a-table>
    </div>
    <!-- 添加弹框 -->
    <person-form
      @refresh="getPersonnelList"
      :isAdd="isAdd"
      :record="record"
      :visible.sync="visible"
    />
  </div>
</template>

<script>
import Title from '@/components/Title'
import PersonForm from './personForm'
import TableMixIn from '@/mixins'
import { getPersonnel, expSysPersonnelDelete } from '@/api'
import { getLocalStorageItem } from '@/utils'

const columns = [
  { title: '头像', dataIndex: 'avatar', scopedSlots: { customRender: 'avatar' }, className: 'avatar-tablecell', align: 'center' },
  { title: '姓名', dataIndex: 'personName', align: 'center' },
  { title: '性别', dataIndex: 'personSex', scopedSlots: { customRender: 'personSex' }, align: 'center' },
  { title: '籍贯', dataIndex: 'nativePlace', align: 'center' },
  { title: '身份证号', dataIndex: 'idcard', align: 'center' },
  { title: '工种', dataIndex: 'jobLevelName', align: 'center' },
  { title: '资格证有效期', dataIndex: 'qualificationsExpiryDate', scopedSlots: { customRender: 'qualificationsExpiryDate' }, align: 'center' },
  { title: '操作', key: 'Action', scopedSlots: { customRender: 'action' }, align: 'center' }
]

export default {
  mixins: [TableMixIn],
  components: {
    Title,
    PersonForm
  },
  data() {
    return {
      columns,
      data: [],
      btnLoading: false,
      isAdd: true,
      record: {},
      visible: false,
      form: this.$form.createForm(this)
    }
  },
  created() {
    this.getPersonnelList()
  },
  methods: {
    handleAdd() {
      this.isAdd = true
      this.isDisabled = true
      this.visible = true
      this.record = {}
    },
    async getPersonnelList() {
      this.tableLoading = true
      const userInfo = getLocalStorageItem('userInfo')
      const params = {
        // showId: localInfo.showId,
        dataCategory: '0',
        dataCategoryId: userInfo.id,
        pageRows: this.pagination.pageSize,
        pageNum: this.pagination.current,
        ...this.searchData
      }
      try {
        const result = await getPersonnel(params)
        this.tableLoading = false
        const { code, data } = result
        if (code === 1000) {
          this.data = data.list.map(list => {
            list.key = list.id
            if (list.headPortrait) {
              const start = list.headPortrait.startsWith('[{')
              list.avatar = start ? JSON.parse(list.headPortrait)[0].url : list.headPortrait
            } else {
              list.avatar = ''
            }
            return list
          })
          this.pagination.total = data.total
        }
      } catch (error) {
        console.log(error)
        this.tableLoading = false
      }
    },
    handleEdit(record) {
      this.isAdd = false
      this.visible = true
      this.record = record
    },
    showDeleteConfirm(record) {
      this.$confirm({
        title: '您确定要删除这条数据吗？',
        content: '删除后不可恢复！是否要删除？',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          this.handleDelete(record.id)
        }
      })
    },
    handleDelete(id) {
      expSysPersonnelDelete({ id }).then(res => {
        const { message } = res
        this.getPersonnelList()
        this.$message.success(message)
      })
    },
    handleSearch() {
      this.pagination.current = 1
      const value = this.form.getFieldsValue()
      this.searchData = value
      this.getPersonnelList()
    },
    paginationChange(pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getPersonnelList()
    }
  }
}
</script>
