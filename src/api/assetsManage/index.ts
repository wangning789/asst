
import { get } from '@/utils/ajax'

export const enum API {
  // 本级及下级
  organizationTree = 'auth-server/organization/getAssetOrganizationTree',
  // 所有All
  gitAllOrganizationTree = 'auth-server/organization/getOrganizationTree',
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

function getAllOrganizationTree() {
  return get(API.gitAllOrganizationTree)
}

export {
  getOrganizationTree,
  getAllOrganizationTree,
}
