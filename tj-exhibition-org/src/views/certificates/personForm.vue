<template>
  <a-modal
    :maskClosable="false"
    :title="isAdd ? '添加人证' : '编辑人证'"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    :width="520"
    @cancel="handleCancel"
  >
    <a-form :form="form" v-bind="formItemLayout">
      <!-- :read="isAdd" 读取身份证信息 -->
      <UploadAvatar
        :read="true"
        label="身份证（国徽面）"
        fieldName="idPositiveUrlList"
        rulesMessage="请上传身份证（国徽面）"
        ref="positiveCard"
        @callback="handleReadCard"
        :class="{ 'upload-pointer-events': isAdd === false }"
        :type="1"
        :width="200"
      />
      <UploadAvatar
        label="身份证（人像面）"
        fieldName="idNegativeUrlList"
        rulesMessage="请上传身份证（人像面）"
        ref="negativeCard"
        :class="{ 'upload-pointer-events': isAdd === false }"
        :type="0"
        :width="200"
      />
      <UploadAvatar
        label="头像上传"
        fieldName="headPortraitList"
        rulesMessage="请上传头像"
        ref="avatar"
        :class="{ 'upload-pointer-events': isAdd === false }"
        :type="2"
      />
      <a-form-item label="姓名">
        <a-input
          v-decorator="[
            'personName',
            {
              rules: [
                { required: true, message: '请输入姓名' },
                { min: 2, max: 20, message: '姓名不能小于2位,不能大于20位' }
              ],
              getValueFromEvent: event => {
                return event.target.value.replace(/\s+/g, '');
              }
            }
          ]"
          placeholder="请输入姓名"
          allowClear
        ></a-input>
      </a-form-item>
      <a-form-item label="性别">
        <a-select
          v-decorator="[
            'personSex',
            { rules: [{ required: true, message: '请选择性别' }] }
          ]"
          placeholder="请选择性别"
          allowClear
        >
          <a-select-option :value="0">男</a-select-option>
          <a-select-option :value="1">女</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="籍贯">
        <a-input
          v-decorator="[
            'nativePlace',
            {
              rules: [
                { required: true, message: '请输入籍贯' },
                { min: 2, max: 20, message: '籍贯不能小于2位,不能大于20位' }
              ],
              getValueFromEvent: event => {
                return event.target.value.replace(/\s+/g, '');
              }
            }
          ]"
          placeholder="请输入籍贯"
          allowClear
        ></a-input>
      </a-form-item>
      <a-form-item label="手机号">
        <a-input
          v-decorator="[
            'mobilePhone',
            {
              rules: [
                {
                  required: false,
                  message: '请输入手机号'
                },
                {
                  pattern: /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,
                  message: '请输入正确手机号'
                }
              ]
            }
          ]"
          placeholder="请输入手机号"
          allowClear
        ></a-input>
      </a-form-item>
      <a-form-item label="身份证号">
        <a-input
          v-decorator="[
            'idcard',
            {
              rules: [
                {
                  required: true,
                  message: '请输入身份证号'
                },
                {
                  pattern: /(^\d{15}$)|(^\d{17}([0-9]|X)$)/,
                  message: '请输入正确身份证号'
                }
              ]
            }
          ]"
          placeholder="请输入身份证号"
          allowClear
        ></a-input>
      </a-form-item>
      <!-- <a-form-item label="参展商">
        <a-select
          show-search
          v-decorator="['expoExhibitorsId']"
          placeholder="请选择参展商" allowClear
          :filter-option="filterOption"
        >
          <a-select-option
            v-for="exhibitor in exhibitorsList"
            :key="exhibitor.id"
            :value="exhibitor.id"
          >
            {{exhibitor.exhibitors002}}
          </a-select-option>
        </a-select>
      </a-form-item> -->
      <a-form-item label="工种">
        <a-select
          v-decorator="[
            'jobLevel',
            { rules: [{ required: true, message: '请选择工种' }] }
          ]"
          placeholder="请选择工种"
          allowClear
        >
          <a-select-option
            v-for="jobLevel in jobLevelList"
            :key="jobLevel.id"
            :value="jobLevel.id"
          >
            {{ jobLevel.detailsNameCn }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="资格证有效期">
        <a-date-picker
          v-decorator="[
            'qualificationsExpiryDate',
            {
              rules: [
                { type: 'object', required: true, message: '请选择证件有效期' }
              ]
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="备注">
        <a-textarea
          v-decorator="['certificatesRemarks']"
          placeholder="备注"
          :rows="2"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { regCId } from '@/utils/validate'
import UploadAvatar from '@/components/UploadAvatar'
import {
  exhibitorsListAll,
  jobLevel,
  personCertificateAdd,
  personCertificateEdit
} from '@/api'
import { getLocalInfo } from '@/utils'
import { urlStringify, handleFileList } from '@/utils/fileData'
import axios from 'axios'
import moment from 'moment'

export default {
  components: {
    UploadAvatar
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    record: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      regCId,
      noIdCard: false,
      noMobilePhone: false,
      confirmLoading: false,
      exhibitorsList: [],
      jobLevelList: [],
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      },
      form: this.$form.createForm(this)
    }
  },
  computed: {
    edit() {
      return this.visible && !this.isAdd
    }
  },
  created() {
    this.getExhibitorsList()
    this.getJobLevel()
  },
  methods: {
    getParams(values) {
      const localInfo = getLocalInfo()
      const {
        qualificationsExpiryDate,
        headPortraitList,
        idPositiveUrlList,
        idNegativeUrlList,
        ...validValue
      } = values
      const positiveUrl = urlStringify(idPositiveUrlList.slice(-1), true) // 第二个参数 需要合并后再解析
      const negativeUrl = urlStringify(idNegativeUrlList.slice(-1), true)
      const headPortrait = urlStringify(headPortraitList.slice(-1))
      const idcardUrl = JSON.stringify([...positiveUrl, ...negativeUrl]) // 正面在前、反面在后
      const params = {
        showId: localInfo.showId,
        dataCategory: '0',
        dataCategoryId: localInfo.userId, // 搭建商id
        orderTypr: '0', // 人证0
        idcardUrl,
        headPortrait,
        qualificationsExpiryDate: qualificationsExpiryDate.format(
          'YYYY-MM-DD HH:mm:ss'
        ),
        ...validValue
      }
      return params
    },
    handleOk(e) {
      this.form.validateFields((err, values) => {
        if (err) return
        if (this.isAdd) {
          // 添加
          const params = this.getParams(values)
          // eslint-disable-next-line no-unused-expressions
          this.noIdCard ? delete params.idcard : ''
          // eslint-disable-next-line no-unused-expressions
          this.noMobilePhone ? delete params.mobilePhone : ''
          this.handleOperateRequest(personCertificateAdd, params)
        } else {
          // 编辑
          const params = this.getParams(values)
          // eslint-disable-next-line no-unused-expressions
          this.noIdCard ? delete params.idcard : ''
          // eslint-disable-next-line no-unused-expressions
          this.noMobilePhone ? delete params.mobilePhone : ''
          this.handleOperateRequest(personCertificateEdit, {
            id: this.record.key,
            certificatesPersonId: this.certificatesPersonId,
            ...params
          })
        }
      })
    },
    async handleOperateRequest(requestFn, params) {
      try {
        this.confirmLoading = true
        const result = await requestFn(params)
        this.confirmLoading = false
        const { message } = result
        this.$emit('refresh')
        this.handleCancel()
        this.$message.success(message)
      } catch (error) {
        console.log(error)
        this.confirmLoading = false
      }
    },
    handleCancel(e) {
      this.form.resetFields()
      this.$emit('update:visible', false)
      this.$refs.positiveCard.imageUrl = ''
      this.$refs.negativeCard.imageUrl = ''
      this.$refs.avatar.imageUrl = ''
    },
    async getExhibitorsList() {
      const localInfo = getLocalInfo()
      const params = {
        homeCourtId: localInfo.userId,
        exhibitors000: localInfo.showId
      }
      try {
        const result = await exhibitorsListAll(params)
        const { code, data } = result
        if (code === 1000) {
          this.exhibitorsList = data
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getJobLevel() {
      try {
        const result = await jobLevel({ dictionaryTypeId: '4' })
        const { code, data } = result
        if (code === 1000) {
          this.jobLevelList = data
        }
      } catch (error) {
        console.log(error)
      }
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    setValue() {
      const {
        id,
        certificatesPersonId,
        personName,
        personSex,
        nativePlace,
        mobilePhone,
        idcard,
        jobLevel,
        qualificationsExpiryDate,
        idcardUrl,
        headPortrait,
        certificatesRemarks
      } = this.record
      // 编辑赋值
      const idPositiveUrlList = [handleFileList(idcardUrl)[0]]
      const idNegativeUrlList = [handleFileList(idcardUrl)[1]]
      const headPortraitList = handleFileList(headPortrait)
      const momemtDate = moment(qualificationsExpiryDate, 'YYYY-MM-DD')

      this.recordId = id
      this.certificatesPersonId = certificatesPersonId

      this.timer = setTimeout(() => {
        this.form.setFieldsValue({
          personName,
          personSex,
          nativePlace,
          mobilePhone,
          idcard,
          // expoExhibitorsId,
          jobLevel: Number(jobLevel),
          qualificationsExpiryDate: momemtDate,
          idPositiveUrlList,
          idNegativeUrlList,
          headPortraitList,
          certificatesRemarks
        })
        this.$refs.positiveCard.imageUrl = idPositiveUrlList[0].url
        this.$refs.negativeCard.imageUrl = idNegativeUrlList[0].url
        this.$refs.avatar.imageUrl = headPortraitList[0].url
      }, 50)
    },
    handleReadCard(Base64Url) {
      let exhInfo = JSON.parse(localStorage.getItem('currentExhibition'))
      let formData = new FormData()
      formData.append('UserName', 'qiuwenyan@eastfair.com')
      formData.append('UserPwd', 'lkj13*ksjd$kjkj')
      formData.append('ProjectType', '证件申请')
      formData.append('Project', '天津国展-主场')
      formData.append('FileName', '身份证图片')
      formData.append('ExhID', exhInfo.id)
      formData.append('Base64Img', Base64Url)
      formData.append('Positive', '0')
      axios
        .post(
          'https://ai.exporegist.com/recv3/Api/Card/ReadIDCardBase64',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        .then(res => {
          const data = res.data
          if (data.status === 'OK') {
            this.form.setFieldsValue({
              personName: data.Name,
              personSex: data.Sex === '男' ? 0 : 1,
              // nativePlace: data.Address,
              idcard: data.IDCardNo
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  watch: {
    edit(value) {
      if (value) {
        this.setValue()
      }
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="less" scoped>
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
