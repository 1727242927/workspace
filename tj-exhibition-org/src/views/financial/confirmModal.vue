<template>
  <a-drawer
    title="添加"
    :width="720"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose"
  >
    <a-form
      :form="form"
      layout="vertical"
    >
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
      </a-row>
      <a-row :gutter="16">
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
      </a-row>
      <a-row :gutter="16">
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
        <!-- <a-col :span="12">
          <a-form-item label="付款类型">
            <a-select
              v-decorator="[
                'paytype',
                {
                  rules: [{ required:true, message: '请选择付款类型' }]
                }
              ]"
              style="width: 100%"
              placeholder="请选择付款类型"
            >
              <a-select-option value="0">展费</a-select-option>
              <a-select-option value="1">押金</a-select-option>
            </a-select>
          </a-form-item>
        </a-col> -->
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
        textAlign: 'left',
        zIndex: 1
      }"
    >
      <a-button :style="{ marginRight: '12px' }" @click="onClose">
        取消
      </a-button>
      <a-button type="primary" @click="onSave" :loading="saveLoading">
        保存
      </a-button>
    </div>
  </a-drawer>
</template>

<script>
import { jobLevel, financialAdd } from '@/api'
import { getLocalStorageItem } from '@/utils'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isAdd: {
      type: Boolean,
      default: true
    }
  },
  created() {
    this.getPayMethodList()
  },
  data() {
    return {
      payMethodList: [],
      saveLoading: false,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    onSave() {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          values.state08 = values.state08.format('YYYY-MM-DD HH:mm:ss')
          this.financialAdd(values)
        }
      })
    },
    financialAdd(values) {
      const showId = getLocalStorageItem('currentExhibition')
      const state06 = this.$route.query.orderId
      const params = {
        showId: showId.id,
        state06,
        ...values
      }
      this.saveLoading = true
      financialAdd(params).then(res => {
        const { message } = res
        this.saveLoading = false
        this.onClose()
        this.$emit('refreshList')
        this.$emit('refreshBase')
        this.$message.success(message)
      }).catch(err => {
        console.log(err)
        this.saveLoading = false
      })
    },
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
    showDrawer() {
      this.$emit('update:visible', true)
    },
    onClose() {
      this.$emit('update:visible', false)
      this.form.resetFields()
    }
  }
}
</script>
