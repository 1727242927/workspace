<template>
  <a-modal
    v-model="visible"
    title="扫我支付"
  >
    <template slot="footer">
      <a-button key="back" type="primary" @click="handleCancel">知道了</a-button>
    </template>
    <div class="qr-code-content">
      <div class="inner">
        <img src="./qrCode.png" alt="二维码" width="120px" height="120px">
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  data() {
    return {
      visible: false
    }
  },
  methods: {
    handleCancel() {
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
.qr-code-content {
  width: 100%;
  display: flex;
  justify-content: center;
  .inner {
    width: 120px;
    height: 120px;
  }
}
</style>