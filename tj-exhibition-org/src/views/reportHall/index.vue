<template>
  <div class="report-hall">
    <Title>一键报馆
      <template v-slot:right>
        <a-button v-if="!selfExhibition" type="primary">
          <a href="/tj-exhibition/file/downloadTemplate?templateName=2">模板下载</a>
        </a-button>
      </template>
    </Title>
    <a-form layout="inline" :form="form">
      <a-form-item label="服务项目">
        <a-input v-decorator="['serviceItemName']" placeholder="请输入服务项目"></a-input>
      </a-form-item>
      <a-form-item label="搭建商名称">
        <a-input v-decorator="['comName']" placeholder="请输入搭建商名称"></a-input>
      </a-form-item>
      <a-form-item label="展位号">
        <a-input v-decorator="['zwName']" placeholder="请输入展位号"></a-input>
      </a-form-item>
      <a-form-item label="订单号">
        <a-input v-decorator="['orderNum']" placeholder="请输入订单号"></a-input>
      </a-form-item>
      <a-form-item label="报馆状态">
        <a-select v-decorator="['submitStatus']" placeholder="请选择报馆状态" allowClear style="width: 180px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="0">未报馆</a-select-option>
          <a-select-option value="1">已报馆</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="search">查询</a-button>
      </a-form-item>
      <a-form-item v-if="!selfExhibition">
        <a-button type="primary" @click="handleImportClick">导入</a-button>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" :loading="btnLoading" @click="handleReportHall">一键报馆</a-button>
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
        :row-selection="{
          selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: record => ({
            props: {
              disabled: record.submitStatus === '1'
            }
          })
        }"
        rowKey="orderDetailId"
        :scroll="{y: 550}"
      >
        <span slot="submitStatus" slot-scope="submitStatus">
          <a-tag :color="submitStatus === '1' ? 'cyan' : 'red'">
            {{formateSubmitStatus(submitStatus)}}
          </a-tag>
        </span>
      </a-table>
    </div>
     <ImportFile
      :visible.sync="modalVisible"
      @refresh="getReportHallList"
    />
  </div>
</template>

<script>
import Title from '@/components/Title'
import TableMixIn from '@/mixins'
import ImportFile from './importFile'
import { orgReportHall, reportHallSubmit } from '@/api'
import { getLocalInfo } from '@/utils'
import { mapGetters } from 'vuex'

const columns = [
  { title: '订单号', dataIndex: 'orderNum' },
  { title: '服务项目', dataIndex: 'serviceItemName' },
  { title: '数量', dataIndex: 'serviceItemNum' },
  { title: '展位号', dataIndex: 'zwName' },
  { title: '搭建商名称', dataIndex: 'comName' },
  { title: '报馆状态', dataIndex: 'submitStatus', scopedSlots: { customRender: 'submitStatus' } }
]

export default {
  mixins: [TableMixIn],
  components: {
    Title,
    ImportFile
  },
  data() {
    return {
      columns,
      data: [],
      btnLoading: false,
      selectedRowKeys: [],
      modalVisible: false,
      form: this.$form.createForm(this)
    }
  },
  computed: {
    ...mapGetters(['selfExhibition'])
  },
  created() {
    this.isAddColumns()
    this.getReportHallList()
  },
  methods: {
    isAddColumns() {
      // selfExhibition: true自办展
      if (!this.selfExhibition) {
        this.columns = [
          ...this.columns,
          { title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, align: 'center' }
        ]
      }
    },
    async getReportHallList() {
      try {
        const localInfo = getLocalInfo()
        const params = {
          showId: localInfo.showId,
          userId: localInfo.userId,
          pageRows: this.pagination.pageSize,
          pageNum: this.pagination.current,
          ...this.searchData
        }
        this.tableLoading = true
        const result = await orgReportHall(params)
        this.tableLoading = false
        const { data } = result
        this.data = data.list
        this.pagination.total = data.total
      } catch (error) {
        this.tableLoading = false
        console.log(error)
      }
    },
    search() {
      this.pagination.current = 1
      const value = this.form.getFieldsValue()
      this.searchData = value
      this.getReportHallList()
    },
    paginationChange(pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getReportHallList()
    },
    handleReportHall() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择服务项！')
        return
      }
      this.reportHallRequest()
    },
    async reportHallRequest() {
      try {
        const params = {
          orderDetailIds: this.selectedRowKeys
        }
        this.btnLoading = true
        const result = await reportHallSubmit(params)
        const { message } = result
        this.btnLoading = false
        this.$message.success(message)
        this.getReportHallList()
        this.selectedRowKeys = []
      } catch (error) {
        this.btnLoading = false
        console.log(error)
      }
    },
    handleImportClick() {
      this.modalVisible = true
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    formateSubmitStatus(status) {
      if (status == null) return
      const config = {
        0: '未报馆',
        1: '已报馆'
      }
      return config[status]
    }
  }
}
</script>
