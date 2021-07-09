// 业务常量

// 各种任务
export const enum TASK {
  generalOperaMain = '通用运维任务',
  penetrationTest = '渗透测试任务',
  tracetosource = '溯源任务',
  threatToBan ='威胁IP封禁任务',
  bugFix ='漏洞修复任务',
}

// 事件状态
export const STATE = {
  pending: '待处理',
  processing: '处理中',
  finished: '完成',
  terminate: '终止',
}

// 事件状态任务管理用
export const STATETWO = {
  pending: '待处理',
  processing: '处理中',
}

// 事件状态任务管理用
export const STATESGREE = {
  processing: '处理中',
  finished: '完成',
}
