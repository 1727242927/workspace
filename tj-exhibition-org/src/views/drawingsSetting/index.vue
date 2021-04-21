<template>
  <div class="drawings-setting">
    <Title>图纸设置</Title>
    <div class="content">
      <div class="title-wrap">
        <div class="item">未选择图纸</div>
        <div class="center"></div>
        <div class="item">已选择图纸</div>
      </div>
      <a-transfer
        show-search
        :data-source="data"
        :list-style="{
          width: '250px',
          height: '350px'
        }"
        :target-keys="targetKeys"
        :selected-keys="selectedKeys"
        :render="item => item.title"
        @change="handleChange"
        @selectChange="handleSelectChange"
      />
      <div class="footer">
        <a-button
          type="primary"
          :loading="btnLoading"
          :disabled="btnDisabled"
          @click="onSubmit"
          >提交</a-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import Title from '@/components/Title'
import { drawingsAll, getNewDrawingList, setDrawing, getDrawingList } from '@/api'

import { getLocalInfo } from '@/utils'

export default {
  components: {
    Title
  },
  data() {
    return {
      data: [],
      targetKeys: [],
      selectedKeys: [],
      btnLoading: false,
      btnDisabled: false
    }
  },
  created() {
    this.userInfo = getLocalInfo()
    this.getDrawingList()
    this.getData()
  },
  methods: {
    async getData() {
      const { showId, userId } = this.userInfo
      await drawingsAll({ showId, userId }).then(res => {
        this.targetKeys = res.data.map(item => item.id)
      })
    },
    async getDrawingList() {
      const userId = this.userInfo.userId
      const showId = this.userInfo.showId
      this.data = await getDrawingList({ userId }).then(res => {
        return res.data.map(item => ({
          key: item.id,
          title: item.drawingName,
          disabled: item.isUse == 0 ? true : false
        }))
      })
    },
    onSubmit() {
      const params = {
        drawingIds: this.targetKeys,
        showId: this.userInfo.showId,
        userId: this.userInfo.userId
      }
      this.btnLoading = true
      this.btnDisabled = true
      setDrawing(params)
        .then(res => {
          this.btnLoading = false
          this.btnDisabled = false
          this.$message.success(res.message)
        })
        .catch(err => {
          console.log(err)
          this.btnLoading = false
          this.btnDisabled = false
        })
    },
    handleChange(nextTargetKeys, direction, moveKeys) {
      this.targetKeys = nextTargetKeys
    },
    handleSelectChange(sourceSelectedKeys, targetSelectedKeys) {
      this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys]
    }
  }
}
</script>

<style lang="less" scoped>
.drawings-setting {
  user-select: none;
  .content {
    width: 540px;
    margin: 0 auto;
    .title-wrap {
      height: 40px;
      line-height: 40px;
      text-align: center;
      display: flex;
      .item {
        flex: 1;
        color: #2c3e50;
        font-weight: bold;
      }
      .center {
        flex: 0 1 40px;
      }
    }
    .footer {
      padding: 15px 0;
      text-align: right;
    }
  }
}
</style>
