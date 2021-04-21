<template>
  <a-dropdown :trigger="['hover']" v-model="show">
    <div slot="overlay">
      <a-tabs class="dropdown-tabs" :tabBarStyle="{textAlign: 'center'}" :style="{width: '297px'}">
        <a-tab-pane tab="通知" key="1">
          <a-list class="tab-pane">
            <div class="bell-dropdown-menu">
              <div class="bell-dropdown-menu-item">
                <div class="title">主体认证：</div>
                <div class="content">
                  <a-tag color="#2db7f5">{{companyType}}</a-tag>
                </div>
              </div>
              <div class="bell-dropdown-menu-item">
                <div class="title">认证有效期：</div>
                <div class="content">{{formateDate}}</div>
              </div>
              <div class="bell-dropdown-menu-item">
                <div class="title">预存款：</div>
                <div class="content">10000.00 元</div>
              </div>
            </div>
          </a-list>
        </a-tab-pane>
        <a-tab-pane tab="消息" key="2">
          <a-list class="tab-pane"></a-list>
        </a-tab-pane>
        <a-tab-pane tab="待办" key="3">
          <a-list class="tab-pane"></a-list>
        </a-tab-pane>
      </a-tabs>
    </div>
    <span class="header-notice">
      <a-avatar class="bell-wrapp" icon="bell" size="small"/>
    </span>
  </a-dropdown>
</template>

<script>
import { getUsefulLife } from '@/api'

export default {
  data() {
    return {
      show: false,
      validStartTime: '',
      validEndTime: '',
      type: 0
    }
  },
  computed: {
    formateDate() {
      if (!this.validStartTime && !this.validEndTime) {
        return '暂无数据'
      }
      let start = this.checkDate(this.validStartTime)
      let end = this.checkDate(this.validEndTime)
      return `${start} - ${end}`
    },
    companyType() {
      switch (this.type) {
        case 1:
          return '主场'
        case 2:
          return '搭建商'
        case 3:
          return '主运'
        default:
          return '暂无数据'
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      getUsefulLife({}).then(res => {
        const { data } = res
        this.validStartTime = data.validStartTime
        this.validEndTime = data.validEndTime
        this.type = data.companyType
      }).catch(err => {
        console.log(err)
      })
    },
    checkDate(date) {
      if (date) {
        return date.slice(0, 10)
      } else {
        return '暂无数据'
      }
    }
  }
}
</script>

<style lang="less">
  .header-notice{
    transition: all 0.3s;
    span {
      vertical-align: initial;
    }
    .notice-badge{
      color: inherit;
      .header-notice-icon{
        font-size: 16px;
        padding: 4px;
      }
    }
    .bell-wrapp {
      vertical-align: top;
      margin-top: 13px;
    }
  }
  .dropdown-tabs{
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    .tab-pane{
      padding: 0 24px 12px;
      min-height: 200px;
      .bell-dropdown-menu {
        user-select: none;
        .bell-dropdown-menu-item {
          list-style: none;
          height: 40px;
          border-bottom: 1px solid #eeeeee;
          display: flex;
          line-height: 40px;
          .title {
            font-size: 14px;
            width: 90px ;
            text-align: right;
          }
          .content {
            flex: 1;
            overflow: hidden;
          }
        }
      }
    }
  }
</style>
