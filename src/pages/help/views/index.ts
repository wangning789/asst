/** 模块索引 */
import { getAsync } from '@com/hoc'
import DistributeRoute, {
  SubModuleFactory as ModuleFactory,
} from '@/functions/router/module'

/** 帮助手册 */
export const main: ModuleFactory = meta => ({
  path: '',
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "pMain" */ './Main')
      ),
    },
  ],
})
