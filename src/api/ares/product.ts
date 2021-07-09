
import { get, post, put, del } from '@/utils/ajax'

/** 产品服务相关接口 */
export const enum API {

  /** 分页查询 */
  listProdPage='service-platform/product/listProdPage',
  /** 查询产品详情 */
  productInfo='service-platform/product/getProductInfo',
  /** 新增产品 */
  productSave='service-platform/product/addProd',
  /** 修改产品 */
  productEdit='service-platform/product/modifyProd',
  /** 删除产品 */
  productDel='service-platform/product/delProd',
  /** 产品入库 */
  productProdApply='service-platform/product/addProdApply',
  /** 获取云平台信息 */
  getProvider='service-platform/product/getProvider',
  /** 厂商下拉 */
  getVendorList='service-platform/Vendor/getVendorList',
  /** 产品服务方式 */
  getProductsModeCode='service-platform/product/getProductsModeCode',
}

/** 产品信息 */
export interface Product {
  'createDate'?: string
  'createUser'?: string
  'deleteUser'?: string
  'deliveryType'?: string
  'id'?: string
  'ids'?: object[]
  'keyword'?: string
  'modifyDate'?: string
  'modifyUser'?: string
  'orderField'?: string
  'orderFieldType'?: string
  'page'?: number
  'pageSize'?: number
  'priceList'?: object[]
  'productsModel'?: string
  'productsName'?: string
  'productsNo'?: string
  'productsOrigin'?: number
  'productsRemark'?: string
  'productsStatus'?: number
  'productsTypeCode'?: string
  'storageAmounts'?: number
  'takeEffectTime'?: string
  'vendorId'?: string
  'vendorName'?: string
  'version'?: string
  'versionName'?: string
}

/** 列表分页 */

function pageList(parms: any) {
  return post(API.listProdPage, parms)
}

/** 查询产品详情 */

function productInfo(parms: any) {
  return get(API.productInfo, parms)
}

/** 保存产品 */
function productSave(parms: any) {
  return post(API.productSave, parms)
}

/** 修改产品 */
function productEdit(parms: any) {
  return put(API.productEdit, parms)
}

/** 删除产品 */
function productDel(parms: any) {
  return del(API.productDel, parms)
}

/**  产品入库 */
function productProdApply(parms: any) {
  return post(API.productProdApply, parms)
}

/**  获取云平台信息 */
function getProvider(parms: any) {
  return post(API.getProvider, parms)
}
/**  厂商下拉 */
function getVendorList(parms: any) {
  return get(API.getVendorList, parms)
}

/**  产品服务方式 */
function getProductsModeCode(parms: any) {
  return get(API.getProductsModeCode, parms)
}
export {
  pageList,
  productInfo,
  productSave,
  productEdit,
  productDel,
  productProdApply,
  getProvider,
  getVendorList,
  getProductsModeCode,
}
