<template>
  <a-drawer
    :visible="visible"
    :width="720"
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose"
  >
    <Title slot="title" style="margin-bottom: 0">认款</Title>
    <a-form :form="form" layout="vertical">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="付款方">
            <a-input
              v-decorator="[
                'state07',
                {
                  rules: [{ required: true, message: '请输入付款方名称' }]
                }
              ]"
              placeholder="请输入付款方名称"
              :maxLength="30"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="付款方式">
            <a-select
              v-decorator="[
                'state02',
                {
                  rules: [{ required:true, message: '请选择付款方式' }]
                }
              ]"
              style="width: 100%"
              placeholder="请选择付款方式"
            >
              <a-select-option
                v-for="payMethod in payMethodList"
                :key="payMethod.id"
                :value="payMethod.id"
              >
                {{payMethod.detailsNameCn}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="付款日期">
            <a-date-picker
              v-decorator="[
                'state08',
                {
                  rules: [{ type: 'object', required: true, message: '请选择付款日期' }]
                }
              ]"
              show-time
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择付款日期"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="付款金额">
            <a-input
              v-decorator="[
                'state05',
                {
                  rules: [
                    { required: true, message: '请输入付款金额' },
                    ...$rules.numberRules
                  ]
                }
              ]"
              placeholder="请输入付款金额"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="付款凭证类型">
            <a-input
              v-decorator="[
                'state03',
                {
                  rules: [{ required: true, message: '请输入付款凭证类型' }]
                }
              ]"
              placeholder="请输入付款凭证类型"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="付款凭证号">
            <a-input
              v-decorator="[
                'state04',
                {
                  rules: [{ required: true, message: '请输入付款凭证号' }]
                }
              ]"
              placeholder="请输入付款凭证号"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
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
      <a-button type="primary" :loading="btnLoading" @click="onSubmit">提交</a-button>
    </div>
  </a-drawer>
</template>

<script>
import Title from '@/components/Title'
import { jobLevel, settleExpSure } from '@/api'

export default {
  components: {
    Title
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true
    },
    record: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      payMethodList: [],
      btnLoading: false,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    getPayMethodList() {
      jobLevel({ dictionaryTypeId: '5' }).then(res => {
        const { code, data } = res
        if (code === 1000) {
          this.payMethodList = data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    onSubmit() {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          values.state08 = values.state08.format('YYYY-MM-DD HH:mm:ss')
          this.handleSureRequest(values)
        }
      })
    },
    handleSureRequest(values) {
      const params = {
        ...values,
        state06: this.record.settlementNumber
      }
      this.btnLoading = true
      settleExpSure(params).then(res => {
        const { message } = res
        this.btnLoading = false
        this.$message.success(message)
        this.onClose()
        this.$emit('refresh')
      }).catch(err => {
        console.log(err)
        this.btnLoading = false
      })
    },
    onClose() {
      this.$emit('update:visible', false)
      this.$emit('update:record', {})
      this.form.resetFields()
    }
  },
  watch: {
    visible(value) {
      if (value && this.payMethodList.length === 0) {
        this.getPayMethodList()
      }
    }
  }
}
</script>