/** 告警 */
import { post, get } from '@/utils/ajax'
// import { influenceScopeList } from './influenceScopeList'

export const enum API {
  /** 告警统计 */
  statistics = 'service-platform/alarmWithEvent/getAlarmStatistics',
  /** 表格 */
  DetaList = 'service-platform/alarmWithEvent/getAlarmList',
  /** 告警-详情 */
  Particulars = 'service-platform/alarmWithEvent/getAlarmDetail',
  /** 告警-处置 */
  Dispose = 'service-platform/alarmWithEvent/saveAlarmDispositionMsg',
  /** 告警-升级 */
  UpdateAlarm = 'service-platform/alarmWithEvent/updateAlarm',

  /** 查询安全日志列表(post) */
  selLog = 'service-platform/alarmWithEvent/getSecurityLogList',
  /** 查询安全日志详情(post) */
  selLogInfo = 'service-platform/alarmWithEvent/getSecurityLogDetail',
  /** 安全日志总数统计(post) */
  selLogTotal = 'service-platform/alarmWithEvent/getSecurityLogTotal',

  /** 获取原始日志 */
  log = 'service-platform/alarmWithEvent/getsecLogDetail',
  /** 获取源IP和目的IP相关信息 */
  ipInfo = 'service-platform/alarmWithEvent/getSrcAndDstDetail',
  /** 安全告警关联日志接口 */
  relLog = 'service-platform/alarmWithEvent/getAlarmrelevanceLog',
  /** 发起工单运维 */
  alarmOperateFlow = 'service-platform/workOrder/operation/add/alarmOperateFlow',
  // 获取运维侧的告警处置列表
  getOperationCurAlarmWorkOrderList = 'service-platform/alarmWithEvent/getOperationCurAlarmWorkOrderList',
  // 修改处置状态
  saveAlarmDispositionMsg = 'service-platform/alarmWithEvent/saveAlarmDispositionMsg'
}

export interface Warning {
  /**  高级ID集合 */
  alarmIds?: string

  /** 创建日期 example: 1970-1-1 00:00:00 */
  createDate?: number

  /** 创建者 example: uuid */
  createUser?: string

  /**  事件描述 */
  eventDescribe?: string

  /**  事件名称 */
  eventName?: string

  /**  事件编号 */
  eventNo?: string

  /**  事件状态 */
  eventStatus?: number

  /**  处理人 */
  handler?: string

  /** 主键ID example: uuid */
  id?: string[]

  // influenceScopeList?: influenceScopeList []

  /** 最后修改日期 example: 1970-1-1 00:00:00 */
  modifyDate?: number

  /** 最后修改者 example: uuid */
  modifyUser?: string

  /** 排序字段 example: field */
  orderField?: string

  /** 排序字段类型 example: desc */
  orderFieldType?: string

  /** 页码 example: 1 */
  page?: number

  /** 页面条数 example: 10 */
  pageSize?: number

  /**  告警状态 */
  secewarnStatus?: string

  /**  告警id */
  secewarnUuids?: string

  /**  威胁级别 */
  threatLevel?: number
}

/** 安全日志 */
export interface SecurityLog {
  /** 创建日期 example: 1970-1-1 00:00:00 */
  createDate?: number

  /** 创建者 example: uuid */
  createUser?: string

  /**    查询结束时间 */
  endTime?: string
  /** 主键ID example: uuid */
  id?: string

  /** 主键IDS example: List [ "uuid", "uuid" ] */
  ids?: [string]
  /** 关键字查询 example: 关键词 */
  keyword?: string

  /** 最后修改日期 example: 1970-1-1 00:00:00 */
  modifyDate?: number

  /** 最后修改者 example: uuid */
  modifyUser?: string

  /** 排序字段 example: field */
  orderField?: string

  /** 排序字段类型 example: desc */
  orderFieldType?: string

  /** 页码 example: 1 */
  page?: number

  /** 页面条数 example: 10 */
  pageSize?: number

  /**    待搜索的内容 */
  searchInfo?: string
  /**    日志级别 */
  seclogLevels?: string
  /**    日志类型 */
  seclogTypes?: string
  /**  查询开始时间 */
  startTime?: string
}

export interface QueryListParams {
  /** adsad */
  keyWord: string

  /** 主键ID example: uuid */
  /**   */
  cloud?: string /** 创建日期 example: 1970-1-1 00:00:00 */
  createDate?: number

  /** 创建者 example: uuid */
  createUser?: string

  /** 是否删除 example: 0 */
  delStatus?: number

  /** 删除日期 example: 1970-1-1 00:00:00 */
  deleteDate?: number

  /** 删除者 example: uuid */
  deleteUser?: string

  /** 编号 example: uuid */
  id?: string

  /**   */
  importantStatus?: boolean /**   */
  ip?: string /** 最后修改日期 example: 1970-1-1 00:00:00 */
  modifyDate?: number

  /** 最后修改者 example: uuid */
  modifyUser?: string

  /**   */
  origin?: number /**   */
  port?: number /**   */
  region?: string /**     */
  securityEventId?: string
}

/** 告警- 统计
 * @param noCache
 */
function stalist(): Promise<{ data: Warning }> {
  return post(API.statistics)
}

/** 告警-表格
 * @param noCache
 */
function detaList(param: any, noCache?: boolean): Promise<{ data: Warning }> {
  return post(API.DetaList, param, null, { noCache })
}

/** 告警-详情页
 * @param noCache
 */
// function particulars(
//   secewarnUuid: string,
//   noCache?: boolean
// ): Promise<{ data: { body: Warning } }> {
//   return post(API.Particulars, null, { secewarnUuid }, { noCache: !!noCache })
// }

function particulars(secewarnUuid: string): Promise<{ data: Warning }> {
  return get(API.Particulars, { secewarnUuid })
}

/** 告警处置 */
function dispose(data: SecurityLog) {
  return post(API.Dispose, data, undefined)
}

/** 告警升级 */
function updateAlarm(data: SecurityLog) {
  return post(API.UpdateAlarm, data, undefined)
}

/** 查询日志列表 */
function selectLog(data: SecurityLog) {
  return post(API.selLog, data, undefined)
}

/** 查询日志详情 */
function selectInfo(seclogUuid: string) {
  return post(API.selLogInfo, undefined, { seclogUuid })
}

/** 查询日志总数 */
function selectTotal() {
  return post(API.selLogTotal, undefined, undefined)
}

/** 获取原始日志 */
function log(
  params: { seclogUuid: string; orilogUuid: string },
  noCache?: boolean
) {
  return post(API.log, params, { noCache })
}
/** 获取源IP和目的IP相关信息 */
function ipInfo(params: QueryListParams) {
  return post(API.ipInfo, params)
}
/** 安全告警关联日志接口 */
function relLog(params: { secwarnUuid: string }, noCache?: boolean) {
  return get(API.relLog, params, { noCache })
}
function getOperationCurAlarmWorkOrderList(
  secewarnUuid: string
) {
  return get(API.getOperationCurAlarmWorkOrderList, { secewarnUuid })
}
function alarmOperateFlow(
  relAlarmId: string,
  relAlarmInfo: string,
  customerLoginId: string,
  customer: string
) {
  return post(API.alarmOperateFlow, { relAlarmId, relAlarmInfo, customerLoginId, customer })
}
function saveAlarmDispositionMsg(
  alarmId: string,
  secewarnStatus: string
) {
  return post(API.saveAlarmDispositionMsg, { alarmId, secewarnStatus })
}
export {
  stalist,
  detaList,
  particulars,
  selectLog,
  selectInfo,
  selectTotal,
  updateAlarm,
  dispose,
  log,
  ipInfo,
  relLog,
  alarmOperateFlow,
  getOperationCurAlarmWorkOrderList,
  saveAlarmDispositionMsg,
}
