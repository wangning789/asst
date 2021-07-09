/** 人员管理模块 */
import { getAsync } from '@com/hoc'
import DistributeRoute, { ModuleFactory } from '@/functions/router/module'

const AddOrEdit = getAsync(() =>
  import(/* webpackChunkName: "hUsr" */ './AddOrEdit')
)

export default (meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hUsr" */ './List')
      ),
    },
    { path: 'add', props: { be: 'add' }, component: AddOrEdit },
    { path: ':id/edit', props: { be: 'edit' }, component: AddOrEdit },
    {
      path: ':id/info',
      component: getAsync(() =>
        import(/* webpackChunkName: "hUsr" */ './Info')
      ),
    },
  ],
})) as ModuleFactory
