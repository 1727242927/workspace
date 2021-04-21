<template>
  <a-modal
    title="结算单"
    width="50%"
    :visible="settleVisible"
    :footer="null"
    @cancel="handleCancel"
  >
    <div>
      <SettleTable
        :spinning="spinning"
        :data="data"
      />
      <div class="customer-footer">
        <a-button key="back" @click="handleCancel">取消</a-button>
        <!-- <a-button key="sure" class="sure" type="primary" :loading="sureLoading" @click="sureClick">确认无误</a-button> -->
      </div>
    </div>
  </a-modal>
</template>

<script>
import SettleTable from '@/components/settleTable'
import { settleDetail, expSettleSure } from '@/api'

export default {
  props: {
    settleVisible: {
      type: Boolean,
      default: false
    },
    recordId: {
      type: Number,
      default: -1
    }
  },
  components: {
    SettleTable
  },
  data() {
    return {
      sureLoading: false,
      spinning: false,
      data: {}
    }
  },
  methods: {
    settleDetail() {
      const params = {
        id: this.recordId
      }
      this.spinning = true
      settleDetail(params).then(res => {
        const { data } = res
        this.spinning = false
        this.data = data
      }).catch(err => {
        this.spinning = false
        console.log(err)
      })
    },
    sureClick() {
      this.sureLoading = true
      const id = this.recordId
      const params = { id }
      expSettleSure(params).then(res => {
        const { message, data } = res
        this.sureLoading = false
        this.$emit('refresh')
        this.handleCancel()
        this.$message.success(message)
      }).catch(err => {
        this.sureLoading = false
        console.log(err)
      })
    },
    handleCancel() {
      this.$emit('update:settleVisible', false)
      this.data = {}
    }
  },
  watch: {
    settleVisible: {
      handler(value) {
        if (value) {
          this.settleDetail()
        }
      },
      immediate: false
    }
  }
}
</script>

<style lang="less" scoped>
.customer-footer {
  text-align: right;
  padding: 20px 0 0;
  .sure {
    margin: 0 18px;
  }
}
</style>