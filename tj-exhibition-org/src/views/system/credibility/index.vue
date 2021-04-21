<template>
  <div class="credibility">
    <Title>信誉查询</Title>
    <div class="content">
      <div class="title">当前等级：</div>
      <div>
        <a-select default-value="1" style="width: 120px">
        <a-select-option value="1">钻石</a-select-option>
        <a-select-option value="2">白金</a-select-option>
        <a-select-option value="3">黄金</a-select-option>
        <a-select-option value="4">普通</a-select-option>
      </a-select>
      </div>
    </div>
  </div>
</template>

<script>
import Title from '@/components/Title'

export default {
  components: {
    Title
  }
}
</script>

<style lang="less" scoped>
.credibility {
  .content {
    display: flex;
    height: 32px;
    .title {
      line-height: 32px;
    }
  }
}
</style>