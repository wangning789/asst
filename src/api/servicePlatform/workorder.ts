import { get, post } from '@/utils/ajax'

// workorder 工单
/** 服务相关接口 */
export const enum API {
  /** 分页查询 */
  getWorkorders = 'service-platform/workOrder/getWorkOrderList', // yunwei
  getWorkorderStatistics = 'service-platform/workOrder/getWorkOrderCount',
  serviceOperateFlow = 'service-platform/workOrder/customer/add/serviceOperateFlow',
  operationserviceOperateFlow = 'service-platform/workOrder/operation/add/serviceOperateFlow',
  getWorkOrderCountToCustomer = 'service-platform/workOrder/getWorkOrderCountToCustomer',
  getWorkOrderListToCustomer = 'service-platform/workOrder/getWorkOrderListToCustomer' // kefu

}

/** 服务信息 */
export interface Workorder {
  id?: string // 工单ID
  workOrderNo?: string // 工单编号
  workOrderName?: string // 工单标题
  typeName?: string // 工单类型
  purchaseOrderNo?: string // 关联订单
  nodeName?: string // 流程节点
  securityServiceName?: string // 服务名称
  // workOrderStatus?: string // 工单状态
  sourceName?: string // 工单来源
  workLevelName?: string // 工单级别
  beginTime?: string // 创建时间
  endTime?: string // 结束时间
  reliveryTime?: string // 到期时间
  createUser?: string // 发起人
  handler?: string // 当前处理人
}
/** 获取统计信息 */
function getWorkorderStatistics() {
  return get(API.getWorkorderStatistics)
}
/** 列表分页 */
function getWorkorders(params: Workorder) {
  return post(API.getWorkorders, params)
}
// function getCustomerWorkOrderCount() {
//   return get(API.getCustomerWorkOrderCount)
// }
function serviceOperateFlow() {
  return post(API.serviceOperateFlow, { productTypeCode: '' })
}
function operationserviceOperateFlow() {
  return post(API.operationserviceOperateFlow, { productTypeCode: '' })
}
function getWorkOrderCountToCustomer() {
  return get(API.getWorkOrderCountToCustomer)
}
function getWorkOrderListToCustomer(
  params: any
) {
  return post(API.getWorkOrderListToCustomer, params)
}
export {
  getWorkorderStatistics,
  getWorkorders,
  serviceOperateFlow,
  operationserviceOperateFlow,
  getWorkOrderCountToCustomer,
  getWorkOrderListToCustomer,
}
