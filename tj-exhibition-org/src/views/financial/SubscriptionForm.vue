<!--认款表单-->
<template>
  <div>
    <a-form-model
      ref="ruleForm"
      :rules="rules"
      :model="form"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="展费应付">
        <a-input disabled v-model="financial0191" />
      </a-form-model-item>
      <a-form-model-item label="押金应付">
        <a-input disabled v-model="financial0251" />
      </a-form-model-item>
      <a-form-model-item label="未认领金额">
        <a-input disabled v-model="noClaimedAmount" />
      </a-form-model-item>
      <a-form-model-item label="认领金额" prop="claimedAmount">
        <a-input  oninput="value=value.replace(/[^\d^\.]+/g,'')" v-model="form.claimedAmount" />
      </a-form-model-item>
      <a-form-model-item label="认款类型" prop="paytype">
        <a-radio-group v-model="form.paytype">
          <a-radio value="1">
            展费
          </a-radio>
          <a-radio value="2">
            押金
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import { financialConfirmBase, payClaimAPI } from '@/api/index.js'
export default {
  name: 'SubscriptionForm',
  props: {
    // 两个参数:收款流水编号 ,未认领金额
    paramsObject: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      form: {
        claimedAmount: undefined,
        paytype: undefined
      },
      financial0251: undefined,
      financial0191: undefined,
      noClaimedAmount: this.paramsObject.noClaimedAmount,
      rules: {
        claimedAmount: [
          { required: true, message: '请输入认款金额', trigger: 'blur' }
        ],
        paytype: [
          { required: true, message: '请选择认款类型', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getValues()
  },
  methods: {
    /**
     * @description: 保存
     * @author: 潘慧敏
     * @time: 2021-03-25 16:05:59
     */
    saveSubscription() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (
            Number(this.form.claimedAmount) >
            Number(this.paramsObject.noClaimedAmount)
          ) {
            this.$message.error('认领金额不可以大于未认领金额')
            return
          }
          payClaimAPI({
            merchantOrderNumber: this.$route.query.orderId,
            claimedAmount: this.form.claimedAmount,
            collectionSerialNumber: this.paramsObject.collectionSerialNumber,
            paytype: Number(this.form.paytype)
          }).then(res => {
            console.log(res)
            if (res.code == 1000) {
              this.$message.success(res.message)
              this.$emit('closeModal')
            } else {
              this.$message.warning(res.message)
              return
            }
          }).catch(err => {
            this.$message.error(err.message)
            return
          })
        }
      })
    },
    /**
    * @description: 获取展费应付,押金应付
    * @author: 潘慧敏
    * @time: 2021-03-25 18:00:44
    */
    getValues() {
      financialConfirmBase({ orderId: this.$route.query.orderId }).then(res => {
        if (res.code == 1000) {
          this.financial0251 = res.data.financial0251
          this.financial0191 = res.data.financial0191
        }
      })
    }
  }
}
</script>

<style scoped lang="css"></style>
