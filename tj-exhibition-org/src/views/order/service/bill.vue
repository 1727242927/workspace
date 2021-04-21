<template>
  <div>
    <Bill :data="billData"/>
  </div>
</template>

<script>
import Bill from '@/components/Bill'
import { generatePayFeeNotice } from '@/api'

export default {
  components: {
    Bill
  },
  created() {
    this.getBillData()
  },
  data() {
    return {
      billData: {}
    }
  },
  methods: {
    async getBillData() {
      const query = this.$route.query
      const params = { orderId: query.orderId || '' }
      const result = await generatePayFeeNotice(params)
      const { code, data } = result
      if (code === 1000) {
        this.billData = data
      }
    }
  }
}
</script>