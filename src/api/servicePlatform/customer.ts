import { get } from '@/utils/ajax'

export const enum API {
  /** 根据登录用户ID查询客户详情 */
  info = 'service-platform/customer/getCustomerByUserId',
  /** 云服务商查询负责客户下拉 */
  listCloudService = 'service-platform/customer/listCustomerForProvider',
  /** 销售或经销商查询负责客户下拉 */
  listSales = 'service-platform/customer/listCustomerForSellMan',
}

/** 根据登录用户ID查询客户详情 */
function info(id: string, noCache?: boolean) {
  return get(API.info, { id }, { noCache })
}

/** 云服务商查询负责客户下拉 */
function listCloudService() {
  return get(API.listCloudService)
}
/** 销售或经销商查询负责客户下拉 */
function listSales() {
  return get(API.listSales)
}

export { info, listCloudService, listSales }
