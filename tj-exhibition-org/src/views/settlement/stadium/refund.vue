<template>
  <a-modal
    title="结算单"
    :width="500"
    :visible="refundVisible"
    :footer="null"
    @cancel="handleCancel"
  >
    <a-form :form="form" v-bind="formItemLayout">
      <a-form-item label="账户名">
        <a-input
          placeholder="请输入账户名"
          v-decorator="[
            'refundAccountName',
            {
              rules: [
                { required: true, message: '请输入账户名' }
              ]
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="账号">
        <a-input
          placeholder="请输入账户名"
          v-decorator="[
            'refundAccountNumber',
            {
              rules: [
                { required: true, message: '请输入账号' }
              ]
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="开户行">
        <a-input
          placeholder="请输入开户行"
          v-decorator="[
            'refundBank',
            {
              rules: [
                { required: true, message: '请输入开户行' }
              ]
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="退款金额">
        <a-tag color="cyan" style="font-size: 16px">
          {{refundAmount}} 元
        </a-tag>
      </a-form-item>
    </a-form>
    <div class="customer-footer">
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="refund" type="primary" :loading="RefundApplyLoading" @click="refundClick">提交退款申请</a-button>
    </div>
  </a-modal>
</template>

<script>
import { expSettleRefund, expSettleRefundApply } from '@/api'

export default {
  props: {
    refundVisible: {
      type: Boolean,
      default: false
    },
    recordId: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      RefundApplyLoading: false,
      refundAmount: 0,
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
      },
      form: this.$form.createForm(this)
    }
  },
  methods: {
    expSettleRefund() {
      const params = {
        id: this.recordId
      }
      expSettleRefund(params).then(res => {
        const { data } = res
        this.setFieldsValue(data)
      }).catch(err => {
        console.log(err)
      })
    },
    setFieldsValue(data) {
      const { refundAccountName, refundAccountNumber, refundBank, settlementOutstandingAmount } = data
      this.refundAmount = settlementOutstandingAmount
      this.form.setFieldsValue({
        refundAccountName,
        refundAccountNumber,
        refundBank
      })
    },
    expSettleRefundApply(values) {
      const id = this.recordId
      const params = {
        id,
        refundAmount: this.refundAmount,
        ...values
      }
      this.RefundApplyLoading = true
      expSettleRefundApply(params).then(res => {
        const { message, data } = res
        this.RefundApplyLoading = false
        this.$emit('refresh')
        this.handleCancel()
        this.$message.success(message)
      }).catch(err => {
        this.RefundApplyLoading = false
        console.log(err)
      })
    },
    refundClick() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.expSettleRefundApply(values)
        }
      })
    },
    handleCancel() {
      this.$emit('update:refundVisible', false)
      this.form.resetFields()
      this.refundAmount = 0
    }
  },
  watch: {
    refundVisible: {
      handler(value) {
        if (value) {
          this.expSettleRefund()
        }
      },
      immediate: false
    }
  }
}
</script>

<style lang="less" scoped>
.customer-footer {
  text-align: right;
  padding: 20px 0 0;
  button {
    margin-left: 18px;
  }
}
</style>