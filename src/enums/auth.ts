import { SPA } from '@/config'
import { Element } from '@/api/authServer/element'
import { ROLES, ROLE_DES } from '.'
import { MODULE } from './module'

type AuthDictionary = { [key in MODULE]?: Element[] } &
    { [key in SPA]?: Element[] }

/** 权限字典 */
const AUTH: AuthDictionary = {
  [MODULE.main]: [
    { elementCode: '0', description: '显示告警' },
    { elementCode: '1', description: '显示审批' },
    { elementCode: '2', description: '显示待交付订单' },
    { elementCode: '3', description: '显示公告列表' },
    { elementCode: '4', description: '显示最新订单' },
    { elementCode: '5', description: '显示待处理工单' },
    {
      elementCode: ROLES.commercialManager,
      description: ROLE_DES[ROLES.commercialManager],
    },
    {
      elementCode: ROLES.commercialMember,
      description: ROLE_DES[ROLES.commercialMember],
    },
    {
      elementCode: ROLES.custom,
      description: ROLE_DES[ROLES.custom],
    },
    {
      elementCode: ROLES.sales,
      description: ROLE_DES[ROLES.sales],
    },
    {
      elementCode: ROLES.cloudService,
      description: ROLE_DES[ROLES.cloudService],
    },
    {
      elementCode: ROLES.other,
      description: '其他公告权限',
    },
    {
      elementCode: ROLES.commercial,
      description: ROLE_DES[ROLES.commercial],
    },
  ],
  [MODULE.role]: [
    {
      elementCode: ROLES.systemAdmin,
      description: ROLE_DES[ROLES.systemAdmin],
    },
    {
      elementCode: ROLES.superAdmin,
      description: ROLE_DES[ROLES.superAdmin],
    },
  ],
  [MODULE.user]: [
    {
      elementCode: ROLES.common,
      description: ROLE_DES[ROLES.common],
    },
    {
      elementCode: ROLES.systemAdmin,
      description: ROLE_DES[ROLES.systemAdmin],
    },
    {
      elementCode: ROLES.superAdmin,
      description: ROLE_DES[ROLES.superAdmin],
    },
    {
      elementCode: ROLES.communicationLLY,
      description: ROLE_DES[ROLES.communicationLLY],
    },
  ],
  [MODULE.approve]: [
    {
      elementCode: ROLES.commercialManager,
      description: ROLE_DES[ROLES.commercialManager],
    },
    {
      elementCode: ROLES.commercialMember,
      description: ROLE_DES[ROLES.commercialMember],
    },
  ],
  [MODULE.securityWarning]: [
    {
      elementCode: ROLES.custom,
      description: ROLE_DES[ROLES.custom],
    },
  ],
  [MODULE.workorder]: [
    {
      elementCode: ROLES.custom,
      description: ROLE_DES[ROLES.custom],
    },
    {
      elementCode: ROLES.operation,
      description: ROLE_DES[ROLES.operation],
    },
  ],
  [MODULE.order]: [
    {
      elementCode: ROLES.custom,
      description: ROLE_DES[ROLES.custom],
    },
    {
      elementCode: ROLES.cloudService,
      description: ROLE_DES[ROLES.cloudService],
    },
    {
      elementCode: ROLES.sales,
      description: ROLE_DES[ROLES.sales],
    },
    {
      elementCode: ROLES.salesManager,
      description: ROLE_DES[ROLES.salesManager],
    },
    {
      elementCode: ROLES.commercial,
      description: ROLE_DES[ROLES.commercial],
    },
    {
      elementCode: ROLES.operationManager,
      description: ROLE_DES[ROLES.operationManager],
    },
    {
      elementCode: ROLES.operation,
      description: ROLE_DES[ROLES.operation],
    },
  ],
  [MODULE.client]: [
    {
      elementCode: ROLES.cloudService,
      description: ROLE_DES[ROLES.cloudService],
    },
    {
      elementCode: ROLES.sales,
      description: ROLE_DES[ROLES.sales],
    },
    {
      elementCode: ROLES.commercial,
      description: ROLE_DES[ROLES.commercial],
    },
  ],
  [MODULE.risk]: [
    {
      elementCode: ROLES.custom,
      description: ROLE_DES[ROLES.custom],
    },
    {
      elementCode: ROLES.commercial,
      description: ROLE_DES[ROLES.commercial],
    },
    {
      elementCode: ROLES.operation,
      description: ROLE_DES[ROLES.operation],
    },
  ],
  [MODULE.security]: [
    {
      elementCode: ROLES.custom,
      description: ROLE_DES[ROLES.custom],
    },
    {
      elementCode: ROLES.operation,
      description: ROLE_DES[ROLES.operation],
    },
  ],
  [MODULE.securityReport]: [
    {
      elementCode: ROLES.custom,
      description: ROLE_DES[ROLES.custom],
    },
    {
      elementCode: ROLES.operation,
      description: ROLE_DES[ROLES.operation],
    },
  ],
  [MODULE.noticeCenter]: [
    {
      elementCode: ROLES.custom,
      description: ROLE_DES[ROLES.custom],
    },
    {
      elementCode: ROLES.sales,
      description: ROLE_DES[ROLES.sales],
    },
    {
      elementCode: ROLES.cloudService,
      description: ROLE_DES[ROLES.cloudService],
    },
    {
      elementCode: ROLES.commercial,
      description: ROLE_DES[ROLES.commercial],
    },
    {
      elementCode: ROLES.unitSO,
      description: ROLE_DES[ROLES.unitSO],
    },
    {
      elementCode: ROLES.groupLeaders,
      description: ROLE_DES[ROLES.groupLeaders],
    },
  ],
  [MODULE.safetyAsset]: [
    {
      elementCode: ROLES.custom,
      description: ROLE_DES[ROLES.custom],
    },
    {
      elementCode: ROLES.operationManager,
      description: ROLE_DES[ROLES.operationManager],
    },
    {
      elementCode: ROLES.operationMember,
      description: ROLE_DES[ROLES.operationMember],
    },
    {
      elementCode: ROLES.operation,
      description: ROLE_DES[ROLES.operation],
    },
  ],
  [MODULE.facility]: [
    {
      elementCode: ROLES.custom,
      description: ROLE_DES[ROLES.custom],
    },
    {
      elementCode: ROLES.operationManager,
      description: ROLE_DES[ROLES.operationManager],
    },
    {
      elementCode: ROLES.operationMember,
      description: ROLE_DES[ROLES.operationMember],
    },
    {
      elementCode: ROLES.operation,
      description: ROLE_DES[ROLES.operation],
    },
  ],
  [MODULE.property]: [
    {
      elementCode: ROLES.custom,
      description: ROLE_DES[ROLES.custom],
    },
    {
      elementCode: ROLES.operation,
      description: ROLE_DES[ROLES.operation],
    },
  ],
  [MODULE.appAsset]: [
    {
      elementCode: ROLES.custom,
      description: ROLE_DES[ROLES.custom],
    },
    {
      elementCode: ROLES.operation,
      description: ROLE_DES[ROLES.operation],
    },
  ],
  [MODULE.userOverview]: [
    {
      elementCode: ROLES.custom,
      description: ROLE_DES[ROLES.custom],
    },
  ],
  [SPA.mall]: [
    {
      elementCode: ROLES.custom,
      description: ROLE_DES[ROLES.custom],
    },
    {
      elementCode: ROLES.sales,
      description: ROLE_DES[ROLES.sales],
    },
    {
      elementCode: ROLES.cloudService,
      description: ROLE_DES[ROLES.cloudService],
    },
  ],
  [MODULE.requirement]: [
    {
      elementCode: ROLES.cloudService,
      description: ROLE_DES[ROLES.cloudService],
    },
    {
      elementCode: ROLES.commercial,
      description: ROLE_DES[ROLES.commercial],
    },
  ],
  [MODULE.placeOrder]: [
    {
      elementCode: ROLES.cloudService,
      description: ROLE_DES[ROLES.cloudService],
    },
    {
      elementCode: ROLES.commercial,
      description: ROLE_DES[ROLES.commercial],
    },
  ],
  [MODULE.noticeManage]: [
    {
      elementCode: ROLES.superAdmin, // 超级管理员
      description: ROLE_DES[ROLES.superAdmin],
    },
    {
      elementCode: ROLES.communicationLLY, // 通报联络员
      description: ROLE_DES[ROLES.communicationLLY],
    },
    {
      elementCode: ROLES.unitSO, // 单位安全管理员
      description: ROLE_DES[ROLES.unitSO],
    },
    {
      elementCode: ROLES.groupLeaders, // 单位安全管理员
      description: ROLE_DES[ROLES.groupLeaders],
    },
    {
      elementCode: ROLES.projectManager, // 项目经理
      description: ROLE_DES[ROLES.projectManager],
    },
  ],
  [MODULE.organization]: [
    {
      elementCode: ROLES.superAdmin,
      description: ROLE_DES[ROLES.superAdmin],
    },
  ],
  [MODULE.userManage]: [
    {
      elementCode: ROLES.superAdmin,
      description: ROLE_DES[ROLES.superAdmin],
    },
  ],
  [MODULE.securityIncident]: [
    {
      elementCode: ROLES.superAdmin,
      description: ROLE_DES[ROLES.superAdmin],
    },
    {
      elementCode: ROLES.securityExperts, // 安全专家
      description: ROLE_DES[ROLES.securityExperts],
    },
    {
      elementCode: ROLES.unitSO, // 单位安全管理员
      description: ROLE_DES[ROLES.unitSO],
    },
    {
      elementCode: ROLES.groupLeaders, // 单位领导
      description: ROLE_DES[ROLES.groupLeaders],
    },
    {
      elementCode: ROLES.communicationLLY, // 通报联络员
      description: ROLE_DES[ROLES.communicationLLY],
    },
    {
      elementCode: ROLES.monitorAnlysis, // 监测分析员
      description: ROLE_DES[ROLES.monitorAnlysis],
    },
    {
      elementCode: ROLES.opertateMaintenance, // 运维管理员
      description: ROLE_DES[ROLES.opertateMaintenance],
    },
    {
      elementCode: ROLES.projectManager, // 项目经理
      description: ROLE_DES[ROLES.projectManager],
    },
  ],
  [MODULE.assetsManage]: [
    {
      elementCode: ROLES.superAdmin,
      description: ROLE_DES[ROLES.superAdmin],
    },
    {
      elementCode: ROLES.unitSO,
      description: ROLE_DES[ROLES.unitSO], // 安全管理员
    },
    {
      elementCode: ROLES.groupLeaders, // 单位领导
      description: ROLE_DES[ROLES.groupLeaders],
    },
    {
      elementCode: ROLES.communicationLLY, // 通报联络员
      description: ROLE_DES[ROLES.communicationLLY],
    },
    {
      elementCode: ROLES.securityExperts, // 安全专家
      description: ROLE_DES[ROLES.securityExperts],
    },
    {
      elementCode: ROLES.monitorAnlysis, // 监测分析员
      description: ROLE_DES[ROLES.monitorAnlysis],
    },
    {
      elementCode: ROLES.opertateMaintenance, // 运维管理员
      description: ROLE_DES[ROLES.opertateMaintenance],
    },
    {
      elementCode: ROLES.projectManager, // 项目经理
      description: ROLE_DES[ROLES.projectManager],
    },

  ],
  [MODULE.assetsOverview]: [
    {
      elementCode: ROLES.superAdmin,
      description: ROLE_DES[ROLES.superAdmin],
    },
  ],
  [MODULE.taskManagement]: [
    {
      elementCode: ROLES.communicationLLY, // 通报联络员
      description: ROLE_DES[ROLES.communicationLLY],
    },
    {
      elementCode: ROLES.opertateMaintenance, // 运维管理员
      description: ROLE_DES[ROLES.opertateMaintenance],
    },
    {
      elementCode: ROLES.projectManager, // 项目经理
      description: ROLE_DES[ROLES.projectManager],
    },
    {
      elementCode: ROLES.securityExperts, // 安全专家
      description: ROLE_DES[ROLES.securityExperts],
    },
    {
      elementCode: ROLES.monitorAnlysis, // 监测分析员
      description: ROLE_DES[ROLES.monitorAnlysis],
    },
    {
      elementCode: ROLES.unitSO, // 单位安全管理员
      description: ROLE_DES[ROLES.unitSO],
    },

  ],
  [MODULE.roleOverview]: [
    {
      elementCode: ROLES.communicationLLY, // 通报联络员
      description: ROLE_DES[ROLES.communicationLLY],
    },
    {
      elementCode: ROLES.opertateMaintenance, // 运维管理员
      description: ROLE_DES[ROLES.opertateMaintenance],
    },
    {
      elementCode: ROLES.projectManager, // 项目经理
      description: ROLE_DES[ROLES.projectManager],
    },
    {
      elementCode: ROLES.securityExperts, // 安全专家
      description: ROLE_DES[ROLES.securityExperts],
    },
    {
      elementCode: ROLES.monitorAnlysis, // 监测分析员
      description: ROLE_DES[ROLES.monitorAnlysis],
    },
    {
      elementCode: ROLES.unitSO, // 单位安全管理员
      description: ROLE_DES[ROLES.unitSO],
    },
    {
      elementCode: ROLES.groupLeaders, // 单位领导
      description: ROLE_DES[ROLES.groupLeaders],
    },

  ],
  [MODULE.reportManage]: [
    {
      elementCode: ROLES.superAdmin,
      description: ROLE_DES[ROLES.superAdmin],
    },
    {
      elementCode: ROLES.groupLeaders, // 单位领导
      description: ROLE_DES[ROLES.groupLeaders],
    },
    {
      elementCode: ROLES.communicationLLY, // 通报联络员
      description: ROLE_DES[ROLES.communicationLLY],
    },
  ],
  [MODULE.threatNotification]: [
    {
      elementCode: ROLES.securityExperts, // 安全专家
      description: ROLE_DES[ROLES.securityExperts],
    },
    {
      elementCode: ROLES.monitorAnlysis, // 监测分析员
      description: ROLE_DES[ROLES.monitorAnlysis],
    },
    {
      elementCode: ROLES.projectManager, // 项目经理
      description: ROLE_DES[ROLES.projectManager],
    },
    {
      elementCode: ROLES.communicationLLY, // 通报联络员
      description: ROLE_DES[ROLES.communicationLLY],
    },
    {
      elementCode: ROLES.opertateMaintenance, // 运维管理员
      description: ROLE_DES[ROLES.opertateMaintenance],
    },
  ],
  [MODULE.operationFrontier]: [
    {
      elementCode: ROLES.opertateMaintenance, // 运维管理员
      description: ROLE_DES[ROLES.opertateMaintenance],
    },
    {
      elementCode: ROLES.projectManager, // 项目经理
      description: ROLE_DES[ROLES.projectManager],
    },
  ],
  [MODULE.operationManagement]: [
    {
      elementCode: ROLES.opertateMaintenance, // 运维管理员
      description: ROLE_DES[ROLES.opertateMaintenance],
    },
    {
      elementCode: ROLES.projectManager, // 项目经理
      description: ROLE_DES[ROLES.projectManager],
    },
  ],
  [MODULE.organizational]: [
    {
      elementCode: ROLES.assetManager, // 资产管理员
      description: ROLE_DES[ROLES.assetManager],
    },
  ],
  [MODULE.assetsInfo]: [
    {
      elementCode: ROLES.assetManager, // 资产管理员
      description: ROLE_DES[ROLES.assetManager],
    },
    {
      elementCode: ROLES.systemAdmin, // 系统管理员
      description: ROLE_DES[ROLES.systemAdmin],
    },
  ],
}

let elements: any
let element: any
for (elements in AUTH) {
  elements = AUTH[elements as MODULE | SPA]
  for (element of elements) {
    element.id || (element.id = element.elementCode)
  }
}
export default AUTH
