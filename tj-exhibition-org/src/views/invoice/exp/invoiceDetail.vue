<template>
  <a-drawer
    title="开票信息"
    :width="720"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="开票金额（元）">
              <span :style="{fontSize: '20px', fontWeight: 'bold'}">{{totalAmount}}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="开票类型">
              <a-select
                v-decorator="[
                  'invoiceType',
                  {
                    rules: [{ required: true, message: '请选择开票类型' }],
                  },
                ]"
                placeholder="请选择开票类型"
                :getPopupContainer="node => node.parentNode"
              >
                <a-select-option
                  v-for="(status, key) in invoiceType"
                  :key="key"
                  :value="key"
                >
                  {{status}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="公司名称">
              <a-input
                v-decorator="[
                  'invoiceCorporateName',
                  {
                    rules: [{ required: true, message: '请输入公司名称' }],
                  },
                ]"
                placeholder="请输入公司名称"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="税号">
              <a-input
                v-decorator="[
                  'invoiceDutyParagraph',
                  {
                    rules: [{ required: true, message: '请输入税号' }],
                  },
                ]"
                placeholder="请输入税号"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="开户行">
              <a-input
                v-decorator="[
                  'invoiceDepositBank',
                  {
                    rules: [{ required: true, message: '请输入开户行' }],
                  },
                ]"
                placeholder="请输入开户行"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="公司账号">
              <a-input
                v-decorator="[
                  'invoiceAccountNumber',
                  {
                    rules: [{ required: true, message: '请输入公司账号' }],
                  },
                ]"
                placeholder="请输入公司账号"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="公司地址">
              <a-input
                v-decorator="[
                  'invoiceCompanyAddress',
                  {
                    rules: [{ required: true, message: '请输入公司地址' }],
                  },
                ]"
                placeholder="请输入公司地址"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="公司电话">
              <a-input
                v-decorator="[
                  'invoiceCompanyPhone',
                  {
                    rules: [{ required: true, message: '请输入公司电话' }],
                  },
                ]"
                placeholder="请输入公司电话"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="公司邮箱">
              <a-input
                v-decorator="[
                  'invoiceCompanyMailbox',
                  {
                    rules: [{ required: true, message: '请输入公司邮箱' }],
                  },
                ]"
                placeholder="请输入公司邮箱"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="收件地址">
              <a-input
                v-decorator="[
                  'invoiceShippingAddress',
                  {
                    rules: [{ required: true, message: '请输入收件地址' }],
                  },
                ]"
                placeholder="请输入收件地址"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="收件人">
              <a-input
                v-decorator="[
                  'invoiceShippingName',
                  {
                    rules: [{ required: true, message: '请输入收件人' }],
                  },
                ]"
                placeholder="请输入收件人"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系方式">
              <a-input
                v-decorator="[
                  'invoiceContactInformation',
                  {
                    rules: [{ required: true, message: '请输入联系方式' }],
                  },
                ]"
                placeholder="请输入联系方式"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
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
      <a-button :style="{ marginRight: '8px' }" @click="onClose">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { orgInvoiceDetail } from '@/api'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    recordId: {
      type: Number,
      default: null
    },
    invoiceType: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      totalAmount: 0,
      spinning: false,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    getInvoiceDetail() {
      const id = this.recordId
      const params = { id }
      this.spinning = true
      orgInvoiceDetail(params).then(res => {
        const { data } = res
        this.spinning = false
        this.setFormData(data)
      }).catch(err => {
        console.log(err)
        this.spinning = false
      })
    },
    setFormData(data) {
      const { invoiceType, invoiceCorporateName, invoiceDutyParagraph, invoiceDepositBank, invoiceAccountNumber, invoiceCompanyAddress, invoiceCompanyPhone, invoiceCompanyMailbox, invoiceShippingAddress, invoiceShippingName, invoiceContactInformation, invoiceAmount } = data

      this.totalAmount = invoiceAmount
      this.form.setFieldsValue({
        invoiceType,
        invoiceCorporateName,
        invoiceDutyParagraph,
        invoiceDepositBank,
        invoiceAccountNumber,
        invoiceCompanyAddress,
        invoiceCompanyPhone,
        invoiceCompanyMailbox,
        invoiceShippingAddress,
        invoiceShippingName,
        invoiceContactInformation
      })
    },
    onClose() {
      this.form.resetFields()
      this.$emit('update:visible', false)
    }
  },
  watch: {
    visible(value) {
      if (value) {
        this.getInvoiceDetail()
      }
    }
  }
}
</script>