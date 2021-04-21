<template>
  <div class="content">
    <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout">
      <a-form-model-item required label="原始密码" prop="oldPass">
        <a-input v-model="ruleForm.oldPass" type="password" placeholder="请输入原始密码" autocomplete="off" />
      </a-form-model-item>
      <a-form-model-item required label="新密码" prop="newPass">
        <a-input v-model="ruleForm.newPass" type="password" placeholder="请输入新密码" autocomplete="off" />
      </a-form-model-item>
      <a-form-model-item required label="重复新密码" prop="checkPass">
        <a-input v-model="ruleForm.checkPass" type="password" placeholder="请再次输入密码" @keyup.enter="submitForm('ruleForm')" autocomplete="off" />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" :loading="loading" @click="submitForm('ruleForm')">
          提交
        </a-button>
        <a-button style="margin-left: 10px" @click="resetForm('ruleForm')">
          重置
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import { updatePassword } from '@/api'

export default {
  data() {
    let validateOldPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入原始密码'))
      } else {
        callback()
      }
    }
    let validatePass = (rule, value, callback) => {
      const pattern = /^(?=.*[0-9])(?=.*[a-zA-Z])(.{8,20})$/
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (!pattern.test(value)) {
        callback(new Error('密码长度为8-20个字符、包含字母和数字，字母区分大小写'))
      } else if (value === this.ruleForm.oldPass) {
        callback(new Error('新密码和旧密码应保持不同，请重新输入'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.newPass) {
        callback(new Error('两次密码不一致，请重新输入'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      ruleForm: {
        oldPass: '',
        newPass: '',
        checkPass: ''
      },
      rules: {
        oldPass: [{ validator: validateOldPass, trigger: 'change' }],
        newPass: [{ validator: validatePass, trigger: 'change' }],
        checkPass: [{ validator: validatePass2, trigger: 'change' }]
      },
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 }
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updatePassword()
        }
      })
    },
    async updatePassword() {
      try {
        this.loading = true
        const { checkPass, ...params } = this.ruleForm
        const result = await updatePassword(params)
        const { message } = result
        this.loading = false
        this.$message.success(message)
        this.$router.push('/login')
      } catch (error) {
        console.log(error)
        this.loading = false
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.account-wrapper {
  .content {
    width: 50%;
    margin: 0 auto;
  }
}
</style>