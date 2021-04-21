<template>
  <a-form-item :label="label" v-bind="formItemLayout">
    <a-upload
      v-decorator="[
        fieldName,
        {
          valuePropName: 'fileList',
          getValueFromEvent: normFile,
          rules: [
            { required: true, message: rulesMessage }
          ]
        }
      ]"
      name="file"
      action="/tj-exhibition/file/upload/image"
      list-type="picture-card"
      :disabled="disabled"
      :show-upload-list="false"
      @change="handleUploadChange"
      :before-upload="beforeAvatarUpload"
      accept=".jpg, .jpeg, .png, .bmp"
      :class="{
        'picture-card-negative': type === 0,
        'picture-card-positive': type === 1,
        'picture-card-avatar': type === 2
      }"
    >
      <img v-if="imageUrl" :width="`${width}px`" height="104px" :src="imageUrl" alt="img" />
      <div v-else>
        <div>
          <a-icon :type="loading ? 'loading' : 'plus'" />
          <!--          <div class="ant-upload-text">-->
          <!--            开始上传-->
          <!--          </div>-->
        </div>
      </div>
    </a-upload>
  </a-form-item>
</template>

<script>
function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export default {
  props: {
    type: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 104
    },
    label: {
      type: String,
      required: true
    },
    fieldName: {
      type: String,
      required: true
    },
    rulesMessage: {
      type: String,
      default: '请上传内容'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    read: {
      type: Boolean,
      default: false
    },
    formItemLayout: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      loading: false,
      imageUrl: ''
    }
  },
  methods: {
    normFile(e) {
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    },
    handleUploadChange({ file, fileList }) {
      if (file.status === 'uploading') {
        this.loading = true
        return
      }
      if (file.status === 'done') {
        const lastfile = fileList.slice(-1)
        const response = lastfile[0].response
        this.imageUrl = (response && response.data.url) || ''
        this.$message.success(`${file.name} 上传成功`)
        this.loading = false
        // 读取身份证信息
        if (this.read) {
          getBase64(file.originFileObj, imageUrl => {
            const url = imageUrl.split(',')[1]
            this.$emit('callback', url)
          })
        }
      } else if (file.status === 'error') {
        this.$message.error(`${file.name} 上传失败`)
      }
    },
    beforeAvatarUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp'
      if (!isJpgOrPng) {
        this.$message.error('您只能上传jpg、jpeg、png、bmp格式的一种')
      }
      const isLt100M = file.size / 1024 / 1024 < 100
      if (!isLt100M) {
        this.$message.error('上传图片大小不能超过100M!')
      }
      return isJpgOrPng && isLt100M
    }
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
