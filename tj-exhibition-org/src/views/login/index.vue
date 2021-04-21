<template>
  <div class="login">
    <div class="login-form">
      <div class="login-header">
        <img src="../../assets/img/logo.png" width="60" alt="">
        <div>主场业务管理系统</div>
      </div>
      <a-form :form="form">
        <a-form-item>
          <a-input
            v-decorator="[
              'userName',
              {
                rules: [{ required: true, message: '请输入您的用户名!' }],
                getValueFromEvent: event => {
                  return event.target.value.replace(/(^\s*)|(\s*$)/g, '');
                }
              }
            ]"
            placeholder="请输入您的用户名"
            size="large"
          >
            <a-icon slot="prefix" type="user" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
              'password',
              { rules: [{ required: true, message: '请输入您的密码' }] }
            ]"
            type="password"
            placeholder="请输入您的密码"
            size="large"
          >
            <a-icon slot="prefix" type="lock" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-row :gutter="8">
            <a-col :span="15">
              <a-input
                v-decorator="[
                  'code',
                  {
                    rules: [
                      { required: true, message: '请输入验证码' },
                      { max: 5, message: '验证码不能超过5位' }
                    ]
                  }
                ]"
                placeholder="请输入验证码"
                size="large"
                @keyup.native.enter="handleSubmit"
              >
                <a-icon slot="prefix" type="codepen" />
              </a-input>
            </a-col>
            <a-col :span="5">
              <img
                class="login-image-url"
                :src="imageUrl"
                @click="handleImageClick"
                width="100"
                height="40"
                alt="验证码"
              />
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            :loading="loginLoading"
            block
            size="large"
            @click="handleSubmit"
            >登录
          </a-button>
          <div style="font-size: 8px !important;margin-bottom: 30px;">
            <a-checkbox
              :defaultChecked="false"
              @change="checkPrivacy"
            ></a-checkbox>
            <span
              style="font-size: 8px;color: #409EFF;margin-left: 8px;cursor:pointer"
              @click="showPrivacyModal"
            >
              隐私声明
            </span>
            <span class="login-footer">
              <a href="javascript:" @click="register">注册</a>
            </span>
          </div>
        </a-form-item>
      </a-form>
    </div>
    <a-modal
      title="隐私声明"
      :visible="showPrivacy"
      :confirm-loading="confirmLoading"
      @cancel="handleCancel"
    >
      <template slot="footer">
        <a-button @click="handleCancel">关闭</a-button>
      </template>
      <PrivacyStatement />
    </a-modal>
  </div>
</template>

<script>
import { orgLogin } from '@/api'
import UUID from 'uuid-js'
export default {
  components: {
    PrivacyStatement: () => import('./components/PrivacyStatement')
  },
  data() {
    return {
      loginLoading: false,
      imageUrl: '',
      uuid: '',
      form: this.$form.createForm(this),
      // 控制是否显示弹窗
      showPrivacy: false,
      // 动画
      confirmLoading: false,
      // 控制登录按钮是否可以点击
      checkBoxType: false
    }
  },
  created() {
    this.handleImageClick()
  },
  methods: {
    /**
     * @description: 控制登录按钮是否可以点击
     * @author: 潘慧敏
     * @date: 2021-02-01 16:42:42
     */
    checkPrivacy(e) {
      this.checkBoxType = !this.checkBoxType
    },
    /**
     * @description: 显示申明
     * @author: 潘慧敏
     * @date: 2021-02-01 16:44:27
     */
    showPrivacyModal() {
      this.showPrivacy = true
    },
    /**
     * @description: 关闭申明弹窗
     * @author: 潘慧敏
     * @date: 2021-02-01 16:42:58
     */
    handleCancel() {
      this.showPrivacy = false
    },
    handleImageClick() {
      const uuid4 = UUID.create()
      this.uuid = uuid4.toString()
      this.imageUrl = `/tj-exhibition/user/getCaptcha?uuid=${this.uuid}`
    },
    handleSubmit() {
      if (this.checkBoxType === false) {
        this.$message.warning('请先勾选隐私声明')
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          values.companyType = 1
          values.uuid = this.uuid
          this.handleLogin(values)
        }
      })
    },
    handleLogin(values) {
      this.loginLoading = true
      orgLogin(values)
        .then(res => {
          this.loginLoading = false
          this.$message.success(res.message)
          localStorage.setItem('userInfo', JSON.stringify(res.data))
          this.goHome()
        })
        .catch(err => {
          this.handleImageClick()
          this.loginLoading = false
          console.log(err)
        })
    },
    goHome() {
      this.$router.push({
        path: '/exhibition'
      })
    },
    register() {
      this.$router.push({
        path: '/register'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  height: 100%;
  width: 100%;
  background-image: linear-gradient(-20deg, #b721ff 0%, #21d4fd 100%);
  background-position: 50% 50%;
  background-size: cover;
  background-repeat: no-repeat;
  .login-form {
    width: 350px;
    height: 465px;
    padding: 30px 30px;
    background-color: white;
    text-align: left;
    position: relative;
    margin-left: 0;
    margin-right: 0;
    zoom: 1;
    display: block;
    box-shadow: 0px 0px 5px #333333;
    .login-header {
      text-align: center;
      font-size: 26px;
      margin-bottom: 20px;
      div {
        margin-top: 15px;
      }
    }
    .login-footer {
      a {
        float: right;
        color: #3c8dbc;
        font-size: 14px;
        padding: 5px;
      }
    }
    .login-image-url {
      cursor: pointer;
    }
  }
}
</style>
