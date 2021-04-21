<template>
  <div class="personnel">
    <Title>人员资料库信息</Title>
    <a-form layout="inline" :form="form">
      <a-form-item label="姓名">
        <a-input
          v-decorator="['personName']"
          placeholder="请输入姓名"
          allowClear
        ></a-input>
      </a-form-item>
      <a-form-item label="身份证号">
        <a-input
          v-decorator="['idcard']"
          placeholder="请输入身份证号"
          allowClear
        ></a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="handleSearch">查询</a-button>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="() => $router.back()">返回</a-button>
      </a-form-item>
    </a-form>
    <div class="table-wrapper">
      <div style="margin: 0 0 15px">
        <a-button type="primary" :loading="btnLoading" @click="handleAdd"
          >添加</a-button
        >
      </div>
      <a-table
        bordered
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        :loading="tableLoading"
        :row-selection="{
          selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: record => ({
            props: {
              disabled: record.whetherApplyCertificates // 已添加的禁用
              // defaultChecked: record.whetherApplyCertificates
            }
          })
        }"
        @change="paginationChange"
        :scroll="{ y: 550 }"
      >
        <span slot="avatar" slot-scope="avatar">
          <img
            width="30"
            height="30"
            :src="avatar"
            style="border-radius: 50%"
          />
        </span>
        <span slot="personSex" slot-scope="personSex">
          {{ personSex == 0 ? "男" : "女" }}
        </span>
        <span slot="qualificationsExpiryDate" slot-scope="text">{{
          text && text.slice(0, 11)
        }}</span>
        <!--        <span slot="exhibitors" slot-scope="exhibitors, record, index">-->
        <!--          <a-select-->
        <!--            :value="record.exhibitors"-->
        <!--            @change="value => handleChange(value, index, 'exhibitors')" style="width: 160px" placeholder="请选择参展商"-->
        <!--            allowClear-->
        <!--            show-search-->
        <!--            :disabled="record.whetherApplyCertificates"-->
        <!--          >-->
        <!--            <a-select-option-->
        <!--              v-for="exhibitors in exhibitorsList"-->
        <!--              :key="exhibitors.id"-->
        <!--              :value="exhibitors.id"-->
        <!--            >-->
        <!--              {{exhibitors.exhibitors002}}-->
        <!--            </a-select-option>-->
        <!--          </a-select>-->
        <!--        </span>-->
      </a-table>
    </div>
  </div>
</template>

<script>
import Title from '@/components/Title'
import TableMixIn from '@/mixins'
import { getPersonnelList, exhibitorsListAll, personnelBatchAdd } from '@/api'
import { getLocalInfo } from '@/utils'

const columns = [
  {
    title: '头像',
    dataIndex: 'avatar',
    scopedSlots: { customRender: 'avatar' },
    className: 'avatar-tablecell',
    align: 'center'
  },
  { title: '姓名', dataIndex: 'personName' },
  {
    title: '性别',
    dataIndex: 'personSex',
    scopedSlots: { customRender: 'personSex' }
  },
  { title: '籍贯', dataIndex: 'nativePlace' },
  { title: '身份证号', dataIndex: 'idcard' },
  // { title: '证件有效期', dataIndex: 'certificatesExpiryDate' },
  { title: '工种', dataIndex: 'jobLevelName' },
  {
    title: '资格证有效期',
    dataIndex: 'qualificationsExpiryDate',
    scopedSlots: { customRender: 'qualificationsExpiryDate' }
  }
  // { title: '参展商', key: 'exhibitors', width: 200, scopedSlots: { customRender: 'exhibitors' } }
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
      selectedRowKeys: [],
      exhibitorsList: [],
      btnLoading: false,
      form: this.$form.createForm(this, { name: 'personnel' })
    }
  },
  created() {
    this.getPersonnelList()
    this.getExhibitorsList()
  },
  methods: {
    handleAdd() {
      if (this.selectedRowKeys.length === 0) {
        return this.$message.warning('请勾选信息！')
      }
      const existFlag = this.selectedRows.every(row => row.exhibitors)
      // if (!existFlag) {
      //   return this.$message.warning('请选择展商！')
      // }
      this.handleBatchAdd()
    },
    async handleBatchAdd() {
      this.btnLoading = true
      this.tableLoading = true
      const localInfo = getLocalInfo()
      const expoExhibitorsIdList = this.selectedRows.map(
        item => item.exhibitors
      )
      const params = {
        showId: localInfo.showId,
        certificatesPersonIdList: this.selectedRowKeys,
        expoExhibitorsIdList: expoExhibitorsIdList
      }
      try {
        const result = await personnelBatchAdd(params)
        this.tableLoading = false
        this.btnLoading = false
        const { message } = result
        this.$message.success(message)
        this.selectedRowKeys = []
        this.selectedRows = []
        this.$router.back()
      } catch (error) {
        this.tableLoading = false
        this.btnLoading = false
        console.log(error)
      }
    },
    async getPersonnelList() {
      this.tableLoading = true
      const localInfo = getLocalInfo()
      const params = {
        showId: localInfo.showId,
        dataCategory: '0',
        dataCategoryId: localInfo.userId,
        pageRows: this.pagination.pageSize,
        pageNum: this.pagination.current,
        ...this.searchData
      }
      try {
        const result = await getPersonnelList(params)
        this.tableLoading = false
        const { code, data } = result
        if (code === 1000) {
          this.data = data.list.map(list => {
            const start = list.headPortrait.startsWith('[{')
            list.key = list.id
            list.avatar = start
              ? JSON.parse(list.headPortrait)[0].url
              : list.headPortrait
            return list
          })
          this.pagination.total = data.total
        }
      } catch (error) {
        console.log(error)
        this.tableLoading = false
      }
    },
    handleSearch() {
      this.pagination.current = 1
      const value = this.form.getFieldsValue()
      this.searchData = value
      this.getPersonnelList()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    paginationChange(pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getPersonnelList()
    },
    async getExhibitorsList() {
      const localInfo = getLocalInfo()
      const params = {
        homeCourtId: localInfo.userId,
        exhibitors000: localInfo.showId
      }
      try {
        const result = await exhibitorsListAll(params)
        const { code, data } = result
        if (code === 1000) {
          this.exhibitorsList = data
        }
      } catch (error) {
        console.log(error)
      }
    },
    handleChange(value, index, columns) {
      const newData = [...this.data]
      newData[index][columns] = value
      // this.$set(newData[index], columns, value)
      this.data = newData
    }
  }
}
</script>
