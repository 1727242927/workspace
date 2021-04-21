<template>
  <a-modal
    title="创建模板"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :form="form" v-bind="formItemLayout">
      <a-form-item label="模板名称">
        <a-input
          v-decorator="[
            'templateName',
            {
              rules: [
                { required: true, message: '请输入模板名称' },
                { max: 15, message: '最多输入15个字符' }
              ],
              getValueFromEvent: (event) => {
                return event.target.value.replace(/(^\s*)|(\s*$)/g, '')
              }
            }
          ]"
          placeholder="请输入模板名称"
        />
      </a-form-item>
      <a-form-item label="模板类型">
        <a-select
          v-decorator="[
            'select',
            { rules: [{ required: true, message: '请选择模板类型' }] },
          ]"
          placeholder="请选择模板类型"
        >
          <a-select-option value="china">China</a-select-option>
          <a-select-option value="usa">U.S.A</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="模板文件" extra="上传.doc或.docx格式">
        <a-upload
          v-decorator="[
            'upload',
            {
              valuePropName: 'fileList',
              getValueFromEvent: normFile,
              rules: [
                { required: true, message: '请上传模板文件' }
              ]
            },
          ]"
          accept=".doc,.docx"
          name="file"
          action="/tj-exhibition/file/upload"
          list-type="picture"
        >
          <a-button type="primary"> <a-icon type="upload" />点击上传</a-button>
        </a-upload>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      confirmLoading: false,
      formItemLayout: {
        labelCol: { span: 5 },
        wrapperCol: { span: 18 }
      },
      form: this.$form.createForm(this)
    }
  },
  methods: {
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    },
    handleCancel() {
      this.$emit('update:visible', false)
      this.form.resetFields()
    },
    normFile(e) {
      console.log('Upload event:', e)
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    }
  }
}
</script>