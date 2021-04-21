<template>
    <div class="certificates-people">
    <div>
      <Title>结算详情</Title>
      <div class="defautlTable">
        <SettleTable
          :spinning="spinning"
          :data="data"
        />
      </div>
      <div class="btnCollect">
        <!-- <a-button type="primary" :loading="sureBtnLoading" @click="sureClick">确认已结算</a-button>
        <a-button type="primary" style="margin-left:20px" @click="genPayCost">生成缴费通知</a-button> -->
        <a-button type="primary" style="margin-left:20px" @click="goBack">返回</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import Title from '@/components/Title'
import SettleTable from '@/components/settleTable'
import { settleDetail, settleSure } from '@/api'

export default {
  components: {
    Title,
    SettleTable
  },
  data() {
    return {
      data: {},
      spinning: false,
      sureBtnLoading: false
    }
  },
  created() {
    this.settleDetail()
  },
  methods: {
    settleDetail() {
      const id = this.$route.query.id
      const params = { id }
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
    goBack() {
      this.$router.back()
    },
    sureClick() {
      const id = this.$route.query.id
      const params = { id }
      this.sureBtnLoading = true
      settleSure(params).then(res => {
        const { message } = res
        this.sureBtnLoading = false
        this.$message.success(message)
        this.settleDetail()
      }).catch(err => {
        this.sureBtnLoading = false
        console.log(err)
      })
    }
  }
}
</script>
<style lang="less">
.formTitle{
  text-align: center;
  padding: 20px;
  font-size: 18px;
}
.btnCollect{
  padding:20px;
  text-align: right;
}
</style>
