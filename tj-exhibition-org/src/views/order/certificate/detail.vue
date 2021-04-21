<template>
  <div>
    <Title>证件订单详情</Title>
    <div class="certificate-btn-bar">
      <div style="font-weight: bolder" class="left-info">
        订单号：{{ orderNumber }}
      </div>
      <div class="right">
        <a-button type="primary" style="margin-right: 10px" @click="orderCacel">
          取消订单
        </a-button>
        <a-button type="primary" :loading="submitBtnLoading" style="margin-right: 10px" @click="payOrder">
          支付
        </a-button>
        <a-button
          type="primary"
          @click="
            () => {
              $router.back();
            }
          "
          >返回</a-button
        >
      </div>
    </div>
    <div class="table-wrapper">
      <component
        :is="currentComponent"
        :loading="loading"
        :data="data"
      ></component>
    </div>
    <!--支付结果查询遮罩-->
    <a-modal
      :visible="showResult"
      :maskClosable="false"
      @ok="payOver"
      @cancel="payOver"
    >
      <PayDialog/>
      <template  slot="footer">
        <div style="text-align: center">
          <a-button type="danger" @click="payOver">支付失败</a-button>
          <a-button type="primary" @click="payOver">支付成功</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script>
import Title from '@/components/Title'
import PersonDescriptions from './personDescriptions'
import CarDescriptions from './carDescriptions'
import { certificateDetail, orderReservation, orderCacel, getPayResult } from '@/api'
import PayDialog from '@/views/certificates/PayDialog.vue'

export default {
  components: {
    Title,
    PersonDescriptions,
    CarDescriptions,
    PayDialog
  },
  data() {
    return {
      data: [],
      loading: false,
      submitBtnLoading: false,
      orderNumber: null,
      currentComponent: 'PersonDescriptions',
      showResult: false,
      // 支付系统订单编号
      paySysOrderNumber: ''
    }
  },
  mounted() {
    const id = this.$route.query.id
    this.id = id
    this.getOrderInfo()
  },
  methods: {
    /**
     * @description: 查询支付结果
     * @author: 潘慧敏
     * @time: 2021-03-13 15:16:20
     * @param transactionType 支付类型：1-支付，2-退款
     * @param paySysOrderNumber 支付系统订单编号
     */
    payOver() {
      getPayResult({ paySysOrderNumber: this.paySysOrderNumber, transactionType: '1' }).then((res) => {
        if (res.code == 1000) {
          this.getOrderInfo()
          this.showResult = false
        }
      })
    },
    orderCacel() {
      this.$confirm({
        title: '取消订单?',
        content: '确认取消订单，该操作不可逆,确认?',
        onOk: () => {
          return new Promise((resolve, reject) => {
            const params = {
              orderId: this.id
            }
            orderCacel({ id: this.id }).then(res => {
              console.log(res)
              if (res.code == '1000' && res.data) {
                this.$message.success(res.message)
                setTimeout(() => {
                  resolve('成功')
                  this.$message.success('取消订单成功')
                  this.$router.back()
                }, 1000)
              } else {
                this.$message.error(res.message)
                resolve('接口失败')
              }
            }).catch(err => {
              resolve('失败')
              console.log(err)
            })
          })
        },
        onCancel() {}
      })
    },
    payOrder() {
      this.$confirm({
        title: '确认支付?',
        content: '确认支付后，将以1s后跳转支付页面',
        onOk: () => {
          return new Promise((resolve, reject) => {
            this.submitBtnLoading = true
            const params = {
              orderId: this.id
            }
            orderReservation(params).then(res => {
              if (res.code == '1000' && res.data) {
                this.paySysOrderNumber = res.data && res.data.orderNumber
                this.$message.success(res.message)
                setTimeout(() => {
                  resolve('成功')
                  window.open(res.data.payUrl)
                }, 1000)
                setTimeout(() => {
                  this.showResult = true
                }, 1000)
              } else {
                this.$message.error(res.message)
                resolve('接口失败')
              }
              this.submitBtnLoading = false
            }).catch(err => {
              resolve('失败')
              this.submitBtnLoading = false
              console.log(err)
            })
          })
        },
        onCancel() {}
      })
    },
    getOrderInfo() {
      const params = {
        id: this.id
      }
      this.loading = true
      certificateDetail(params)
        .then(res => {
          const type = res.data.certificatesType
          this.orderNumber = res.data.orderNumber
          this.loading = false
          if (type === '0') {
            this.currentComponent = 'PersonDescriptions'
            this.data = res.data.certificatesApplicationPersonVoList.map(
              list => ({
                ...list.certificatesPerson,
                jobLevelName: list.jobLevelName,
                applicationStatus: list.applicationStatus,
                expoExhibitorsId: list.expoExhibitorsId,
                certificatesPersonId: list.certificatesPersonId,
                key: list.id,
                avatar: JSON.parse(list.certificatesPerson.headPortrait)[0].url,
                certificatesRemarks: list.certificatesRemarks,
                certificatesPrice: list.certificatesPrice
              })
            )
          } else if (type === '1') {
            this.currentComponent = 'CarDescriptions'
            this.data = res.data.certificatesPersonneExhibitionVoList.map(
              item => ({
                ...item.certificatesVehicleWithBLOBs,
                ...item,
                exhibitors002: item.expoExhibitors.exhibitors002,
                exhibitors015: item.expoExhibitors.exhibitors015
              })
            )
          }
        })
        .catch(err => {
          this.loading = false
          console.log(err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.certificate-btn-bar {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left-info {
    width: 200px;
  }
  .right {
    margin-right: 10px;
  }
}
</style>
