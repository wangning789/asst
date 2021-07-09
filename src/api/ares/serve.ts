import { get, post, put, del } from '@/utils/ajax'

// service-platform 网关路径
/** 服务相关接口 */
export const enum API {
  /** 分页查询 */
  listServicePage = 'service-platform/service/listServicePage',
  /** 查询产品详情 */
  serviceInfo = 'service-platform/service/getServiceInfo',
  /** 新增产品 */
  serviceSave = 'service-platform/service/add',
  /** 修改产品 */
  serviceEdit = 'service-platform/service/modify',
  /** 删除产品 */
  serviceDel = 'service-platform/service/delete',
  /** 获取产品列表 */
  serviceList = 'service-platform/service/getProductList',
  /** 获取产品列表 */
  serviceUpDown = 'service-platform/service/updownShelves',
}

/** 服务信息 */
export interface Service {
  createDate?: string

  createUser?: string

  id?: string

  ids?: string

  modifyDate?: string

  modifyUser?: string

  orderField?: string

  orderFieldType?: string

  packageList?: []

  pageSize?: string

  serviceImageId?: string
  serviceIntroduce?: string
  serviceLabel?: string
  serviceName?: string
  serviceNo?: string
  serviceRemark?: string
  serviceSpecifications?: string
  serviceStatus?: string
  takeEffectTime?: string
  version?: string
}

/** 列表分页 */
function listServicePage(parms: any) {
  return post(API.listServicePage, parms)
}

/** 查询服务详情 */

function serviceInfo(parms: any) {
  return get(API.serviceInfo, parms)
}

/** 保存服务 */
function serviceSave(parms: any) {
  return post(API.serviceSave, parms)
}

/** 修改服务 */
function serviceEdit(parms: any) {
  return put(API.serviceEdit, parms)
}

/** 删除服务 */
function serviceDel(parms: any) {
  return del(API.serviceDel, parms)
}

/** 获取产品列表 */
function serviceList(parms: any) {
  return get(API.serviceList, parms)
}

/** 服务上架下架处理 */
function serviceUpDown(parms: any) {
  return put(API.serviceUpDown, parms)
}

export {
  listServicePage,
  serviceInfo,
  serviceSave,
  serviceEdit,
  serviceDel,
  serviceList,
  serviceUpDown,
}
