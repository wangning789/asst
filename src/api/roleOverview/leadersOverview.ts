import { get, post } from '@/utils/ajax'

export const enum API {
  // 安全事件统计-本级及下级数据统计-集团领导概览
  getIncidentStatisticByLD = 'service-platform/securityIncident/getIncidentStatisticByLD',
  // 单位最新/最热公告列表-本级及下级及公开数据
  cloudServicesList = 'service-platform/notice/cloudServicesList',
  // 集团领导概览-任务未完成数TOP5
  listToDoWorkByUserId = 'service-platform/workTask/listToDoWorkByUserId',
  // 集团领导概览-通报未完成数TOP5
  circularProcessingStat = 'service-platform/circular/statistics/circularProcessingStat',
  // 公告详情
  noticeDetail = 'service-platform/notice/openNotice',
}

function getIncidentStatisticByLD(param: Record<string, any>) {
  return get(API.getIncidentStatisticByLD, param)
}

function listToDoWorkByUserId(param: Record<string, any>) {
  return get(API.listToDoWorkByUserId, param)
}

function cloudServicesList(param: Record<string, any>) {
  return post(API.cloudServicesList, param)
}

function circularProcessingStat(param: Record<string, any>) {
  return get(API.circularProcessingStat, param)
}

function noticeDetail(param: Record<string, any>) {
  return get(API.noticeDetail, param)
}

export {
  getIncidentStatisticByLD,
  listToDoWorkByUserId,
  cloudServicesList,
  circularProcessingStat,
  noticeDetail,
}
