import { post, get } from '@/utils/ajax'

/** 服务商城 */
export const enum API {
  /** 查询服务商城列表(post) */
  selShop = 'service-platform/SecurityServiceMarket/page',

  /** 查询服务基础详情(get) */
  selBaseInfo = 'service-platform/SecurityServiceMarket/baseInfo',

  /** 获取产品类型(post) */
  getProductType = 'service-platform/product/getProdType',

  /** 用户购买(post) */
  buyCustomer = 'service-platform/SecurityServiceMarket/customer/purchase',

  /** 云服务商购买(post) */
  buyProvider = 'service-platform/SecurityServiceMarket/provider/purchase',

  /** 销售购买(post) */
  buySalesman = 'service-platform/SecurityServiceMarket/salesman/purchase',

  /** 查询服务详情(get) */
  getInfo = 'service-platform/service/getServiceInfo',

  /** 查询云平台详情(post) */
  getProvider = 'service-platform/product/getProvider',

  /** 云平台查询云自己详情(post) */
  getProviderSelf = 'service-platform/product/getSelfProvider',

  /** 查询用户选择套餐内容(get) */
  getCombo = 'service-platform/SecurityServiceMarket/product/info',

  /** 查询服务评论(post) */
  getComment = 'service-platform/PurchaseOrderEvaluation/securityService/page',
}

/** 服务商城 */
export interface Shop {
  /**    租户评分平均值 */
  averageScore?: number
  /**   */
  createDate?: {} /** 创建者 example: uuid */
  createUser?: string

  /**    使用租户数量 */
  customerNumber?: number
  /**    删除标识 */
  delStatus?: boolean
  /** 删除日期 example: 1970-1-1 00:00:00 */
  deleteDate?: number

  /** 主键ID example: uuid */
  id?: string

  /**   */
  ids?: [] /** 关键字查询 example: 关键词 */
  keyword?: string

  /**    服务最低价格 */
  miniPrice?: number
  /**   */
  modifyDate?: {} /** 最后修改者 example: uuid */
  modifyUser?: string

  /** 排序字段 example: field */
  orderField?: string

  /** 排序字段类型 example: desc */
  orderFieldType?: string

  /** 页码 example: 1 */
  page?: number

  /** 页面条数 example: 10 */
  pageSize?: number

  /**    安全服务图片 */
  serviceImageId?: string
  /**    安全服务简介 */
  serviceIntroduce?: string
  /**    安全服务标签 */
  serviceLabel?: string
  /**    安全服务名称 */
  serviceName?: string
  /**  安全服务版本 */
  version?: string
}

/** 查询服务商城列表 */
function selectShop(data: Shop) {
  return post(API.selShop, data, undefined)
}
// async function selectShop(data: Shop) {
//   const res = await post(API.selShop, data)
//   const body = res.data.body
//   const list = body.data as any[]
//   list.push(list[0], list[0], list[0], list[0], list[0])
//   body.total = 30
//   return res
// }

/** 获取产品类型 */
function selectProductType() {
  return post(API.getProductType)
}

/** 查询基础详情 */
function selectBaseInfo(serviceId: string) {
  return get(API.selBaseInfo, { serviceId })
}

/** 查询服务详情 */
function selectShopInfo(id: string) {
  return get(API.getInfo, { id })
}

/** 普通查询云平台详情 */
function selectProvider() {
  return post(API.getProvider)
}

/** 云服务商查询自己 */
function selectProviderSelf() {
  return post(API.getProviderSelf)
}

/** 查询用户选择套餐 */
function selectCombo(comboForm: Record<string, any>) {
  return get(API.getCombo, comboForm)
}

/** 用户购买 */
function buyCustomer(data: Record<string, any>) {
  return post(API.buyCustomer, data)
}

/** 云服务商购买 */
function buyProvider(data: Record<string, any>) {
  return post(API.buyProvider, data)
}

/** 销售购买 */
function buySalesman(data: Record<string, any>) {
  return post(API.buySalesman, data)
}

/** 查询服务相关评论 */
function selectShopComment(data: Shop) {
  return post(API.getComment, data, undefined)
}

export {
  selectShop,
  selectShopInfo,
  selectProvider,
  selectProviderSelf,
  selectCombo,

  buyCustomer,
  buyProvider,
  buySalesman,
  selectBaseInfo,
  selectProductType,
  selectShopComment,
}
