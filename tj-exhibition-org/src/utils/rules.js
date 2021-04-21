export default {
  idCardRules: [
    { required: true, message: '请输入身份证号' },
    { pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '身份证格式不正确！' }
  ],
  mobileRules: [
    { required: false, message: '请输入手机号' },
    { pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确' }
  ],
  numberRules: [
    { pattern: /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*)|0)$/, message: '请输入正数，小数保留两位' }
  ]
}
