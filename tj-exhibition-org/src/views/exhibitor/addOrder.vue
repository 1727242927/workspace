<template>
  <a-drawer
    :width="720"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose"
    class="exhibitor-add-order"
  >
    <Title slot="title" style="margin-bottom: 0">添加订单</Title>
    <div class="content">
      <a-descriptions title="基本信息" style="margin-bottom: 10px">
        <a-descriptions-item label="订单号">{{orderId}}</a-descriptions-item>
        <a-descriptions-item label="展馆号">{{currentExhibitor.exhibitors014}}</a-descriptions-item>
        <a-descriptions-item label="展位号">{{currentExhibitor.exhibitors015}}</a-descriptions-item>
        <a-descriptions-item label="公司名称">{{currentExhibitor.exhibitors002}}</a-descriptions-item>
        <a-descriptions-item label="主场/主办名称">{{currentExhibitor.itmaIdP}}</a-descriptions-item>
      </a-descriptions>
      <div class="search-select">
        <div class="search-title-name">服务分类：</div>
        <a-select
          show-search
          placeholder="请选择服务分类"
          option-filter-prop="children"
          style="width: 200px"
          :value="serviceClassifyId"
          @change="handleChange"
        >
          <a-select-option
            v-for="classify in serviceClassifyList"
            :key="classify.id"
            :value="classify.id"
          >
            {{classify.otbNameCn}}
          </a-select-option>
        </a-select>
      </div>
      <div class="table-wrapper">
        <a-table
          :columns="columns"
          :data-source="data"
          :loading="tableLoading"
          :row-selection="{
            selectedRowKeys,
            onChange,
            onSelect
          }"
          bordered
          :pagination="false"
          :scroll="{x: 1000, y: 350}"
        >
          <span slot="otsPriceRmbDeposit" slot-scope="text">{{text !== '' ? text : 0}}</span>
        </a-table>
      </div>
    </div>
    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }"
    >
      <a-button :style="{ marginRight: '8px' }" @click="onClose">取消</a-button>
      <a-button type="primary" @click="onSubmit" :loading="btnLoading">提交</a-button>
    </div>
  </a-drawer>
</template>

<script>
import Title from '@/components/Title'
import { getLocalInfo, getLocalStorageItem } from '@/utils'
import { serviceClassify, orderNumber, orderAdd } from '@/api'

const columns = [
  { title: '服务名称', dataIndex: 'otsNameCn' },
  { title: '展费单价（元）', dataIndex: 'otsPriceRmb' },
  { title: '押金单价（元）', dataIndex: 'otsPriceRmbDeposit', scopedSlots: { customRender: 'otsPriceRmbDeposit' } },
  { title: '计量单位（CN）', dataIndex: 'otsUnit' },
  { title: '服务规格', dataIndex: 'otsStandards' },
  { title: '备注', dataIndex: 'otsRemarks' }
]

export default {
  components: {
    Title
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    currentExhibitor: {
      type: Object
    }
  },
  data() {
    return {
      columns,
      data: [],
      selectedRowKeys: [],
      serviceClassifyId: 0,
      serviceClassifyList: [],
      tableLoading: false,
      orderId: null,
      btnLoading: false
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      const localInfo = getLocalInfo()
      this.showId = localInfo.showId
      this.userId = localInfo.userId
    },
    async getServiceClassifyList() {
      this.tableLoading = true
      const params = {
        homeCourtId: this.userId,
        showId: this.showId
      }
      try {
        const result = await serviceClassify(params)
        this.tableLoading = false
        const { code, data } = result
        if (code === 1000) {
          this.serviceClassifyList = data
          this.serviceClassifyId = data[0].id
          this.data = data[0].expoOrderTypesSmalls.map(item => {
            item.key = item.id
            return item
          })
        }
      } catch (error) {
        this.tableLoading = false
        console.log(error)
      }
    },
    handleChange(value) {
      this.tableLoading = true
      this.selectedRowKeys = [] // 清空已选择的key
      this.serviceClassifyId = value
      this.timer = setTimeout(() => {
        this.filterClassifyList(value)
        this.tableLoading = false
      }, 500)
    },
    filterClassifyList(value) {
      this.serviceClassifyList.forEach(item => {
        if (item.id === value) {
          this.data = item.expoOrderTypesSmalls.map(item => {
            item.key = item.id
            return item
          })
        }
      })
    },
    onChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    onSelect(record, selected) {
      if (!record.flag) {
        this.$message.warning('服务项金额有变更，请删除订单服务项或重新生成订单！')
        if (selected) {
          const id = record.id
          const index = this.selectedRowKeys.findIndex(item => item === id)
          this.selectedRowKeys.splice(index, 1)
        }
      }
    },
    async getOrderNumber() {
      try {
        const currentExhibition = getLocalStorageItem('currentExhibition')
        const result = await orderNumber({ showId: currentExhibition.id })
        const { code, data } = result
        if (code === 1000) {
          this.orderId = data
        }
      } catch (error) {
        console.log(error)
      }
    },
    getParams() {
      const params = {
        showId: this.showId,
        userId: this.userId,
        exhibitorsId: this.currentExhibitor.id, // 展商id
        orderType: 'order', // 搭建商
        orderId: this.orderId,
        expoOrderTypesSmallIds: this.selectedRowKeys
      }
      return params
    },
    async onSubmit() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请勾选所需服务项！')
        return
      }
      const params = this.getParams()
      this.tableLoading = true
      this.btnLoading = true
      try {
        const result = await orderAdd(params)
        this.tableLoading = false
        this.btnLoading = false
        this.$message.success(result.message)
        this.onClose()
      } catch (error) {
        this.tableLoading = false
        this.btnLoading = false
        console.log(error)
      }
    },
    onClose() {
      this.$emit('update:visible', false)
      this.selectedRowKeys = []
    }
  },
  watch: {
    visible(newVal) {
      if (!this.serviceClassifyId) {
        this.getServiceClassifyList()
      }
      if (newVal) {
        // 提前获取orderId
        this.getOrderNumber()
      }
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }
}
</script>

<style lang="less" scoped>
.exhibitor-add-order {
  .content {
    .search-select {
      display: flex;
      align-items: center;
    }
  }
}
</style>