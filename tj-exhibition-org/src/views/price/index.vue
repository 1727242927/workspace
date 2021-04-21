<template>
  <div class="certificates-people">
    <div>
        <div style="height:44px">
          <Title>
            价格体系
            <template v-slot:right>
              <a-button type="primary" @click="pullServe" style="margin-right: 15px">由场馆导入</a-button>
              <a-button type="primary">
                <a href="/tj-exhibition/file/exportServiceExcel">场馆服务项导出</a>
              </a-button>
            </template>
          </Title>
        </div>
        <div class="contentBox clearfix">
          <div class="leftBox">
            <div>
              <a-button type="primary" @click="addItem">添加</a-button>
              <a-button type="primary" style="margin-left:20px" @click="editParant">修改</a-button>
              <a-button type="primary" style="margin-left:20px" @click="delParent">删除</a-button>
            </div>
            <div class="table-box">
              <a-table
                bordered
                :columns="columns"
                :data-source="parentData"
                :loading="tableLoading"
                :pagination='false'
                rowKey="id"
                :rowSelection="{
                  selectedRowKeys: parentSelect,
                  onChange: onParentSelectChange,
                  type:'radio',
                  columnTitle:'选择',
                  columnWidth: 70
                }"
              >
                <span slot="otbNameCn" slot-scope="text" >{{text}}</span>
              </a-table>
            </div>
          </div>
          <div class="rightBox">
            <div >
              <a-button type="primary" @click="addChildItem">添加</a-button>
              <a-button type="primary" style="margin-left:20px" @click="editChildItem">修改</a-button>
              <a-button type="primary" style="margin-left:20px" :loading="saveBtnLoading" @click="saveChildItem">保存</a-button>
              <a-button type="primary" style="margin-left:20px" @click="delChildItem">删除</a-button>
            </div>
            <div class="table-box" ref="childTable">
              <a-table
                bordered
                :columns="childColumns"
                :data-source="childData"
                :loading="childTableLoading"
                :pagination="false"
                rowKey="id"
                :rowSelection="{
                  selectedRowKeys:childSelect,
                  onChange:childSelectChange,
                  type:'radio',
                  columnTitle:'选择',
                  columnWidth: 70
                }"
                :scroll="{y: childTableHeight, x: 1200}"
              >
                <span slot="zsAll">
                  <a-checkbox :checked="displayZsAll" @change="handleZsAllChange($event, 'displayZs')">全选</a-checkbox>
                </span>
                <span slot="djAll">
                  <a-checkbox :checked="displayDjAll" @change="handleDjAllChange($event, 'displayDj')">全选</a-checkbox>
                </span>
                <span slot="displayZs" slot-scope="displayZs, record, index">
                  <a-checkbox :checked="Boolean(displayZs)" @change="e => handleDisplayChange(e.target.checked, index, 'displayZs')">展商</a-checkbox>
                </span>
                <span slot="displayDj" slot-scope="displayDj, record, index">
                  <a-checkbox :checked="Boolean(displayDj)" @change="e => handleDisplayChange(e.target.checked, index, 'displayDj')">搭建商</a-checkbox>
                </span>
                <span slot="otbNameCn" slot-scope="text" >{{text}}</span>
                <span slot="otsStandards" slot-scope="otsStandards" >{{otsStandards}}</span>
                <span slot="otsUnit" slot-scope="otsUnit" >{{otsUnit}}</span>
                <template slot="otsPriceRmb" slot-scope="text, record, index">
                  <a-input
                    v-model.trim="record.otsPriceRmb"
                    @change.native='blurFn(record)'
                    @keyup.native="inputChangeList($event, 'childData', 'otsPriceRmb', index )"
                    style="width: 100%"
                    :maxLength="9"
                  />
                </template>
                <span slot="otsPriceRmbDeposit" slot-scope="otsPriceRmbDeposit" >{{otsPriceRmbDeposit}}</span>
                <span slot="otsCost" slot-scope="otsCost" >{{otsCost}}</span>
                <span slot="otsRemarks" slot-scope="otsRemarks" >{{otsRemarks}}</span>
              </a-table>
            </div>
          </div>
        </div>
    </div>
    <a-modal
      :title="add ? '添加' : '编辑'"
      :visible="visible"
      @ok="handleSubmit"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
      :width="500"
    >
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-model-item label="中文名称" prop="nameCn">
          <a-input v-model="form.nameCn" placeholder="请输入中文名称"/>
        </a-form-model-item>
        <a-form-model-item label="英文名称" prop="nameEn">
          <a-input v-model="form.nameEn" placeholder="请输入英文名称"/>
        </a-form-model-item>
        <a-form-model-item label="管理服务" prop="isManager">
          <a-radio-group v-model="form.isManager">
            <a-radio :value="0" :disabled="isCheckManager<=0">否</a-radio>
            <a-radio :value="1">是</a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <a-modal
      :title="add2 ? '添加' : '编辑'"
      :visible="childVisible"
      @ok="childHandleSubmit"
      @cancel="childHandleCancel"
      :confirmLoading="confirmLoading"
      :width="750"
    >
      <div class='moduleBox'>
        <a-form-model
          ref="childForm"
          :model="childForm"
          :rules="childRules"
          :label-col="{ span:6 }"
          :wrapper-col="{ span: 14 }"
        >
          <a-form-model-item label="中文名称" prop="otsNameCn">
            <a-input v-model="childForm.otsNameCn" placeholder="请输入中文名称" />
          </a-form-model-item>
          <a-form-model-item label="英文名称" prop="otsNameEn">
            <a-input v-model="childForm.otsNameEn" placeholder="请输入英文名称" />
          </a-form-model-item>
          <a-form-model-item label="服务规格" prop="otsStandards">
            <a-input v-model="childForm.otsStandards" placeholder="请输入服务规格" />
          </a-form-model-item>
          <a-form-model-item label="计量单位" prop="otsUnit">
            <a-input v-model="childForm.otsUnit" placeholder="请输入计量单位" />
          </a-form-model-item>
          <a-form-model-item label="人民币单价（展费）" prop="otsPriceRmb">
            <a-input v-model.trim="childForm.otsPriceRmb" type='number' placeholder="请输入人民币单价(展费)" />
          </a-form-model-item>
          <a-form-model-item label="人民币单价（押金）" prop="otsPriceRmbDeposit">
            <a-input v-model.trim="childForm.otsPriceRmbDeposit" type='number' @keyup.native="inputChangeFn($event, 'childForm', 'otsPriceRmbDeposit')" placeholder="请输入人民币单价(押金)" />
          </a-form-model-item>
          <a-form-model-item label="管理服务" prop="isManager">
          <a-radio-group v-model="childForm.isManager">
            <a-radio :value="0" :disabled="parentSelectObj.isManager==1">否</a-radio>
            <a-radio :value="1" :disabled="parentSelectObj.isManager==0">是</a-radio>
          </a-radio-group>
        </a-form-model-item>
          <a-form-model-item label="成本" prop="otsCost">
            <a-input v-model="childForm.otsCost" type='number' :disabled='childEditGzid != 0' placeholder="请输入成本" />
          </a-form-model-item>
          <a-form-model-item label="部门" prop="secondKinds">
            <a-input v-model="childForm.secondKinds" placeholder="请输入部门" />
          </a-form-model-item>
          <a-form-model-item label="备注" prop="otsRemarks">
            <a-input v-model="childForm.otsRemarks"  type='textarea' placeholder="请输入备注" :maxLength="120"/>
          </a-form-model-item>
        </a-form-model>
      </div>
    </a-modal>
  </div>
</template>
<script>
import Title from '@/components/Title'
import TableMixIn from '@/mixins'
import { getLocalInfo } from '@/utils'
import { getPriceList, addInserBig, updateBig, deleteBig, insertSmall, updateSmall, deleteSmall, pullServiceItem, updatePrice, getServiceByBigId, saveChildService } from '@/api'
export default {
  mixins: [TableMixIn],
  components: {
    Title
  },
  data() {
    return {
      isCheckManager: 0,
      columns: [
        { title: '服务分类', dataIndex: 'otbNameCn', scopedSlots: { customRender: 'otbNameCn' }, align: 'center' }
      ],
      childColumns: [
        { title: '服务名称', dataIndex: 'otsNameCn', width: '20%', align: 'center' },
        { title: '人民币单价', dataIndex: 'otsPriceRmb', width: '14%', align: 'center', scopedSlots: { customRender: 'otsPriceRmb' } },
        {
          title: '开放对象',
          dataIndex: 'aadsf',
          align: 'center',
          width: 100,
          children: [
            {
              dataIndex: 'displayZs',
              width: 100,
              slots: {
                title: 'zsAll'
              },
              scopedSlots: { customRender: 'displayZs' }
            },
            {
              dataIndex: 'displayDj',
              width: 110,
              slots: {
                title: 'djAll'
              },
              scopedSlots: { customRender: 'displayDj' }
            }
          ]
        },
        { title: '规格', dataIndex: 'otsStandards', align: 'center' },
        { title: '计量单位', dataIndex: 'otsUnit', align: 'center' },
        { title: '押金（元）', dataIndex: 'otsPriceRmbDeposit', align: 'center' },
        { title: '成本（元）', dataIndex: 'otsCost', align: 'center' },
        // { title: '部门', dataIndex: 'secondKinds', align: 'center' },
        { title: '备注', dataIndex: 'otsRemarks', align: 'center' }
      ],
      parentData: [], //  大分类数据
      childData: [], //  小分类数据
      parentSelect: [],
      parentSelectObj: {},
      childSelect: [],
      form: {
        nameCn: '',
        nameEn: '',
        isManager: 1
      },
      childForm: {
        otsNameCn: '',
        otsNameEn: '',
        otsStandards: '',
        otsUnit: '',
        otsPriceRmb: '',
        // otsPriceUsd: '',
        otsPriceRmbDeposit: '',
        isManager: 0,
        // otsPriceUsdDeposit: '',
        otsCost: '',
        secondKinds: '',
        otsRemarks: '',
        otbId: null
      },
      parentEditId: '',
      childEditId: '',
      childEditGzid: '', //  字类是否是主场的 主场的成本是不能改变的
      rules: {
        nameCn: [
          { required: true, message: '请输入中文名称' },
          { pattern: /^[^\s]*$/, message: '不能输入空格' }
        ],
        nameEn: [
          { required: true, message: '请输入英文名称' },
          { pattern: /^[^\s]*$/, message: '不能输入空格' }
        ],
        isManager: [
          { required: true, message: '请选择是否管理服务' }
        ]
      },
      childRules: {
        otsNameCn: [
          { required: true, message: '请输入中文名称' },
          { pattern: /^[^\s]*$/, message: '不能输入空格' }
        ],
        otsPriceRmb: [
          { required: true, message: '请输入单价' },
          { pattern: /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*)|0)$/, message: '单价为正数，小数保留两位' }
        ],
        isManager: [
          { required: true, message: '请选择是否管理服务' }
        ]
      },
      visible: false,
      add: true,
      add2: true,
      userInfo: '',
      childVisible: false,
      confirmLoading: false,
      displayZsAll: false,
      displayDjAll: false,
      childTableLoading: false,
      saveBtnLoading: false,
      childTableHeight: 400
    }
  },
  created() {
  },
  mounted() {
    this.userInfo = getLocalInfo()
    this.getPriceList()
    this.setChildTableHeight()
  },
  methods: {
    setChildTableHeight() {
      const clientHeight = document.documentElement.clientHeight || document.body.clientHeight || 754
      this.childTableHeight = clientHeight - 335
    },
    handleZsAllChange(e, key) {
      const value = e.target.checked
      this.displayZsAll = value
      this.displayAllMap(key, value)
    },
    handleDjAllChange(e, key) {
      const value = e.target.checked
      this.displayDjAll = value
      this.displayAllMap(key, value)
    },
    handleDisplayChange(value, index, key) {
      const childData = [...this.childData]
      childData[index][key] = value ? 1 : 0
      this.childData = childData
      if (this.childData.every(item => item[key] === 1)) {
        key === 'displayZs' ? this.displayZsAll = true : this.displayDjAll = true
      } else {
        key === 'displayZs' ? this.displayZsAll = false : this.displayDjAll = false
      }
    },
    displayAllMap(key, value) {
      this.childData.map(child => {
        child[key] = value ? 1 : 0
        return child
      })
    },
    //  由场馆导入
    pullServe() {
      pullServiceItem({
        homeCourtId: this.userInfo.userId,
        showId: this.userInfo.showId
      }).then(res => {
        if (res.code === 1000) {
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
        this.getPriceList()
      })
    },
    //  大类切换
    onParentSelectChange(selectedRowKeys, selectedRowList) {
      this.parentSelect = selectedRowKeys
      this.parentSelectObj = selectedRowList[0]
      this.getChildData(selectedRowKeys[0])
      this.childEditId = ''
      this.childSelect = []
    },
    childSelectChange(val) {
      this.childSelect = val
    },
    blurFn(obj) {
      if (obj.otsPriceRmb === '') {
        this.$message.error('请输入单价')
        return false
      }
      updatePrice({
        id: obj.id,
        price: obj.otsPriceRmb
      }).then(res => {
        if (res.code === 1000) {
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    inputChangeFn(val, _obj, str) {
      this[_obj][str] = this[_obj][str].replace(/[^\d.]/g, '')
    },
    inputChangeList(val, _obj, str, _index) {
      this[_obj][_index][str] = this[_obj][_index][str].replace(/[^\d.]/g, '')
    },
    // 删除大类
    delParent() {
      if (this.parentSelect.length === 0) {
        this.$message.error('请选择分类')
        return false
      }
      this.$confirm({
        title: '确认删除此分类吗?',
        content: '',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk: () => {
          deleteBig({
            id: this.parentSelect[0]
          }).then(res => {
            if (res.code === 1000) {
              this.parentSelect = []
              this.$message.success(res.message)
              this.getPriceList()
            } else {
              this.$message.error(res.message)
            }
          })
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    },
    // 保存大分类
    handleSubmit(e) {
      if (this.confirmLoading) {
        return false
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.parentEditId !== '') {
            var _paramt = {
              id: this.parentEditId,
              ...this.form
            }
            this.confirmLoading = true
            updateBig(_paramt).then(res => {
              if (res.code === 1000) {
                this.$message.success(res.message)
                this.visible = false
                this.getPriceList()
              } else {
                this.$message.error(res.message)
              }
              this.confirmLoading = false
            }).catch(err => {
              console.log(err)
              this.confirmLoading = false
            })
          } else {
            var paramt = {
              homeCourtId: this.userInfo.userId,
              showId: this.userInfo.showId,
              ...this.form
            }
            this.confirmLoading = true
            addInserBig(paramt).then(res => {
              if (res.code === 1000) {
                this.$message.success(res.message)
                this.visible = false
                this.getPriceList()
              } else {
                this.$message.error(res.message)
              }
              this.confirmLoading = false
            }).catch(err => {
              console.log(err)
              this.confirmLoading = false
            })
          }
        } else {
          return false
        }
      })
    },
    // 新增大分类弹窗
    addItem() {
      this.isCheckManager = 0
      for (let parentItem of this.parentData) {
        // eslint-disable-next-line eqeqeq
        if (parentItem.isManager == 1) {
          this.isCheckManager += 1
        }
      }
      this.parentEditId = ''
      this.form.nameCn = ''
      this.form.nameEn = ''
      this.form.isManager = 1 // 恢复默认值
      this.visible = true
      this.add = true
    },
    // 编辑大分类
    editParant() {
      if (this.parentSelect.length === 0) {
        this.$message.error('请选择分类')
        return false
      }
      this.isCheckManager = 0
      this.add = false
      var _obj = this.getVal(this.parentData, this.parentSelect[0])
      this.parentEditId = _obj.id
      this.form.nameCn = _obj.otbNameCn
      this.form.nameEn = _obj.otbNameEn
      this.form.isManager = _obj.isManager === null ? 0 : _obj.isManager
      if (this.childData.length <= 0) {
        for (let parentItem of this.parentData) {
          // eslint-disable-next-line eqeqeq
          if (parentItem.isManager == 1) {
            this.isCheckManager += 1
          }
        }
      }
      this.visible = true
    },
    getVal(obj, id) {
      var _data = ''
      for (var i = 0; i < obj.length; i++) {
        if (obj[i].id === id) {
          _data = obj[i]
        }
      }
      return _data
    },
    // 大分类取消
    handleCancel() {
      this.visible = false
      this.$refs.ruleForm.resetFields()
    },
    // 增加小分类
    addChildItem() {
      this.childEditId = ''
      this.childForm.otsNameCn = ''
      this.childForm.otsNameEn = ''
      this.childForm.otsStandards = ''
      this.childForm.otsUnit = ''
      this.childForm.otsPriceRmb = ''
      // this.childForm.otsPriceUsd = ''
      this.childForm.otsPriceRmbDeposit = ''
      // this.childForm.otsPriceUsdDeposit = ''
      this.childForm.otsCost = ''
      this.childForm.secondKinds = ''
      this.childForm.otsRemarks = ''
      this.childForm.isManager = this.parentSelectObj.isManagerwa // 恢复默认值
      this.childEditGzid = ''
      this.childVisible = true
      this.add2 = true
    },
    // 保存小分类
    childHandleSubmit() {
      if (this.confirmLoading) {
        return false
      }
      this.$refs.childForm.validate(valid => {
        if (valid) {
          if (this.childEditId !== '') {
            var _paramt = {
              id: this.childEditId,
              ...this.childForm
            }
            this.confirmLoading = true
            updateSmall(_paramt).then(res => {
              if (res.code === 1000) {
                this.$message.success(res.message)
                this.childVisible = false
                this.getChildData(this.parentSelect[0])
              } else {
                this.$message.error(res.message)
              }
              this.confirmLoading = false
            }).catch(err => {
              console.log(err)
              this.confirmLoading = false
            })
          } else {
            var paramt = {
              homeCourtId: this.userInfo.userId,
              otsShowId: this.userInfo.showId,
              ...this.childForm,
              otbId: this.parentSelect[0]
            }
            this.confirmLoading = true
            insertSmall(paramt).then(res => {
              if (res.code === 1000) {
                this.$message.success(res.message)
                this.childVisible = false
                this.getChildData(this.parentSelect[0])
              } else {
                this.$message.error(res.message)
              }
              this.confirmLoading = false
            }).catch(err => {
              console.log(err)
              this.confirmLoading = false
            })
          }
        } else {
          return false
        }
      })
    },
    // 取消小分类
    childHandleCancel() {
      this.childVisible = false
      this.$refs.childForm.resetFields()
    },

    // 编辑小分类
    editChildItem() {
      if (this.childSelect.length === 0) {
        this.$message.error('请选择分类')
        return false
      }
      var _obj = this.getVal(this.childData, this.childSelect[0])
      this.childEditId = _obj.id
      this.childForm.otsNameCn = _obj.otsNameCn
      this.childForm.otsNameEn = _obj.otsNameEn
      this.childForm.otsStandards = _obj.otsStandards
      this.childForm.otsUnit = _obj.otsUnit
      this.childForm.otsPriceRmb = _obj.otsPriceRmb
      // this.childForm.otsPriceUsd = _obj.otsPriceUsd
      this.childForm.otsPriceRmbDeposit = _obj.otsPriceRmbDeposit
      // this.childForm.otsPriceUsdDeposit = _obj.otsPriceUsdDeposit
      this.childForm.isManager = _obj.isManager === null ? 0 : _obj.isManager
      this.childForm.otbId = _obj.otbId
      this.childForm.otsCost = _obj.otsCost
      this.childForm.secondKinds = _obj.secondKinds
      this.childForm.otsRemarks = _obj.otsRemarks
      this.childEditGzid = _obj.gzId
      this.childVisible = true
      this.add2 = false
    },
    // 删除小类
    delChildItem() {
      if (this.childSelect.length === 0) {
        this.$message.error('请选择分类')
        return false
      }
      this.$confirm({
        title: '确认删除此分类吗?',
        content: '',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk: () => {
          deleteSmall({
            id: this.childSelect[0]
          }).then(res => {
            if (res.code === 1000) {
              this.childSelect = []
              this.$message.success(res.message)
              this.getChildData(this.parentSelect[0])
            } else {
              this.$message.error(res.message)
            }
          })
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    },
    //  获取大分类
    getPriceList() {
      this.tableLoading = true
      const params = {
        homeCourtId: this.userInfo.userId,
        showId: this.userInfo.showId
      }
      getPriceList(params).then(res => {
        const { code, data } = res
        this.tableLoading = false
        if (code === 1000) {
          const id = data[0].id
          this.parentData = data || []
          this.parentSelect = [id]
          this.parentSelectObj = data[0]
          this.getChildData(id)
        }
      }).catch(err => {
        console.log(err)
        this.tableLoading = false
      })
    },
    getChildData(bigId) {
      this.childTableLoading = true
      getServiceByBigId({ bigId }).then(res => {
        const { data } = res
        this.childTableLoading = false
        this.childData = data
        // 是否自动全选
        this.displayZsAll = data.length > 0 ? data.every(item => item.displayZs === 1) : false
        this.displayDjAll = data.length > 0 ? data.every(item => item.displayDj === 1) : false
      }).catch(err => {
        console.log(err)
        this.childTableLoading = false
      })
    },
    saveChildItem() {
      this.saveBtnLoading = true
      saveChildService(this.childData).then(res => {
        const { message } = res
        this.saveBtnLoading = false
        this.$message.success(message)
        this.getChildData(this.parentSelect[0])
      }).catch(err => {
        this.saveBtnLoading = false
        console.log(err)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.leftBox{
  float: left;
  width: 250px;
}
.rightBox{
  margin-left: 260px;
}
.table-box{
  margin: 10px 0 0;
  overflow: hidden;
  overflow-y: auto;
}
.ant-layout-content {
  padding: 0px 20px !important;
}
.moduleBox{
  max-height: 500px;
  overflow-y: auto;
}

</style>
