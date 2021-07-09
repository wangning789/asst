/** 模块索引 */
import { getAsync } from '@com/hoc'
import DistributeRoute, { ModuleFactory } from '@/functions/router/module'

/** 菜单管理 */
export const menu: ModuleFactory = meta => ({
  meta,
  component: getAsync(() => import(/* webpackChunkName: "hAdm" */ './Menu')),
})

/** 权限管理 */
export const auth: ModuleFactory = meta => ({
  meta,
  component: getAsync(() => import(/* webpackChunkName: "hAdm" */ './Auth')),
})

const DepOperations = getAsync(() =>
  import(/* webpackChunkName: "hAdm" */ './department/Operations')
)
/** 部门管理 */
export const department: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hAdm" */ './department/List')
      ),
    },
    { path: ':id?/add', props: { be: 'add' }, component: DepOperations },
    { path: ':id/info', props: { be: 'info' }, component: DepOperations },
    { path: ':id/edit', props: { be: 'edit' }, component: DepOperations },
  ],
})

/** 角色管理 */
export const role: ModuleFactory = meta => ({
  meta,
  component: getAsync(() => import(/* webpackChunkName: "hAdm" */ './Role')),
})

/** 系统日志 */
export const systemLog: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hStl" */ './systemLog/List')
      ),
    },
    {
      path: ':id',
      component: getAsync(() =>
        import(/* webpackChunkName: "hStl" */ './systemLog/info')
      ),
    },
  ],
})
/** 码表管理 */
export const code: ModuleFactory = meta => ({
  meta,
  component: getAsync(() => import(/* webpackChunkName: "hAdmC" */ './Code')),
})

/** 服务资产 */
const ServeAddOrEdit = getAsync(() =>
  import(/* webpackChunkName: "hUsr" */ './Property/ServeAddOrEdit')
)

export const property: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hStl" */ './Property')
      ),
    },
    {
      path: ':id/server',
      component: getAsync(() =>
        import(/* webpackChunkName: "hStl" */ './Property/serverInfo')
      ),
    },
    { path: 'addServe', props: { be: 'addServe' }, component: ServeAddOrEdit },
    { path: ':id/editServe', props: { be: 'editServe' }, component: ServeAddOrEdit },

  ],
})

/** 系统资产 */
const appAddOrEdit = getAsync(() =>
  import(/* webpackChunkName: "hUsr" */ './appAsset/appAddOrEdit')
)
export const appAsset: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hStl" */ './appAsset')
      ),
    },
    {
      path: ':id/app',
      component: getAsync(() =>
        import(/* webpackChunkName: "hStl" */ './appAsset/appInfo')
      ),
    },
    { path: 'add', props: { be: 'add' }, component: appAddOrEdit },
    { path: ':id/edit', props: { be: 'edit' }, component: appAddOrEdit },
  ],
})

/** 安全设备 */
export const facility: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hStl" */ './Facility')
      ),
    },
    {
      path: ':id',
      component: getAsync(() =>
        import(/* webpackChunkName: "hStl" */ './Facility/info')
      ),
    },
  ],
})

/** 安全资产 */
export const safetyAsset: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hStl" */ './safetyAsset')
      ),
    },
    {
      path: ':id/appInfo',
      component: getAsync(() =>
        import(/* webpackChunkName: "hStl" */ './safetyAsset/appInfo')
      ),
    },
    {
      path: ':id/antivirusInfo',
      component: getAsync(() =>
        import(/* webpackChunkName: "hStl" */ './safetyAsset/antivirusInfo')
      ),
    },
    {
      path: ':id/scanInfo',
      component: getAsync(() =>
        import(/* webpackChunkName: "hStl" */ './safetyAsset/scanInfo')
      ),
    },
    {
      path: ':id/workInfo',
      component: getAsync(() =>
        import(/* webpackChunkName: "hStl" */ './safetyAsset/workInfo')
      ),
    },
    {
      path: ':id/tamperInfo',
      component: getAsync(() =>
        import(/* webpackChunkName: "hStl" */ './safetyAsset/tamperInfo')
      ),
    },
  ],
})
