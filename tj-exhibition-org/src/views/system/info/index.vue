<template>
  <div class="system-user">
    <Title>用户信息</Title>
    <div class="system-user-info">
      <a-form v-bind="formItemLayout" :form="form" @submit="handleSubmit">
        <a-form-item label="用户名">
          <a-input
            v-decorator="[
              'userName',
              { rules: [{ required: true, message: '请输入用户名！' }] }
            ]"
            placeholder="请输入用户名"
            disabled
          />
        </a-form-item>
        <a-form-item label="主体类型">
          <a-select
            v-decorator="[
              'companyType',
              { rules: [{ required: true, message: '请选择主题类型！' }] }
            ]"
            placeholder="请选择主题类型"
            disabled
          >
            <a-select-option value="1">主场</a-select-option>
            <a-select-option value="2">搭建商</a-select-option>
            <a-select-option value="3">主运</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="公司名">
          <a-input
            v-decorator="[
              'companyCn',
              {
                rules: [
                  { required: true, message: '请输入公司名称！' },
                  { min: 6, message: '公司名称不能小于6位' },
                  { max: 25, message: '公司名称不能大于25位' }
                ],
                getValueFromEvent: (event) => {
                  return event.target.value.replace(/(^\s*)|(\s*$)/g, '')
                }
              }
            ]"
            placeholder="请输入公司名称"
          />
        </a-form-item>
        <a-form-item label="公司地址">
          <a-input
            v-decorator="[
              'companyAddCn',
              { rules: [{ required: true, message: '请输入公司地址！' }],
                getValueFromEvent: (event) => {
                  return event.target.value.replace(/(^\s*)|(\s*$)/g, '')
                }
              }
            ]"
            placeholder="请输入公司地址"
          />
        </a-form-item>
        <a-form-item label="社会统一码">
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
                getValueFromEvent: (event) => {
                  return event.target.value.toUpperCase();
                }
              }
            ]"
            placeholder="请输入社会统一码"
          />
        </a-form-item>
        <a-form-item label="公司电话">
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
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="系统负责人姓名">
           <a-input
            v-decorator="[
              'contactsName',
              { rules: [{ required: true, message: '请输入系统负责人姓名！' },{ min: 2, message: '法人姓名不能小于2位' }],
                getValueFromEvent: (event) => {
                  return event.target.value.replace(/(^\s*)|(\s*$)/g, '')
                }
              }
            ]"
            placeholder="请输入系统负责人姓名"
          />
        </a-form-item>
        <a-form-item label="手机号">
          <a-input
            v-decorator="[
              'contactsMobile',
              { rules: $rules.mobileRules,getValueFromEvent: (event) => {
                if(Number(event.target.value)){
                  return event.target.value
                }else{
                  return event.target.value.substring(0,event.target.value.length - 1)
                }

                } }
            ]"
            placeholder="请输入手机号"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="固定电话">
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
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="E-mail">
          <a-input
            v-decorator="[
              'contactsEmail',
              {
                rules: [
                  {
                    type: 'email',
                    message: '邮箱格式不正确！',
                  },
                  {
                    required: true,
                    message: '请输入您的邮箱！',
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
          ref="contactsIdPositive"
          :type="1"
          :width="200"
        />
        <UploadAvatar
          label="系统负责人身份证（人像面）"
          fieldName="contactsIdNegativeUrlList"
          rulesMessage="请上传系统负责人身份证（人像面）"
          ref="contactsIdNegative"
          :type="0"
          :width="200"
        />
        <a-form-item label="法人姓名">
          <a-input
            v-decorator="[
              'legalName',
              { rules: [{ required: true, message: '请输入法人姓名！' },{ min: 2, message: '法人姓名不能小于2位' }],
                getValueFromEvent: (event) => {
                  return event.target.value.replace(/(^\s*)|(\s*$)/g, '')
                }
              }
            ]"
            placeholder="请输入法人姓名"
          />
        </a-form-item>
        <a-form-item label="法人手机号">
          <a-input
            v-decorator="[
              'legalMobile',
              { rules: $rules.mobileRules,getValueFromEvent: (event) => {
                if(Number(event.target.value)){
                  return event.target.value
                }else{
                  return event.target.value.substring(0,event.target.value.length - 1)
                }
                } }
            ]"
            placeholder="请输入法人手机号"
            style="width: 100%"
          />
        </a-form-item>
        <UploadAvatar
          label="法人身份证（国徽面）"
          fieldName="legalIdPositiveUrlList"
          rulesMessage="请上传法人身份证（国徽面）"
          ref="legalIdPositive"
          :type="1"
          :width="200"
        />
        <UploadAvatar
          label="法人身份证（人像面）"
          fieldName="legalIdNegativeUrlList"
          rulesMessage="请上传法人身份证（人像面）"
          ref="legalIdNegative"
          :type="0"
          :width="200"
        />
        <a-form-item label="发票邮寄地址（用于发票）">
          <a-input
            v-decorator="[
              'companyMailing',
              { rules: [{ required: true, message: '请输入发票邮寄地址！' }],
                getValueFromEvent: (event) => {
                  return event.target.value.replace(/(^\s*)|(\s*$)/g, '')
                }
              }
            ]"
            placeholder="请输入发票邮寄地址"
          />
        </a-form-item>
        <a-form-item label="企业类别（用于发票）">
          <a-select
            v-decorator="[
              'invoiceEnterpriseType',
              { rules: [{ required: true, message: '请选择企业类别！' }] }
            ]"
            placeholder="请选择企业类别"
          >
            <a-select-option value="0">一般纳税人</a-select-option>
            <a-select-option value="1">小规模纳税人</a-select-option>
            <!-- <a-select-option value="2">非增值税纳税人</a-select-option> -->
          </a-select>
        </a-form-item>
        <a-form-item label="开户银行名称（用于发票）">
          <a-input
            v-decorator="[
              'invoiceBankName',
              { rules: [{ required: true, message: '请输入开户银行名称！' }],
                getValueFromEvent: (event) => {
                  return event.target.value.replace(/(^\s*)|(\s*$)/g, '')
                }
              }
            ]"
            placeholder="请输入开户银行名称"
          />
        </a-form-item>
        <a-form-item label="开户银行账号（用于发票）">
          <a-input
            v-decorator="[
              'invoiceBankCardNumber',
              { rules: [{ required: true, message: '请输入开户银行账号！' }] }
            ]"
            placeholder="请输入开户银行账号"
            style="width:100%"
          />
        </a-form-item>
        <UploadAvatar
          label="营业执照"
          fieldName="businessLicenseField"
          rulesMessage="请上传营业执照"
          ref="businessLicense"
          :type="3"
        />
        <a-form-item v-bind="tailFormItemLayout">
          <a-button type="primary" html-type="submit" :loading="btnLoading">保存</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import Title from '@/components/Title'
import UploadAvatar from '@/components/UploadAvatar'
import { getLocalStorageItem } from '@/utils'
import { handleFileList, urlStringify } from '@/utils/fileData'
import { registerInfo, registerUpdate } from '@/api'

export default {
  components: {
    Title,
    UploadAvatar
  },
  data() {
    return {
      btnLoading: false,
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
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
            offset: 8
          }
        }
      },
      form: this.$form.createForm(this)
    }
  },
  mounted() {
    this.getRegisterInfo()
  },
  methods: {
    async getRegisterInfo() {
      const userInfo = getLocalStorageItem('userInfo')
      const params = {
        id: userInfo.id
      }
      try {
        const result = await registerInfo(params)
        const { code, data } = result
        if (code === 1000) {
          this.setFieldsValue(data)
        }
      } catch (error) {
        console.log(error)
      }
    },
    setFieldsValue(data) {
      const { contactsIdcard, legalIdcard, businessLicense, userName, companyType, companyCn, companyAddCn, companyCode, companyTel, contactsName, contactsMobile, contactsTel, contactsEmail, legalName, legalMobile, companyMailing, invoiceEnterpriseType, invoiceBankName, invoiceBankCardNumber } = data
      const contactsIdPositiveUrlList = [handleFileList(contactsIdcard)[0]]
      const contactsIdNegativeUrlList = [handleFileList(contactsIdcard)[1]]
      const legalIdPositiveUrlList = [handleFileList(legalIdcard)[0]]
      const legalIdNegativeUrlList = [handleFileList(legalIdcard)[1]]
      const businessLicenseField = handleFileList(businessLicense)
      this.form.setFieldsValue({
        userName,
        companyType: String(companyType),
        companyCn,
        companyAddCn,
        companyCode,
        companyTel,
        contactsName,
        contactsMobile,
        contactsTel,
        contactsEmail,
        legalName,
        legalMobile,
        companyMailing,
        invoiceEnterpriseType,
        invoiceBankName,
        invoiceBankCardNumber,
        contactsIdPositiveUrlList,
        contactsIdNegativeUrlList,
        legalIdPositiveUrlList,
        legalIdNegativeUrlList,
        businessLicenseField
      })
      this.$refs.contactsIdPositive.imageUrl = contactsIdPositiveUrlList[0].url
      this.$refs.contactsIdNegative.imageUrl = contactsIdNegativeUrlList[0].url
      this.$refs.legalIdPositive.imageUrl = legalIdPositiveUrlList[0].url
      this.$refs.legalIdNegative.imageUrl = legalIdNegativeUrlList[0].url
      this.$refs.businessLicense.imageUrl = businessLicenseField[0].url
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const { businessLicenseField, contactsIdPositiveUrlList, contactsIdNegativeUrlList, legalIdPositiveUrlList, legalIdNegativeUrlList, ...restValues } = values

          const contactsPositiveUrl = urlStringify(contactsIdPositiveUrlList.slice(-1), true)
          const contactsNegativeUrl = urlStringify(contactsIdNegativeUrlList.slice(-1), true)
          const contactsIdcard = JSON.stringify([...contactsPositiveUrl, ...contactsNegativeUrl])

          const legalPositiveUrl = urlStringify(legalIdPositiveUrlList.slice(-1), true)
          const legalNegativeUrl = urlStringify(legalIdNegativeUrlList.slice(-1), true)
          const legalIdcard = JSON.stringify([...legalPositiveUrl, ...legalNegativeUrl])

          const businessLicense = urlStringify(businessLicenseField.slice(-1))

          restValues.businessLicense = businessLicense
          restValues.contactsIdcard = contactsIdcard
          restValues.legalIdcard = legalIdcard
          this.updateUserInfo(restValues)
        }
      })
    },
    updateUserInfo(value) {
      this.btnLoading = true
      registerUpdate(value).then(res => {
        this.btnLoading = false
        const { message } = res
        this.$message.success(message)
      }).catch(err => {
        console.log(err)
        this.btnLoading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.system-user{
  .system-user-info {
    margin-top: 30px;
    padding-left: 100px;
    max-width: 700px;
  }
}
</style>
