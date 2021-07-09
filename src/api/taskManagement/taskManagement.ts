import { get, post } from '@/utils/ajax'
import { showDialog } from '@com/WorkflowDialog'

export const enum API {
  listAll = 'service-platform/taskProcess/taskList/todo', // 全部设备
  done = 'service-platform/taskProcess/taskList/done',
  allTasks = 'service-platform/taskProcess/taskList/all', // 全部任务
  getWorkflowUrlById = 'workflow/workflowPage/moduleIndex/{workId}',
  depSecManager = 'service-platform/taskProcess/taskList/all/depSecManager', // 单位安全管理员全部任务
  projectManager = 'service-platform/taskProcess/taskList/all/projectManager', // 项目经理全部任务
  bugFix = 'service-platform/taskProcess/add/bugFix', // 创建漏洞修复任务
  threatToBan = 'service-platform/taskProcess/add/threatToBan', // 创建威胁ip封禁任务
  traceToSource = 'service-platform/taskProcess/add/traceToSource', // 创建溯源任务
  addGeneralOperaMaint1 = 'service-platform/workTask/addGeneralOperaMaint1', // 通用运维任务
  addPenetrationTest1 = 'service-platform/workTask/addPenetrationTest1', // 渗透测试任务
  addThreadNotifi = 'service-platform/workTask/addThreadNotifi', // 创建威胁通报任务
  count='service-platform/taskProcess/taskList/count', // 任务管理统计-tab页-通用
  depSecManagerCount='service-platform/taskProcess/taskList/count/depSecManager', // 任务管理统计-tab页-单位安全管理员
  projectManagerCount='service-platform/taskProcess/taskList/count/projectManager', /// / 任务管理统计-tab页-项目经理
  maintain='service-platform/workTask/addGeneralOperaMaintBySafety' // 单位安全管理员创建运维任务
}

function listAll(param: Record<string, any>) {
  return post(API.listAll, param)
}

function depSecManager(param: Record<string, any>) {
  return post(API.depSecManager, param)
}

function projectManager(param: Record<string, any>) {
  return post(API.projectManager, param)
}

function done(param: Record<string, any>) {
  return post(API.done, param)
}

function allTasks(param: Record<string, any>) {
  return post(API.allTasks, param)
}

/** 根据流程ID跳转慧正流程 */
function getWorkflowUrlById(id: string) {
  return get(API.getWorkflowUrlById.replace('{workId}', id))
}

function count(id: string) {
  if (id === '0') {
    return get(API.count)
  } else if (id === '1') {
    return get(API.depSecManagerCount)
  } else if (id === '2') {
    return get(API.projectManagerCount)
  }
}

function addGeneralOperaMaint1(number: string) {
  if (number === '5') {
    return post(API.addGeneralOperaMaint1)
  } else if (number === '4') {
    return post(API.addThreadNotifi)
  } else if (number === '3') {
    return post(API.threatToBan)
  } else if (number === '2') {
    return post(API.bugFix)
  } else if (number === '1') {
    return post(API.traceToSource)
  } else if (number === '0') {
    return post(API.addPenetrationTest1)
  } else if (number === '6') {
    return post(API.maintain)
  }
}

function toDetail(
  id: string,
  title?: string,
  onmessage?: (msg: MessageEvent) => void
) {
  getWorkflowUrlById(id).then((res: any) => {
    res?.data?.body && showDialog(res.data.body, title || '工单流程', onmessage)
    return res
  })
}

function deleteEvent(param: any) {
  return get(`service-platform/taskProcess/delete/${param}`)
}

export {
  listAll,
  done,
  allTasks,
  toDetail,
  depSecManager,
  projectManager,
  addGeneralOperaMaint1,
  count,
  deleteEvent,
}
