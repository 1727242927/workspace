<template>
  <a-drawer
    :width="620"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose"
  >
    <Title slot="title" style="margin-bottom: 0">添加子账户</Title>
    <a-form
      layout="horizontal"
      :form="form"
      v-bind="formItemLayout"
    >
      <a-form-item label="姓名">
        <a-input
          v-decorator="[
            'contactName',
            {
              rules: [
                { required: true, message: '请输入姓名！' },
                { min: 2, message: '公司名称不能小于2位' },
                { max: 10, message: '公司名称不能大于10位' }
              ],
              getValueFromEvent: (event) => {
                return event.target.value.replace(/(^\s*)|(\s*$)/g, '')
              }
            }
          ]"
          placeholder="请输入姓名"
        />
      </a-form-item>
      <a-form-item label="部门">
        <a-input
          v-decorator="[
            'department',
            {
              rules: [
                { required: true, message: '请输入部门！' },
                { min: 2, message: '部门名称不能小于2位' },
                { max: 10, message: '部门名称不能大于10位' }
              ],
              getValueFromEvent: (event) => {
                return event.target.value.replace(/(^\s*)|(\s*$)/g, '')
              }
            }
          ]"
          placeholder="请输入部门"
        />
      </a-form-item>
      <a-form-item label="手机号">
        <a-input
          v-decorator="[
            'contactPhone',
            {
              rules: [
                { required: true, message: '请输入手机号！' },
                { pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确' }
              ],
              getValueFromEvent: (event) => {
                return event.target.value.replace(/(^\s*)|(\s*$)/g, '')
              }
            }
          ]"
          placeholder="请输入手机号"
        />
      </a-form-item>
      <a-form-item label="账号">
        <a-input
          v-decorator="[
            'userName',
            {
              rules: [
                { required: true, message: '请输入账号！' },
                { min: 6, message: '账号名称不能小于6位' },
                { max: 20, message: '账号名称不能大于20位' }
              ],
              getValueFromEvent: (event) => {
                return event.target.value.replace(/(^\s*)|(\s*$)/g, '')
              }
            }
          ]"
          placeholder="请输入账号"
          autocomplete="off"
          @blur.native="userNameFunc"
        />
      </a-form-item>
      <a-form-item label="密码">
        <a-input
          v-decorator="[
            'password',
            {
              rules: [
                { required: true,validator: validatePass, },

              ],
              getValueFromEvent: (event) => {
                return event.target.value.replace(/(^\s*)|(\s*$)/g, '')
              }
            }
          ]"
          placeholder="请输入密码"
          type="password"
          autocomplete="off"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="确认密码">
        <a-input
          v-decorator="[
            'confirmPassword',
            {
              rules: [
                { required: true, message: '请输入确认密码！' },
                { min: 6, message: '密码名称不能小于6位' },
                { max: 20, message: '密码名称不能大于20位' },
                { validator: compareToFirstPassword }
              ],
              getValueFromEvent: (event) => {
                return event.target.value.replace(/(^\s*)|(\s*$)/g, '')
              }
            }
          ]"
          placeholder="请输入确认密码"
          type="password"
        />
      </a-form-item>
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
      <a-button type="primary" :loading="loading" @click="handleSubmit">提交</a-button>
    </div>
  </a-drawer>
</template>

<script>
import Title from '@/components/Title'
import { clildUserAdd, validateUserName } from '@/api'

export default {
  components: {
    Title
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        }
      },
      form: this.$form.createForm(this, { name: 'form' })
    }
  },
  methods: {
    // 名称唯一验证
    userNameFunc(e) {
      const userName = e.target.value
      if (!userName) {
        return
      }
      validateUserName({ userName }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    },
    // 密码与账号不相同
    validatePass(rule, value, callback) {
      const pattern = /^(?=.*[0-9])(?=.*[a-zA-Z])(.{6,20})$/
      let userName = this.form.getFieldValue('userName')
      if (value === '') {
        callback(new Error('请输入密码!'))
      } else if (!pattern.test(value)) {
        callback(new Error('密码长度为6-20个字符、包含字母和数字，字母区分大小写'))
      } else if (value === userName) {
        callback(new Error('密码不能与账号相同'))
      } else {
        callback()
      }
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.loading = true
          clildUserAdd(values).then(res => {
            this.loading = false
            this.onClose()
            this.$emit('refresh')
          })
        }
      })
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('password')) {
        /* eslint-disable standard/no-callback-literal */
        callback('您输入的两个密码不一致！')
      } else {
        callback()
      }
    },
    onClose() {
      this.form.resetFields()
      this.$emit('update:visible', false)
    }
  }
}
</script>
