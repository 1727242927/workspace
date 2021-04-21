<template>
  <div class="page-title clearfix">
    <slot></slot>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<style lang="less" scoped>
.page-title {
  height: 26px;
  padding-left: 10px;
  position: relative;
  font-size: 16px;
  line-height: 26px;
  margin-bottom: 14px;
  color: rgba(0, 0, 0, 0.65);
  -webkit-user-select: none;
  .right {
    float: right;
  }
  &&::before{
    content: '';
    position: absolute;
    left: -5px;
    top: 0;
    width: 5px;
    height: 26px;
    background: #1890ff;
  }
}
</style>