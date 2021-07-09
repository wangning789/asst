// 要求 大小写字母、特殊字符(括号空格不算 _-!@#$%^&* )、数字 的组合
const CHAR = '_!@#$%^&*-' // 允许的特殊字符
const REG_LETTER = /[a-z]/i // 字母: 1 (001)
const REG_CHARACTER = new RegExp(`[${CHAR}]`) // 特殊字符: 2 (010)
const REG_NUMBER = /\d/ // 数字: 4 (100)
/** 验证密码
 * @param {String} str 密码
 *
 * @returns {true|Error} 不符合要求抛出错误信息
 */
function password(str: string) {
  let len = str.length

  if (!len) {
    throw new Error('请输入密码')
  }

  if (len < 8 || len > 16) {
    throw new Error('密码长度在8-16位之间')
  }

  if (!REG_LETTER.test(str[0])) {
    throw new Error('首位必须为：英文字母')
  }

  let char
  let typeCount = 1 // 已有字母
  while (--len) {
    if (!REG_LETTER.test((char = str[len]))) {
      if ((char = REG_CHARACTER.test(char) ? 2 : REG_NUMBER.test(char) && 4)) {
        typeCount |= char as number
      } else {
        break
      }
    }
  }

  if (typeCount !== 7) {
    throw new Error(`请输入：英文字母、字符（${CHAR}）、数字 的组合`)
  }

  return true
}

const CHAR_TYPE = [
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  CHAR,
  '0123456789',
]
const random = (str: string) => str[(Math.random() * str.length) | 0]
/** 获取随机密码 */
function randomPassword() {
  let password = random(CHAR_TYPE[0]) // 第一位是字母

  let len = 7 + ((Math.random() * 9) | 0)
  let typeCount = 1 // 已有字母
  let type
  while (len--) {
    // 001(1) 011(3) 101(5) 111(7)
    type =
      len < 2 && typeCount < 7
        ? typeCount < 5
          ? 2
          : 1
        : (Math.random() * 3) | 0
    typeCount |= type << 1 || 1
    password += random(CHAR_TYPE[type])
  }

  return password
}

const REG_USERNAME = /^[\w-.]+$/
/** 验证账号
 * @param {String} str 账号
 * @param {String} name 错误提示名字, 默认'账号'
 *
 * @returns {true|Error} 不符合要求抛出错误信息
 */
function username(str: string, name?: string) {
  name || (name = '账号')
  const length = str.length
  switch (true) {
    case !length:
      throw new Error('请输入' + name)
    case length < 2 || length > 20:
      throw new Error(name + '长度在2-20位之间')
    case !REG_USERNAME.test(str):
      throw new Error(name + '不能包含中文或特殊字符')
    default:
      return true
  }
}

export const REG_ALIAS_NAME = /^[\w\u4e00-\u9fa5]+$/
/** 验证别名
 * @param {String} str 别名
 * @param {String} name 错误提示名字, 默认'别名'
 *
 * @returns {true|Error} 不符合要求抛出错误信息
 */
function aliaName(str: string, name?: string) {
  name || (name = '别名')
  const length = str.length
  switch (true) {
    case !length:
      throw new Error('请输入' + name)
    case length < 2 || length > 15:
      throw new Error(name + '长度在2-15位之间')
    case !REG_ALIAS_NAME.test(str):
      throw new Error(name + '不能包含特殊字符')
    default:
      return true
  }
}

// 固话：86 代表中国可省；区号2到4位数字不详细检查了；固话号码7到8位数字
// const REG_TELEPHONE = /^(?:86\s?-\s?)?(?:\d{2,4}\s?-\s?)?\d{7,8}$/
// 手机号码：（+86 或 86 或 0 + ） 1开头11位数
// const REG_PHONE = /^(?:\+?86)?\s?0?1\d{10}$/
const REG_PHONE = /^(?:(?:13[0-9]{1})|(?:15[0-9]{1})|(?:16[0-9]{1})|(?:17[3-8]{1})|(?:18[0-9]{1})|(?:19[0-9]{1})|(?:14[5-7]{1}))+\d{8}$/
/** 验证电话号码
 * @param {String} str 电话号码
 *
 * @returns {true|Error} 不符合要求抛出错误信息
 */
function phone(str: string) {
  if (!str.length) {
    throw new Error('请输入电话号码')
  }
  if (REG_PHONE.test(str)) {
    return true
  }
  throw new Error('请输入正确的电话号码')
}

// 邮箱 抄的，不造为啥要写这么长，不过管用
// eslint-disable-next-line max-len
// const REG_EMAIL_LONG = /^[\w!#$%&'*+/=?^`{|}~-]+(?:\.[\w!#$%&'*+/=?^`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/

const REG_EMAIL = /^[\w-.]+@[\w-.]+$/
/** 验证邮箱
 * @param {String} str 邮箱
 *
 * @returns {true|Error} 不符合要求抛出错误信息
 */
function email(str: string) {
  if (!str.length) {
    throw new Error('请输入邮箱')
  }
  if (REG_EMAIL.test(str)) {
    return true
  }
  throw new Error('请输入正确的邮箱')
}

// url http/https(/ftp/ws)...
const REG_URL = /^(?:https?:)?\/\/.+/
/** 验证url
 * @param {String} str url
 *
 * @returns {true|Error} 不符合要求抛出错误信息
 */
function url(str: string) {
  if (!str.length) {
    throw new Error('请输入链接')
  }
  if (REG_URL.test(str)) {
    return true
  }
  throw new Error('请输入正确的链接')
}

// 端口校验正则
const REG_PORT = /^[1-9]|[0-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5]$/
/** 验证端口号
 * @param {String} str 端口号
 *
 * @returns {true|Error} 不符合要求抛出错误信息
 */
function port(str: string) {
  if (!str.length) {
    throw new Error('请输入端口号')
  }
  if (REG_PORT.test(str)) {
    return true
  }
  throw new Error('请输入1-65535之间的值')
}

// 身份证号码可(6-4-2-2-4)中横线分割【不检查区号/出生日期】
// eslint-disable-next-line max-len
// const REG_IDCARD_FORMAT = /^\d{6}\s?-?\s?\d{4}\s?-?\s?\d{2}\s?-?\s?\d{2}\s?-?\s?\d{3}(?:\d|X)$/
const REG_IDCARD = /^\d{17}(?:\d|X)$/
/** 验证身份证号码
 * @param {String} str 身份证号码
 *
 * @returns {true|Error} 不符合要求抛出错误信息
 */
function idCard(str: string) {
  if (!str.length) {
    throw new Error('请输入身份证号码')
  }
  if (REG_IDCARD.test(str)) {
    return true
  }
  throw new Error('请输入正确的身份证号码')
}

/** 验证是否正整数
 * @param {string | number} str 数字
 *
 * @returns {true|Error} 不符合要求抛出错误信息
 */
function pInt(str: any) {
  str = parseFloat(str)
  if (str > 0 && str === (str | 0)) {
    return true
  }
  throw new Error('请输入正整数')
}

/** 验证是否合法ip
 * @param {string} str ip地址
 *
 * @returns {true|Error} 不符合要求抛出错误信息
 */
function ip(str: string) {
  if (checkIP(str)) {
    return true
  }
  throw new Error('请输入正确的ip地址')
}

function checkIP(str: string) {
  const reg = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/
  const pass = reg.test(str)
  return pass
}

function isIPv6(str: string) {
  if (checkIPv6(str)) {
    return true
  }
  throw new Error('请输入正确的IPv6地址')
};

function checkIPv6(str: string) {
  // @ts-nocheck
  const matchStr = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/

  const pass = matchStr.test(str)
  return pass
}

function isIpv4OrIPv6(str: string) {
  if (checkIP(str) || checkIPv6(str)) {
    return true
  }
  throw new Error('请输入正确的ipv4或IPv6地址')
}

// 判断两个ipv6地址是否相等
function isIPv6Equals(src: string, des: string) {
  const srcArr = convert2CompleteIpV6(src).split(':')
  const desArr = convert2CompleteIpV6(des).split(':')
  for (let i = 0; i < 8; i++) {
    if (parseInt(srcArr[i], 16) !== parseInt(desArr[i], 16)) {
      return false
    }
  }
  return true
}

// 将压缩格式的转换为常规的IPv6地址
function convert2CompleteIpV6(ip: string) {
  let ipV6 = ip
  const index = ip.indexOf('::')
  if (index > 0) {
    const size = 8 - (ip.split(':').length - 1)
    let tmp = ''
    for (let i = 0; i < size; i++) {
      tmp += ':0'
    }
    tmp += ':'
    ipV6 = ip.replace('::', tmp)
  } else if (index === 0) {
    ipV6 = ip.replace('::', '0:0:0:0:0:0:0:')
  }
  return ipV6
}

// see: https://my.oschina.net/u/1182602/blog/406435
const REG_CN = /[\u2E80-\u2EFF\u2F00-\u2FDF\u3000-\u303F\u31C0-\u31EF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4DC0-\u4DFF\u4E00-\u9FBF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF]/

/** 验证是否包含中文字符
 * @param {string} str 任意字符串
 *
 * @returns {true|Error} 不符合要求抛出错误信息
 */
function hasCN(str: string) {
  if (REG_CN.test(str)) {
    return true
  }

  throw new Error('未包含中文字符')
}

const REG_MAC = /^([0-9a-fA-F]{2})(([/\s:][0-9a-fA-F]{2}){5})$/

const REG_MAC1 = /^([0-9a-fA-F]{2})(([/\s:-][0-9a-fA-F]{2}){5})$/
/** MAC 地址校验
 * @param {String} str MAC地址
 *
 * @returns {true|Error} 不符合要求抛出错误信息
 */
function macId(str: string) {
  if (!str.length) {
    throw new Error('请输入MAC地址')
  }
  if (REG_MAC.test(str) || REG_MAC1.test(str)) {
    return true
  }
  throw new Error('请输入正确的MAC地址')
}
// 限制长度为200
function length(str: string, name?: string) {
  name || (name = '管理地址')
  const length = str.length
  switch (true) {
    case !length:
      throw new Error('请输入' + name)
    case length < 0 || length > 200:
      throw new Error(name + '长度在0-200位之间')
    default:
      return true
  }
}
export {
  password,
  randomPassword,
  username,
  aliaName,
  phone,
  email,
  url,
  port,
  idCard,
  pInt,
  ip,
  checkIP,
  isIPv6,
  checkIPv6,
  isIpv4OrIPv6,
  isIPv6Equals,
  hasCN,
  macId,
  length,
}
