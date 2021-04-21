<template>
    <div class="certificates-people">
    <div>
        <Title>图纸审核</Title>
        <div >
          <a-form-model layout="inline" :model="serachVal">
            <a-form-model-item label="参展商">
              <a-input v-model="serachVal.exhibitorsName" placeholder="请输入参展商"/>
            </a-form-model-item>
            <a-form-model-item label="展位号">
              <a-input v-model="serachVal.exhibitors015" placeholder="请输入展位号"/>
            </a-form-model-item>
            <!-- <a-form-model-item label="搭建商">
              <a-input v-model="serachVal.exhibitors017" />
            </a-form-model-item> -->
            <a-form-model-item label="总体审核状态">
              <a-select v-model="serachVal.approvalStatus" style="width:200px">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="0">不合格</a-select-option>
                  <a-select-option value="1">合格</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item>
              <a-button type="primary" icon="search" @click="searchFn">查询</a-button>
            </a-form-model-item>
          </a-form-model>
        </div>
        <div class="colorTip">
<!--          <div class="colorItem"><div class="colorBox" style="background:blue"></div><span>修改后的</span></div>-->
<!--          <div class="colorItem"><div class="colorBox" style="background:yellow"></div><span>不合格</span></div>-->
<!--          <div class="colorItem"><div class="colorBox" style="background:red"></div><span>合格</span></div>-->
<!--          <div class="colorItem"><div class="colorBox" style="background:lime"></div><span>已阅</span></div>-->
          <div class="colorItem"><div class="colorBox" style="background:blue"></div><span>修改后的</span></div>
          <div class="colorItem"><div class="colorBox" style="background:red"></div><span>不合格</span></div>
          <div class="colorItem"><div class="colorBox" style="background:lime"></div><span>合格</span></div>
          <div class="colorItem"><div class="colorBox" style="background:yellow"></div><span>已阅</span></div>
        </div>
        <div class="table-box">
          <a-table
            bordered
            :columns="columns"
            :data-source="data"
            :loading="tableLoading"
            :pagination="pagination"
            rowKey="id"
            @change="paginationChange"
            :scroll="{x: 1700, y: 550}"
          >
            <span slot="id" slot-scope="id">
              <a @click="showDetail(id)">查看详情</a>
            </span>
            <span slot="drawingApprovalSummary" slot-scope="drawingApprovalSummary">
              <a-tag color="cyan" v-if="(drawingApprovalSummary !== null ? drawingApprovalSummary.approvalStatus : '') === '0'">不合格</a-tag>
              <a-tag color="blue" v-if="(drawingApprovalSummary !== null ? drawingApprovalSummary.approvalStatus : '') === '1'">合格</a-tag>
            </span>
            <span slot="exhibitors002" slot-scope="exhibitors002" >{{exhibitors002}}</span>
          </a-table>
        </div>
    </div>
    <a-modal
      title=''
      :visible="visible"
      :width="750"
      :footer=" false "
      @cancel="handleCancel"
    >
      <a-carousel style="width: 100%;height: 100%" arrows>
        <div slot="prevArrow" class="custom-slick-arrow" style="left: 10px;zIndex: 1" ><a-icon type="left-circle" /></div>
        <div slot="nextArrow"  class="custom-slick-arrow" style="right: 10px">
          <a-icon type="right-circle" />
        </div>
        <div v-for="(val, index) in imgListData" :key="index">
          <div v-if="val.drawingsType == '1'">
            <span>{{ val.name }}</span><a-button type="link" @click="window.open(val.url)">点击预览</a-button>
          </div>
          <img v-if="val.drawingsType == '0'" :src="val.url" alt="">
        </div>
      </a-carousel>
    </a-modal>
    <a id="fileDownload" style="display: none" :href="hrefString">下载查看合同</a>
  </div>
</template>

<script>
import Title from '@/components/Title'
import TableMixIn from '@/mixins'
import { mainDrawingApproveList, drawingsAll, fileDownload } from '@/api'
import { getLocalInfo } from '@/utils'
export default {
  mixins: [TableMixIn],
  components: {
    Title
  },
  data() {
    return {
      window: window,
      visible: false,
      imgListData: [],
      columns: [],
      frontColumns: [
        { title: '展位号', dataIndex: 'exhibitors015', align: 'center', key: 'exhibitors015' },
        { title: '总体审核状态', dataIndex: 'drawingApprovalSummary', width: 120, key: 'drawingApprovalSummary', scopedSlots: { customRender: 'drawingApprovalSummary' }, align: 'center' },
        { title: '参展商', dataIndex: 'exhibitors002', align: 'center' }
      ],
      middleColumns: [],
      backColumns: [
        { title: '最后一次上传时间', dataIndex: 'drawingApprovalVoList', align: 'center', key: 'submissionDate', customRender: (text, row, index) => { return <div>{text[0] ? text[0].submissionDate : ''}</div> } },
        { title: '最后一次审核时间', dataIndex: 'drawingApprovalSummary', align: 'center', key: 'approvalDate', customRender: (text, row, index) => { return <div>{text ? text.submissionDate : ''}</div> } },
        { title: '操作', dataIndex: 'id', fixed: 'right', width: 100, align: 'center', scopedSlots: { customRender: 'id' } }
      ],
      userInfo: '',
      serachVal: {
        exhibitorsName: '',
        exhibitors015: '', // 展位号
        approvalStatus: '', //  审批状态
        exhibitors017: '' // 搭建商名称
      },
      data: [],
      tableLoading: false,
      pinjieStr: [],
      hrefString: ''
    }
  },
  created() {
  },
  async mounted() {
    this.userInfo = getLocalInfo()
    var _data = await this.drawingsAll() // 获取已选择图纸
    if (_data.length > 0) {
      this.middleColumns = _data.map(item => {
        var that = this
        var _item = {
          title: item.drawingName,
          align: 'center',
          dataIndex: 'drawing_' + item.id,
          key: 'drawing_' + item.id,
          width: 110,
          customRender: (text, row, index) => {
            var child = that.$createElement('div', {
              class: [],
              on: {
                click: function () {
                  that.showImg(text, item.drawingType)
                }
              }
            }, [
              this.$createElement('div', { class: ['tdBox', text.status] }, text.val),
              this.$createElement('div', { class: ['tdColor', text.status] }, '')
            ])
            var obj = {
              children: child,
              attrs: {}
            }
            return obj
          }
        }
        this.pinjieStr.push({
          id: item.id,
          key: 'drawing_' + item.id
        })
        return _item
      })
    }
    this.columns = [...this.frontColumns, ...this.middleColumns, ...this.backColumns]
    this.getDataList()
  },
  methods: {
    handleCancel() {
      this.visible = false
    },
    // 查看上传图纸
    showImg(text, drawingType) {
      console.log(text.imgList)
      if (drawingType == 1) {
        text.imgList.forEach(item => {
          const params = { filename: item.name }
          const config = { responseType: 'blob' }
          fileDownload(params, config).then(res => {
            const downContent = res.data
            const downBlob = new Blob([downContent])
            const downFileName = item.name
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
        })
      } else {
        if (text.imgList.length > 0) {
          this.imgListData = text.imgList
          this.visible = true
        }
      }
    },
    searchFn() {
      this.pagination.current = 1
      this.getDataList()
    },
    paginationChange(pagination) {
      this.pagination.current = pagination.current
      this.getDataList()
    },
    //  查看详情
    showDetail(val) {
      this.$router.push({
        path: '/home/drawings-audit/detail',
        query: { id: val }
      })
    },
    // 获取已经选择的
    drawingsAll() {
      return new Promise((resolve, reject) => {
        drawingsAll({
          showId: this.userInfo.showId,
          userId: this.userInfo.userId
        }).then(res => {
          if (res.code === 1000) {
            resolve(res.data)
          } else {
            this.$message.error('获取失败')
          }
        })
      })
    },
    // 获取列表
    getDataList() {
      var _paramt = {
        showId: this.userInfo.showId,
        userId: this.userInfo.userId,
        exhibitorsName: this.serachVal.exhibitorsName,
        exhibitors015: this.serachVal.exhibitors015,
        approvalStatus: this.serachVal.approvalStatus,
        exhibitors017: this.serachVal.exhibitors017,
        pageNum: this.pagination.current,
        pageRows: this.pagination.pageSize
      }
      this.tableLoading = true
      mainDrawingApproveList(_paramt).then(res => {
        if (res.code === 1000) {
          // console.log(res.data.list)
          var tempData = res.data.list
          for (var i = 0; i < tempData.length; i++) {
            tempData[i] = this.setData(tempData[i])
          }
          this.data = res.data.list
          this.pagination.total = res.data.total
        }
        this.tableLoading = false
      })
    },
    setData(arr) {
      for (var i = 0; i < this.pinjieStr.length; i++) {
        var _tmepObj = this.setVal(arr.drawingApprovalVoList, this.pinjieStr[i].id)
        arr[this.pinjieStr[i].key] = {
          val: _tmepObj.val,
          status: _tmepObj.status,
          imgList: _tmepObj.imgList
        }
      }
      return arr
    },
    setVal(arr, id) {
      var reTemp = {
        val: '',
        status: '',
        imgList: []
      }
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].drawingId === id) {
          if (arr[i].approvalStatus === '0' && arr[i].submitFrequency > 1) { // 二次提交
            reTemp.status = 'blue'
          }
          if (arr[i].approvalStatus === '1') { // 通过
            reTemp.status = 'lime'
          }
          if (arr[i].approvalStatus === '2') { // 未通过
            reTemp.status = 'red'
          }
          if (arr[i].approvalStatus === '3') { // 已阅
            reTemp.status = 'yellow'
          }
          arr[i].drawingApprovalRecordList.map(val => {
            reTemp.val += val.submitFrequency + ','
            reTemp.imgList.push(...JSON.parse(val.url))
            return val
          })
          reTemp.val = reTemp.val.substr(0, reTemp.val.length - 1)
        }
      }
      return reTemp
    }
  }
}
</script>
<style lang="less">
.table-box{
  padding-top:20px
}
.ant-table-tbody td{
  position: relative;
}
.blue{
  background: #0000FF;
  color:#fff
}
.red{
  background: #ff0000;
  color:#fff;
}
.yellow{
  background: #FFFF00;
  color:#000;
}
.lime{
  background: #00FF00;
  color:#fff
}
.tdBox{
  position: relative;
  z-index: 1;
  cursor: pointer;
}
.tdColor{
  word-wrap:break-word;
  position: absolute;
  left:0;
  top:0;
  width:100%;
  height:100%;
  cursor: pointer;
}

.ant-carousel .slick-slide {
  text-align: center;
  height: 400px;
  overflow: hidden;
  position: relative;
}

.ant-carousel .custom-slick-arrow {
  width: 25px;
  height: 25px;
  font-size: 38px;
  color: rgba(0,0,0,.45);
}
.ant-carousel .custom-slick-arrow:before {
  display: none;
}
.ant-carousel .custom-slick-arrow:hover {
  color: rgba(0,0,0,.45);
}
.ant-carousel .slick-slide img{
  position: absolute;
  max-width: 100%;
  max-height: 100%;
  top:0;
  right:0;
  left:0;
  bottom:0;
  margin:auto;
}
.colorTip{
  font-size: 16px;
  vertical-align: middle;
  padding-top: 20px;
}
.colorItem { display: inline-block;padding-right: 20px;}
.colorItem .colorBox{
  display: inline-block;
  width:20px;
  height: 20px;
  border-radius: 5px;
  background: red;
  vertical-align: middle;
  margin-right: 10px;
}
.colorItem span{
  display: inline-block;
  vertical-align: middle;
}
</style>
