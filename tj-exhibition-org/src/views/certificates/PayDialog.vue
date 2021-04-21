<template functional>
  <div class="pay-box">
    <div class="pay-title-box">
      <h2>温馨提示</h2>
    </div>
    <div class="pay-content">
      订单系统收款会略有延迟，支付成功后可刷新订单查看结果。
    </div>
    <div />
  </div>
</template>

<script>
export default {
  name: 'PayDialog'
}
</script>

<style scoped lang="css">
.pay-box{
  width: 100%;
}
.pay-title-box{
  text-align: center;
}
.pay-content{
  width: 100%;
  font-size: 18px;
}
</style>
