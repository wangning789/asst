/** 全局复用模块索引 */
import { getAsync } from '@com/hoc'
import { ModuleFactory } from '@/functions/router/module'

/** 订单管理 */
export const order: ModuleFactory = meta => ({
  meta,
  component: getAsync(() => import(/* webpackChunkName: "ord" */ './Order')),
})
