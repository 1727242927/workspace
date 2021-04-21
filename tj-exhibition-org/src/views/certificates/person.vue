<template>
  <div class="certificates-people">
    <Title>人证列表</Title>
    <div class="top" style="text-align: right;padding-right:50px">
      <a-button type="primary" @click="handleAdd">添加</a-button>
      <!-- 提交 提交的接口-->
      <a-button type="primary" style="margin-left:20px" :loading="submitBtnLoading" @click="handleSubmitBtnClick">支付</a-button>
      <!-- <a-button type="primary" style="margin-left:20px" @click="handlePayClick">支付</a-button> -->
      <a-button type="primary" style="margin-left:20px" @click="personnelClick">从人员库选择</a-button>
    </div>
    <div class="table-wrapper">
      <a-table
        :row-selection="rowSelection"
        bordered
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        :loading="tableLoading"
        @change="paginationChange"
        :scroll="{y: 550}"
      >
        <span slot="avatar" slot-scope="avatar">
          <img width="30" height="30" :src="avatar" style="border-radius: 50%"/>
        </span>
        <span slot="personSex" slot-scope="text">{{text === 0 ? '男' : '女'}}</span>
        <span slot="qualificationsExpiryDate" slot-scope="text">{{text && text.slice(0, 11)}}</span>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <a v-if="record.applicationStatus == 4" @click="showDeleteConfirm(record)">删除</a>
        </span>
        <template slot="applicationStatus" slot-scope="text, record">
          <span>
            {{
              record.applicationStatus == 0
                ? "待支付"
                : record.applicationStatus == 1
                ? "已付款"
                : record.applicationStatus == 4
                ? "待提交"
                : record.applicationStatus == 3
                ? "已制证"
                : ""
            }}
          </span>
        </template>
      </a-table>
    </div>
    <!-- 添加弹框 -->
    <person-form
      @refresh="getPersonCertificateList"
      :isAdd="isAdd"
      :record="record"
      :visible.sync="visible"
    />
    <!-- <pay
      ref="payModal"
    /> -->
    <qr-code
      ref="qrCodeModal"
    />
    <!--支付结果查询遮罩-->
    <a-modal
      :visible="showResult"
      :maskClosable="false"
      @ok="payOver"
      @cancel="payOver"
    >
      <PayDialog/>
      <template  slot="footer">
        <div style="text-align: center">
          <a-button type="danger" @click="payOver">支付失败</a-button>
          <a-button type="primary" @click="payOver">支付成功</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script>
import Title from '@/components/Title'
import PersonForm from './personForm'
import qrCode from './qrCode'
import PayDialog from './PayDialog'
import TableMixIn from '@/mixins'
import { getPayResult, personCertificate, personCertificateDelete, personCertificateSubmit } from '@/api'
import { getLocalInfo } from '@/utils'
export default {
  mixins: [TableMixIn],
  components: {
    Title,
    PersonForm,
    qrCode,
    PayDialog
  },
  data() {
    return {
      columns: [
        { title: '头像', dataIndex: 'avatar', scopedSlots: { customRender: 'avatar' }, className: 'avatar-tablecell', align: 'center' },
        { title: '姓名', dataIndex: 'personName' },
        { title: '性别', dataIndex: 'personSex', scopedSlots: { customRender: 'personSex' } },
        { title: '籍贯', dataIndex: 'nativePlace' },
        { title: '身份证号', dataIndex: 'idcard' },
        { title: '工种', dataIndex: 'jobLevelName' },
        { title: '资格证有效期', dataIndex: 'qualificationsExpiryDate', scopedSlots: { customRender: 'qualificationsExpiryDate' } },
        { title: '申请状态', dataIndex: 'applicationStatus', scopedSlots: { customRender: 'applicationStatus' } },
        { title: '操作', key: 'Action', scopedSlots: { customRender: 'action' }, align: 'center' }
      ],
      data: [],
      selectedRowKeys: [],
      submitBtnLoading: false,
      isAdd: true,
      record: {},
      visible: false,
      showResult: false,
      // 支付系统订单编号
      paySysOrderNumber: ''
    }
  },
  created() {
    this.getPersonCertificateList()
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
        },
        /**
         * @description: 非待提交状态的不能勾选
         * @author: 潘慧敏
         * @time: 2021-03-13 13:49:45
         */
        getCheckboxProps: record => ({
          props: {
            disabled: record.applicationStatus != '4'
          }
        })
      }
    }
  },
  methods: {
    /**
     * @description: 查询支付结果
     * @author: 潘慧敏
     * @time: 2021-03-13 15:16:20
     * @param transactionType 支付类型：1-支付，2-退款
     * @param paySysOrderNumber 支付系统订单编号
     */
    payOver() {
      getPayResult({ paySysOrderNumber: this.paySysOrderNumber, transactionType: '1' }).then((res) => {
        if (res.code == 1000) {
          this.getPersonCertificateList()
          this.showResult = false
        }
      })
    },
    handlePayClick() {
      const payModal = this.$refs.payModal
      payModal.visible = true
      payModal.getSubmitRecordList()
    },
    handleAdd() {
      this.isAdd = true
      this.visible = true
      this.record = {}
    },
    handleEdit(record) {
      this.isAdd = false
      this.visible = true
      this.record = record
    },
    personnelClick() {
      this.$router.push({
        path: '/home/certificates/personnel'
      })
    },
    handleSubmitBtnClick() {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.error('请选择证件')
        return
      }
      this.$confirm({
        title: '确认支付?',
        content: '确认支付后，将以1s后跳转支付页面',
        onOk: () => {
          return new Promise((resolve, reject) => {
            this.submitBtnLoading = true
            const localInfo = getLocalInfo()
            const params = {
              showId: localInfo.showId,
              dataCategoryId: localInfo.userId,
              dataCategory: '0',
              certificatesPersonneExhibitionIdList: this.selectedRowKeys,
              certificatesType: '0',
              orderSource: '0'
            }
            personCertificateSubmit(params).then(res => {
              if (res.code == '1000' && res.data) {
                this.paySysOrderNumber = res.data && res.data.orderNumber
                this.$message.success(res.message)
                setTimeout(() => {
                  resolve('成功')
                  window.open(res.data.payUrl)
                }, 1000)
                setTimeout(() => {
                  this.showResult = true
                }, 1000)
              } else {
                this.$message.error(res.message)
                resolve('接口失败')
              }
              this.submitBtnLoading = false
            }).catch(err => {
              resolve('失败')
              this.submitBtnLoading = false
              console.log(err)
            })
          })
        },
        onCancel() {}
      })
      // 显示假弹框
      // const qrCodeModal = this.$refs.qrCodeModal
      // qrCodeModal.visible = true
      // this.tableLoading = true
      // this.submitBtnLoading = true
    },
    async getPersonCertificateList() {
      this.tableLoading = true
      const localInfo = getLocalInfo()
      const params = {
        showId: localInfo.showId,
        dataCategoryId: localInfo.userId,
        dataCategory: '0', // 主场
        pageRows: this.pagination.pageSize,
        pageNum: this.pagination.current,
        ...this.searchData
      }
      try {
        const result = await personCertificate(params)
        this.tableLoading = false
        const { code, data } = result
        if (code === 1000) {
          this.data = data.list.map(list => {
            const start = list.certificatesPerson && list.certificatesPerson.headPortrait != null ? list.certificatesPerson.headPortrait.startsWith('[{') : undefined
            const obj = {
              ...list.certificatesPerson,
              jobLevelName: list.jobLevelName,
              applicationStatus: list.applicationStatus,
              expoExhibitorsId: list.expoExhibitorsId,
              certificatesPersonId: list.certificatesPersonId,
              key: list.id,
              avatar: start ? JSON.parse(list.certificatesPerson.headPortrait)[0].url : list.certificatesPerson.headPortrait,
              certificatesRemarks: list.certificatesRemarks
            }
            return obj
          })
          this.pagination.total = data.total
        }
      } catch (error) {
        console.log(error)
        this.tableLoading = false
      }
    },
    paginationChange(pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getPersonCertificateList()
    },
    showDeleteConfirm(record) {
      this.$confirm({
        title: '您确定要删除这条数据吗?',
        content: '删除后不可恢复！是否要删除？',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          this.handleDelete(record.id)
        }
      })
    },
    handleDelete(id) {
      personCertificateDelete({ id }).then(res => {
        const { message } = res
        this.getPersonCertificateList()
        this.$message.success(message)
      })
    }
  }
}
</script>
