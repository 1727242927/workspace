<template>
  <div class="exhibitors">
    <Title>展商列表
      <template v-slot:right>
        <a-button v-if="!selfExhibition" type="primary">
          <a href="/tj-exhibition/file/downloadTemplate?templateName=1">模板下载</a>
        </a-button>
      </template>
    </Title>
    <a-form layout="inline" :form="form">
      <a-form-item label="展馆号">
        <a-input v-decorator="['exhibitors014']" placeholder="请输入展馆号" :style="style" allowClear />
      </a-form-item>
      <a-form-item label="展位号">
        <a-input v-decorator="['exhibitors015']" placeholder="请输入展位号" :style="style" allowClear />
      </a-form-item>
      <a-form-item label="参展商名称">
        <a-input v-decorator="['exhibitors002']" placeholder="请输入参展商名称" :style="style" allowClear />
      </a-form-item>
      <a-form-item label="联系人">
        <a-input v-decorator="['exhibitors007']" placeholder="请输入联系人" :style="style" allowClear />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="handleSearch">查询</a-button>
      </a-form-item>
      <a-form-item>
        <a-button v-if="!selfExhibition" @click="handleImport" type="primary">导入</a-button>
      </a-form-item>
    </a-form>
    <div class="table-wrapper">
      <a-table
        :columns="columns"
        :data-source="data"
        :loading="tableLoading"
        :pagination="pagination"
        @change="paginationChange"
        bordered
        :scroll="{y: 550}"
      >
        <span slot="exhibitors002" slot-scope="text">
          <a-tooltip placement="bottom">
            <template slot="title">
              <div>{{text}}</div>
            </template>
            <div :style="{width: '158px',whiteSpace: 'nowrap',textOverflow: 'ellipsis',overflow: 'hidden'}">{{text}}</div>
          </a-tooltip>
        </span>
        <span slot="itmaIdP" slot-scope="text">
          <a-tooltip placement="bottom">
            <template slot="title">
              <div>{{text}}</div>
            </template>
            <div :style="{width: '158px',whiteSpace: 'nowrap',textOverflow: 'ellipsis',overflow: 'hidden'}">{{text}}</div>
          </a-tooltip>
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="add(record)">添加订单</a>
        </span>
      </a-table>
    </div>
    <addOrder
      :visible.sync="visible"
      :currentExhibitor="currentExhibitor"
    />
    <ImportFile
      :visible.sync="modalVisible"
      @refresh="getExhibitorsList"
    />
  </div>
</template>

<script>
import Title from '@/components/Title'
import addOrder from './addOrder'
import ImportFile from './importFile'
import TableMixIn from '@/mixins'
import { exhibitorsList, acceptanceAdd } from '@/api'
import { getLocalStorageItem } from '@/utils'
import { mapGetters } from 'vuex'

const columns = [
  { title: '参展商名称', dataIndex: 'exhibitors002', width: 190, scopedSlots: { customRender: 'exhibitors002' } },
  { title: '展馆号', dataIndex: 'exhibitors014' },
  { title: '展位号', dataIndex: 'exhibitors015' },
  { title: '展位类型', dataIndex: 'exhibitors013' },
  { title: '面积（㎡）', dataIndex: 'exhibitors016' },
  { title: '联系人', dataIndex: 'exhibitors007' },
  { title: '手机号', dataIndex: 'exhibitors011' },
  { title: '所属公司（主场/主办）', dataIndex: 'itmaIdP', width: 190, scopedSlots: { customRender: 'itmaIdP' } },
  { title: '操作', dataIndex: 'action', align: 'center', scopedSlots: { customRender: 'action' } }
]

export default {
  mixins: [TableMixIn],
  components: {
    Title,
    addOrder,
    ImportFile
  },
  data() {
    return {
      visible: false,
      modalVisible: false,
      currentExhibitor: {},
      tableLoading: false,
      columns,
      data: [],
      form: this.$form.createForm(this),
      style: {
        width: '160px'
      }
    }
  },
  computed: {
    ...mapGetters(['selfExhibition'])
  },
  created() {
    this.getExhibitorsList()
  },
  methods: {
    handleSearch() {
      this.pagination.current = 1
      const value = this.form.getFieldsValue()
      this.searchData = value
      this.getExhibitorsList()
    },
    async getExhibitorsList() {
      this.tableLoading = true
      const currentExhibition = getLocalStorageItem('currentExhibition')
      const userInfo = getLocalStorageItem('userInfo')
      const params = {
        pageRows: this.pagination.pageSize,
        pageNum: this.pagination.current,
        homeCourtId: userInfo.id,
        exhibitors000: currentExhibition.id,
        ...this.searchData
      }
      try {
        const result = await exhibitorsList(params)
        this.tableLoading = false
        const { code, data } = result
        if (code === 1000) {
          this.data = data.list.map(item => {
            item.key = item.id
            return item
          })
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
      this.getExhibitorsList()
    },
    add(record) {
      this.visible = true
      this.currentExhibitor = record
    },
    handleImport() {
      this.modalVisible = true
    }
  }
}
</script>

<style lang="less" scoped>

</style>
