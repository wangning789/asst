// @ts-check
/** 安全事件 */
import { get, post } from '@/utils/ajax'
import { download } from '@/utils/downloader'
import { showDialog } from '@com/WorkflowDialog'

export const enum API {
  getAllIncidentStatistic = 'service-platform/securityIncident/getAllIncidentStatistic',
  getIncidentStatistic = 'service-platform/securityIncident/getIncidentStatistic',
  getIncidentStatisticByView = 'service-platform/securityIncident/getIncidentStatisticByView', // 单位安全管理员
  getDwSecurityIncidentTrend = 'service-platform/securityIncident/getDwSecurityIncidentTrend',
  getSecurityIncidentTrend = 'service-platform/securityIncident/getSecurityIncidentTrend',
  getIncidentStatisticByGroup = 'service-platform/securityIncident/getIncidentStatisticByGroup',
  getTopUnit = 'service-platform/securityIncident/companyCount',
  getTopUnitTime = 'service-platform/securityIncident/completionTimeAndCompanyStatistic',
  // 项目经理，监测分析员，运维管理员securityIncidentInfoPageList
  getTotalSecurityIncident = 'service-platform/securityIncident/securityIncidentInfoPageList',
  // 单位安全管理员，集团领导securityIncidentInfoPageListByCompany
  getBlowSecurityIncident = 'service-platform/securityIncident/securityIncidentInfoPageListByCompany',
  // 通报联络员securityIncidentInfoPageListByTB
  getCommunicationSecurityIncident = 'service-platform/securityIncident/securityIncidentInfoPageListByTB',
  confirm = 'service-platform/securityIncident/confirm',
  goBack = 'service-platform/securityIncident/goBack',
  exportUnitTable = 'service-platform/securityIncident/securityIncidentExportList', // 单位安全管理员
  exportProjectTable = 'service-platform/securityIncident/securityIncidentExportAllList', // 项目经理
  getSecurityIncident = 'service-platform/securityIncident/getSecurityIncident',
  // 单位安全管理员新建接口
  addDwSecurityIncident = 'service-platform/securityIncident/addDwSecurityIncident',
  // 运维管理员新建接口
  addYWSecurityIncident = 'service-platform/securityIncident/addYWSecurityIncident',
  deleteSecurityIncident = 'service-platform/securityIncident/deleteSecurityIncident',
  inHandle = 'service-platform/securityIncident/inHandle',
  // 处置完成
  handle = 'service-platform/securityIncident/handle',
  getWorkflowUrlById = 'workflow/workflowPage/moduleIndex/{workId}',
  // 通用运维任务
  addGeneralOperaMaint2 = 'service-platform/workTask/addGeneralOperaMaint2',
  // 渗透测试任务
  addPenetrationTest2 = 'service-platform/workTask/addPenetrationTest2',
  // 溯源任务
  tracetosource = 'service-platform/taskProcess/add/traceToSource/relEvent',
  // 威胁IP封禁任务
  threatToBan = 'service-platform/taskProcess/add/threatToBan/relEvent',
  // 漏洞修复任务
  bugFix = 'service-platform/taskProcess/add/bugFix/relEvent',
  // 修改安全事件接口
  updateSecurityIncident = 'service-platform/securityIncident/updateSecurityIncident',
  // 安全事件侧任务列表
  getTaskList = 'service-platform/taskProcess/taskList/event',
  // 根据id列表返回资产列表
  queryHostsByIds = 'asset/host/queryHostsByIds',
  // 根据id列表返回应用系统列表
  pageQueryAllBiz = 'asset/biz/pageQueryAllBiz',
}

function queryHostsByIds(param: Record<string, any>) {
  return post(API.queryHostsByIds, { ids: [param] })
}

function pageQueryAllBiz(param: Record<string, any>) {
  return post(API.pageQueryAllBiz, [param])
}

function getAllIncidentStatistic(date: number) {
  return get(API.getAllIncidentStatistic, { date })
}
function getIncidentStatistic(date: number) {
  return get(API.getIncidentStatistic, { date })
}

function getIncidentStatisticByView(date: number) {
  return get(API.getIncidentStatisticByView, { date })
}

function getDwSecurityIncidentTrend(date: number) {
  return get(API.getDwSecurityIncidentTrend, { date })
}

function getSecurityIncidentTrend(date: number) {
  return get(API.getSecurityIncidentTrend, { date })
}

function getIncidentStatisticByGroup(date: number) {
  return get(API.getIncidentStatisticByGroup, { date })
}

function getTopUnit(date: number) {
  return get(API.getTopUnit, { date })
}

function getTopUnitTime(date: number) {
  return get(API.getTopUnitTime, { date })
}

function getTotalSecurityIncident(param: number) {
  return post(API.getTotalSecurityIncident, param)
}

function getBlowSecurityIncident(param: number) {
  return post(API.getBlowSecurityIncident, param)
}

function getCommunicationSecurityIncident(param: number) {
  return post(API.getCommunicationSecurityIncident, param)
}

function confirm(id: string) {
  return get(API.confirm, { id })
}
function goBack(id: string) {
  return get(API.goBack, { id })
}

function exportUnitTable(dto: Record<string, any>) {
  const res = download(API.exportUnitTable, dto)
  return res
}

function exportProjectTable(dto: Record<string, any>) {
  const res = download(API.exportProjectTable, dto)
  return res
}

function getSecurityIncident(id: string) {
  return get(API.getSecurityIncident, { id, t: new Date().getTime() })
}

function addDwSecurityIncident(param: Record<string, any>) {
  return post(API.addDwSecurityIncident, param)
}

function addYWSecurityIncident(param: Record<string, any>) {
  return post(API.addYWSecurityIncident, param)
}

function deleteSecurityIncident(id: string) {
  return get(API.deleteSecurityIncident, { id })
}

function inHandle(id: string) {
  return get(API.inHandle, { id })
}

function handle(id: string) {
  return get(API.handle, { id })
}

/** 根据流程ID跳转慧正流程 */
function getWorkflowUrlById(id: string) {
  return get(API.getWorkflowUrlById.replace('{workId}', id))
}
// 查询通用运维任务id
function addGeneralOperaMaint2(taskEventId: string) {
  return get(API.addGeneralOperaMaint2 + '?taskEventId=' + taskEventId)
}

function addPenetrationTest2(taskEventId: string) {
  return get(API.addPenetrationTest2 + '?taskEventId=' + taskEventId)
}

function tracetosource(eventId: string) {
  return get(API.tracetosource + '?eventId=' + eventId)
}

function threatToBan(eventId: string) {
  return get(API.threatToBan + '?eventId=' + eventId)
}

function bugFix(eventId: string) {
  return get(API.bugFix + '?eventId=' + eventId)
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

function updateSecurityIncident(params: Record<string, any>) {
  return post(API.updateSecurityIncident, params)
}

function getTaskList(eventId: string) {
  return get(API.getTaskList + '?eventId=' + eventId)
}

export {
  getAllIncidentStatistic,
  getIncidentStatistic,
  getIncidentStatisticByView,
  getDwSecurityIncidentTrend,
  getSecurityIncidentTrend,
  getIncidentStatisticByGroup,
  getTopUnit,
  getTopUnitTime,
  getTotalSecurityIncident,
  getBlowSecurityIncident,
  getCommunicationSecurityIncident,
  confirm,
  goBack,
  exportUnitTable,
  exportProjectTable,
  getSecurityIncident,
  addDwSecurityIncident,
  addYWSecurityIncident,
  deleteSecurityIncident,
  inHandle,
  handle,
  toDetail,
  addGeneralOperaMaint2,
  addPenetrationTest2,
  tracetosource,
  threatToBan,
  bugFix,
  updateSecurityIncident,
  getTaskList,
  queryHostsByIds,
  pageQueryAllBiz,
}
