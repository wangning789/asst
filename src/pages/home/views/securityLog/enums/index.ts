import STYLE from '@/scss/status.module.scss'

export const LEVEL = {
  5: '很高',
  4: '高',
  3: '中',
  2: '低',
  1: '信息',
}

export const LOGTYPE = {
  5: '网络攻击',
  4: 'WEB攻击',
  3: '恶意代码',
  2: '异常行为',
}

/** 获取日志级别展示 */
export function getLogLevel(row: any) {
  let className
  switch (row.log_level_cd) {
    case '5':
      className = STYLE.danger
      break
    case '4':
      className = STYLE.primary
      break
    case '3':
      className = STYLE.warn
      break
    case '2':
      className = STYLE.success
      break
    case '1':
      className = STYLE.info
      break
  }
  return { class: className, text: row.log_level }
}
