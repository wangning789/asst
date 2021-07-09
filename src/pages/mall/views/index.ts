/** 模块索引 */
import { getAsync } from '@com/hoc'
import DistributeRoute, { ModuleFactory } from '@/functions/router/module'

/** 商城首页 */
export const main: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "mMain" */ './main/Show')
      ),
    },
    {
      path: ':id',
      component: getAsync(() =>
        import(/* webpackChunkName: "mMain" */ './main/Info')
      ),
    },
  ],
})

/** 购物车 */
export const cart: ModuleFactory = meta => ({
  meta,
  component: getAsync(() => import(/* webpackChunkName: "mCC" */ './Cart')),
})

/** 购物车 */
export const cashier: ModuleFactory = meta => ({
  meta,
  component: getAsync(() => import(/* webpackChunkName: "mCC" */ './Cashier')),
})
