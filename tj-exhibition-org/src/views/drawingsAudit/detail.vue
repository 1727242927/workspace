<template>
    <div class="certificates-people">
    <div>
      <Title style="margin: 0 0 10px">图纸审核</Title>
      <a-row class="rowBox">
        <a-col :span="4">展位号：{{mainInfor.exhibitors015}}</a-col>
        <a-col :span="5">参展商：{{mainInfor.exhibitors002}}</a-col>
        <a-col :span="5">参展商联系人：{{mainInfor.exhibitors007}}</a-col>
        <a-col :span="5">联系人方式：{{mainInfor.exhibitors011}}</a-col>
      </a-row>
      <a-row class="rowBox">
        <a-col :span='5' :offset="4">搭建商：{{mainInfor.exhibitors017}}</a-col>
        <a-col :span="5">搭建商联系人：{{mainInfor.exhibitors021}}</a-col>
        <a-col :span="5">联系人方式：{{mainInfor.exhibitors023}}</a-col>
      </a-row>

      <div class="table-box">
        <!-- <div class="smallTitle">1. 图纸审核</div> -->
        <a-table
          bordered
          :columns="columns"
          :data-source="drawingData"
          :loading="tableLoading"
          :pagination="false"
          rowKey="rowKey"
        >
          <span slot="lastUrl" slot-scope="lastUrl">
            <template v-if="lastUrl">
              <img :src="lastUrl" width="20" height="20" @click="handleLastUrlClick(lastUrl)" style="cursor:pointer"/>
            </template>
          </span>
          <template slot="defautlStatus" slot-scope="defautlStatus" v-if="defautlStatus">
            <a-select style="width:200px" v-model="defautlStatus.status" v-if="!defautlStatus.type" placeholder="请选择类型">
              <a-select-option :value="'0'" v-if="defautlStatus.status === '0'">待审核</a-select-option>
              <a-select-option :value="'1'">合格</a-select-option>
              <a-select-option :value="'2'">不合格</a-select-option>
              <a-select-option :value="'3'">已阅</a-select-option>
            </a-select>
            <a-select style="width:200px" v-model="defautlStatus.status" v-if="defautlStatus.type">
              <a-select-option :value="'0'">不合格</a-select-option>
              <a-select-option :value="'1'">合格</a-select-option>
            </a-select>
          </template>
          <template slot="defautlReson" slot-scope="defautlReson" v-if="defautlReson">
            <a-input v-model="defautlReson.reson"></a-input>
          </template>
          <template slot="defautlTime" slot-scope="defautlTime" v-if="defautlTime">{{defautlTime.time}}</template>
        </a-table>
        <div class="btn"><a-button type="primary" @click="drawingSubmit">提交并短信通知</a-button><a-button type="primary" style="margin-left:20px" @click="goBack">返回</a-button></div>

        <div class="smallTitle">
          <Title style="margin: 0 0 10px">搭建合同审核</Title>
        </div>
        <a-table
          bordered
          :columns="agreementColumns"
          :data-source="agreementData"
          :loading="tableLoading"
          :pagination="false"
          rowKey="id"
        >
          <template slot="drawingName"  slot-scope="exhibitors, record">
            <a-button type="primary">
              <a :href="`/tj-exhibition/file/fileDownload?filename=${record.fileName}`">下载查看合同</a>
            </a-button>
          </template>
          <template slot="defautlStatus" slot-scope="defautlStatus">
            <a-select style="width:200px" v-model="defautlStatus.status" v-if="defautlStatus">
              <a-select-option :value="'0'" v-if="defautlStatus.status === '0'">待审核</a-select-option>
              <a-select-option value="1">合格</a-select-option>
              <a-select-option value="2">不合格</a-select-option>
              <a-select-option :value="'3'">已阅</a-select-option>
            </a-select>
          </template>
          <template slot="defautlReson" slot-scope="defautlReson" v-if="defautlReson">
            <a-input v-model="defautlReson.reson"></a-input>
          </template>
          <template slot="defautlTime" slot-scope="defautlTime" v-if="defautlTime">{{defautlTime.time}}</template>

        </a-table>
        <div class="btn"><a-button type="primary" @click="agreementSubmit">提交并短信通知</a-button><a-button type="primary" style="margin-left:20px" @click="goBack">返回</a-button></div>
      </div>
    </div>
  </div>
</template>

<script>
import Title from '@/components/Title'
import { mainGetDetail, drawingsAll, approveDrawing, fileDownload } from '@/api'
import { getLocalInfo } from '@/utils'
export default {
  components: {
    Title
  },
  data() {
    return {
      id: `${this.$route.query.id}` === 'undefined' ? '' : `${this.$route.query.id}`,
      columns: [
        { title: '序号', width: 100, align: 'center', customRender: (text, record, index) => `${index + 1}` },
        { title: '图纸类型', width: 200, dataIndex: 'drawingName', align: 'center', scopedSlots: { customRender: 'drawingName' } },
        { title: '图纸（最后一次上传）', dataIndex: 'lastUrl', scopedSlots: { customRender: 'lastUrl' }, align: 'center' },
        { title: '审核', width: 150, dataIndex: 'defautlStatus', align: 'center', scopedSlots: { customRender: 'defautlStatus' } },
        { title: '审核意见', dataIndex: 'defautlReson', align: 'center', scopedSlots: { customRender: 'defautlReson' } },
        { title: '审核时间', width: 180, dataIndex: 'defautlTime', align: 'center', scopedSlots: { customRender: 'defautlTime' } }
      ],
      agreementColumns: [
        { title: '序号', width: 100, align: 'center', customRender: (text, record, index) => `${index + 1}` },
        { title: '合同', width: 200, dataIndex: 'drawingName', align: 'center', scopedSlots: { customRender: 'drawingName' } },
        { title: '审核', width: 150, dataIndex: 'defautlStatus', align: 'center', scopedSlots: { customRender: 'defautlStatus' } },
        { title: '审核意见', dataIndex: 'defautlReson', align: 'center', scopedSlots: { customRender: 'defautlReson' } },
        { title: '审核时间', width: 180, dataIndex: 'defautlTime', align: 'center', scopedSlots: { customRender: 'defautlTime' } }
      ],
      userInfo: '',
      drawingData: [],
      agreementData: [],
      tableLoading: false,
      mainInfor: {} // 详情信息
    }
  },
  mounted() {
    this.getAll()
  },
  methods: {
    async getAll() {
      // 获取已选择的图纸
      this.drawingAllData = await this.drawingsAll()
      this.mainGetDetail()
    },
    // 合同提交
    agreementSubmit() {
      let submitVal = this.getSubmitVal(this.agreementData)
      this.saveData(submitVal, '1')
    },
    // 图纸提交
    drawingSubmit() {
      let submitVal = this.getSubmitVal(this.drawingData)
      this.saveData(submitVal)
    },
    saveData(_val, type = '0') {
      let submitType = false
      var drawingList = []
      var paramt = {}
      if (type === '0') {
        var summaryList = _val.pop()
        paramt.drawingApprovalSummary = {
          id: summaryList.id,
          approvalOpinion: summaryList.defautlReson.reson,
          approvalStatus: summaryList.defautlStatus.status,
          oldApprovalOpinion: summaryList.defautlReson.oldReson,
          oldApprovalStatus: summaryList.defautlStatus.oldStatus
        }
        for (var index = _val.length - 1; index >= 0; index--) {
          if (_val[index].defautlStatus.status != _val[index].defautlStatus.oldStatus || _val[index].defautlReson.oldReson != _val[index].defautlReson.reson) {
          } else {
            _val.splice(index, 1)
          }
        }
        if (_val.length <= 0 && (paramt.drawingApprovalSummary.approvalOpinion == paramt.drawingApprovalSummary.oldApprovalOpinion && paramt.drawingApprovalSummary.approvalStatus == paramt.drawingApprovalSummary.oldApprovalStatus)) {
          this.$message.error('并无改动,无需提交')
          return
        }
      }
      console.log(_val)

      if (_val.length > 0) {
        for (var i = 0; i < _val.length; i++) {
          drawingList.push({
            id: _val[i].paramtId.id,
            approvalOpinion: _val[i].defautlReson.reson,
            approvalStatus: _val[i].defautlStatus.status
          })
        }
      }
      paramt.drawingApprovals = drawingList
      approveDrawing(paramt).then(res => {
        if (res.code === 1000) {
          this.$message.success(res.message)
          // 刷新数据
          this.getAll()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 循环获取提交值
    getSubmitVal(arr) {
      var _tempArry = []
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].defautlStatus) {
          _tempArry.push(arr[i])
        }
      }
      return _tempArry
    },
    // 返回上一页
    goBack() {
      this.$router.back()
    },
    drawingsAll() {
      return new Promise((resolve, reject) => {
        const { showId, userId } = getLocalInfo()
        const params = { showId, userId }
        drawingsAll(params).then(result => {
          const { data } = result
          resolve(data)
        }, err => {
          reject(err)
        })
      })
    },
    //  获取分类详情
    mainGetDetail() {
      const params = { exhibitorId: this.id }
      this.tableLoading = true
      mainGetDetail(params).then(res => {
        this.tableLoading = false
        if (res.code === 1000) {
          this.mainInfor = res.data
          this.mainInfor.drawingApprovals.map(val => {
            this.setData(val)
            return val
          })
          let drawingData = []
          let agreementData = []
          const summay = this.mainInfor.drawingApprovalSummary

          this.drawingAllData.map((val, index) => {
            val.rowKey = index
            if (val.drawingType === '0') {
              if (val.lastUrl === null || val.lastUrl === undefined) {
                val.lastUrl = ''
              }
              drawingData.push(val)
            }
            if (val.drawingType === '1') {
              agreementData.push(val)
            }
          })
          this.drawingData = drawingData
          this.agreementData = agreementData

          this.drawingData.push(
            {
              rowKey: this.drawingData.length + 1,
              drawingName: '总体审核意见',
              defautlStatus: { status: summay.approvalStatus, oldStatus: summay.approvalStatus, type: 1 },
              defautlReson: { reson: summay.approvalOpinion, oldReson: summay.approvalOpinion },
              defautlTime: { time: summay.submissionDate },
              lastUrl: '',
              ...summay
            }
          )
        }
      }).catch(error => {
        this.tableLoading = false
        console.log(error)
      })
    },
    setData(_obj) {
      for (var i = 0; i < this.drawingAllData.length; i++) {
        if (_obj.drawingId === this.drawingAllData[i].id) {
          const url = _obj.url
          this.$set(this.drawingAllData[i], 'defautlStatus', { status: _obj.approvalStatus, oldStatus: _obj.approvalStatus })
          this.$set(this.drawingAllData[i], 'defautlReson', { reson: _obj.approvalOpinion, oldReson: _obj.approvalOpinion })
          this.$set(this.drawingAllData[i], 'defautlTime', { time: _obj.approvalDate })
          this.$set(this.drawingAllData[i], 'paramtId', { id: _obj.id })
          this.$set(this.drawingAllData[i], 'paramtUrl', url)
          if (url) {
            const urlArr = JSON.parse(url)
            const lastUrl = urlArr[urlArr.length - 1].url
            const pathArr = lastUrl.split('/')
            const fileName = pathArr[pathArr.length - 1]
            this.$set(this.drawingAllData[i], 'lastUrl', lastUrl)
            this.$set(this.drawingAllData[i], 'fileName', fileName)
          }
        }
      }
    },
    handleLastUrlClick(lastUrl) {
      window.open(lastUrl)
    },
    // 下载查看合同
    showAggress(val) {
      if (val.paramtUrl && val.paramtUrl !== '') {
        var _tempVal = JSON.parse(val.paramtUrl)
        var fileName = _tempVal[0].url.split('/')
        fileName = fileName[fileName.length - 1]
        // console.log(fileName)
        const params = { filename: fileName }
        const config = { responseType: 'blob' }
        fileDownload(params, config).then(res => {
          const downContent = res.data
          const downBlob = new Blob([downContent])
          const downFileName = fileName
          if ('download' in document.createElement('a')) {
            // 非IE下载
            const elink = document.createElement('a')
            elink.download = downFileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(downBlob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else {
            // IE10+下载
            navigator.msSaveBlob(downBlob, downFileName)
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.rowBox{
  padding: 10px 0;
  font-size: 16px;
}
.smallTitle{
  padding:0 0 20px;
  font-size:16px
}
.btn{
  padding: 20px 0;
  text-align: right;
}
</style>
