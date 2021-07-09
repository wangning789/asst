/** 知识库管理 */
import { get, post } from '@/utils/ajax'
// import { Approve } from "@/api/servicePlatform/examination"

export const enum API {
  // 获取安全报表列表信息
  getSecurityReportList = 'service-platform/security/getSecurityReportList',
  // 上传安全报表
  saveSecurityReport = 'service-platform/security/saveSecurityReport',
  // 获取所属用户的列表
  getUserList = 'service-platform/serverAssets/getUserList',
  // 删除安全报表
  securityDelete = 'service-platform/security/delete',
  // 分类统计告警级别总数
  getAlarmLevelStatistics = 'service-platform/alarmWithEvent/getAlarmLevelStatistics',
  // 安全告警未处理统计
  getAlarmNotHandleStatistics = 'service-platform/alarmWithEvent/getAlarmNotHandleStatistics',
  // 安全告警已处理统计
  getAlarmHandledStatistics = 'service-platform/alarmWithEvent/getAlarmHandledStatistics',
  // 安全告警今日数统计
  getAlarmTodayStatistics = 'service-platform/alarmWithEvent/getAlarmTodayStatistics',
  // 安全告警列表
  getCurrentUserAlarmList = 'service-platform/alarmWithEvent/getCurrentUserAlarmList',
  // 安全告警详情
  getAlarmDetail = 'service-platform/alarmWithEvent/getAlarmDetail',
  // 安全告警关联日志
  getAlarmrelevanceLog = 'service-platform/alarmWithEvent/getAlarmrelevanceLog',
  // 以处理
  getSecurityLogStatistics = 'service-platform/alarmWithEvent/getSecurityLogStatistics',
  // 告警类型
  getSubList = 'auth-server/sysCodeTable/getSubList?dictType=1&dictCode=SECURITY_ALARM',
  // chuzhi
  getCurAlarmWorkOrderList = 'service-platform/alarmWithEvent/getCurAlarmWorkOrderList',
  // gog工单详情
  getCurAlarmWorkDetail = 'service-platform/alarmWithEvent/getCurAlarmWorkDetail',
  // 安全报表运维侧获取信息接口：
  getOperationSecurityReportList = 'service-platform/security/getOperationSecurityReportList',
  // 用户侧详情：
  getAlarmUserDetail = 'service-platform/alarmWithEvent/getAlarmUserDetail',
  // 用户发起工单
  alarmOperateFlow = 'service-platform/workOrder/customer/add/alarmOperateFlow',
  // 已处理日志
}

function getSecurityReportList( // 客户
  param: any,
  noCache?: boolean
) {
  return get(API.getSecurityReportList, param, { noCache })
}
function getOperationSecurityReportList(
  params: any
) { // 运维
  return get(API.getOperationSecurityReportList, params)
}
function saveSecurityReport(
  param: any
) {
  return post(API.saveSecurityReport, param)
}
function getUserList() {
  return post(API.getUserList)
}

function securityDelete(
  fileIds: string,
  reportIds: string
) {
  return get(API.securityDelete, { fileIds, reportIds })
}
function getAlarmLevelStatistics() {
  return get(API.getAlarmLevelStatistics)
}
function getAlarmNotHandleStatistics(
  alarmStatus: 1
) {
  return get(API.getAlarmNotHandleStatistics, { alarmStatus })
}
function getAlarmHandledStatistics(
  alarmStatus: 1
) {
  return get(API.getAlarmHandledStatistics, { alarmStatus })
}
function getAlarmTodayStatistics() {
  return get(API.getAlarmTodayStatistics)
}
function getCurrentUserAlarmList(
  param: any
) {
  return get(API.getCurrentUserAlarmList, param)
}
function getAlarmDetail(
  secewarnUuid: string
) {
  return get(API.getAlarmDetail, { secewarnUuid })
}
function getAlarmrelevanceLog(
  secwarnUuid: string
) {
  return get(API.getAlarmrelevanceLog, { secwarnUuid })
}
function getSecurityLogStatistics() {
  return get(API.getSecurityLogStatistics)
}
function getSubList() {
  return get(API.getSubList)
}
function getCurAlarmWorkOrderList(
  secewarnUuid: string
) {
  return get(API.getCurAlarmWorkOrderList, { secewarnUuid })
}
function getCurAlarmWorkDetail(
  alarmId: string
) {
  return get(API.getCurAlarmWorkDetail, { alarmId })
}
function getAlarmUserDetail(
  secewarnUuid: string
) {
  return get(API.getAlarmUserDetail, { secewarnUuid })
}
function alarmOperateFlow(
  relAlarmId: string,
  relAlarmInfo: string
) {
  return post(API.alarmOperateFlow, { relAlarmId, relAlarmInfo })
}
export {
  getSecurityReportList,
  saveSecurityReport,
  getUserList,
  securityDelete,
  getAlarmLevelStatistics,
  getAlarmNotHandleStatistics,
  getAlarmHandledStatistics,
  getAlarmTodayStatistics,
  getCurrentUserAlarmList,
  getAlarmDetail,
  getAlarmrelevanceLog,
  getSecurityLogStatistics,
  getSubList,
  getCurAlarmWorkOrderList,
  getCurAlarmWorkDetail,
  getAlarmUserDetail,
  getOperationSecurityReportList,
  alarmOperateFlow,
}
