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
  fileSize: 100 * 1024 * 1024,
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
