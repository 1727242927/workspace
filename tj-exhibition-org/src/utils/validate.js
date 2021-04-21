/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 判读是否为外链
 * @param path
 * @returns {boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 校验密码是否小于6位
 * @param str
 * @returns {boolean}
 */
export function isPassword(str) {
  return str.length >= 6
}

/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 判断是否为数字
 * @param value
 * @returns {boolean}
 */
export function isNumber(value) {
  const reg = /^[0-9]*$/
  return reg.test(value)
}

/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 判断是否是名称
 * @param value
 * @returns {boolean}
 */
export function isName(value) {
  const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/
  return reg.test(value)
}

/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 判断是否为IP
 * @param ip
 * @returns {boolean}
 */
export function isIP(ip) {
  const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  return reg.test(ip)
}

/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 判断是否是传统网站
 * @param url
 * @returns {boolean}
 */
export function isUrl(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 判断是否是小写字母
 * @param str
 * @returns {boolean}
 */
export function isLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 判断是否是大写字母
 * @param str
 * @returns {boolean}
 */
export function isUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 判断是否是大写字母开头
 * @param str
 * @returns {boolean}
 */
export function isAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 判断是否是字符串
 * @param str
 * @returns {boolean}
 */
export function isString(str) {
  return typeof str === 'string' || str instanceof String
}

/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 判断是否是数组
 * @param arg
 * @returns {arg is any[]|boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 判断是否是端口号
 * @param str
 * @returns {boolean}
 */
export function isPort(str) {
  const reg = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
  return reg.test(str)
}

/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 判断是否是手机号
 * @param str
 * @returns {boolean}
 */
export function isPhone(str) {
  const reg = /^1\d{10}$/
  return reg.test(str)
}

/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 判断是否是身份证号(第二代)
 * @param str
 * @returns {boolean}
 */
export function isIdCard(str) {
  const reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  return reg.test(str)
}

/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 判断是否是邮箱
 * @param str
 * @returns {boolean}
 */
export function isEmail(str) {
  const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  return reg.test(str)
}

/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 判断是否中文
 * @param str
 * @returns {boolean}
 */
export function isChina(str) {
  const reg = /^[\u4E00-\u9FA5]{2,4}$/
  return reg.test(str)
}

/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 判断是否为空
 * @param str
 * @returns {boolean}
 */
export function isBlank(str) {
  return (
    str == null ||
    false ||
    str === '' ||
    str.trim() === '' ||
    str.toLocaleLowerCase().trim() === 'null'
  )
}

/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 判断是否为固话
 * @param str
 * @returns {boolean}
 */
export function isTel(str) {
  const reg = /^(400|800)([0-9\\-]{7,10})|(([0-9]{4}|[0-9]{3})(-| )?)?([0-9]{7,8})((-| |转)*([0-9]{1,4}))?$/
  return reg.test(str)
}

/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 判断是否为数字且最多两位小数
 * @param str
 * @returns {boolean}
 */
export function isNum(str) {
  const reg = /^\d+(\.\d{1,2})?$/
  return reg.test(str)
}
// 验证 身份证
export function regCId(regID) {
  var val = regID
  var tipStr = '请输入15位或者18位的合法身份证号！'
  var isT = validateIdCard(val)
  return isT
  // isT?callback():callback(new Error(tipStr));
  function validateIdCard(idCard) {
    var vcity = {
      11: '北京',
      12: '天津',
      13: '河北',
      14: '山西',
      15: '内蒙古',
      21: '辽宁',
      22: '吉林',
      23: '黑龙江',
      31: '上海',
      32: '江苏',
      33: '浙江',
      34: '安徽',
      35: '福建',
      36: '江西',
      37: '山东',
      41: '河南',
      42: '湖北',
      43: '湖南',
      44: '广东',
      45: '广西',
      46: '海南',
      50: '重庆',
      51: '四川',
      52: '贵州',
      53: '云南',
      54: '西藏',
      61: '陕西',
      62: '甘肃',
      63: '青海',
      64: '宁夏',
      65: '新疆',
      71: '台湾',
      81: '香港',
      82: '澳门',
      91: '国外'
    }
    // 是否为空
    if (idCard === '') {
      return false
    }
    // 校验长度，类型
    if (isCardNo(idCard) === false) {
      return false
    }
    // 检查省份
    if (checkProvince(idCard, vcity) === false) {
      return false
    }
    // 校验生日
    if (checkBirthday(idCard) === false) {
      return false
    }
    // 检验位的检测
    if (checkParity(idCard) === false) {
      return false
    }
    return true
  }
  // 检查长度
  function isCardNo(card) {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    var reg = /(^\d{15}$)|(^\d{17}(\d|X|x)$)/
    if (reg.test(card) === false) {
      return false
    }
    return true
  }
  // 检查省份
  function checkProvince(card, vcity) {
    var province = card.substr(0, 2)
    if (vcity[province] == undefined) {
      return false
    }
    return true
  }
  // 检查生日
  function checkBirthday(card) {
    var len = card.length
    // 身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
    if (len == '15') {
      var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/
      var arr_data = card.match(re_fifteen)
      var year = arr_data[2]
      var month = arr_data[3]
      var day = arr_data[4]
      var birthday = new Date('19' + year + '/' + month + '/' + day)
      return verifyBirthday('19' + year, month, day, birthday)
    }
    // 身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
    if (len == '18') {
      var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X|x)$/
      // eslint-disable-next-line no-redeclare
      var arr_data = card.match(re_eighteen)
      // eslint-disable-next-line no-redeclare
      var year = arr_data[2]
      // eslint-disable-next-line no-redeclare
      var month = arr_data[3]
      // eslint-disable-next-line no-redeclare
      var day = arr_data[4]
      // eslint-disable-next-line no-redeclare
      var birthday = new Date(year + '/' + month + '/' + day)
      return verifyBirthday(year, month, day, birthday)
    }
    return false
  }
  // 效验日期 - 检查生日调用
  function verifyBirthday(year, month, day, birthday) {
    var now = new Date()
    var now_year = now.getFullYear()
    // 年月日是否合理
    if (
      birthday.getFullYear() == year &&
      birthday.getMonth() + 1 == month &&
      birthday.getDate() == day
    ) {
      // 判断年份的范围（0岁到100岁之间)
      var time = now_year - year
      if (time >= 0 && time <= 100) {
        return true
      }
      return false
    }
    return false
  }
  // 校验位的检测
  function checkParity(card) {
    // 15位转18位
    card = changeFivteenToEighteen(card)
    var len = card.length
    if (len == '18') {
      // eslint-disable-next-line no-array-constructor
      var arrInt = new Array(
        7,
        9,
        10,
        5,
        8,
        4,
        2,
        1,
        6,
        3,
        7,
        9,
        10,
        5,
        8,
        4,
        2
      )
      // eslint-disable-next-line no-array-constructor
      var arrCh = new Array(
        '1',
        '0',
        'X',
        '9',
        '8',
        '7',
        '6',
        '5',
        '4',
        '3',
        '2'
      )
      var cardTemp = 0
      var i
      var valnum
      for (i = 0; i < 17; i++) {
        cardTemp += card.substr(i, 1) * arrInt[i]
      }
      valnum = arrCh[cardTemp % 11]
      if (valnum == card.substr(17, 1).toLocaleUpperCase()) {
        return true
      }
      return false
    }
    return false
  }
  // 15位转18位 -校验位的检测checkParity 中调用
  function changeFivteenToEighteen(card) {
    if (card.length == '15') {
      // eslint-disable-next-line no-array-constructor
      var arrInt = new Array(
        7,
        9,
        10,
        5,
        8,
        4,
        2,
        1,
        6,
        3,
        7,
        9,
        10,
        5,
        8,
        4,
        2
      )
      // eslint-disable-next-line no-array-constructor
      var arrCh = new Array(
        '1',
        '0',
        'X',
        '9',
        '8',
        '7',
        '6',
        '5',
        '4',
        '3',
        '2'
      )
      var cardTemp = 0
      var i
      card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6)
      for (i = 0; i < 17; i++) {
        cardTemp += card.substr(i, 1) * arrInt[i]
      }
      card += arrCh[cardTemp % 11]
      return card
    }
    return card
  }
}
