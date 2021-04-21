<template>
  <a-table
    bordered
    rowKey="id"
    :columns="columns"
    :data-source="data"
    :loading="loading"
    :scroll="{y: 550}"
  >
    <span slot="applicationStatus" slot-scope="applicationStatus">{{formateApplyStatus(applicationStatus)}}</span>
    <span slot="gender" slot-scope="gender">{{gender == 1 ? '男' : '女'}}</span>
    <span slot="whetherMechanicalVehicle" slot-scope="text">{{text === '0' ? '否' : '是'}}</span>
    <span slot="admissionDate" slot-scope="admissionDate">{{formateAdmissionDate(admissionDate)}}</span>
    <span slot="admissionTime" slot-scope="text, record">
      {{formateAdmissionTime(record)}}
    </span>
  </a-table>
</template>

<script>
import { statusConfig } from '@/utils/config'

const columns = [
  { title: '驾驶员姓名', dataIndex: 'driverName', align: 'center', width: 120 },
  { title: '性别', dataIndex: 'gender', align: 'center', scopedSlots: { customRender: 'gender' }, width: 120 },
  { title: '身份证号', dataIndex: 'idCard', align: 'center' },
  { title: '车牌号', dataIndex: 'licensePlateNumber', align: 'center' },
  { title: '申请证件类型', dataIndex: 'certTypeName', align: 'center', width: 120 },
  { title: '证件种类', dataIndex: 'certCategoryName', align: 'center', width: 110 },
  // { title: '是否需要机力', dataIndex: 'whetherMechanicalVehicle', align: 'center', scopedSlots: { customRender: 'whetherMechanicalVehicle' }, width: 125 },
  { title: '进场日期', dataIndex: 'admissionDate', scopedSlots: { customRender: 'admissionDate' }, align: 'center', width: 120 },
  { title: '进场时间', dataIndex: 'admissionTime', align: 'center', scopedSlots: { customRender: 'admissionTime' }, width: 140 },
  { title: '申请状态', dataIndex: 'applicationStatus', scopedSlots: { customRender: 'applicationStatus' }, align: 'center', width: 120 }
  // { title: '参展商', dataIndex: 'exhibitors002', align: 'center' },
  // { title: '展位号', dataIndex: 'exhibitors015', align: 'center', width: 120 }
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
    formateAdmissionTime(record) {
      if (record.certType === 27) {
        return ''
      } else {
        return `${record.admissionStartTime} : 00 - ${record.admissionEndTime} : 00`
      }
    },
    formateApplyStatus(status) {
      if (status == null) return
      return statusConfig.certificateApplyStatus[status]
    },
    formateAdmissionDate(time) {
      if (time == null || time === '') return
      return time.slice(0, 10)
    }
  }
}
</script>
