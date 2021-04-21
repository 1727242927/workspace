<template>
  <a-drawer
    :visible="visible"
    :width="780"
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose"
  >
    <Title slot="title" style="margin-bottom:0">{{isAdd ? '添加车证' : '编辑车证'}}</Title>
    <a-form :form="form" v-bind="formItemLayout">
      <a-row :gutter="24">
        <a-col :span="12">
          <!-- :read="isAdd" 读取身份证信息 -->
          <UploadAvatar
            label="身份证（国徽面）"
            fieldName="idPositiveUrlList"
            rulesMessage="请上传身份证（国徽面）"
            ref="positiveCard"
            @callback="handleReadCard"
            :type="1"
            :width="200"
          />
        </a-col>
        <a-col :span="12">
          <UploadAvatar
            label="身份证（人像面）"
            fieldName="idNegativeUrlList"
            rulesMessage="请上传身份证（人像面）"
            ref="negativeCard"
            :type="0"
            :width="200"
          />
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <UploadAvatar
            label="驾驶证上传"
            fieldName="driverLicensePhotoList"
            rulesMessage="请上传驾驶证"
            ref="avatar"
            :type="3"
          />
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="姓名">
            <a-input
              v-decorator="[
                'driverName',
                {
                  rules:
                  [
                  { required: true, message: '请输入姓名' },
                  { min: 2,max:20, message: '姓名最小2位,最大20位' }
                  ],
                  getValueFromEvent: (event) => {
                    return event.target.value.replace(/\s+/g, '')
                  }
                }
              ]"
              placeholder="请输入姓名" allowClear></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="性别">
            <a-select
              v-decorator="['gender', { rules: [{ required: true, message: '请选择性别' }] }]"
              placeholder="请选择性别" allowClear
            >
              <a-select-option value="1">男</a-select-option>
              <a-select-option value="2">女</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="身份证号">
            <a-input
              v-decorator="['idCard', { rules: [
                {
                  required: true, message: '请输入身份证号'
                },
                {validator:(f,value,callback)=>{
                  if(value==''){
                    callback()
                  }
                  if (!regCId(value)) {
                      callback('请输入正确的身份证号码');
                  } else {
                      callback();
                  }
                }}
              ] }]"
              placeholder="请输入身份证号" allowClear></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="手机号">
            <a-input
              v-decorator="['driverMobilePhone', { rules: $rules.mobileRules }]"
              placeholder="请输入手机号" allowClear></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="车牌号">
            <a-input
              v-decorator="[
                'licensePlateNumber',
                {
                  rules: [
                    { required: true, message: '请输入车牌号' },
                    { max: 7, message: '车牌号不能大于7位' }
                  ],
                  getValueFromEvent: (event) => {
                    return event.target.value.replace(/\s+/g, '')
                  }
                }
              ]"
              placeholder="请输入车牌号" allowClear></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="车型">
            <a-select
              v-decorator="['vehicleType', { rules: [{ required: true, message: '请选择车型' }] }]"
              placeholder="请选择车型" allowClear
            >
              <a-select-option
                v-for="vehicleType in vehicleTypeList"
                :key="vehicleType.id"
                :value="String(vehicleType.id)"
              >
                {{vehicleType.detailsNameCn}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="货物明细">
            <a-input
              v-decorator="[
                'goodsDetail',
                {
                  rules: [{ required: true, message: '请输入货物明细' }],
                  getValueFromEvent: (event) => {
                    return event.target.value.replace(/\s+/g, '')
                  }
                }
              ]"
              placeholder="请输入货物明细" allowClear></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="申请证件类型">
            <a-select
              v-decorator="['certType', { rules: [{ required: true, message: '请选择申请证件类型' }] }]"
              placeholder="请选择申请证件类型" allowClear
            >
              <a-select-option
                v-for="certType in certTypeList"
                :key="certType.id"
                :value="certType.id"
              >
                {{certType.detailsNameCn}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="证件种类">
            <a-select
              v-decorator="['certCategory', { rules: [{ required: true, message: '请选择证件种类' }] }]"
              placeholder="请选择证件种类"
              allowClear
              @change="certCategoryChange"
            >
              <a-select-option
                v-for="certCategory in certCategoryList"
                :key="certCategory.id"
                :value="certCategory.id"
              >
                {{certCategory.detailsNameCn}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <!-- <a-col :span="12">
          <a-form-item label="参展商">
            <a-select
              show-search
              v-decorator="['exhibitorId', { rules: [{ required: true, message: '请选择参展商' }] }]"
              placeholder="请选择参展商" allowClear
            >
              <a-select-option
                v-for="exhibitor in exhibitorsList"
                :key="exhibitor.id"
                :value="exhibitor.id"
              >
                {{exhibitor.exhibitors002}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col> -->
        <a-col :span="12">
          <a-form-item label="是否需要机力">
            <a-select
              v-decorator="['whetherMechanicalVehicle', { rules: [{ required: true, message: '请选择是否需要机力' }] }]"
              placeholder="请选择是否需要机力" allowClear
            >
              <a-select-option value="0">否</a-select-option>
              <a-select-option value="1">是</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
         <a-col :span="12">
          <a-form-item label="入场日期">
              <a-select
                v-decorator="[
                  'admissionDate',
                  { rules: [{ required: true, message: '请选择入场日期' }] }
                ]"
                placeholder="请选择入场日期"
                @change="admissionDateChange"
              >
                <a-select-option
                  v-for="(item, index) in admissionDateList"
                  :value="item.vehicle02"
                  :key="index"
                >
                  {{item.vehicle02}}
                </a-select-option>
              </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item :wrapperCol="{span:24}" style="margin-left: -25px">
            <a-select
              v-decorator="[
                'admissionTime',
                { rules: [{ required: true, message: '请选择入场时间' }] }
              ]"
              placeholder="请选择入场时间"
              @change="admissionTimeChange"
            >
              <a-select-option
                v-for="(item, index) in admissionTimeList"
                :key="index"
                :value="item.time"
              >
                {{item.time}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col v-if="isAdd" :span="6">
          <a-form-item :wrapperCol="{span: 24}">
            还剩
            <a-tag color="cyan" style="margin: 0 2px">{{vehicle05}}</a-tag>
            名额
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
      <a-button type="primary" :loading="confirmLoading" @click="handleOk">提交</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { regCId } from '@/utils/validate'
import Title from '@/components/Title'
import UploadAvatar from '@/components/UploadAvatar'
import { exhibitorsListAll, jobLevel, carCertificateAdd, carCertificateEdit, carCertificateTime } from '@/api'
import { getLocalInfo } from '@/utils'
import { urlStringify, handleFileList, handleFileList1 } from '@/utils/fileData'
import axios from 'axios'
import moment from 'moment'

const VEHICLE05 = 1000

export default {
  components: {
    Title,
    UploadAvatar
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    record: {
      type: Object,
      default: () => ({})
    },
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      regCId,
      confirmLoading: false,
      exhibitorsList: [],
      certTypeList: [],
      vehicleTypeList: [], // 车型
      certCategoryList: [],
      vehicle01: null, // 证件类型
      admissionDateList: [], // 入场日期
      admissionTimeList: [], // 入场时间段
      vehicle05: VEHICLE05, // 还剩多少名额
      form: this.$form.createForm(this, { name: 'personCertificate' }),
      formItemLayout: {
        labelCol: { span: 9 },
        wrapperCol: { span: 14 }
      },
      vehicleSetupId: ''
    }
  },
  created() {
    this.getExhibitorsList()
    this.getDictionaryType('2', data => {
      // 过滤出货运车证
      this.certTypeList = data.filter(item => item.id === 3)
    })
    this.getDictionaryType('3', data => {
      this.certCategoryList = data
    })
    this.getDictionaryType('8', data => {
      this.vehicleTypeList = data
    })
  },
  computed: {
    edit() {
      return this.visible && !this.isAdd
    }
  },
  methods: {
    handleOk(e) {
      this.form.validateFields((err, values) => {
        if (err) return
        if (this.isAdd) {
          // 添加
          const params = this.getParams(values)
          this.handleOperateRequest(carCertificateAdd, params)
        } else {
          // 编辑
          const params = this.getParams(values)
          this.handleOperateRequest(carCertificateEdit, {
            certVehicleId: this.certVehicleId,
            certRelateId: this.certRelateId,
            ...params
          })
        }
      })
    },
    getParams(values) {
      const localInfo = getLocalInfo()
      const { admissionDate, admissionTime, driverLicensePhotoList, idPositiveUrlList, idNegativeUrlList, idCardPhotoList, ...validValue } = values
      const positiveUrl = urlStringify(idPositiveUrlList.slice(-1), true) // 第二个参数 需要合并后再解析
      const negativeUrl = urlStringify(idNegativeUrlList.slice(-1), true)
      const driverLicensePhoto = urlStringify(driverLicensePhotoList.slice(-1))
      const idCardPhoto = JSON.stringify([...positiveUrl, ...negativeUrl]) // 正面在前、反面在后

      const [startTime, endTime] = admissionTime.split('-')
      const [admissionStartTime] = startTime.split(' : ')
      const [admissionEndTime] = endTime.split(' : ')
      const params = {
        showId: localInfo.showId,
        dataCategoryId: localInfo.userId,
        dataCategory: '1', // 搭建商
        idCardPhoto,
        driverLicensePhoto,
        admissionDate,
        admissionStartTime: admissionStartTime.trim(),
        admissionEndTime: admissionEndTime.trim(),
        vehicle05: this.vehicle05,
        ...validValue,
        vehicleSetupId: this.vehicleSetupId
      }
      return params
    },
    async handleOperateRequest(requestFn, params) {
      try {
        this.confirmLoading = true
        const result = await requestFn(params)
        this.confirmLoading = false
        const { message } = result
        this.$emit('refresh')
        this.onClose()
        this.$message.success(message)
      } catch (error) {
        console.log(error)
        this.confirmLoading = false
      }
    },
    onClose(e) {
      this.form.resetFields()
      this.$emit('update:visible', false)
      this.vehicle05 = VEHICLE05
      this.admissionDateList = []
      this.admissionTimeList = []
      // 清空上传img
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
    async getDictionaryType(type, callback) {
      try {
        const result = await jobLevel({ dictionaryTypeId: type })
        const { code, data } = result
        if (code === 1000) {
          callback(data)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getCarCertificateTime(value, obj) {
      try {
        const localInfo = getLocalInfo()
        const params = {
          showId: localInfo.showId,
          certCategory: value
        }
        const result = await carCertificateTime(params)
        const { code, data } = result
        if (code === 1000) {
          this.admissionDateList = data.map(item => {
            item.expoVehicleSetups.map(expo => {
              expo.time = `${expo.vehicle03} : 00 - ${expo.vehicle04} : 00`
              return expo
            })
            return item
          })
          // 回显设置time option
          if (!this.isAdd && obj) {
            obj.admissionDate && this.admissionDateChange(obj.admissionDate, {}, {})
            obj.time && this.admissionTimeChange(obj.time, {}, {})
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    certCategoryChange(value, {}, obj) {
      // obj 清空已设置的time
      this.getCarCertificateTime(value, obj)
      if (!obj) {
        this.form.setFieldsValue({
          admissionDate: undefined,
          admissionTime: undefined
        })
      }
    },
    admissionDateChange(value, {}, obj) {
      // obj 清空已设置的time
      const admissionDateFilter = this.admissionDateList.filter(item => item.vehicle02 === value)
      this.admissionTimeList = admissionDateFilter[0].expoVehicleSetups
      if (!obj) {
        this.form.setFieldsValue({
          admissionTime: undefined
        })
      }
    },
    admissionTimeChange(value) {
      const admissionTimeFilter = this.admissionTimeList.filter(item => item.time === value)
      this.vehicleSetupId = admissionTimeFilter[0].id
      this.vehicle05 = admissionTimeFilter[0].vehicle05
    },
    setValue() {
      const {
        certRelateId, certVehicleId,
        driverName, gender, idCard,
        driverMobilePhone, licensePlateNumber,
        vehicleType, goodsDetail, certType,
        certCategory, whetherMechanicalVehicle,
        idCardPhoto, admissionDate, driverLicensePhoto,
        admissionStartTime, admissionEndTime
      } = this.record
      let imgArr = JSON.parse(idCardPhoto)
      // 编辑赋值
      const idPositiveUrlList = [handleFileList1(imgArr)[0]]
      const idNegativeUrlList = [handleFileList1(imgArr)[1]]
      const driverLicensePhotoList = handleFileList(driverLicensePhoto)

      this.certRelateId = certRelateId // 每一行的id
      this.certVehicleId = certVehicleId

      // 设置日期
      const time = `${admissionStartTime} : 00 - ${admissionEndTime} : 00`
      this.certCategoryChange(Number(certCategory), {}, {
        admissionDate,
        time
      })
      // carModal.admissionDateChange(admissionDate)
      // carModal.admissionTimeChange(time)

      this.timer = setTimeout(() => {
        this.form.setFieldsValue({
          driverName,
          gender,
          idCard,
          driverMobilePhone,
          licensePlateNumber,
          vehicleType: Number(vehicleType),
          goodsDetail,
          certType: Number(certType),
          certCategory: Number(certCategory),
          whetherMechanicalVehicle,
          admissionDate,
          admissionTime: time,
          idPositiveUrlList,
          idNegativeUrlList,
          driverLicensePhotoList
        })
        this.$refs.positiveCard.imageUrl = idPositiveUrlList[0].url
        this.$refs.negativeCard.imageUrl = idNegativeUrlList[0].url
        this.$refs.avatar.imageUrl = driverLicensePhotoList[0].url
      }, 60)
    },
    handleReadCard(Base64Url) {
      let formData = new FormData()
      formData.append('UserName', 'qiuwenyan@eastfair.com')
      formData.append('UserPwd', 'lkj13*ksjd$kjkj')
      formData.append('ProjectType', '搭建商类型')
      formData.append('Project', '天津国展')
      formData.append('FileName', '图片')
      formData.append('ExhID', 'jz888')
      formData.append('Base64Img', Base64Url)
      formData.append('Positive', '0')
      axios.post('/recv3/Api/Card/ReadIDCardBase64', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        const data = res.data
        if (data.status === 'OK') {
          this.form.setFieldsValue({
            personName: data.Name,
            personSex: data.Sex === '男' ? 0 : 1,
            nativePlace: data.Address,
            idcard: data.IDCardNo
          })
        }
      }).catch(err => {
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
