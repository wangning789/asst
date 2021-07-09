import { post, get } from '@/utils/ajax'

/** 订单相关接口 */
export const enum API {
  /** 最新订单 */
  getNewOrderList = 'service-platform/order/getNewOrderList',

  /** 查询用户首页订单 */
  getUserOrderList = 'service-platform/order/getNewOrderListByCustomer',

  /** 待办订单 */
  getToDoOrderList = 'service-platform/order/getToDoOrderLimit5',

  /** 客户订单管理统计数据 */
  customCount = 'service-platform/order/getOrderCountByCustomer',
  /** 销售订单管理统计数据 */
  sellsCount = 'service-platform/order/getOrderCountBySellMan',
  /** 运维经理订单管理统计数据 */
  operationManagerCount = 'service-platform/order/getOrderCountByMaintainManager',
  /** 运营人员，运营经理订单管理统计数据 */
  commercialCount = 'service-platform/order/getOrderCountByOperation',
  /** 云服务商订单管理统计数据 */
  cloudServiceCount = 'service-platform/order/getOrderCountByProvider',
  /** 销售经理订单管理统计数据 */
  sellsManagerCount = 'service-platform/order/getOrderCountBySellManManager',

  /** 运维经理查看所有订单列表 */
  opeMOrderList = 'service-platform/order/getOrderList',
  /** 运营，运营经理查看所有订单列表 */
  commercialOrderList = 'service-platform/order/getOrderListByOperation',
  /** 销售经理查看所有订单列表 */
  saleManOrderList = 'service-platform/order/getOrderListBySellManJL',
  /** 客户查看订单管理列表 */
  customerOrderList = 'service-platform/order/getOrderListByCustomer',
  /** 运维人员查看自己已办和待办订单列表 */
  operationOrderList = 'service-platform/order/getOrderListBymaintain',
  /** 云服务商查看自己为下单人的订单列表 */
  cloudServiceOrderList = 'service-platform/order/getOrderListByProvider',
  /** 销售查看负责客户订单管理列表 */
  sellsOrderList = 'service-platform/order/getOrderListBySellMan',

  /** 客户门户获取订单展示大状态下拉列表 */
  customStatus = 'service-platform/order/getOrderStatusByCustomer',
  /** 运维门户获取订单展示大状态下拉列表 */
  operationStatus = 'service-platform/order/getOrderStatusByMaintain',
  /** 运营门户获取订单展示大状态下拉列表 */
  commercialStatus = 'service-platform/order/getOrderStatusByOperation',
  /** 销售门户获取订单展示大状态下拉列表 */
  sellsStatus = 'service-platform/order/getOrderStatusBySell',

  /** 获取工订单展示小状态下拉列表 */
  getChildStatus = 'service-platform/order/getChildStatus',
}

/** 订单 */
export interface PurchaseOrder {
  /** 订单申请类型编码 */
  applyTypeCode?: string

  /** 开始时间 */
  beginTime?: string

  /** 合同附件 */
  contractFile?: string

  /** 合同编号 */
  contractNumber?: string

  /** 创建日期 example: 1970-1-1 00:00:00 */
  createDate?: number

  /** 创建者 example: uuid */
  createUser?: string

  /** 申请客户名称(单位) */
  customer?: string

  /** 申请客户id */
  customerId?: string

  /** 客户登录账号id */
  customerLoginId?: string

  /** 客户登录名 */
  customerLoginName?: string

  /** 删除标识 */
  delStatus?: boolean

  /** 删除日期 example: 1970-1-1 00:00:00 */
  deleteDate?: number

  /** 交付结果 */
  deliverResult?: string

  /** */
  description?: string
  /** 折后订单价格 */
  discountOrderPrice?: number

  /** 结束时间 */
  endTime?: string

  /** 评价内容 */
  evaluationContent?: string

  /** 预计订单交付时间 */
  expectDeliveryTime?: string

  /** 产品id */
  fkSecurityServiceId?: string

  /** 套餐id */
  fkServicePackageId?: string

  /** 订单id */
  id?: string

  /** */
  ids?: string[]
  /** 关键字查询 example: 关键词 */
  keyword?: string

  /** 最后修改日期 example: 1970-1-1 00:00:00 */
  modifyDate?: number

  /** 最后修改者 example: uuid */
  modifyUser?: string

  /** 订单开始时间 */
  orderBeginTime?: string

  /** 订单联系人 */
  orderContacts?: string

  /** 订单联系人电话 */
  orderContactsPhone?: string

  /** 订单结束时间 */
  orderExpireTime?: string

  /** 排序字段 example: field */
  orderField?: string

  /** 排序字段类型 example: desc */
  orderFieldType?: string

  /** 订单编号 */
  orderNo?: string

  /** 下单人id */
  orderPeopleId?: string

  /** 下单人名字 */
  orderPeopleName?: string

  /** 订单价格 */
  orderPrice?: number

  /** 订单状态 */
  orderStatus?: string

  /** 订单状态名称 */
  orderStatusName?: string

  /** 页码 example: 1 */
  page?: number

  /** 页面条数 example: 10 */
  pageSize?: number

  /** 价格修改原因 */
  priceModifyReason?: string

  /** 流程id */
  processId?: string

  /** 当前处理人 */
  processor?: string

  /** 购买时长 */
  purchaseDuration?: number

  /** 实际订单交付时间 */
  realDeliveryTime?: string

  /** 产品名称 */
  securityServiceName?: string

  /** 产品版本 */
  securityServiceVersion?: string

  /** 套餐名称 */
  servicePackageName?: string

  /** 多订单状态列表 */
  statuList?: string[]
}

/** 最新订单 */
function getNewOrderList(parms: any) {
  return post(API.getNewOrderList, parms)
}

/** 客户订单管理统计数据 */
function customCount() {
  return post(API.customCount)
}
/** 销售订单管理统计数据 */
function sellsCount() {
  return post(API.sellsCount)
}
/** 运维经理订单管理统计数据 */
function operationManagerCount() {
  return post(API.operationManagerCount)
}
/** 运营人员，运营经理订单管理统计数据 */
function commercialCount() {
  return post(API.commercialCount)
}
/** 云服务商订单管理统计数据 */
function cloudServiceCount() {
  return post(API.cloudServiceCount)
}
/** 销售经理订单管理统计数据 */
function sellsManagerCount() {
  return post(API.sellsManagerCount)
}

/** 运维经理查看所有订单列表 */
function optManagerOrderList(params: PurchaseOrder, noCache?: boolean) {
  return post(API.opeMOrderList, params, null, { noCache: !!noCache })
}
/** 运营，运营经理查看所有订单列表 */
function commercialOrderList(params: PurchaseOrder, noCache?: boolean) {
  return post(API.commercialOrderList, params, null, { noCache: !!noCache })
}
/** 销售经理查看所有订单列表 */
function saleManagerOrderList(params: PurchaseOrder, noCache?: boolean) {
  return post(API.saleManOrderList, params, null, { noCache: !!noCache })
}
/** 客户查看订单管理列表 */
function customerOrderList(params: PurchaseOrder, noCache?: boolean) {
  return post(API.customerOrderList, params, null, { noCache: !!noCache })
}
/** 运维人员查看自己已办和待办订单列表 */
function operationOrderList(params: PurchaseOrder, noCache?: boolean) {
  return post(API.operationOrderList, params, null, { noCache: !!noCache })
}
/** 云服务商查看自己为下单人的订单列表 */
function cloudServiceOrderList(params: PurchaseOrder, noCache?: boolean) {
  return post(API.cloudServiceOrderList, params, null, { noCache: !!noCache })
}
/** 销售查看负责客户订单管理列表 */
function sellsOrderList(params: PurchaseOrder, noCache?: boolean) {
  return post(API.sellsOrderList, params, null, { noCache: !!noCache })
}

/** 客户门户获取订单展示大状态下拉列表 */
function customStatus() {
  return post(API.customStatus)
}
/** 运维门户获取订单展示大状态下拉列表 */
function operationStatus() {
  return post(API.operationStatus)
}
/** 运营门户获取订单展示大状态下拉列表 */
function commercialStatus() {
  return post(API.commercialStatus)
}
/** 销售门户获取订单展示大状态下拉列表 */
function sellsStatus() {
  return post(API.sellsStatus)
}

/** 用户首页订单 */
function getUserOrderList(parms: any) {
  return post(API.getUserOrderList, parms)
}

/** 待交付订单 */
function getToDoOrderList(parms: any) {
  return post(API.getToDoOrderList, parms)
}

/** 获取工订单展示小状态下拉列表 */
function getChildStatus(parentId: string) {
  return get(API.getChildStatus, { parentId })
}

export {
  getNewOrderList,
  getUserOrderList,
  customCount,
  sellsCount,
  operationManagerCount,
  commercialCount,
  cloudServiceCount,
  sellsManagerCount,
  saleManagerOrderList,
  commercialOrderList,
  optManagerOrderList,
  customerOrderList,
  operationOrderList,
  cloudServiceOrderList,
  sellsOrderList,
  customStatus,
  operationStatus,
  commercialStatus,
  sellsStatus,
  getToDoOrderList,
  getChildStatus,
}
