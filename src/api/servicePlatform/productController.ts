// 获取云平台信息/product/getProvider  获取云平台信息/** 审批 */
import { post } from '@/utils/ajax'

export const enum API {
  /** 获取云平台信息 */
  getProvider = 'service-platform//product/getProvider',

}
// 穿参数类型
export interface ParamsId{
  id?: string
  ids?: string
}
/** 获取云平台信息
 * @param noCache
 */
function getP(params: ParamsId) {
  return post(API.getProvider, params)
}

export { getP }
