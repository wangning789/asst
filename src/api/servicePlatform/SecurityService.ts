import { get, post } from '@/utils/ajax'

// terminal 路径
/** 公告相关接口 */
export const enum API {
  /** 应用层防火墙服务/网页防篡改服务 -- 告警数量 */
  alarmLogCount = 'service-platform/securityService/alarmLogCount',

  /** 告警日志信息分页 */
  alarmLogPage = 'service-platform/securityService/alarmLogPage',

  // 网页防篡改服务 -- 告警趋势

  alarmTrend = 'service-platform/securityService/alarmTrend',

   // 漏洞扫描详情分页列表

  alreadyAssetDetailsPage = 'service-platform/securityService/alreadyAssetDetailsPage',

  // 已扫描资产清单详情

  alreadyAssetInfo = 'service-platform/securityService/alreadyAssetInfo',

   // 已扫描资产清单

   alreadyAssetList = 'service-platform/securityService/alreadyAssetList',

  // 防病毒告警日志

  antiVirusAlarmLog = 'service-platform/securityService/antiVirusAlarmLog',

  // 应用层防火墙服务 -- 攻击源地区分布

  regionDistribution = 'service-platform/securityService/attackSourceRegionDistribution',

  // 应用层防火墙服务 -- 攻击类型分布
  typeDistribution= 'service-platform/securityService/attackTypeDistribution',
    // 虚拟防火墙服务详情
    firewallInfo= 'service-platform/securityService/firewallInfo',
    // 防火墙策略
    firewallPolicy= 'service-platform/securityService/firewallPolicy',
    // 首页 -- 资产总数
    getAssetsTotal= 'service-platform/securityService/getAssetsTotal',

    // 首页 -- 当前安全漏洞总数
    loophole= 'service-platform/securityService/getCurrentSecurityLoophole',

    // 首页 -- 最新安全告警
    securityAlarm= 'service-platform/securityService/getNewSecurityAlarm',

  // 首页 -- 代办事项
  toDoList= 'service-platform/securityService/getToDoList',
// 首页 -- 未处理安全告警
untreatedSecurityAlarm= 'service-platform/securityService/getUntreatedSecurityAlarm',

// 安全服务详情 --- 运维记录
maintenanceRecords= 'service-platform/securityService/maintenanceRecords',

// 应用层防火墙服务 -- 发起攻击次数最多的IP
mostAttackIp= 'service-platform/securityService/mostAttackIp',

// 应用层防火墙服务 -- 被攻击最多的资产
mostAttacksAssets= 'service-platform/securityService/mostAttacksAssets',

// 漏洞风险最高的资产TOP5
riskAssetsTop= 'service-platform/securityService/riskAssetsTop5',

// 安全服务信息
securityServiceInfo= 'service-platform/securityService/securityServiceInfo',

// 主机防病毒服务 -- 防护终端列表
protectionTerminalListPage= 'service-platform/securityService/protectionTerminalListPage',

// 主机防病毒服务 -- 终端详情
terminalInfo= 'service-platform/securityService/terminalInfo',

// 入侵防护告警日志
protectionAlarmLog= 'service-platform/securityService/protectionAlarmLog',

// 应用下拉菜单
getApplicationCheck= 'service-platform/securityService/getApplicationCheck',

// 软件安装列表
softwareList= 'service-platform/terminal/softwareList',

// 漏洞补丁列表
vulnList= 'service-platform/terminal/vulnList',

// 软件安装列表
getSoftwareInstall= 'service-platform/securityService/getSoftwareInstall',

// 补丁安装列表
getPatchInstallation= 'service-platform/securityService/getPatchInstallation',

// 首页 -- 我的订单
getMyOrderCount= 'service-platform/securityService/getMyOrderCount',

// 首页 -- 代办事项
getToDoList= 'service-platform/securityService/getToDoList',

// 首页 -- 公告
customerNoticeList= 'service-platform/notice/customerNoticeList',

// 首页 -- 安全服务列表
securityServiceIndex= 'service-platform/securityService/securityServiceIndex',

// 获取应用下的资产
getAssetsList= 'service-platform/securityService/getAssetsList',

// 客户新增服务运维工单实例
serviceOperateFlow= 'service-platform/workOrder/customer/add/serviceOperateFlow',

// 安全服务类型列表
purchasedList= 'service-platform/securityService/purchasedList',

// 漏洞详情
vulnerabilityDetails= 'service-platform/securityService/vulnerabilityDetails',

// 获取用户不同服务类型的资产数
getUserOrderAssetByCode= 'service-platform/securityService/getUserOrderAssetByCode',
}

//   获取用户不同服务类型的资产数
function getUserOrderAssetByCode(parms: any) {
  return get(API.getUserOrderAssetByCode + '?productTypeCode=' + parms)
}

//   漏洞详情
function vulnerabilityDetails(parms: any) {
  return get(API.vulnerabilityDetails + '?vulnerabilityId=' + parms)
}

//   安全服务类型列表
function purchasedList(parms: any) {
  return post(API.purchasedList, parms)
}
//   客户新增服务运维工单实例
function serviceOperateFlow(parms: any) {
  return post(API.serviceOperateFlow + '?productTypeCode=' + parms)
}

//   获取应用下的资产
function getAssetsList(parms: any) {
  return get(API.getAssetsList, parms)
}

//   首页 -- 安全服务列表
function securityServiceIndex(parms: any) {
  return get(API.securityServiceIndex, parms)
}

//   首页 -- 代办事项
function customerNoticeList(parms: any) {
  return post(API.customerNoticeList, parms)
}

//   首页 -- 代办事项
function getToDoList(parms: any) {
  return get(API.getToDoList, parms)
}
//   首页 -- 我的订单
function getMyOrderCount(parms: any) {
  return get(API.getMyOrderCount, parms)
}

//  软件安装列表
function getSoftwareInstall(parms: any) {
  return post(API.getSoftwareInstall, parms)
}
//  补丁安装列表
function getPatchInstallation(parms: any) {
  return post(API.getPatchInstallation, parms)
}

//  漏洞补丁列表
function vulnList(parms: any) {
  return post(API.vulnList, parms)
}

//  软件安装列表
function softwareList(parms: any) {
  return post(API.softwareList, parms)
}

//  应用下拉菜单
function getApplicationCheck(parms: any) {
  return get(API.getApplicationCheck, parms)
}

// 主机防病毒服务 -- 终端详情
function protectionAlarmLog(parms: any) {
  return post(API.protectionAlarmLog, parms)
}

// 主机防病毒服务 -- 终端详情
function terminalInfo(parms: any) {
  return get(API.terminalInfo + '?terminalId=' + parms)
}

/** 安全服务信息 */
function protectionTerminalListPage(parms: any) {
  return post(API.protectionTerminalListPage, parms)
}

/** 安全服务信息 */
function securityServiceInfo(parms: any) {
  return get(API.securityServiceInfo, parms)
}

/** 漏洞风险最高的资产TOP5 */
function riskAssetsTop(parms: any) {
  return get(API.riskAssetsTop, parms)
}

/** 应用层防火墙服务/网页防篡改服务 -- 告警数量 */
function alarmLogCount(parms: any) {
  return get(API.alarmLogCount, parms)
}

/** 告警日志信息分页 */
function alarmLogPage(parms: any) {
  return post(API.alarmLogPage, parms)
}

/** 网页防篡改服务 -- 告警趋势 */
function alarmTrend(parms: any) {
  return get(API.alarmTrend, parms)
}

/** 漏洞扫描详情分页列表 */
function alreadyAssetDetailsPage(parms: any) {
  return post(API.alreadyAssetDetailsPage, parms)
}

/** 已扫描资产清单详情 */
function alreadyAssetInfo(parms: any) {
  return get(API.alreadyAssetInfo, parms)
}
/** 已扫描资产清单 */
function alreadyAssetList(parms: any) {
  return post(API.alreadyAssetList, parms)
}

/** 防病毒告警日志 */
function antiVirusAlarmLog(parms: any) {
  return post(API.antiVirusAlarmLog, parms)
}

/** 应用层防火墙服务 -- 攻击类型分布 */
function regionDistribution(parms: any) {
  return get(API.regionDistribution, parms)
}

/** 应用层防火墙服务 -- 攻击类型分布 */
function typeDistribution(parms: any) {
  return get(API.typeDistribution, parms)
}

// 漏洞统计
function firewallInfo(parms: any) {
  return get(API.firewallInfo, parms)
}

// 防火墙策略
function firewallPolicy(parms: any) {
  return post(API.firewallPolicy, parms)
}

// 首页 -- 资产总数
function getAssetsTotal(parms: any) {
  return get(API.getAssetsTotal, parms)
}
// 首页 -- 当前安全漏洞总数
function loophole(parms: any) {
  return get(API.loophole, parms)
}

// 首页 -- 最新安全告警
function securityAlarm(parms: any) {
  return get(API.securityAlarm, parms)
}

// 首页 -- 代办事项
function toDoList(parms: any) {
  return get(API.toDoList, parms)
}

// 首页 -- 代办事项
function untreatedSecurityAlarm(parms: any) {
  return get(API.untreatedSecurityAlarm, parms)
}

// 安全服务详情 --- 运维记录
function maintenanceRecords(parms: any) {
  return get(API.maintenanceRecords, parms)
}

// 应用层防火墙服务 -- 发起攻击次数最多的IP
function mostAttackIp(parms: any) {
  return get(API.mostAttackIp, parms)
}

// 应用层防火墙服务 -- 被攻击最多的资产
function mostAttacksAssets(parms: any) {
  return get(API.mostAttacksAssets, parms)
}

export {
  getUserOrderAssetByCode,
  vulnerabilityDetails,
  purchasedList,
  serviceOperateFlow,
  getAssetsList,
  securityServiceIndex,
  customerNoticeList,
  getToDoList,
  getMyOrderCount,
  getSoftwareInstall,
  getPatchInstallation,
  vulnList,
  softwareList,
  getApplicationCheck,
  protectionAlarmLog,
  terminalInfo,
  protectionTerminalListPage,
  securityServiceInfo,
  riskAssetsTop,
  alarmLogCount,
  alarmLogPage,
  alarmTrend,
  alreadyAssetDetailsPage,
  alreadyAssetInfo,
  alreadyAssetList,
  antiVirusAlarmLog,
  regionDistribution,
  typeDistribution,
  firewallInfo,
  firewallPolicy,
  getAssetsTotal,
  loophole,
  securityAlarm,
  toDoList,
  untreatedSecurityAlarm,
  maintenanceRecords,
  mostAttackIp,
  mostAttacksAssets,
}
