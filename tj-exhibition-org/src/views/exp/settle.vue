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
        <a-button key="back" class="back" @click="handleCancel">取消</a-button>
        <!-- <a-button key="submit" type="primary" :loading="confirmLoading" @click="createSettleRecord">生成结算记录</a-button> -->
      </div>
    </div>
  </a-modal>
</template>

<script>
import SettleTable from '@/components/settleTable'
import { orgExpSettle, settleAdd } from '@/api'
import { getLocalInfo } from '@/utils'

export default {
  props: {
    settleVisible: {
      type: Boolean,
      default: false
    },
    builderId: {
      type: Number,
      default: -1
    }
  },
  components: {
    SettleTable
  },
  data() {
    return {
      confirmLoading: false,
      spinning: false,
      data: {}
    }
  },
  methods: {
    settleDetail() {
      const { userId, showId } = getLocalInfo()
      const params = {
        userId,
        showId,
        builderId: this.builderId
      }
      this.spinning = true
      orgExpSettle(params).then(res => {
        const { code, data } = res
        this.spinning = false
        if (code === 1000) {
          this.data = data
        }
      }).catch(err => {
        this.spinning = false
        console.log(err)
      })
    },
    createSettleRecord(e) {
      const { userId, userName, showId } = getLocalInfo()
      const { yingfuPrice, yifuPrice, yuPrice, builderName } = this.data
      const params = {
        homeCourtId: userId,
        showId,
        standFittingContractorId: this.builderId,
        settlementActualCollectionAmount: yifuPrice,
        settlementOutstandingAmount: yuPrice,
        settlementReceivableAmount: yingfuPrice,
        standFittingContractorName: builderName,
        homeCourtName: userName
      }
      this.confirmLoading = true
      settleAdd(params).then(res => {
        const { message } = res
        this.confirmLoading = false
        this.$emit('refresh')
        this.handleCancel()
        this.$message.success(message)
      }).catch(err => {
        this.confirmLoading = false
        console.log(err)
      })
    },
    handleCancel(e) {
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
  .back{
    margin-right: 20px;
  }
}
</style>