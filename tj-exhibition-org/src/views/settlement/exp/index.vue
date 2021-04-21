<template>
  <div class="certificates-people">
    <div>
      <Title>搭建商结算</Title>
      <div>
        <a-form layout="inline" :form="form">
          <a-form-item label="结算单号">
            <a-input v-decorator="['settlementNumber']" placeholder="请输入结算单号"/>
          </a-form-item>
          <a-form-item label="搭建商名称">
            <a-input v-decorator="['standFittingContractorName']" placeholder="请输入搭建商名称"/>
          </a-form-item>
          <a-form-item label="结算单状态">
            <a-select v-decorator="['settlementState']" placeholder="请选择结算单状态" style="width:160px">
              <a-select-option value="">全部</a-select-option>
              <a-select-option
                v-for="(status, key) in settlementState"
                :value="key"
                :key="key"
              >
                {{status}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" icon="search" @click="search">查询</a-button>
          </a-form-item>
        </a-form>
      </div>
      <div class="table-box">
        <a-table
          bordered
          :columns="columns"
          :data-source="data"
          :loading="tableLoading"
          :pagination="pagination"
          rowKey="id"
          @change="paginationChange"
          :scroll="{y: 550}"
        >
          <span slot="id" slot-scope="id, record">
            <a @click="showDetail(record)">详情</a>
            <a-divider type="vertical" />
            <a @click="sureClick(record)" :disabled="record.settlementState == '3'">认款</a>
          </span>
          <span slot="settlementState" slot-scope="status">
            {{formateSettlementState(status)}}
          </span>
        </a-table>
      </div>
      <SureModel
        :visible.sync="visible"
        :record.sync="record"
        @refresh="settleList"
      />
    </div>
  </div>
</template>

<script>
import Title from '@/components/Title'
import TableMixIn from '@/mixins'
import SureModel from './sureModel'
import { settleList } from '@/api'
import { getLocalInfo } from '@/utils'
import { statusConfig } from '@/utils/config'

const settlementState = statusConfig.settlementState

const columns = [
  { title: '序号', align: 'center', width: 100, customRender: (text, record, index) => `${index + 1}` },
  { title: '结算单号', dataIndex: 'settlementNumber', align: 'center' },
  { title: '搭建商名称', dataIndex: 'standFittingContractorName', align: 'center' },
  { title: '应付总金额', dataIndex: 'settlementReceivableAmount', align: 'center' },
  { title: '已付金额', dataIndex: 'settlementActualCollectionAmount', align: 'center' },
  { title: '余额', dataIndex: 'settlementOutstandingAmount', align: 'center' },
  { title: '结算单生成时间', dataIndex: 'settlementEstablishDate', align: 'center' },
  { title: '结算单状态', dataIndex: 'settlementState', align: 'center', scopedSlots: { customRender: 'settlementState' } },
  { title: '操作', width: 120, dataIndex: 'id', align: 'center', scopedSlots: { customRender: 'id' } }
]

export default {
  mixins: [TableMixIn],
  components: {
    Title,
    SureModel
  },
  data() {
    return {
      columns,
      data: [],
      settlementState,
      visible: false,
      record: {},
      form: this.$form.createForm(this)
    }
  },
  created() {
    this.settleList()
  },
  methods: {
    search() {
      this.pagination.current = 1
      const value = this.form.getFieldsValue()
      this.searchData = value
      this.settleList()
    },
    paginationChange(pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.settleList()
    },
    settleList() {
      const localInfo = getLocalInfo()
      const params = {
        showId: localInfo.showId,
        homeCourtId: localInfo.userId,
        pageRows: this.pagination.pageSize,
        pageNum: this.pagination.current,
        ...this.searchData
      }
      this.tableLoading = true
      settleList(params).then(res => {
        const { code, data } = res
        this.tableLoading = false
        if (code === 1000) {
          this.data = data.list
          this.pagination.total = data.total
        }
      }).catch(err => {
        this.tableLoading = false
        console.log(err)
      })
    },
    sureClick(record) {
      this.visible = true
      this.record = record
    },
    showDetail(record) {
      console.log(record)
      this.$router.push({
        path: '/home/settlement/exp/detail',
        query: { id: record.id }
      })
    },
    formateSettlementState(status) {
      if (status == null) return
      return this.settlementState[status]
    }
  }
}
</script>
<style lang="less">
.table-box{
  padding-top:20px
}
.ant-table-tbody td{
  position: relative;
}
.blue{
  background: #0000FF;
  color:#fff
}
.red{
  background: #ff0000;
  color:#fff;
}
.yellow{
  background: #FFFF00;
  color:#fff;
}
.lime{
  background: #00FF00;
  color:#fff
}
.tdColor{
  position: absolute;
  left:0;
  top:0;
  width:100%;
  height:100%;
  line-height: 65px;
  cursor: pointer;
}

.ant-carousel .slick-slide {
  text-align: center;
  height: 400px;
  overflow: hidden;
  position: relative;
}

.ant-carousel .custom-slick-arrow {
  width: 25px;
  height: 25px;
  font-size: 38px;
  color: rgba(0,0,0,.45);
}
.ant-carousel .custom-slick-arrow:before {
  display: none;
}
.ant-carousel .custom-slick-arrow:hover {
  color: rgba(0,0,0,.45);
}
.ant-carousel .slick-slide img{
  position: absolute;
  max-width: 100%;
  max-height: 100%;
  top:0;
  right:0;
  left:0;
  bottom:0;
  margin:auto;
}

</style>
