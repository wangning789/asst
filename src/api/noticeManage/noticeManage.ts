
import { get, post, put } from '@/utils/ajax'
import { encode } from '@/functions/cipher'

export const enum API {
  // 新建通报
  addCircular = 'service-platform/circular/addCircular',
  // 通报联络员通报列表-全部列表
  queryCircularAllList = 'service-platform/circular/getCircularAllList',
  // 单位通报列表-单位安全管理员列表自己
  queryCircularList = 'service-platform/circular/getCircularListBDwaq',
  // 单位领导通报列表-单位领导-本级及下级
  getCircularListByDwld = 'service-platform/circular/getCircularListByDwld',
  // 删除通报
  deleteCircular = 'service-platform/circular/deleteCircular',
  // 发布通报回填
  getCircularAllDetail = 'service-platform/circular/getCircularAllDetail',
  // 编辑通报
  updateCircular = 'service-platform/circular/updateCircular',
  // 查询2级组织机构信息
  getTwoLeverOrganizationInfo = 'auth-server/organization/getTwoLeverOrganizationInfo',
}

function addCircular(param: Record<string, any>) {
  param.content = encode(param.content)
  return put(API.addCircular, param)
}
function queryCircularAllList(param: Record<string, any>) {
  return post(API.queryCircularAllList, param)
}
function queryCircularList(param: Record<string, any>) {
  return post(API.queryCircularList, param)
}
function getCircularListByDwld(param: Record<string, any>) {
  return post(API.getCircularListByDwld, param)
}

// 删除通报反馈
function deleteCircular(param: Record<string, any>) {
  return post(API.deleteCircular, param)
}

// 发布通报回填
function getCircularAllDetail(param: Record<string, any>) {
  return get(API.getCircularAllDetail, param)
}

// 查询2级组织机构信息
function getTwoLeverOrganizationInfo(param: Record<string, any>) {
  return get(API.getTwoLeverOrganizationInfo, param)
}

// 编辑通报
function updateCircular(param: Record<string, any>) {
  param.content = encode(param.content)
  return post(API.updateCircular, param)
}

export {
  addCircular,
  queryCircularAllList,
  queryCircularList,
  getCircularListByDwld,
  deleteCircular,
  getCircularAllDetail,
  updateCircular,
  getTwoLeverOrganizationInfo,
}
