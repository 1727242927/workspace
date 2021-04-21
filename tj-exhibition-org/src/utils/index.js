export function getLocalStorageItem(key) {
  return JSON.parse(localStorage.getItem(key)) || {}
}

export function getLocalInfo() {
  const currentExhibition = getLocalStorageItem('currentExhibition')
  const userInfo = getLocalStorageItem('userInfo')
  const data = {
    showId: currentExhibition.id,
    userId: userInfo.id,
    userName: userInfo.userName,
    companyCn: userInfo.companyCn
  }
  return data
}

export function price2UpperCase(number) {
  let ret = ''
  if (number !== '' && number !== null && number !== '0') {
    let unit = '仟佰拾亿仟佰拾万仟佰拾元角分'
    let str = ''
    number += '00'
    let point = number.indexOf('.')
    if (point >= 0) {
      number = number.substring(0, point) + number.substr(point + 1, 2)
    }
    unit = unit.substr(unit.length - number.length)
    for (let i = 0; i < number.length; i++) {
      str += '零壹贰叁肆伍陆柒捌玖'.charAt(number.charAt(i)) + unit.charAt(i)
    }
    ret = str
      .replace(/零(仟|佰|拾|角)/g, '零')
      .replace(/(零)+/g, '零')
      .replace(/零(万|亿|元)/g, '$1')
      .replace(/(亿)万|(拾)/g, '$1$2')
      .replace(/^元零?|零分/g, '')
      .replace(/元$/g, '元') + '整'
  }
  return ret
}
