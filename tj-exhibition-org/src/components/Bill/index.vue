<template>
  <div class="exp-bill">
    <div class="top">
      <a-button type="primary" @click="() => {$router.back()}">返回</a-button>
      <a-button type="primary" style="margin-left: 20px" @click="downLoad">下载pdf</a-button>
    </div>
    <div class="exp-bill-content" id="billPdf">
      <div class="exp-bill-header">
        <h1 class="title">缴费通知书</h1>
        <div class="title-en">
          <p>
            <a>PAYMENT INSTRUCTIONS</a>
          </p>
        </div>
        <div class="order-number">
          <span>订单号（No）</span>
          <span class="order-number-value">{{data.orderId}}</span>
        </div>
      </div>
      <div class="exp-exhibitor-info-wrap">
        <ul class="exp-exhibitor-info">
          <li class="exp-exhibitor-info-item">
            <div class="exp-exhibitor-info-inner">
              <div class="left">
                <span>单位名称</span>
                <span>Tenant Name</span>
              </div>
              <div class="right">卡四通-Hall 10-全馆</div>
            </div>
            <div class="exp-exhibitor-info-inner">
              <div class="left">
                <span>展会名称</span>
                <span>Exhibition Name</span>
              </div>
              <div class="right">{{data.showName}}</div>
            </div>
          </li>
          <li class="exp-exhibitor-info-item">
            <div class="exp-exhibitor-info-inner">
              <div class="left">
                <span>纳税人识别号</span>
                <span>Identification NO</span>
              </div>
              <div class="right">{{data.financial034}}</div>
            </div>
            <div class="exp-exhibitor-info-inner">
              <div class="left">
                <span>展位号</span>
                <span>Booth NO</span>
              </div>
              <div class="right">{{data.zwNum}}</div>
            </div>
          </li>
          <li class="exp-exhibitor-info-item">
            <div class="exp-exhibitor-info-inner">
              <div class="left">
                <span>地址、电话</span>
                <span>Add Tel</span>
              </div>
              <div class="right">{{data.financial035}}</div>
            </div>
            <div class="exp-exhibitor-info-inner">
              <div class="left">
                <span>日期</span>
                <span>Date</span>
              </div>
              <div class="right">{{data.date}}</div>
            </div>
          </li>
          <li class="exp-exhibitor-info-item">
            <div class="exp-exhibitor-info-inner">
              <div class="left">
                <span>开户银行及账号</span>
                <span>Bank account and account NO</span>
              </div>
              <div class="right">{{data.financial037}} {{data.financial038}}</div>
            </div>
          </li>
        </ul>
      </div>
      <div class="exp-table">
        <table align="center">
          <thead>
            <tr>
              <th width="124">序号/No</th>
              <th>项目内容 / Description</th>
              <th width="165">金额/Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in data.serviceVos" :key="index">
              <td>{{index + 1}}</td>
              <td>{{`${item.serviceName} ${item.unitPrice} * ${item.num}`}}</td>
              <td>{{item.totalValue}}</td>
            </tr>
            <!--  -->
            <tr class="color-white">
              <td colspan="2">合计（Total Amount）</td>
              <td colspan="1" style="color: #000000;text-align:center">{{data.totalValue}}</td>
            </tr>
            <tr class="color-white">
              <td colspan="2">备注 / Remark</td>
              <td colspan="1">
                <div>客户确认</div>
                <div>Customer Sign</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    downLoad() {
      this.html2pdf('billPdf', '缴费单')
    }
  }
}
</script>

<style lang="less" scoped>
.exp-bill {
  width: 100%;
  .top {
    width: 750px;
    margin: 0 auto;
    margin-bottom: 16px;
  }
  .exp-bill-content {
    width: 750px;
    margin: 0 auto;
    background: #66CCFF;
    padding: 20px 50px 50px;
    .exp-bill-header {
      padding: 20px 0;
      color: #fff;
      text-align: center;
      .title {
        color: #fff;
        font-size: 26px;
        margin-bottom: 4px;
      }
      .title-en {
        margin-bottom: 0;
        p {
          margin-bottom: 0;
          a {
            color: #ffffff;
            padding: 0 40px;
            border-bottom: 1px solid #ffffff;
          }
        }
      }
      .order-number {
        margin: 10px 0;
        text-align: center;
        .order-number-value {
          color: #000000;
        }
      }
    }
    .exp-exhibitor-info-wrap {
      margin-top: 20px;
      .exp-exhibitor-info {
        list-style: none;
        padding-left: 0;
        .exp-exhibitor-info-item {
          height: 42px;
          display: flex;
          padding-bottom: 8px;
          border-bottom: 1px solid #ffffff;
          margin-bottom: 8px;
          .exp-exhibitor-info-inner {
            flex: 1;
            display: flex;
            .left {
              display: flex;
              flex-direction: column;
              justify-content: center;
              color: #ffffff;
              padding: 2px 0;
            }
            .right {
              flex: 1;
              padding-left: 10px;
              line-height: 2.1;
              color: #000000;
            }
          }
        }
      }
    }
    .exp-table {
      table {
        width: 100%;
        // border-spacing: 2px;
        font-size: 14px;
        border-top: 2px solid #ffffff;
        border-left: 2px solid #ffffff;
        thead {
          color: #ffffff;
          text-align: center;
          th {
            font-weight: normal;
            padding: 10px 5px;
            border-right: 2px solid #ffffff;
            border-bottom: 2px solid #ffffff;
          }
        }
        tbody {
          color: #000000;
          text-align: center;
          td {
            padding: 5px 5px;
            border-right: 2px solid #ffffff;
            border-bottom: 2px solid #ffffff;
          }
          .color-white {
            color: #ffffff;
            td {
              text-align: left;
            }
          }
        }
      }
    }
  }
}
</style>