import { get, post } from '@/utils/ajax'

export const enum API {
  notice='service-platform/notice/list', // 通报，监测，运维公告
  safetyBulletin='service-platform/notice/cloudServicesList', // 安全专家公告
  needToBeDealtWith='service-platform/taskProcess/statistical/survey/todo', // 我的代办
  statistics= 'service-platform/taskProcess/statistical/survey', // 任务统计数通用
  taskProcess='service-platform/taskProcess/statistical/bar', // 条形图
  notification='service-platform/circular/statistics/processingCircularStat', // 进行中通报
  security='service-platform/securityIncident/getAllIncidentStatusStatusStatistic'// 安全事件状态统计

}

function notice(param: Record<string, any>) {
  return post(API.notice, param)
}

function safetyBulletin(param: Record<string, any>) {
  return post(API.safetyBulletin, param)
}

function statistics(param: Record<string, any>) {
  return get(API.statistics, param)
}

function taskProcess(param: Record<string, any>) {
  return get(API.taskProcess, param)
}

function needToBeDealtWith() {
  return get(API.needToBeDealtWith)
}

function notification() {
  return get(API.notification)
}

function security() {
  return get(API.security)
}
export {
  notice,
  safetyBulletin,
  statistics,
  taskProcess,
  needToBeDealtWith,
  notification,
  security,
}
