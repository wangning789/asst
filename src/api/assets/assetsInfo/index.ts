// 这是资产信息api
import { post, get } from '@/utils/ajax'
export const enum API {
  // 查询所有资产类型
  assetsTypeAll = 'asset/ciType/listAll',
  // 查询所有资产属性表头加内容
  assetsListAll = '/ciColumn/listAll',
  // 查询所有用户 下拉
  adminGetStaffList = 'auth-server/staff/adminGetStaffList',
  // 查询本机和下级的用户 下拉
  commonUserGetStaffList = 'auth-server/staff/commonUserGetStaffList',
  // 查询所有的资产关系
  getRelationList = 'asset/relation/getRelationList',
  // 根据关键字查询资产
  listByKeyword = 'asset/baseCi/listByKeyword',
}

// 状态
const ASSET_USE_STATUS = {
  0: '启用中',
  1: '已停用',
}
// 资产形态
const ASSET_FORM = {
  0: '软件',
  1: '硬件',
  2: '软硬一体',
}

// 查询所有资产类型
function assetsTypeAll(param: Record<string, any>) {
  return post(API.assetsTypeAll, { ...param })
}
// 查询所有资产属性表头加内容
function assetsListAll(param: Record<string, any>) {
  return post(API.assetsListAll, param)
}
// 查询所有用户
function adminGetStaffList() {
  return get(API.adminGetStaffList)
}
// 查询本机和下级的用户
function commonUserGetStaffList() {
  return get(API.commonUserGetStaffList)
}
// 查询所有的资产关系
function getRelationList() {
  return get(API.getRelationList)
}
// 根据关键字查询资产
function listByKeyword(param: Record<string, any>) {
  return post(API.listByKeyword, param)
}

export {
  assetsTypeAll,
  assetsListAll,
  adminGetStaffList,
  commonUserGetStaffList,
  getRelationList,
  listByKeyword,
  ASSET_USE_STATUS,
  ASSET_FORM,
}
