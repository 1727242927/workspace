<!--认款弹窗-->
<template>
  <div>
    <a-form-model
      layout="inline"
      :model="form"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="付款方">
        <a-input style="width: 250px" v-model="form.clientName" />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 2, offset: 8 }">
        <a-button type="primary" @click="searchByName">
          查询
        </a-button>
      </a-form-model-item>
    </a-form-model>
    <a-table :columns="columns" :data-source="dataSource">
      <template slot="collectionAmount" slot-scope="text,record">
       {{$formatMoney(record.collectionAmount)}}
      </template>
      <template slot="claimedAmount" slot-scope="text,record">
        {{$formatMoney(record.claimedAmount)}}
      </template>
      <template slot="noClaimedAmount" slot-scope="text,record">
        {{$formatMoney(record.noClaimedAmount)}}
      </template>
      <template slot="action" slot-scope="record">
        <a @click="showModal(record)">认款</a>
      </template>
    </a-table>
    <a-modal
      title="认款"
      :visible="visible"
      :maskClosable="false"
      :destroyOnClose="true"
      @ok="handleOk"
      @cancel="handleCancel => (visible = false)"
    >
      <SubscriptionForm
        ref="SubscriptionRef"
        @closeModal="closeModal"
        :paramsObject="paramsObject"
      />
    </a-modal>
  </div>
</template>

<script>
import { getBankFlowAPI } from '@/api/index'
import SubscriptionForm from '@/views/financial/SubscriptionForm'
export default {
  name: 'SubscriptionList',
  components: {
    SubscriptionForm
  },
  props: {
    // 搭建商名称
    builderName: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
      visible: false,
      form: {
        clientName: undefined
      },
      paramsObject: {
        // 收款流水编号
        collectionSerialNumber: undefined,
        // 未认领金额
        noClaimedAmount: undefined
      },
      dataSource: [],
      columns: [
        {
          key: '1',
          title: '收款流水编号',
          dataIndex: 'collectionSerialNumber',
          width: 150,
          align: 'center',
          scopedSlots: { customRender: 'collectionSerialNumber' }
        },
        {
          key: '2',
          title: '收款金额',
          dataIndex: 'collectionAmount',
          width: 120,
          align: 'center',
          scopedSlots: { customRender: 'collectionAmount' }
        },
        {
          key: '3',
          title: '已认领金额',
          dataIndex: 'claimedAmount',
          width: 120,
          align: 'center',
          scopedSlots: { customRender: 'claimedAmount' }
        },
        {
          key: '4',
          title: '未认领金额',
          dataIndex: 'noClaimedAmount',
          width: 120,
          align: 'center',
          scopedSlots: { customRender: 'noClaimedAmount' }
        },
        {
          key: '5',
          title: '操作',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: 120
        }
      ]
    }
  },
  created() {
    this.getList()
    this.setDefaultValue()
  },
  methods: {
    /**
     * @description: 认款
     * @author: 潘慧敏
     * @time: 2021-03-25 15:35:25
     */
    handleOk() {
      this.$refs.SubscriptionRef.saveSubscription()
    },
    /**
     * @description: 获取列表
     * @author: 潘慧敏
     * @time: 2021-03-25 11:06:35
     */
    getList() {
      getBankFlowAPI({ clientName: this.form.clientName ? this.form.clientName : this.builderName }).then(res => {
        if (res.code == 1000) {
          this.dataSource = res.data
        }
      })
    },
    /**
     * @description: 赋值搜索框默认值
     * @author: 潘慧敏
     * @time: 2021-03-25 11:26:47
     */
    setDefaultValue() {
      this.form.clientName = this.builderName
    },
    /**
     * @description:搜索
     * @author: 潘慧敏
     * @time: 2021-03-25 10:21:50
     */
    searchByName() {
      this.getList(this.form)
    },
    /**
     * @description: 显示
     * @author: 潘慧敏
     * @time: 2021-03-25 15:39:20
     * @param noClaimedAmount 未认领金额
     */
    showModal(record) {
      this.paramsObject.collectionSerialNumber = record.collectionSerialNumber
      this.paramsObject.noClaimedAmount = record.noClaimedAmount
      this.visible = true
    },
    /**
     * @description: 关闭
     * @author: 潘慧敏
     * @time: 2021-03-25 16:18:08
     */
    closeModal() {
      this.getList()
      this.visible = false
    }
  }
}
</script>

<style scoped lang="css"></style>
