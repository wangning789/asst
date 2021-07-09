// 头部时间选择
export const DATERANGE = [
  {
    id: 7,
    label: '近7天',
  }, {
    id: 30,
    label: '近30天',
  }, {
    id: 365,
    label: '近一年',
  },
]

// echart自定义颜色
export const COLORLIST = ['#8AD08A', '#73C1EE', '#FCB970', '#6CA5F8', '#EF7C7C', '#00ff77', '#D5402B', '#F79267', '#A6CEE3', '#893A49', '#CCD4D8', '#F09CCD', '#B65D3E', '#93C89F', '#49DBB3', '#F7EFAF']

export const FILETYPE = {
  /*! 上传文件类型列表 */
  // fileType: '.prd, .txt, .pdf, .rar , .zip, .tar, .gz, .jar, .iso',
  // 【安全运维管理】安全事件附件上传应限制为excel、word、txt、pdf、压缩包
  fileType: '.doc, .docx, .xlsx, .xls, .txt, .pdf, .rar , .zip, .tar, .gz, .jar, .iso',
  /*! 上传文件大小 50M */
  fileSize: 50 * 1024 * 1024,
}

export const securityTypeNumber = [
  {
    icon: 'i-jinjianquanshijianshu',
    name: '今日新增安全事件',
  },
  {
    icon: 'i-jinjianquanshijianshu',
    name: '待处理安全事件',
  },
  {
    icon: 'i-chulizhonganquanshijian',
    name: '处理中安全事件',
  },

  {
    icon: 'i-shangbaoanquanshijianzongshu',
    name: '安全事件总数',
    toolTip: '未确认的安全事件不计入总数',
  },
  {
    icon: 'i-pingjunchuzhishijian',
    name: '安全事件平均处置时长',
  },
]

// 时间戳转yymmdd
export function fmtDate(obj: any) {
  const date = new Date(obj)
  const y = date.getFullYear()
  const m = '0' + (date.getMonth() + 1)
  const d = '0' + date.getDate()
  return (
    y +
    '-' +
    m.substring(m.length - 2, m.length) +
    '-' +
    d.substring(d.length - 2, d.length)
  )
}

// js 毫秒转日期（yy-MM-dd hh:mm:ss）
export function formatDate(timeStamp: any) {
  // console.log('时间戳',timeStamp)
  timeStamp = `${timeStamp}` // 如果后台传的timeStamp为10位数，则需要在后面加三个0.
  timeStamp = Number(timeStamp)
  const year = new Date(timeStamp).getFullYear()
  const month = new Date(timeStamp).getMonth() + 1 < 10 ? '0' + (new Date(timeStamp).getMonth() + 1) : new Date(timeStamp).getMonth() + 1
  const date = new Date(timeStamp).getDate() < 10 ? '0' + new Date(timeStamp).getDate() : new Date(timeStamp).getDate()
  const hh = new Date(timeStamp).getHours() < 10 ? '0' + new Date(timeStamp).getHours() : new Date(timeStamp).getHours()
  const mm = new Date(timeStamp).getMinutes() < 10 ? '0' + new Date(timeStamp).getMinutes() : new Date(timeStamp).getMinutes()
  const ss = new Date(timeStamp).getSeconds() < 10 ? '0' + new Date(timeStamp).getSeconds() : new Date(timeStamp).getSeconds()
  const nowTime = year + '-' + month + '-' + date + '-' + ' ' + hh + ':' + mm + ':' + ss
  return nowTime
}
