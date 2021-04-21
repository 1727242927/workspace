<template>
  <a-modal
    :visible="visible"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <Title slot="title" style="margin-bottom: 0">导入展商数据</Title>
    <a-form :form="form" v-bind="formItemLayout">
      <a-form-item label="上传文件">
        <a-upload
          v-decorator="[
            'upload',
            {
              valuePropName: 'fileList',
              getValueFromEvent: normFile,
              rules: [
                { required: true, message: '请选择上传文件' }
              ]
            },
          ]"
          name="file"
          accept=".xlsx, .xls"
          :before-upload="beforeUpload"
        >
          <a-button> <a-icon type="upload" /> 点击选择文件 </a-button>
        </a-upload>
      </a-form-item>
    </a-form>
    <!-- <div class="progress-wrap" v-show="show">
      <a-progress :percent="percent" status="active" />
    </div> -->
    <div class="upload-result-wrap">
      <div class="result-item">
        <div class="title">上传成功条数：</div>
        <div class="content">{{result.successNum}}</div>
      </div>
      <div class="result-item">
        <div class="title">上传失败条数：</div>
        <div class="content error">{{result.failNum}}</div>
      </div>
      <div class="result-item">
        <div class="title">下载失败文件：</div>
        <div class="content error">
          <a :href="result.errorFileUrl" title="点击下载文件">{{result.errorFileName}}</a>
        </div>
      </div>
    </div>
    <template slot="footer">
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">提交</a-button>
    </template>
  </a-modal>
</template>

<script>
import Title from '@/components/Title'
import { exhibitorsUpload } from '@/api'

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
      fileList: [],
      loading: false,
      formItemLayout: {
        labelCol: { span: 5 },
        wrapperCol: { span: 14 }
      },
      result: {
        successNum: 0,
        failNum: 0,
        errorFileUrl: '',
        errorFileName: ''
      },
      form: this.$form.createForm(this, { name: 'uploadFile' })
    }
  },
  methods: {
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.submitRequest(values)
        }
      })
    },
    submitRequest(values) {
      this.result = {
        successNum: 0,
        failNum: 0,
        errorFileUrl: '',
        errorFileName: ''
      }
      const { upload: fileList } = values
      const formData = new FormData()
      fileList.forEach(file => {
        if (file.name.length > 120) {
          this.$message.error('文件名称过长,请修改重新上传！')
          return
        }
        formData.append('file', file)
      })
      this.loading = true
      exhibitorsUpload(formData).then(res => {
        this.loading = false
        this.result = res.data
        this.$emit('refresh')
      }).catch(err => {
        console.log(err)
        this.loading = false
        this.result = {
          successNum: 0,
          failNum: 0,
          errorFileUrl: '',
          errorFileName: ''
        }
      })
    },
    handleCancel() {
      this.result = {
        successNum: 0,
        failNum: 0,
        errorFileUrl: '',
        errorFileName: ''
      }
      this.$emit('update:visible', false)
      this.form.resetFields()
      this.show = false
    },
    beforeUpload() {
      return false
    },
    normFile(e) {
      if (Array.isArray(e)) {
        return e
      }
      if (e.fileList && e.fileList.length != 0) {
        e.fileList = [e.file]
      }
      return e && e.fileList
    }
  }
}
</script>

<style lang="less" scoped>
.progress-wrap {
  padding: 0 20px;
}
.upload-result-wrap {
  min-height: 100px;
  padding-left: 20%;
  user-select: none;
  .result-item {
    height: 30px;
    line-height: 30px;
    display: flex;
    align-items: center;
    .title {
      width: 104px;
    }
    .content {
      flex: 1;
      font-weight: bold;
      &.error {
        color: red;
        a {
          color: inherit;
        }
      }
    }
  }
}
</style>