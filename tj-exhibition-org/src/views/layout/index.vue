<template>
  <div class="main">
    <a-layout id="components-layout-demo-custom-trigger">
      <a-layout-header class="components-layout-header clearfix">
        <div class="layout-header-left">
          <img src="../../assets/img/logo.png" width="34" height="34" alt="logo" />
          <span class="title">主场业务管理系统</span>
        </div>
        <div class="layout-header-right clearfix">
          <div class="current-exhibition-info">
            <h1>{{currentExihibition}}</h1>
          </div>
          <div class="user-info">
            <HeaderBell class="header-top-item"/>
            <HeaderAvatar
              class="header-top-item"
              color="#ffffff"
              :system="true"
            />
          </div>
        </div>
      </a-layout-header>
      <a-layout>
        <a-layout-sider style="height:calc(100%); overflow-y: auto;" v-model="collapsed" :trigger="null" collapsible>
          <a-menu
            mode="inline"
            theme="dark"
            :inline-collapsed="collapsed"
            :selected-keys="[$route.path]"
            :open-keys="openKeys"
            @openChange="changeOpen"
          >
            <template v-for="item in list">
              <a-menu-item v-if="!item.children" :key="item.key">
                <router-link :to="item.path">
                  <a-icon :type="item.icon ? item.icon : 'pie-chart'" />
                  <span>{{ item.title }}</span>
                </router-link>
              </a-menu-item>
              <sub-menu v-else :key="item.key" :menu-info="item" />
            </template>
          </a-menu>
        </a-layout-sider>
        <a-layout>
          <div class="layout-header clearfix">
            <!-- <a-icon
              class="trigger"
              :type="collapsed ? 'menu-unfold' : 'menu-fold'"
              @click="toggleCollapsed"
            /> -->
            <tags-view />
          </div>
          <a-layout-content
            :style="{
              margin: '1px 0px',
              padding: '10px 24px 10px',
              background: '#fff',
              height: 'calc(100% - 74px)',
              overflowY: 'scroll'
            }"
          >
            <router-view></router-view>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import SubMenu from '@/components/subMenu'
import MenuList from '@/menu'
import HeaderAvatar from '@/components/HeaderAvatar'
import HeaderBell from '@/components/HeaderBell'
import TagsView from '@/components/TagsView'
import { mapGetters } from 'vuex'

export default {
  components: {
    SubMenu,
    HeaderAvatar,
    HeaderBell,
    TagsView
  },
  data() {
    return {
      collapsed: false,
      list: MenuList,
      currentExihibition: '',
      openKeys: []
    }
  },
  computed: {
    // ...mapGetters(['permissionRoutes'])
  },
  mounted() {
    this.getExhibitionName()
    // 刷新设置openKeys
    this.resetOpenKeys()
  },
  methods: {
    changeOpen(keys) {
      const currentOpenKey = keys.find(key => this.openKeys.indexOf(key) === -1)
      const children = this.list[0].children
      if (children && children.findIndex(item => item.path === currentOpenKey) === -1) {
        this.openKeys = keys
      } else {
        this.openKeys = currentOpenKey ? [currentOpenKey] : []
      }
    },
    resetOpenKeys() {
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      if (matched.length > 1) {
        this.openKeys = matched.map(item => item.path)
      }
    },
    toggleCollapsed() {
      this.collapsed = !this.collapsed
    },
    getExhibitionName() {
      const dataString = localStorage.getItem('currentExhibition') || '{}'
      const data = JSON.parse(dataString)
      this.currentExihibition = data.show002
    }
  }
}
</script>
<style lang="less">
.main {
  height: 100%;
  min-width: 1300px;
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
        //margin-right: 60px;
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
