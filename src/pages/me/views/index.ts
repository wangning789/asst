/** 模块索引 */
import { getAsync } from '@com/hoc'
import DistributeRoute, {
  SubModuleFactory as ModuleFactory,
} from '@/functions/router/module'

/** 我的信息 */
export const info: ModuleFactory = meta => ({
  path: '',
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "eInfo" */ './Info/Info')
      ),
    },
    {
      path: 'edit',
      component: getAsync(() =>
        import(/* webpackChunkName: "eInfo" */ './Info/Edit')
      ),
    },
  ],
})
