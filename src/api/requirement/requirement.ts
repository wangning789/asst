/** 供应商管理 */
import { get, post, put } from '@/utils/ajax'
// import { Approve } from '@/api/servicePlatform/examination'

export const enum API {
  // /** 查询供应商列表(get) */
  // list = 'service-platform/Vendor/findAllVendor',
  // /** 查看供应商详情(post) */
  // info = 'service-platform/Vendor/findByIdVendor',
  // /** 添加供应商(post) */
  // add = 'service-platform/Vendor/addVendor',
  // /** 删除供应商 (delete) */
  //   delete = 'service-platform/Vendor/deleteVendor',
  // /** 筛选查询供应商 */
  // filter = 'service-platform/Vendor/filterVendors',
  // /** 修改供应商信息 (put) */
  // update = 'service-platform/Vendor/updateVendor',

  // 新增采购单 (POST)
  add = 'service-platform/requisitionForm/add',
  // 运营人员确认采购单(PUT)
  confirm = 'service-platform/requisitionForm/confirm',
  // 查询采购单详情(云服务商 GET)
  getRequisitionFormInfo = 'service-platform/requisitionForm/getRequisitionFormInfo',
  // 查询采购单详情(运营 GET)
  commercialInfo = 'service-platform/requisitionForm/getReqFormInfoByOperation',
  // 运营采购单列表分页(POST)
  listReqFormByOperation = 'service-platform/requisitionForm/listReqFormByOperation',
  // 云服务商采购单列表分页(POST)
  listReqFormByProvider = 'service-platform/requisitionForm/listReqFormByProvider',
  // 云服务商修改采购单(PUT)
  modify = 'service-platform/requisitionForm/modify',
  // 云服务商撤回采购单(POST)
  recall = 'service-platform/requisitionForm/recall',
  // 运营人员退回采购单(POST)
  sendBack = 'service-platform/requisitionForm/sendBack',
  // 获取关联订单列表
  getOrderList = 'service-platform/requisitionForm/getOrderListByFormId',
  // 获取套餐list
  SecurityServiceMarket = 'service-platform/SecurityServiceMarket/page',
  // 获取shoprcar list
  // getShoppingCartList = 'service-platform/SecurityServiceMarket/cart/getShoppingCartList',
  // 获取服务下面的包
  getProductInfo = 'service-platform/service/getServiceInfo',
  // 获取价钱
  baseInfo ='service-platform/SecurityServiceMarket/baseInfo',
  // 获取所有统采服务
  allService ='service-platform//SecurityServiceMarket/getServiceListByProvider'
}

export interface Supplier {
  /** 对接人  */
  contact?: string
  /** 创建日期 example: 1970-1-1 00:00:00 */
  createDate?: number

  /** 创建者 example: uuid */
  createUser?: string

  /** 是否删除 example: 0 */
  delStatus?: number

  /** 删除日期 example: 1970-1-1 00:00:00 */
  deleteDate?: number

  /** 删除者 example: uuid */
  deleteUser?: string

  /** 编号 example: uuid */
  id?: string

  /** 最后修改日期 example: 1970-1-1 00:00:00 */
  modifyDate?: number

  /** 最后修改者 example: uuid */
  modifyUser?: string

  /** 联系方式  */
  phoneNumber?: string
  /**   */
  products?: string[]
  /** 供应产品  */
  productsName?: string
  /** 供应商名  */
  vendorName?: string
  /** 供应商编号  */
  vendorNo?: string
}

function listReqFormByOperation(
  param: any
): any {
  return post(API.listReqFormByOperation, param)
}
function getRequisitionFormInfo(
  id: string
) {
  return get(API.getRequisitionFormInfo, { id })
}
// 获取详情 运营
function commercialInfo(
  id: string
) {
  return get(API.commercialInfo, { id })
}

function add(
  param: any
): any {
  return post(API.add, param)
}
function sendBack(
  id: string
): any {
  return get(API.sendBack, { id })
}

function recall(
  id: string
): any {
  return get(API.recall, { id })
}

function confirm(
  param: any
): any {
  return put(API.confirm, param)
}

function listReqFormByProvider(
  param: any
): any {
  return post(API.listReqFormByProvider, param)
}

function modify(
  param: any
): any {
  return put(API.modify, param)
}

function SecurityServiceMarket(
  param: any
): any {
  return post(API.SecurityServiceMarket, param)
}

// 获取所有统采服务
function allService(): any {
  return post(API.allService)
}

function getOrderList(
  param: any
) {
  return get(API.getOrderList, param)
}

function getProductInfo(
  id: any
) {
  return get(API.getProductInfo, { id })
}
function baseInfo(
  serviceId: any
) {
  return get(API.baseInfo, { serviceId })
}
// function getShoppingCartList(
//   param: any
// ) {
//   return post(API.getShoppingCartList, param)
// }
// /** 查询供应商列表
//  *
//  */
// function allList(
//   param: any,
//   noCache?: boolean
// ): Promise<{ data: { body: Supplier } }> {
//   return get(API.list, param, { noCache })
// }

// /** 查看一个供应商详情
//  * @param id
//  *
//  */
// function info(
//   id: string,
//   noCache?: boolean
// ): Promise<{ data: { body: Approve } }> {
//   return post(API.info, undefined, { id }, { noCache })
// }
//
// /** 新增供应商
//  * @param supplier
//  */
// function add(supplier: Supplier) {
//   return post(API.add, supplier)
// }
//
// /** 删除供应商
//  * @param supplier
//  */
// // function delet(
// //   id: string,
// //   noCache?: boolean
// // ): Promise<{ data: { body: Approve } }> {
// //   return del(API.delete, { id }, { noCache })
// // }
//
// // function delet(supplier: Supplier) {
// //   return del(API.delete, supplier)
// // }
//
// /** 模糊查询供应商
//  * @param supplier
//  */
// function fil(supplier: Supplier) {
//   return post(API.filter, supplier)
// }
//
// /** 修改供应商
//  * @param supplier
//  */
// function update(supplier: Supplier) {
//   return put(API.update, supplier)
// }

export {
  listReqFormByOperation,
  add,
  confirm,
  listReqFormByProvider,
  modify,
  SecurityServiceMarket,
  allService,
  getRequisitionFormInfo,
  commercialInfo,
  getProductInfo,
  baseInfo,
  recall,
  sendBack,
  getOrderList,
}
