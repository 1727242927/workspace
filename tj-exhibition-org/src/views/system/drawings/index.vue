<template>
    <div class="certificates-people">
    <div>
      <Title style="margin:10px 0">
        图纸管理
        <div style="float:right;padding-right: 20%">
          <a-button type="primary" @click="addFn()">新增</a-button>
        </div>
      </Title>
      <div class="table-box">
        <a-table bordered :columns="columns" :data-source="data" :loading="tableLoading" :pagination='false' rowKey="id" >
          <span slot="drawingName" slot-scope="drawingName">{{drawingName}}</span>
          <span slot="isUse" slot-scope="isUse, record, index">
            <a-switch
              :checked="isUse"
              @change="value => onSwitchChange(value, record, index)"
              checked-children="启用"
              un-checked-children="禁用"
              :loading="record.loading"
            />
          </span>
          <span slot="oper" slot-scope="text, record">
            <a style="margin-right:20px" @click="editFn(record)">修改</a>
            <a style="color: #ff4d4f" @click="deleFn(record)">删除</a>
          </span>
        </a-table>
      </div>
      <a-modal title='' :visible="visible" :width="550" @cancel="handleCancel" @ok="saveOk" >
        <div  style="margin-top:40px">
          <a-form-model ref="form" :model="form" :rules="rulses" :label-col="{ span:3 }" :wrapper-col="{ span: 20 }">
            <a-form-model-item label="图纸名" prop="drawingName">
              <a-input v-model.trim="form.drawingName" placeholder="请输入图纸名称"/>
            </a-form-model-item>
          </a-form-model>
        </div>
      </a-modal>
    </div>
  </div>
</template>
<script>
import Title from '@/components/Title'
import { addDrawingInfo, updateDrawing, deleteDrawing, getDrawingList, updateUse } from '@/api'
import { getLocalStorageItem } from '@/utils'
export default {
  components: {
    Title
  },
  data() {
    return {
      columns: [
        { title: '序号', align: 'center', width: 100, customRender: (text, record, index) => `${index + 1}` },
        { title: '图纸名', dataIndex: 'drawingName', scopedSlots: { customRender: 'drawingName' }, align: 'center' },
        { title: '是否启用', dataIndex: 'isUse', scopedSlots: { customRender: 'isUse' }, align: 'center' },
        { title: '展会数', dataIndex: 'showCount', align: 'center' },
        { title: '操作', dataIndex: 'oper', scopedSlots: { customRender: 'oper' }, align: 'center' }
      ],
      data: [],
      tableLoading: false,
      confirmLoading: false,
      visible: false,
      form: { drawingName: '', id: '' },
      rulses: {
        drawingName: [
          { required: true, message: '请输入图纸名', trigger: 'change' },
          { pattern: /^[^\s]*$/, message: '不能输入空格', trigger: 'change' }
        ]
      },
      userInfo: ''
    }
  },
  mounted() {
    this.userInfo = getLocalStorageItem('userInfo')
    this.getDrawingList()
  },
  methods: {
    onSwitchChange(value, record, index) {
      this.updateUse(value, record, index)
    },
    async updateUse(value, record, index) {
      try {
        this.data[index].loading = true
        const params = {
          isUse: Number(value),
          id: record.id
        }
        const result = await updateUse(params)
        this.data[index].loading = true
        const { message } = result
        this.$message.success(message)
        this.getDrawingList()
      } catch (error) {
        this.data[index].loading = true
        console.log(error)
      }
    },
    // 取消弹窗
    handleCancel() {
      this.$refs.form.resetFields()
      this.visible = false
    },
    // 保存
    saveOk() {
      if (this.confirmLoading) {
        return false
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.confirmLoading = true
          if (this.form.id === '') {
            addDrawingInfo({
              drawingName: this.form.drawingName,
              userId: this.userInfo.id
            }).then(res => {
              if (res.code === 1000) {
                this.$message.success('增加成功')
                this.getDrawingList()
              } else {
                this.$message.error(res.message)
              }
              this.handleCancel()
              this.confirmLoading = false
            })
          } else {
            updateDrawing({
              drawingName: this.form.drawingName,
              id: this.form.id
            }).then(res => {
              if (res.code === 1000) {
                this.$message.success('修改成功')
                this.getDrawingList()
              } else {
                this.$message.error(res.message)
              }
              this.handleCancel()
              this.confirmLoading = false
            })
          }
        } else {
          return false
        }
      })
    },
    // 编辑
    editFn(val) {
      this.form.drawingName = val.drawingName
      this.form.id = val.id
      this.visible = true
    },
    addFn() {
      this.visible = true
      this.form.drawingName = ''
      this.form.id = ''
    },
    // 删除
    deleFn(val) {
      this.$confirm({
        title: '确认删除此分类图纸吗？',
        content: '',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk: () => {
          deleteDrawing({
            id: val.id
          }).then(res => {
            if (res.code === 1000) {
              this.$message.success('删除成功')
              this.getDrawingList()
            } else {
              this.$message.error(res.message)
            }
            this.visible = false
          })
        }
      })
    },
    // 获取图纸
    getDrawingList() {
      this.tableLoading = true
      getDrawingList({
        userId: this.userInfo.id
      }).then(res => {
        if (res.code === 1000) {
          this.data = res.data.map(item => {
            item.isUse = Boolean(item.isUse)
            item.loading = false
            return item
          })
          this.tableLoading = false
        }
      }).catch(err => {
        this.tableLoading = false
        console.log(err)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.table-box{
  width: 80%;
  padding: 20px 0
}
</style>
