import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Table, Button, Input, InputNumber, message, Checkbox, Layout, Menu, Select, Upload, Dropdown, DatePicker, Form, FormModel, Breadcrumb, Icon, ConfigProvider, Tag, Divider, Row, Col, Result, Modal, Tabs, Radio, Carousel, Tooltip, Avatar, Switch, Drawer, Spin, Card, Steps, Descriptions, Pagination, Popover, Popconfirm, Badge, List, Transfer, Progress } from 'ant-design-vue'
import html2pdf from '@/utils/html2pdf'
import rules from '@/utils/rules'
import './assets/less/common.less'
Vue.use(Popconfirm)
Vue.use(Popover)
Vue.use(Pagination)
Vue.use(Descriptions)
Vue.use(Steps)
Vue.use(Card)
Vue.use(Table)
Vue.use(Button)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Checkbox)
Vue.use(Layout)
Vue.use(Menu)
Vue.use(Select)
Vue.use(Upload)
Vue.use(Dropdown)
Vue.use(DatePicker)
Vue.use(Form)
Vue.use(FormModel)
Vue.use(Breadcrumb)
Vue.use(Icon)
Vue.use(ConfigProvider)
Vue.use(Tag)
Vue.use(Divider)
Vue.use(Row)
Vue.use(Col)
Vue.use(Result)
Vue.use(Modal)
Vue.use(Tabs)
Vue.use(Radio)
Vue.use(Carousel)
Vue.use(Tooltip)
Vue.use(Avatar)
Vue.use(Switch)
Vue.use(Drawer)
Vue.use(Spin)
Vue.use(Badge)
Vue.use(List)
Vue.use(Transfer)
Vue.use(Progress)
Vue.use(html2pdf)
Vue.prototype.$message = message
Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$info = Modal.info
Vue.prototype.$rules = rules
Vue.prototype.$formatMoney = (money, places = 2) => {
  const zero = '0.00'
  if (isNaN(money) || money === '') return zero

  if (money && money != null) {
    money = `${money}`
    let left = money.split('.')[0] // 小数点左边部分
    let right = money.split('.')[1] // 小数点右边
    // 保留places位小数点，当长度没有到places时，用0补足。
    right = right
      ? right.length >= places
        ? '.' + right.substr(0, places)
        : '.' + right + '0'.repeat(places - right.length)
      : '.' + '0'.repeat(places)
    var temp = left
      .split('')
      .reverse()
      .join('')
      .match(/(\d{1,3})/g) // 分割反向转为字符串然后最多3个，最少1个，将匹配的值放进数组返回
    return (
      (Number(money) < 0 ? '-' : '') +
      temp
        .join(',')
        .split('')
        .reverse()
        .join('') +
      right
    ) // 补齐正负号和货币符号，数组转为字符串，通过逗号分隔，再分割（包含逗号也分割）反向转为字符串变回原来的顺序
  } else if (money === 0) {
    return zero
  } else {
    return zero
  }
}
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
