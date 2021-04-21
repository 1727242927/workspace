<template>
  <div class="system-layout">
    <a-layout id="components-layout-demo-top-side-2">
      <a-layout-header class="system-header">
        <div class="logo">系统管理</div>
        <div class="user-info-nav">
          <HeaderBell class="header-top-item"/>
          <HeaderAvatar
            class="header-top-item"
            :system="false"
            color="#fff"
          />
        </div>
      </a-layout-header>
      <a-layout style="height: 'calc(100% - 50px)">
        <a-layout-sider width="200" style="background: #fff">
          <a-menu
            mode="inline"
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
        <a-layout style="padding: 0 0 12px 12px">
          <a-layout-content
            :style="{
              background: '#fff',
              padding: '20px',
              margin: 0,
              height: 'calc(100% - 50px)',
              overflowY: 'scroll'
            }"
          >
            <router-view />
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import SubMenu from '@/components/subMenu'
import MenuList from '@/menu/system'
import HeaderAvatar from '@/components/HeaderAvatar'
import HeaderBell from '@/components/HeaderBell'
import { getLocalStorageItem } from '@/utils'

export default {
  components: {
    SubMenu,
    HeaderAvatar,
    HeaderBell
  },
  data() {
    return {
      list: [],
      openKeys: []
    }
  },
  mounted() {
    // 过滤路由
    this.setMenuList()
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
    setMenuList() {
      const userInfo = getLocalStorageItem('userInfo')
      const menuList = JSON.parse(JSON.stringify(MenuList))
      if (userInfo.isVerify === 2) {
        // 审核未通过 只显示用户中心-用户信息
        this.list = menuList.filter(item => {
          if (item.children) {
            item.children = item.children.filter(child => child.title === '用户信息')
          }
          return item.title === '用户中心'
        })
      } else {
        this.list = MenuList
      }
    }
  }
}
</script>

<style lang="less" scoped>
.system-layout {
  height: 100%;
}
.ant-layout-header{
  padding: 0 !important;
}
#components-layout-demo-top-side-2 {
  height: 100%;
  padding: 0 !important;
  .system-header {
    display: flex;
    justify-content: space-between;
    .user-info-nav {
      display: flex;
      padding-right: 20px;
    }
  }
  .logo {
    width: 120px;
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 9px 28px 9px 20px;
    float: left;
    color: #fff;
    text-align: center;
    line-height: 32px;
  }
}
</style>
