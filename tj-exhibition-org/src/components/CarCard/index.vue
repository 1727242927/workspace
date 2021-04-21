<template>
  <div class="exp-bill">
    <div class="top">
      <a-button type="primary" @click="() => {$router.back()}">返回</a-button>
      <a-button type="primary" style="margin-left: 20px" @click="downLoad">下载pdf</a-button>
    </div>
    <div class="exp-bill-content" id="carPdf">
      <div class="exp-bill-header">
        <h1 class="title">车证</h1>
        <div class="title-en">
          <p>
            <a>CAR LINCENSE</a>
          </p>
        </div>
      </div>
      <div class="exp-exhibitor-info-wrap">
        <ul class="exp-exhibitor-info">
          <li class="exp-exhibitor-info-item">
            <div class="exp-exhibitor-info-inner">
              <div class="left">
                <span>姓名</span>
                <span>Name</span>
              </div>
              <div class="right">{{data.driverName}}</div>
            </div>
            <div class="exp-exhibitor-info-inner">
              <div class="left">
                <span>性别</span>
                <span>Gender</span>
              </div>
              <div class="right">{{data.gender === '1' ? '男' : '女'}}</div>
            </div>
          </li>
          <li class="exp-exhibitor-info-item">
            <div class="exp-exhibitor-info-inner">
              <div class="left">
                <span>身份证号</span>
                <span>ID Number</span>
              </div>
              <div class="right">{{data.idCard}}</div>
            </div>
            <div class="exp-exhibitor-info-inner">
              <div class="left">
                <span>车牌号</span>
                <span>License NO</span>
              </div>
              <div class="right">{{data.licensePlateNumber}}</div>
            </div>
          </li>
          <li class="exp-exhibitor-info-item">
            <div class="exp-exhibitor-info-inner">
              <div class="left">
                <span>证件类型</span>
                <span>Certificate Type</span>
              </div>
              <div class="right">{{data.certTypeName}}</div>
            </div>
            <div class="exp-exhibitor-info-inner">
              <div class="left">
                <span>证件种类</span>
                <span>Certificate Species</span>
              </div>
              <div class="right">{{data.certCategoryName}}</div>
            </div>
          </li>
          <li class="exp-exhibitor-info-item">
            <div class="exp-exhibitor-info-inner">
              <div class="left">
                <span>进场日期</span>
                <span>Approach Date</span>
              </div>
              <div class="right">{{data.admissionDate}}</div>
            </div>
            <div class="exp-exhibitor-info-inner">
              <div class="left">
                <span>进场时间</span>
                <span>Approach Time</span>
              </div>
              <div class="right">{{data.admissionStartTime}}:00 - {{data.admissionEndTime}}:00</div>
            </div>
          </li>
          <li class="exp-exhibitor-info-item">
            <div class="exp-exhibitor-info-inner">
              <div class="left">
                <span>参展商</span>
                <span>Exhibitors</span>
              </div>
              <div class="right">{{data.exName}}</div>
            </div>
            <div class="exp-exhibitor-info-inner">
              <div class="left">
                <span>展位号</span>
                <span>Booth NO</span>
              </div>
              <div class="right">{{data.zwNum}}</div>
            </div>
          </li>
        </ul>
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
      this.html2pdf('carPdf', '车证')
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
  }
}
</style>
