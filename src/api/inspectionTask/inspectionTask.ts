import { get, post } from '@/utils/ajax'

export const enum API {
  /** 单位领导，资产概括 */
  assetss='service-platform/safetyInspectionCycle/getSafetyInspectionCycleList',
  theServer='asset/host/queryCompanyBelowTotalHostForOP',
  cycleInformation='service-platform/safetyInspectionCycle/addSafetyInspectionCycle', // 添加安全周期信息
  safetyProducts='asset/securityDevice/listCurrentAndNextForOP',
  DeleteSecurity='service-platform/safetyInspectionCycle/deleteSafetyInspectionCycle', // 删除安全巡检周期
  modify='service-platform/safetyInspection/getSafetyInspection',
  details='service-platform/safetyInspectionCycle/getSafetyInspectionCycleById'// 获取巡检周期详情
}

function assetss(param: Record<string, any>) {
  return get(API.assetss, param)
}

function theServer(param: Record<string, any>) {
  return post(API.theServer, param)
}

function cycleInformation(param: Record<string, any>) {
  return post(API.cycleInformation, param)
}

function safetyProducts(param: Record<string, any>) {
  return post(API.safetyProducts, param)
}

function DeleteSecurity(param: Record<string, any>) {
  return get(`service-platform/safetyInspectionCycle/deleteSafetyInspectionCycle?cycleId=${param}`)
}

function modify(param: Record<string, any>) {
  return post(API.modify, param)
}

function details(param: Record<string, any>) {
  return get(`service-platform/safetyInspectionCycle/getSafetyInspectionCycleById?safetyInspectionCycleId=${param}`)
}
export {
  assetss,
  theServer,
  cycleInformation,
  safetyProducts,
  DeleteSecurity,
  modify,
  details,
}
