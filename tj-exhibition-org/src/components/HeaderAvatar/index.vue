<template>
  <div class="user-info-avatar">
    <a-dropdown placement="bottomCenter" :trigger="['hover']" @visibleChange="visibleChange">
      <div class="avatar-wrapper">
        <a-avatar icon="user" size="small"/>
        <span
          class="userName"
          :style="{color}"
        >
          {{userName}}
        </span>
        <a-icon
          type="down"
          class="down-icon"
          :class="{'rotate': visible}"
          :style="{marginLeft: '4px', fontSize: '14px', color}"
        />
      </div>
      <a-menu slot="overlay">
        <a-menu-item key="1" style="color: rgba(0 ,0 ,0 , 0.8);font-weight: bold">
          你好，{{userName}}
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item key="2" @click="goBack">
          <a-icon type="home" class="menu-item-icon" style="font-size: 14px;margin-right: 8px"/>
          <span style="color: #000">返回首页</span>
        </a-menu-item>
        <slot></slot>
        <a-menu-item key="3" @click="goSystem" v-if="system">
          <a-icon type="setting" class="menu-item-icon" style="font-size: 14px;margin-right: 8px"/>
          <span style="color: #000">系统管理</span>
        </a-menu-item>
        <a-menu-item key="4" @click="logout">
          <a-icon type="logout" class="menu-item-icon" style="font-size: 14px;margin-right: 8px"/>
          <span style="color: #000">退出登录</span>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
import { getLocalStorageItem } from '@/utils'
import { orgLogout } from '@/api'

export default {
  props: {
    system: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: 'rgba(0 ,0 ,0 , 0.8)'
    }
  },
  data() {
    return {
      userName: '',
      visible: false
    }
  },
  created() {
    this.setUserName()
  },
  methods: {
    setUserName() {
      const { userName } = getLocalStorageItem('userInfo')
      this.userName = userName
    },
    logout() {
      const storageKey = ['userInfo', 'currentExhibitor', 'currentExhibition']
      storageKey.forEach(key => {
        localStorage.setItem(key, '{}')
      })
      this.logoutRequest()
    },
    async logoutRequest() {
      try {
        const result = await orgLogout()
        const { message } = result
        this.$router.push({ path: '/login' })
        this.$message.success(message)
      } catch (error) {
        console.log(error)
      }
    },
    goBack() {
      this.$router.push({
        path: '/exhibition'
      })
    },
    goSystem() {
      this.$router.push({
        path: '/system'
      })
    },
    visibleChange(visible) {
      this.visible = visible
    }
  }
}
</script>

<style lang="less" scoped>
.down-icon {
  display: inline-block;
  transition: transform .3s;
  transform: rotateZ(0deg);
  &.rotate {
    transform: rotateZ(-180deg);
  }
}
</style>