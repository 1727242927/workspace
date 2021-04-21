<template>
  <div class="register-wrapper">
    <div class="rigister">
      <h1>天津国展-注册</h1>
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item v-bind="formItemLayout" label="主体类型">
          <a-select
            disabled
            default-value="1"
            v-decorator="[
              'companyType',
              {
                rules: [{ required: true, message: '请选择主体类型！' }],
                initialValue: '1'
              }
            ]"
            placeholder="请选择主体类型"
          >
            <a-select-option value="1">主场</a-select-option>
            <a-select-option value="2">搭建商</a-select-option>
            <a-select-option value="3">主运</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="公司名称">
          <a-input
            v-decorator="[
              'companyCn',
              {
                rules: [
                  { required: true, message: '请输入公司名称！' },
                  { min: 6, message: '公司名称不能小于6位' },
                  { max: 25, message: '公司名称不能大于25位' }
                ],
                getValueFromEvent: event => {
                  return event.target.value.replace(/(^\s*)|(\s*$)/g, '');
                }
              }
            ]"
            placeholder="请输入公司名称"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="公司地址">
          <a-input
            v-decorator="[
              'companyAddCn',
              {
                rules: [{ required: true, message: '请输入公司地址!' }],
                getValueFromEvent: event => {
                  return event.target.value.replace(/(^\s*)|(\s*$)/g, '');
                }
              }
            ]"
            placeholder="请输入公司地址"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="社会统一码">
          <a-input
            :maxLength="18"
            v-decorator="[
              'companyCode',
              {
                rules: [
                  { required: true, message: '请输入社会统一码！' },
                  {
                    pattern: /^[A-Z0-9]{18}$/,
                    message: '社会统一码由大写英文字母或18位数字组成'
                  }
                ],
                getValueFromEvent: event => {
                  return event.target.value.toUpperCase();
                }
              }
            ]"
            @blur.native="companyCodeFunc"
            placeholder="请输入社会统一码"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="公司电话">
          <a-input
            v-decorator="[
              'companyTel',
              {
                rules: [
                  { required: true, message: '请输入公司电话！' },
                  {
                    pattern: /^0\d{2,3}-[1-9]\d{6,7}$/,
                    message: '正确格式:0XXX-XXXXXXXX 或 0XX-XXXXXXXX'
                  }
                ],
                getValueFromEvent: event => {
                  return event.target.value.replace(/(^\s*)|(\s*$)/g, '');
                }
              }
            ]"
            :maxLength="13"
            placeholder="请输入公司电话"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="系统负责人姓名">
          <a-input
            v-decorator="[
              'contactsName',
              {
                rules: [
                  { required: true, message: '请输入系统负责人姓名！' },
                  { min: 2, message: '系统负责人姓名不能小于2位' }
                ],
                getValueFromEvent: event => {
                  return event.target.value.replace(/(^\s*)|(\s*$)/g, '');
                }
              }
            ]"
            placeholder="请输入系统负责人姓名"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="手机号">
          <a-input
            v-decorator="[
              'contactsMobile',
              {
                rules: $rules.mobileRules,
                getValueFromEvent: event => {
                  if (Number(event.target.value)) {
                    return event.target.value;
                  } else {
                    return event.target.value.substring(
                      0,
                      event.target.value.length - 1
                    );
                  }
                }
              }
            ]"
            placeholder="请输入手机号"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="固定电话">
          <a-input
            v-decorator="[
              'contactsTel',
              {
                rules: [
                  { required: true, message: '请输入固定电话！' },
                  {
                    pattern: /^0\d{2,3}-[1-9]\d{6,7}$/,
                    message: '正确格式:0XXX-XXXXXXXX 或 0XX-XXXXXXXX'
                  }
                ],
                getValueFromEvent: event => {
                  return event.target.value.replace(/(^\s*)|(\s*$)/g, '');
                }
              }
            ]"
            :maxLength="13"
            placeholder="请输入固定电话"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="E-mail">
          <a-input
            v-decorator="[
              'contactsEmail',
              {
                rules: [
                  {
                    type: 'email',
                    message: '邮箱格式不正确！'
                  },
                  {
                    required: true,
                    message: '请输入您的邮箱！'
                  }
                ]
              }
            ]"
            placeholder="请输入邮箱地址"
          />
        </a-form-item>
        <UploadAvatar
          label="系统负责人身份证（国徽面）"
          fieldName="contactsIdPositiveUrlList"
          rulesMessage="请上传系统负责人身份证（国徽面）"
          :type="1"
          :width="200"
          :formItemLayout="formItemLayout"
        />
        <UploadAvatar
          label="系统负责人身份证（人像面）"
          fieldName="contactsIdNegativeUrlList"
          rulesMessage="请上传系统负责人身份证（人像面）"
          :type="0"
          :width="200"
          :formItemLayout="formItemLayout"
        />
        <a-form-item v-bind="formItemLayout" label="法人姓名">
          <a-input
            v-decorator="[
              'legalName',
              {
                rules: [
                  { required: true, message: '请输入法人姓名！' },
                  { min: 2, message: '法人姓名不能小于2位' }
                ],
                getValueFromEvent: event => {
                  return event.target.value.replace(/(^\s*)|(\s*$)/g, '');
                }
              }
            ]"
            placeholder="请输入法人姓名"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="法人手机号">
          <a-input
            v-decorator="[
              'legalMobile',
              {
                rules: $rules.mobileRules,
                getValueFromEvent: event => {
                  if (Number(event.target.value)) {
                    return event.target.value;
                  } else {
                    return event.target.value.substring(
                      0,
                      event.target.value.length - 1
                    );
                  }
                }
              }
            ]"
            placeholder="请输入法人手机号"
            style="width: 100%"
          />
        </a-form-item>
        <UploadAvatar
          label="法人身份证（国徽面）"
          fieldName="legalIdPositiveUrlList"
          rulesMessage="请上传法人身份证（国徽面）"
          :type="1"
          :width="200"
          :formItemLayout="formItemLayout"
        />
        <UploadAvatar
          label="法人身份证（人像面）"
          fieldName="legalIdNegativeUrlList"
          rulesMessage="请上传法人身份证（人像面）"
          :type="0"
          :width="200"
          :formItemLayout="formItemLayout"
        />
        <a-form-item v-bind="formItemLayout" label="发票邮寄地址（用于发票）">
          <a-input
            v-decorator="[
              'companyMailing',
              {
                rules: [{ required: true, message: '请输入发票邮寄地址！' }],
                getValueFromEvent: event => {
                  return event.target.value.replace(/(^\s*)|(\s*$)/g, '');
                }
              }
            ]"
            placeholder="请输入发票邮寄地址"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="企业类别（用于发票）">
          <a-select
            v-decorator="[
              'invoiceEnterpriseType',
              { rules: [{ required: true, message: '请选择企业类别！' }] }
            ]"
            placeholder="请选择企业类别"
          >
            <a-select-option value="0">一般纳税人</a-select-option>
            <a-select-option value="1">小规模纳税人</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="开户银行名称（用于发票）">
          <a-input
            v-decorator="[
              'invoiceBankName',
              {
                rules: [{ required: true, message: '请输入开户银行名称！' }],
                getValueFromEvent: event => {
                  return event.target.value.replace(/(^\s*)|(\s*$)/g, '');
                }
              }
            ]"
            placeholder="请输入开户银行名称"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="开户银行账号（用于发票）">
          <a-input
            v-decorator="[
              'invoiceBankCardNumber',
              {
                rules: [
                  { required: true, message: '请输入开户银行账号！' },
                  {
                    min: 16,
                    max: 19,
                    message: '用户名必须是16-19位字符',
                    trigger: 'blur'
                  }
                ],
                getValueFromEvent: event => {
                  if (Number(event.target.value)) {
                    return event.target.value;
                  } else {
                    return event.target.value.substring(
                      0,
                      event.target.value.length - 1
                    );
                  }
                }
              }
            ]"
            :maxLength="19"
            placeholder="请输入开户银行账号"
            style="width:100%"
          />
        </a-form-item>
        <UploadAvatar
          label="营业执照"
          fieldName="businessLicenseField"
          rulesMessage="请上传营业执照"
          :type="3"
          :formItemLayout="formItemLayout"
        />
        <a-form-item v-bind="formItemLayout" label="用户名（登录账号）">
          <a-input
            v-decorator="[
              'userName',
              {
                rules: [{ required: true, message: '请输入用户名！' }],
                getValueFromEvent: event => {
                  return event.target.value.replace(/(^\s*)|(\s*$)/g, '');
                }
              }
            ]"
            placeholder="请输入用户名"
            :maxLength="30"
            @change.native="handleChange"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="密码">
          <a-input
            v-decorator="[
              'companyPass',
              {
                rules: [
                  { required: true, message: '请输入密码！' },
                  {
                    pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])(.{8,20})$/,
                    message:
                      '密码长度为8-20个字符、包含字母和数字，字母区分大小写'
                  }
                ],
                getValueFromEvent: event => {
                  return event.target.value.replace(/(^\s*)|(\s*$)/g, '');
                }
              }
            ]"
            placeholder="请输入密码"
            type="password"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="确认密码">
          <a-input
            v-decorator="[
              'companyPassRepeat',
              {
                rules: [
                  { required: true, message: '请输入确认密码！' },
                  { validator: compareToFirstPassword }
                ],
                getValueFromEvent: event => {
                  return event.target.value.replace(/(^\s*)|(\s*$)/g, '');
                }
              }
            ]"
            placeholder="请输入确认密码"
            type="password"
          />
        </a-form-item>
        <a-form-item v-bind="tailFormItemLayout">
          <a-button type="primary" html-type="submit" :loading="btnLoading"
            >注册</a-button
          >
          <a-button @click="goLogin" style="margin-left: 15px"
          >返回登录页</a-button
          >
          <a-button @click="clearForm" style="margin-left: 15px"
          >重置</a-button
          >
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import UploadAvatar from '@/components/UploadAvatar'
import { register, validateUserName, validCompanyCode } from '@/api'
import { urlStringify } from '@/utils/fileData'

export default {
  components: {
    UploadAvatar
  },
  data() {
    return {
      btnLoading: false,
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 17 }
        }
      },
      tailFormItemLayout: {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0
          },
          sm: {
            span: 19,
            offset: 5
          }
        }
      }
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  methods: {
    clearForm() {
      this.form.resetFields()
    },
    goLogin() {
      this.$router.push('/login')
    },
    // 转换大写
    toUpperCase(e) {
      const value = e.target.value.toUpperCase()
      return value
    },
    // 重复校验
    companyCodeFunc(e) {
      const companyCode = e.target.value
      if (!companyCode) {
        return
      }
      validCompanyCode({ companyCode })
        .then(res => {})
        .catch(err => {
          console.log(err)
        })
    },
    handleChange(e) {
      const userName = e.target.value
      if (!userName) {
        return
      }
      validateUserName({ userName })
        .then(res => {})
        .catch(err => {
          this.from.setFieldsValue('userName')
          console.log(err)
        })
    },
    registerSubmit(value1) {
      this.form.validateFieldsAndScroll((err, value) => {
        if (!err) {
          register(value1)
            .then(res => {
              this.$message.success('注册成功！ 1秒后返回登录页')
              this.timer = setTimeout(() => {
                this.$router.back()
              }, 1000)
            })
        }
      })
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const {
            businessLicenseField,
            contactsIdPositiveUrlList,
            contactsIdNegativeUrlList,
            legalIdPositiveUrlList,
            legalIdNegativeUrlList,
            ...restValues
          } = values

          const contactsPositiveUrl = urlStringify(
            contactsIdPositiveUrlList.slice(-1),
            true
          )
          const contactsNegativeUrl = urlStringify(
            contactsIdNegativeUrlList.slice(-1),
            true
          )
          const contactsIdcard = JSON.stringify([
            ...contactsPositiveUrl,
            ...contactsNegativeUrl
          ])

          const legalPositiveUrl = urlStringify(
            legalIdPositiveUrlList.slice(-1),
            true
          )
          const legalNegativeUrl = urlStringify(
            legalIdNegativeUrlList.slice(-1),
            true
          )
          const legalIdcard = JSON.stringify([
            ...legalPositiveUrl,
            ...legalNegativeUrl
          ])

          const businessLicense = urlStringify(businessLicenseField.slice(-1))
          console.log(businessLicense)
          restValues.businessLicense = businessLicense
          restValues.contactsIdcard = contactsIdcard
          restValues.legalIdcard = legalIdcard
          this.registerSubmit(restValues)
        }
      })
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('companyPass')) {
        /* eslint-disable standard/no-callback-literal */
        callback('您输入的两个密码不一致！')
      } else {
        callback()
      }
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }
}
</script>

<style lang="less" scoped>
.register-wrapper {
  width: 100%;
  background: #e4e5e6;
}
.rigister {
  width: 760px;
  margin: 0 auto;
  padding: 10px 50px;
  background: #ffffff;
  h1 {
    text-align: center;
  }
}

@media screen and (max-width: 768px) {
  .rigister {
    width: 100%;
    padding: 10px;
    .ant-btn.ant-btn-primary {
      width: 100%;
    }
  }
}
</style>
