/** 模块索引 */
import { getAsync } from '@com/hoc'
import DistributeRoute, { ModuleFactory } from '@/functions/router/module'
// import { RawLocation } from '@/functions/router'

export {
  menu,
  auth,
  department,
  role,
  systemLog,
  code,
  property,
  facility,
  safetyAsset,
  appAsset,
} from './admin'
export { default as user } from './user'

/** 导航视图 */
export const main: ModuleFactory = meta => ({
  meta,
  component: getAsync(() => import(/* webpackChunkName: "hMain" */ './Main')),
})

const PrdOperations = getAsync(() =>
  import(/* webpackChunkName: "hPrd" */ './product/Add')
)
/** 产品管理 */
export const product: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hPrd" */ './product/List')
      ),
    },
    { path: 'add', props: { be: 'add' }, component: PrdOperations },
    { path: ':id/detail', props: { be: 'detail' }, component: PrdOperations },
    { path: ':id/edit', props: { be: 'edit' }, component: PrdOperations },
  ],
})

const SrvOperations = getAsync(() =>
  import(/* webpackChunkName: "hSrv" */ './serve/Add')
)
/** 服务管理 */ // TODO
export const serve: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hSrv" */ './serve/List')
      ),
    },
    { path: 'add', component: SrvOperations },
    { path: 'info', component: SrvOperations },
    { path: 'edit', component: SrvOperations },
  ],
})

const NtcOperations = getAsync(() =>
  import(/* webpackChunkName: "hNtc" */ './notice/Add')
)
/** 公告列表 */
export const notice: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hNtc" */ './notice/List')
      ),
    },
    { path: 'add', props: { be: 'add' }, component: NtcOperations },
    { path: ':id/detail', props: { be: 'detail' }, component: NtcOperations },
    { path: ':id/edit', props: { be: 'edit' }, component: NtcOperations },
  ],
})

/** 工单列表 */
// export const workorder: ModuleFactory = meta => ({
//   meta,
//   component: getAsync(() =>
//     import(/* webpackChunkName: "hWo" */ './Workorder')
//   ),
// })
export const workorder: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hApv" */ './Workorder')
      ),
    },
    // { path: ':id/detail', props: { type: 'detail' }, component: supplierInfo },
    {
      path: '/new',
      component: getAsync(() =>
        import(/* webpackChunkName: "hApv" */ './Workorder/newWorkOrder')
      ),
    },
  ],
})
/** 审批管理 */
export const approve: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hApv" */ './approve/Screening')
      ),
    },
    // { path: ':id/detail', props: { type: 'detail' }, component: supplierInfo },
    {
      path: 'detail',
      component: getAsync(() =>
        import(/* webpackChunkName: "hApv" */ './approve/Detail')
      ),
    },
  ],
})

/** 告警管理  Report upgrade  */
export const warning: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hWrn" */ './warning/Report')
      ),
    },
    {
      path: ':id/info',
      component: getAsync(() =>
        import(/* webpackChunkName: "hWrn" */ './warning/Emergency')
      ),
    },
    {
      path: ':id/up',
      name: 'Upgrade',
      component: getAsync(() =>
        import(/* webpackChunkName: "hWrn" */ './warning/Upgrade')
      ),
    },
    {
      path: ':id',
      component: getAsync(() =>
        // import(/* webpackChunkName: "hStl" */ '../securityLog/info')
        import(/* webpackChunkName: "hStl" */ './securityLog/Info')
      ),
    },
  ],
})

/** 供应商管理 */
const supplierInfo = getAsync(() =>
  import(/* webpackChunkName: "hSup" */ './supplier/Info')
)
export const supplier: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hSup" */ './supplier/List')
      ),
    },
    { path: ':id/info', props: { type: 'info' }, component: supplierInfo },
    { path: ':id/edit', props: { type: 'edit' }, component: supplierInfo },
  ],
})

/** 安全日志 */
export const securityLog: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hSlg" */ './securityLog/List')
      ),
    },
    {
      path: ':id/info',
      component: getAsync(() =>
        import(/* webpackChunkName: "hSlg" */ './securityLog/Info')
      ),
    },
  ],
})

/** 客户管理 */
const clientInfo = getAsync(() =>
  import(/* webpackChunkName: "hCli" */ './client/Info')
)
export const client: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hCli" */ './client/List')
      ),
    },
    { path: 'add', props: { type: 'add' }, component: clientInfo },
    { path: ':id/info', props: { type: 'info' }, component: clientInfo },
    { path: ':id/edit', props: { type: 'edit' }, component: clientInfo },
  ],
})
/** 公告中心 */
export const noticeCenter: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hNct" */ './noticeCenter/List')
      ),
    },
    {
      path: ':id/detail',
      props: { be: 'detail' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hNct" */ './noticeCenter/Info')
      ),
    },
  ],
})

/** 采购记录 */
const requireInfo = getAsync(() =>
  import(/* webpackChunkName: "rIf" */ './requirement/Info')
)
export const requirement: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './requirement')
      ),
    },
    { path: 'add', props: { type: 'add' }, component: requireInfo },
    { path: ':id/info', props: { type: 'info' }, component: requireInfo },
    { path: ':id/edit', props: { type: 'edit' }, component: requireInfo },
  ],
})
export const placeOrder: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    { path: '', props: { type: 'add' }, component: requireInfo },
  ],
})

/** 安全报表 */
const ReportDetail = getAsync(() =>
  import(/* webpackChunkName: "hCli" */ './Report/Detail')
)
export const report: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hNct" */ './Report/List')
      ),
    },
    { path: ':id/detail', props: { type: 'detail' }, component: ReportDetail },
  ],
})

/** 安全设备管理 */
const vulnerTaskDetail = getAsync(() =>
  import(/* webpackChunkName: "hCli" */ './vulnerTask/detail')
)
export const vulnerTask: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hNct" */ './vulnerTask/list')
      ),
    },
    { path: ':id/detail', props: { type: 'detail' }, component: vulnerTaskDetail },
  ],
})

/** 安全服务管理 */
const FBingDuDetail = getAsync(() =>
  import(/* webpackChunkName: "hCli" */ './securityServe/FBingDu/detail')
)

const virtualFanFireDetail = getAsync(() =>
  import(/* webpackChunkName: "hCli" */ './securityServe/virtualFanFire/detail')
)

const vulneDetectDetail = getAsync(() =>
  import(/* webpackChunkName: "hCli" */ './securityServe/vulneDetect/detail')
)

const vulnePropertyDetail = getAsync(() =>
  import(/* webpackChunkName: "hCli" */ './securityServe/vulneDetect/property')
)
export const securityServe: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      name: 'securityServe',
      component: getAsync(() =>
        import(/* webpackChunkName: "hNct" */ './securityServe')
      ),
    },
    { path: '/detail', name: 'bdDetail', props: { type: 'detail' }, component: FBingDuDetail },
    { path: ':devId/vDetail', props: { type: 'vDetail' }, component: virtualFanFireDetail },
    { path: '/dDetail', name: 'vulnePropertyDetail', props: { type: 'dDetail' }, component: vulnePropertyDetail },
    { path: '/PDetail', name: 'vulneDetectDetail', props: { type: 'PDetail' }, component: vulneDetectDetail },
  ],
})

/** 用户概览 */

export const userOverview: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hNct" */ './userOverview')
      ),
    },
  ],
})
/** 安全报表 */
export const securityReport: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hAp6" */ './securityReport')
      ),
    },
    {
      path: 'upload',
      props: { type: 'upload' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hAp6" */ './securityReport/upload')
      ),
    },
  ],
})
/** 知识库维护管理 */
const knowledgeInfo = getAsync(() =>
  import(/* webpackChunkName: "hCli" */ './knowledge/component/upload')
)
export const knowledge: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      props: { fileType: 4 },
      component: getAsync(() =>
        import(/* webpackChunkName: "hApn" */ './knowledge')
      ),
    },
    { path: 'upload', props: { type: 'upload' }, component: knowledgeInfo },
  ],
})
// 学习资料
export const data: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      props: { fileType: 3 },
      component: getAsync(() =>
        import(/* webpackChunkName: "hApm" */ './knowledge')
      ),
    },
    { path: 'upload', props: { type: 'upload' }, component: knowledgeInfo },
  ],
})
// 法律法规
export const law: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      props: { fileType: 1 },
      component: getAsync(() =>
        import(/* webpackChunkName: "hApe" */ './knowledge')
      ),
    },
    { path: 'upload', props: { type: 'upload' }, component: knowledgeInfo },
  ],
})
// 风险预警
const riskDetail = getAsync(() =>
  import(/* webpackChunkName: "hCli" */ './noticeCenter/Info')
)
export const risk: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hApc" */ './knowledge/risk')
      ),
    },
    { path: ':id/detail', props: { who: 'mine' }, component: riskDetail },
  ],
})

// 安全资讯
export const security: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hAp3" */ './knowledge/security')
      ),
    },
    { path: ':id/detail', props: { type: 'upload' }, component: riskDetail },
  ],
})

// 安全告警
export const securityWarning: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hAp3" */ './securityWarning')
      ),
    },
    {
      path: 'detail',
      props: { type: 'upload' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hAp3" */ './securityWarning/detail')
      ),
    },
  ],
})
const noticeManageAdd = getAsync(() =>
  import(/* webpackChunkName: "hNtc" */ './noticeManage/Add')
)
// 通报管理
export const noticeManage: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './noticeManage/index')
      ),
    },
    {
      path: 'add',
      props: { be: 'add' },
      component: noticeManageAdd,
    },
    {
      path: ':id/edit',
      props: { be: 'edit' },
      component: noticeManageAdd,
    },
    {
      path: ':id/loopholeInfo',
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './noticeManage/loopholeInfo')
      ),
    },
    {
      path: ':id/feedbackInfo',
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './noticeManage/feedbackInfo')
      ),
    },
    {
      path: ':id/carryOutInfo',
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './noticeManage/carryOutInfo')
      ),
    },
  ],
})
// 组织机构管理
export const organization: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './systemManage/organization')
      ),
    },
  ],
})
// 用户管理
export const userManage: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './systemManage/userManage')
      ),
    },
  ],
})
// 安全事件
export const securityIncident: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './securityIncident')
      ),
    },
    {
      path: ':id/edit',
      props: { be: 'edit' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hWrn" */ './securityIncident/createSecurityIncident')
      ),
    },
    {
      path: '/securityIncident/new',
      props: { be: 'new' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hWrn" */ './securityIncident/createSecurityIncident')
      ),
    },
    {
      path: ':id/info',
      component: getAsync(() =>
        import(/* webpackChunkName: "hWrn" */ './securityIncident/securityIncidentDetail')
      ),
    },
  ],
})

// 资产管理
export const assetsManage: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './assetsManage')
      ),
    },
    {
      path: 'addHost',
      props: { be: 'add' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './assetsManage/hostAssets/addHost')
      ),
    },
    {
      path: ':id/hostInfo',
      props: { be: 'info' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hWrn" */ './assetsManage/hostAssets/hostInfo')
      ),
    },
    {
      path: ':id/editHost',
      props: { be: 'edit' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hWrn" */ './assetsManage/hostAssets/addHost')
      ),
    },
    {
      path: 'addTerminal',
      props: { be: 'add' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './assetsManage/computerTerminal/addTerminal')
      ),
    },
    {
      path: ':id/terminalInfo',
      props: { be: 'info' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hWrn" */ './assetsManage/computerTerminal/addTerminal')
      ),
    },
    {
      path: ':id/editTerminal',
      props: { be: 'edit' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hWrn" */ './assetsManage/computerTerminal/addTerminal')
      ),
    },
    {
      path: 'addBusiness',
      props: { be: 'add' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hWrn" */ './assetsManage/systemAssets/addBusiness')
      ),
    },
    {
      path: ':id/BusinessInfo',
      props: { be: 'Info' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hWrn" */ './assetsManage/systemAssets/businessInfo')
      ),
    },
    {
      path: ':id/editBiz',
      props: { be: 'edit' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hWrn" */ './assetsManage/systemAssets/addBusiness')
      ),
    },
    {
      path: 'addSecurity',
      props: { be: 'add' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './assetsManage/securityAssets/addSecurity')
      ),
    },
    {
      path: ':id/nfo',
      component: getAsync(() =>
        import(/* webpackChunkName: "hWrn" */ './assetsManage/securityAssets/addSecurity')
      ),
    },
    {
      path: ':id/editSecurity',
      props: { be: 'edit' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hWrn" */ './assetsManage/securityAssets/addSecurity')
      ),
    },
    {
      path: ':id/securityInfo',
      props: { be: 'info' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hWrn" */ './assetsManage/securityAssets/securityInfo')
      ),
    },
    {
      path: 'addStorage',
      props: { be: 'add' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './assetsManage/storage/addStorage')
      ),
    },
    {
      path: ':id/storageInfo',
      props: { be: 'info' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hWrn" */ './assetsManage/storage/addStorage')
      ),
    },
    {
      path: ':id/editStorage',
      props: { be: 'edit' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hWrn" */ './assetsManage/storage/addStorage')),
    },
    {
      path: '/assetsManage/addPeripherals',
      props: { be: 'add' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './assetsManage/computerPeripherals/addPeripherals')
      ),
    },
    {
      path: ':id/assetsManage/addPeripherals/inof',
      props: { be: 'inof' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './assetsManage/computerPeripherals/addPeripherals')
      ),
    },
    {
      path: ':id/assetsManage/addPeripherals/edit',
      props: { be: 'edit' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './assetsManage/computerPeripherals/addPeripherals')
      ),
    },
    {
      path: '/assetsManage/addSecretCount',
      props: { be: 'add' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './assetsManage/secretCount/addSecretCount')
      ),
    },
    {
      path: ':id/assetsManage/editSecretCount',
      props: { be: 'edit' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './assetsManage/secretCount/addSecretCount')
      ),
    },
    {
      path: ':id/assetsManage/modifySecretCount',
      props: { be: 'modify' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './assetsManage/secretCount/addSecretCount')
      ),
    },
    {
      path: '/assetsManage/addNonSecretCount',
      props: { be: 'add' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './assetsManage/nonSecretCount/addNonSecretCount')
      ),
    },
    {
      path: ':id/assetsManage/editNonSecretCount',
      props: { be: 'edit' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './assetsManage/nonSecretCount/addNonSecretCount')
      ),
    },
    {
      path: ':id/assetsManage/modifyNonSecretCount',
      props: { be: 'modify' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './assetsManage/nonSecretCount/addNonSecretCount')
      ),
    },
  ],
})

// 资产概览
export const assetsOverview: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './assetsOverview')
      ),
    },

  ],
})

// 任务管理
export const taskManagement: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './taskManagement/index')
      ),
    },
  ],
})

// 角色总概览
export const roleOverview: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './roleOverview/index')
      ),
    },
  ],
})

// 报告管理
export const reportManage: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './reportManage/index')
      ),
    },
    {
      path: 'uploadReport',
      component: getAsync(() =>
        import(/* webpackChunkName: "hAp6" */ './reportManage/upload')
      ),
    },
  ],
})

// 任务概况
export const leaderTaskOverview: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './leaderTaskOverview/index')
      ),
    },
  ],
})

// 威胁情报
export const threatNotification: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './threatNotification/index')
      ),
    },
  ],
})

// 日常巡检
export const operationFrontier: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './operationFrontier/index')
      ),
    },
  ],
})

// 巡检任务管理
export const operationManagement: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './operationFrontier/operationManagement')
      ),
    },
    {
      path: 'addInspection',
      props: { be: 'add' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hAp6" */ './operationFrontier/addInspection')
      ),
    },
    {
      path: ':id/editInspection',
      props: { be: 'edit' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hAp6" */ './operationFrontier/addInspection')
      ),
    },
    {
      path: ':id/detailsInspection',
      props: { be: 'details' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hAp6" */ './operationFrontier/addInspection')
      ),
    },
  ],
})

/** 资产管理 组织架构 */
export const organizational: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './organizational/organizational')
      ),
    },
  ],
})
/** 资产管理 资产信息 */

const customizeInfo = getAsync(() =>
  import(/* webpackChunkName: "hNtc" */ './assets/assetsInfo/customize/Info')
)
const serverInfo = getAsync(() =>
  import(/* webpackChunkName: "hNtc" */ './assets/assetsInfo/server/Info')
)
const businessSystemInfo = getAsync(() =>
  import(/* webpackChunkName: "hNtc" */ './assets/assetsInfo/businessSystem/Info')
)
const securityFacilityInfo = getAsync(() =>
  import(/* webpackChunkName: "hNtc" */ './assets/assetsInfo/securityFacility/Info')
)
export const assetsInfo: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './assets/assetsInfo')
      ),
    },
    {
      path: 'server',
      title: '服务器详情',
      component: DistributeRoute,
      children: [
        {
          path: '',
          title: '服务器详情',
          component: serverInfo,
        },
        {
          path: 'add',
          name: '新增服务器',
          props: { type: 'add' },
          component: getAsync(() =>
          import(/* webpackChunkName: "hNtc" */ './assets/assetsInfo/server/Info/Edit')
          ),
        },
        {
          path: ':id/info',
          name: '服务器详情',
          props: { type: 'info' },
          component: serverInfo,
        },
        {
          path: ':id/edit',
          name: '编辑服务器',
          props: { type: 'edit' },
          component: getAsync(() =>
          import(/* webpackChunkName: "hNtc" */ './assets/assetsInfo/server/Info/Edit')
          ),
        },
      ],
    },
    {
      path: 'customize',
      title: '自定义详情',
      component: DistributeRoute,
      children: [
        {
          path: '',
          title: '自定义详情',
          component: customizeInfo,
        },
        {
          path: ':ciTypeId/add',
          name: '新增自定义',
          props: { type: 'add' },
          component: getAsync(() =>
          import(/* webpackChunkName: "hNtc" */ './assets/assetsInfo/customize/Info/Edit')
          ),
        },
        {
          path: ':ciTypeId/:id/info',
          name: '自定义详情',
          props: { type: 'info' },
          component: customizeInfo,
        },
        {
          path: ':ciTypeId/:id/edit',
          name: '编辑自定义',
          props: { type: 'edit' },
          component: getAsync(() =>
          import(/* webpackChunkName: "hNtc" */ './assets/assetsInfo/customize/Info/Edit')
          ),
        },
      ],
    },
    {
      path: 'businessSystem',
      title: '应用系统详情',
      component: DistributeRoute,
      children: [
        {
          path: '',
          name: '应用系统详情',
          component: businessSystemInfo,
        },
        {
          path: 'add',
          props: { type: 'add' },
          name: '新增应用系统',
          component: getAsync(() =>
          import(/* webpackChunkName: "hApb" */ './assets/assetsInfo/businessSystem/Info/Edit')
          ),
        },
        {
          path: ':id/info',
          props: { type: 'info' },
          name: '应用系统详情',
          component: businessSystemInfo,
        },
        {
          path: ':id/edit',
          props: { type: 'edit' },
          name: '编辑应用系统',
          component: getAsync(() =>
          import(/* webpackChunkName: "hApb" */ './assets/assetsInfo/businessSystem/Info/Edit')
          ),
        },
      ],
    },
    {
      path: 'securityFacility',
      name: '安全产品详情',
      component: DistributeRoute,
      children: [
        {
          path: '',
          name: '安全产品详情',
          component: securityFacilityInfo,
        },
        {
          path: 'add',
          name: '新增安全产品',
          props: { type: 'add' },
          component: getAsync(() =>
          import(/* webpackChunkName: "hNtc" */ './assets/assetsInfo/securityFacility/Info/Edit')
          ),
        },
        {
          path: ':id/info',
          name: '资产详情',
          props: { type: 'info' },
          component: securityFacilityInfo,
        },
        {
          path: ':id/edit',
          name: '编辑安全产品',
          props: { type: 'edit' },
          component: getAsync(() =>
            import(/* webpackChunkName: "hNtc" */ './assets/assetsInfo/securityFacility/Info/Edit')
          ),
        },
      ],
    },
    {
      path: '/businessSystem',
      props: { be: 'details' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './assets/assetsInfo/businessSystem')
      ),
    },
  ],
})

/** 资产管理 资产关系管理 */

export const assetsRelation: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './assets/assetsRelation')
      ),
    },
  ],
})

/** 资产管理 资产类型管理 */

export const assetsType: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './assets/assetsType')
      ),
    },
  ],
})

/** 资产管理 资产探针管理 */

export const assetsProbe: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './assets/assetsProbe')
      ),
    },
    {
      path: ':id/info',
      name: '探针详情',
      props: { type: 'info' },
      component: getAsync(() =>
        import(/* webpackChunkName: "hNtc" */ './assets/assetsProbe/info')
      ),
    },
  ],
})

/** 资产管理 概览 */

export const overview: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './assets/overview')
      ),
    },
  ],
})
/** 资产发现任务 */
export const assetDiscoveryTask: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './assets/assetFound/assetDiscoveryTask')
      ),
    },
    {
      path: 'internetAssetDiscovery',
      name: '互联网资产发现',
      props: { type: 'add' },
      component: getAsync(() =>
      import(/* webpackChunkName: "hNtc" */ './assets/assetFound/assetDiscoveryTask/networkScanDiscovery/internet/internetAssetDiscovery')
      ),
    },
    {
      path: 'internet/:id/info',
      name: '互联网资产详情',
      props: { type: 'info' },
      component: getAsync(() =>
      import(/* webpackChunkName: "hNtc" */ './assets/assetFound/assetDiscoveryTask/networkScanDiscovery/internet/internetInfo')
      ),
    },
    {
      path: 'intranetAssetDiscovery',
      name: '内网资产发现',
      props: { type: 'add' },
      component: getAsync(() =>
      import(/* webpackChunkName: "hNtc" */ './assets/assetFound/assetDiscoveryTask/networkScanDiscovery/intranet/intranetAssetDiscovery')
      ),
    },
    {
      path: 'intranet/:id/info',
      name: '内网资产详情',
      props: { type: 'info' },
      component: getAsync(() =>
      import(/* webpackChunkName: "hNtc" */ './assets/assetFound/assetDiscoveryTask/networkScanDiscovery/intranet/intranetInfo')
      ),
    },
  ],
})
/** 已忽略主机 */
export const hostIgnored: ModuleFactory = meta => ({
  meta,
  component: DistributeRoute,
  children: [
    {
      path: '',
      component: getAsync(() =>
        import(/* webpackChunkName: "hApb" */ './assets/assetFound/hostIgnored')
      ),
    },

  ],
})
