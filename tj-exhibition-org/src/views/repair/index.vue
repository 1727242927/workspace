<template>
  <div class="repair">
    <Title>报修申请列表</Title>
    <a-form layout="inline" :form="form">
      <a-form-item label="展商名称">
        <a-input v-decorator="['homeBuildingExhibitorsName']" placeholder="请输入展商名称" allowClear></a-input>
      </a-form-item>
      <a-form-item label="搭建商名称">
        <a-input v-decorator="['standFittingContractorName']" placeholder="请输入搭建商名称" allowClear></a-input>
      </a-form-item>
      <a-form-item label="服务项目">
        <a-input v-decorator="['homeBuildingOrderTypesSmallName']" placeholder="请输入服务项目" allowClear></a-input>
      </a-form-item>
      <a-form-item label="订单号">
        <a-input v-decorator="['orderNumber']" placeholder="请输入订单号" allowClear></a-input>
      </a-form-item>
      <a-form-item label="展位号">
        <a-input v-decorator="['boothNo']" placeholder="请输入展位号" allowClear></a-input>
      </a-form-item>
      <a-form-item label="报修状态">
        <a-select v-decorator="['guaranteeState']" placeholder="请选择报修状态" allowClear style="width:145px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option
            v-for="(status, key) in guaranteeState"
            :value="key"
            :key="key"
          >
            {{status}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="search">查询</a-button>
        <a-button type="primary" :loading="repairLoading" @click="handleRepair" style="margin-left: 18px">报修</a-button>
      </a-form-item>
    </a-form>
    <div class="table-wrapper">
      <a-table
        bordered
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        :loading="tableLoading"
        :row-selection="{
          selectedRowKeys,
          onChange,
          getCheckboxProps: record => ({
            props: {
              disabled: record.guaranteeState !== '0'
            }
          })
        }"
        @change="paginationChange"
        rowKey="id"
        :scroll="{y: 550}"
      >
        <div slot="homeBuildingOrderTypesSmallName" slot-scope="text">
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>{{text}}</span>
            </template>
            <div :style="{width: '132px',whiteSpace: 'nowrap',textOverflow: 'ellipsis',overflow: 'hidden'}">{{text}}</div>
          </a-tooltip>
        </div>
        <span slot="guaranteeState" slot-scope="status">{{formateGuaranteeState(status)}}</span>
      </a-table>
    </div>
  </div>
</template>

<script>
import Title from '@/components/Title'
import TableMixIn from '@/mixins'
import { repairList, repairReq } from '@/api'
import { getLocalInfo } from '@/utils'
import { statusConfig } from '@/utils/config'

const guaranteeState = statusConfig.guaranteeState

const columns = [
  { title: '订单号', dataIndex: 'orderNumber' },
  { title: '展位号', dataIndex: 'boothNo' },
  { title: '展商名称', dataIndex: 'homeBuildingExhibitorsName' },
  { title: '搭建商名称', dataIndex: 'standFittingContractorName' },
  { title: '服务项目', dataIndex: 'homeBuildingOrderTypesSmallName', width: 170, scopedSlots: { customRender: 'homeBuildingOrderTypesSmallName' } },
  { title: '报修状态', dataIndex: 'guaranteeState', scopedSlots: { customRender: 'guaranteeState' } },
  { title: '报修时间', dataIndex: 'guaranteeDate' },
  { title: '报修原因', dataIndex: 'guaranteeReason' }
  // { title: '检测结果', dataIndex: 'guaranteeDetectionResult' },
  // { title: '维修意见', dataIndex: 'guaranteeMaintenanceOpinion' },
  // { title: '收费金额', dataIndex: 'guaranteeChargeAmount' },
  // { title: '维修完成时间', dataIndex: 'guaranteeCompletionTime' }
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
      selectedRowKeys: [],
      guaranteeState,
      repairLoading: false,
      form: this.$form.createForm(this)
    }
  },
  created() {
    this.getRepairList()
  },
  methods: {
    search() {
      this.pagination.current = 1
      const value = this.form.getFieldsValue()
      this.searchData = value
      this.getRepairList()
    },
    async getRepairList() {
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
        const result = await repairList(params)
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
      this.getRepairList()
    },
    onChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    handleRepair() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请勾选报修的服务项！')
        return
      }
      this.repairReq()
    },
    repairReq() {
      this.repairLoading = true
      repairReq(this.selectedRowKeys).then(res => {
        this.repairLoading = false
        const { message } = res
        this.$message.success(message)
        this.selectedRowKeys = [] // 清空已勾选
        this.getRepairList()
      }).catch(err => {
        this.repairLoading = false
        console.log(err)
      })
    },
    formateGuaranteeState(status) {
      if (status == null) return
      return this.guaranteeState[status]
    }
  }
}
</script>