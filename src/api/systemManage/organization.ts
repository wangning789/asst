/** 组织机构管理 */
import { get, post } from '@/utils/ajax'

export const enum API {
  organizationTree = 'auth-server/organization/getOrganizationTree',
  getOrganizationInfoById = 'auth-server/organization/getOrganizationInfoById',
  addOrganization = 'auth-server/organization/addOrganization',
  getOrganizationInfo = 'auth-server/organization/getOrganizationInfo',
  getOrgByUserInfo = 'auth-server/organization/getOrganizationListByUserInfo',
  getOrganizationUpdateInfo = 'auth-server/organization/getOrganizationUpdateInfo',
  businessId= 'service-platform/securityIncident/securityIncidentPageListByBusinessId',
  listByBusinessId='service-platform/securityIncident/securityIncidentPageListByHostId',
  getIncidentCount='service-platform/securityIncident/getIncidentCount',
  queryHostsByIds= 'asset/host/queryHostsByIds',
  // 获取当前单位的本级或下级
  getOrganizationListById= 'auth-server/organization/getOrganizationListById',
}

export interface Menu {
  /** 主键ID example: uuid */
  id?: string
  /** 单位名称 */
  organizationName?: string
  /** 单位级别 */
  organizationLevel?: string
  /** 上级单位 */
  parentName?: string
  /** 简称 */
  abbreviation?: string
  /** 备注 */
  organizationDesc?: string
  /** 备注 */
  organizationPath?: string
  /** 是否可用 */
  enabled?: number
  /** 模块上级ID */
  parentId?: string
}

function getOrganizationTree() {
  return get(API.organizationTree)
}

function getOrganizationInfoById(organizationId: string) {
  return get(API.getOrganizationInfoById, { organizationId })
}
function getOrgByUserInfo() {
  return get(API.getOrgByUserInfo)
}
function getOrganizationListById(param: object) {
  return get(API.getOrganizationListById, param)
}

function addOrganization(param: object) {
  return post(API.addOrganization, param)
}

function getIncidentCount(param: object) {
  return post(API.getIncidentCount, param)
}
function listByBusinessId(param: object) {
  return post(API.listByBusinessId, param)
}

function businessId(param: object) {
  return post(API.businessId, param)
}

function getOrganizationInfo(param: string) {
  return get(API.getOrganizationInfo, { param })
}

function getOrganizationUpdateInfo(param: string) {
  return get(API.getOrganizationUpdateInfo, { param })
}
function queryHostsByIds(param: any) {
  return post(API.queryHostsByIds, param)
}

export {
  getOrganizationTree,
  getOrganizationInfoById,
  addOrganization,
  getOrganizationInfo,
  getOrganizationListById,
  getOrganizationUpdateInfo,
  businessId,
  listByBusinessId,
  getIncidentCount,
  queryHostsByIds,
  getOrgByUserInfo,

}
