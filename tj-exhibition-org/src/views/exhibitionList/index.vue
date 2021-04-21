<template>

  <div class="exhibition">
    <a-layout id="components-layout-demo-custom-trigger">
      <a-layout-header class="components-layout-header clearfix">
        <div class="layout-header-left">
          <img src="../../assets/img/logo.png" width="34" height="34" alt="logo" />
          <span class="title">主场业务管理系统</span>
        </div>
        <div class="layout-header-right clearfix">
          <a-button type="link" @click="logout">退出登录</a-button>
          <a-button type="primary" @click="goSystem">系统管理</a-button>
        </div>
      </a-layout-header>
      <a-layout-content
        :style="{
          margin: '1px 0px',
          padding: '10px 24px 10px',
          background: '#fff',
          height: 'calc(100% - 74px)',
          overflowY: 'scroll'
        }"
      >
        <section class="exhibition-list">
          <div class="exhitibion-search-wrapper">
            <a-form layout="inline" :form="form">
              <a-form-item label="开展日期">
                <a-range-picker v-decorator="['date']" />
              </a-form-item>
              <a-form-item>
                <a-form-item label="展会名称">
                    <a-input v-decorator="['show002']" placeholder="请输入展会名称" allowClear></a-input>
                </a-form-item>
                <a-button type="primary" @click="handleSearch">查询</a-button>
              </a-form-item>
            </a-form>
          </div>
          <a-table
            rowKey="id"
            :columns="columns"
            :data-source="data"
            :pagination="pagination"
            :customRow="clickRow"
            :loading="tableLoading"
            @change="paginationChange"
            :rowClassName="() => 'table-row-cursor'"
            :scroll="{y: 550}"
          >
            <span slot="oe" slot-scope="text">
              <a-tag :color="text === 0 ? 'cyan' : 'blue'">
              {{renderText(text)}}
              </a-tag>
            </span>
          </a-table>
        </section>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
import TableMixIn from '@/mixins'
import { getExhibition, orgLogout, saveExhibition } from '@/api'
import { getLocalStorageItem } from '@/utils'

const columns = [
  { title: '展会编号', dataIndex: 'show001', align: 'center' },
  { title: '展会名称', dataIndex: 'show002', align: 'center' },
  { title: '展会类型', dataIndex: 'oe', align: 'center', scopedSlots: { customRender: 'oe' } },
  { title: '开始日期', dataIndex: 'show005', align: 'center' },
  { title: '结束日期', dataIndex: 'show0051', align: 'center' }
]

export default {
  mixins: [TableMixIn],
  data() {
    return {
      data: [],
      columns,
      form: this.$form.createForm(this)
    }
  },
  created() {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'))
    // eslint-disable-next-line eqeqeq
    if (userInfo.isVerify == 2) {
      let that = this
      this.$confirm({
        title: '审核不通过!',
        content: '请前往[系统管理]修改信息并重新提交审核~',
        onOk() {
          that.$router.push({
            path: '/system'
          })
        },
        onCancel() {
        }
      })
    } else {
      this.getExhibitionList()
    }
  },
  methods: {
    getExhibitionList() {
      this.tableLoading = true
      const params = {
        pageRows: this.pagination.pageSize,
        pageNum: this.pagination.current,
        ...this.searchData
      }
      getExhibition(params).then(res => {
        this.tableLoading = false
        const code = res.code
        if (code === 1000) {
          this.data = res.data.list
          this.pagination.total = res.data.total
        }
      }, err => {
        this.tableLoading = false
        console.log(err)
      })
    },
    handleSearch() {
      this.pagination.current = 1
      const value = this.form.getFieldsValue()
      if (value.date && value.date.length > 0) {
        value.show005StartTime = value.date[0].format('YYYY-MM-DD HH:mm:ss')
        value.show005EndTime = value.date[1].format('YYYY-MM-DD HH:mm:ss')
      }
      // searchData 自定义属性
      this.searchData = value
      this.getExhibitionList()
    },
    paginationChange(pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getExhibitionList()
    },
    clickRow(record) {
      return {
        on: {
          click: () => {
            const userInfo = getLocalStorageItem('userInfo')
            // isVerify 0-未审核，1-审核通过，2-审核不通过
            if (userInfo.isVerify === 1) {
              this.saveExhibition(record)
            } else if (userInfo.isVerify === 2) {
              this.$message.warning('请在【系统管理】【用户信息】界面修改资料！')
            }
          }
        }
      }
    },
    saveExhibition(record) {
      const params = {
        showId: record.id
      }
      this.tableLoading = true
      saveExhibition(params).then(res => {
        this.tableLoading = false
        const data = {
          id: record.id,
          show002: record.show002, // 展会中文名称
          oe: record.oe
        }
        // 保存数据
        localStorage.setItem('currentExhibition', JSON.stringify(data))
        this.$store.dispatch('user/setExhibition', data)
        this.$router.push({
          path: '/home'
        })
      }).catch(err => {
        this.tableLoading = false
        console.log(err)
      })
    },
    async logout() {
      try {
        const result = await orgLogout()
        // 清除storage
        const storageKey = ['userInfo', 'currentExhibitor', 'currentExhibition']
        storageKey.forEach(key => {
          localStorage.setItem(key, '')
        })
        this.$store.dispatch('user/clearExhibition')
        this.$message.success(result.message)
        this.$router.push({ path: '/login' })
      } catch (error) {
        console.log(error)
      }
    },
    goSystem() {
      this.$router.push({
        path: '/system'
      })
    },
    renderText(text) {
      if (text !== undefined) {
        return text === 0 ? '客展' : '自办展'
      }
      return text
    }
  }
}
</script>

<style lang="less" scoped>
.exhibition {
  min-width: 1300px;
  height: 100%;
  .exhibition-list {
    .exhitibion-search-wrapper {
      margin-bottom: 10px;
      .oprate {
        text-align: right;
      }
    }
  }
}
#components-layout-demo-custom-trigger {
  height: 100%;
  .components-layout-header {
    background: #1f2033;
    padding: 0 20px;
    .layout-header-left {
      height: 100%;
      float: left;
      img {
        vertical-align: middle;
      }
      .title {
        vertical-align: middle;
        font-size: 18px;
        color: #fff;
        margin-left: 14px;
      }
    }
    .layout-header-right {
      float: right;
      height: 100%;
      .current-exhibition-info {
        margin-right: 40px;
        float: left;
        h1 {
          margin-bottom: 0;
          color: #fff;
          font-size: 18px;
        }
      }
      .user-info {
        float: right;
        display: flex;
        margin-right: 200px;
        .logout-icon {
          font-size: 20px;
          padding: 5px;
          cursor: pointer;
        }
      }
    }
  }
  .layout-header {
    background: #fff;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    padding: 0;
    .trigger {
      float: left;
      font-size: 18px;
      line-height: 50px;
      padding: 0 24px;
      cursor: pointer;
      transition: color 0.3s;
      &:hover {
        color: #1890ff;
      }
    }
  }
}
</style>
