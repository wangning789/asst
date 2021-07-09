/** 模块索引 */
import { getAsync } from '@com/hoc'
import DistributeRoute, {
  SubModuleFactory as ModuleFactory,
} from '@/functions/router/module'

/** 商城首页 */
export const main: ModuleFactory = meta => ({
  path: '/',
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "iMain" */ './Main')
      ),
    },
    {
      path: ':id/notice',
      component: getAsync(() =>
        import(/* webpackChunkName: "iMain" */ './Info')
      ),
    },
    {
      path: ':id/service',
      component: getAsync(() =>
        import(/* webpackChunkName: "iMain" */ './Service')
      ),
    },
    {
      path: 'about',
      component: getAsync(() =>
        import(/* webpackChunkName: "iMain" */ './More/about')
      ),
    },
    {
      path: 'law',
      component: getAsync(() =>
        import(/* webpackChunkName: "iMain" */ './More/law')
      ),
    },
    {
      path: 'terms',
      component: getAsync(() =>
        import(/* webpackChunkName: "iMain" */ './More/terms')
      ),
    },
    {
      path: 'contact',
      component: getAsync(() =>
        import(/* webpackChunkName: "iMain" */ './More/contact')
      ),
    },
  ],
})
