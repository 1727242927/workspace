<template>
  <a-table
    bordered
    rowKey="id"
    :columns="columns"
    :data-source="data"
    :loading="loading"
    :pagination="false"
  >
    <span slot="avatar" slot-scope="avatar">
      <img width="30" height="30" :src="avatar" style="border-radius: 50%"/>
    </span>
    <span slot="personSex" slot-scope="text">{{text ==1  ? '男' : '女'}}</span>
    <span slot="applicationStatus" slot-scope="text">{{transformApplicationStatus(text)}}</span>
  </a-table>
</template>

<script>
import { statusConfig } from '@/utils/config'

const columns = [
  { title: '头像', dataIndex: 'avatar', scopedSlots: { customRender: 'avatar' }, className: 'avatar-tablecell', align: 'center' },
  { title: '姓名', dataIndex: 'personName' },
  { title: '性别', dataIndex: 'personSex', scopedSlots: { customRender: 'personSex' } },
  { title: '籍贯', dataIndex: 'nativePlace' },
  { title: '身份证号', dataIndex: 'idcard' },
  { title: '金额（元）', dataIndex: 'certificatesPrice' },
  { title: '工种', dataIndex: 'jobLevelName' },
  { title: '资格证有效期', dataIndex: 'qualificationsExpiryDate', scopedSlots: { customRender: 'qualificationsExpiryDate' } },
  { title: '申请状态', dataIndex: 'applicationStatus', scopedSlots: { customRender: 'applicationStatus' } }
]

export default {
  props: {
    data: {
      type: Array,
      default: () => ([])
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      columns
    }
  },
  methods: {
    transformApplicationStatus(status) {
      if (status == null) return
      return statusConfig.certificateApplyStatus[status]
    }
  }
}
</script>
