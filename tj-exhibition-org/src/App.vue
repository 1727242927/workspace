<template>
  <div id="app">
    <a-config-provider :getPopupContainer="getPopupContainer" :locale="locale">
      <router-view />
    </a-config-provider>
  </div>
</template>

<script>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'

moment.locale('zh-cn')

export default {
  data() {
    return {
      locale: zhCN
    }
  },
  methods: {
    getPopupContainer(el, dialogContext) {
      if (dialogContext) {
        return dialogContext.getDialogWrap()
      } else {
        return document.body
      }
    }
  }
}
</script>

<style lang="less">
html, body {
  height: 100%;
  font-family: Microsoft YaHei;
}
#app {
  height: 100%;
}
</style>
