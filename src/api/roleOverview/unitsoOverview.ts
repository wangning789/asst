import { get } from '@/utils/ajax'

export const enum API {
  // 单位安全管理员获取最新通报
  circularNowStat = 'service-platform/circular/statistics/circularNowStat',
  // 单位安全管理员未完成的通报计数
  notFinishAnnounce = 'service-platform/circular/statistics/processingUnitCircularStat',
  // 单位安全管理员未完成的安全事件
  todoSecurity = 'service-platform/securityIncident/getNoHandleStatusStatistic',
  getIncidentStatisticByDwaq = 'service-platform/securityIncident/getIncidentStatisticByDwaq',

}

function circularNowStat(param: Record<string, any>) {
  return get(API.circularNowStat, param)
}

function notFinishAnnounce() {
  return get(API.notFinishAnnounce)
}

function todoSecurity() {
  return get(API.todoSecurity)
}

function getIncidentStatisticByDwaq() {
  return get(API.getIncidentStatisticByDwaq)
}
export {
  circularNowStat,
  notFinishAnnounce,
  todoSecurity,
  getIncidentStatisticByDwaq,
}
