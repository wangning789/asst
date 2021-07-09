import STYLE from '@/scss/status.module.scss'

export const LEVEL = {
  5: '严重',
  4: '高危',
  3: '中危',
  2: '低危',
}

export const LOGTYPE = {
  5: '网络攻击',
  4: 'WEB攻击',
  3: '恶意代码',
  2: '恶意邮件',
}

export const STATUS = {
  1: '待处置',
  2: '已升级',
  3: '已处置',
  4: '已忽略',
}

/** 获取日志级别展示 */
export function getAlarmLevel(row: any) {
  let className = ''
  switch (+row.alarm_level_cd) {
    case 5:
      className = STYLE.danger
      break
    case 4:
      className = STYLE.warn
      break
    case 3:
      className = STYLE.primary
      break
    case 2:
      className = STYLE.success
      break
  }
  return { class: className, text: row.alarm_level }
}
