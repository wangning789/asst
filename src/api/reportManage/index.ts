
import { get, post } from '@/utils/ajax'

export const enum API {
  getOperationSecurityReportList = 'service-platform/security/getOperationSecurityReportList', // 通报联络员获取报告列表
  getSecurityReportList = 'service-platform/security/getSecurityReportList', // 单位领导获取报告列表
  getSecurityReportById = 'service-platform/security/getSecurityReportById', // 根据id获取报告信息
  saveSecurityReport = 'service-platform/security/saveSecurityReport', // 新增/编辑报告
  deleteReport = 'service-platform/security/delete', // 删除报告
}
function getOperationSecurityReportList(
  params: Record<string, any>
) {
  return post(API.getOperationSecurityReportList, params)
}

function getSecurityReportList(params: Record<string, any>) {
  return post(API.getSecurityReportList, params)
}
function getSecurityReportById(reportId: string) {
  return get(API.getSecurityReportById, { reportId })
}
function saveSecurityReport(
  params: Record<string, any>
) {
  return post(API.saveSecurityReport, params)
}

function deleteReport(
  params: Record<string, any>
) {
  return get(API.deleteReport, params)
}

export {
  getOperationSecurityReportList,
  getSecurityReportList,
  getSecurityReportById,
  saveSecurityReport,
  deleteReport,
}
