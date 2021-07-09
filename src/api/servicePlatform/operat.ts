import { get, post } from '@/utils/ajax'

// terminal 路径
/** 公告相关接口 */
export const enum API {
  /** 终端列表接口 */
  terminalList = 'service-platform/terminal/list',

  /** 关联用户 */
  terminalUesr = 'service-platform/terminal/user',

  // 操作系统占比统计

  systemCount = 'service-platform/terminal/systemCount',

   // 终端详情

  terminalDetail = 'service-platform/terminal/terminal',

  // 终端统计

  terminalCount = 'service-platform/terminal/count',

   // 软件安装列表

  softwareList = 'service-platform/terminal/softwareList',

  // 确认关联用户

  relationUser = 'service-platform/terminal/relationUser',

  // 漏洞补丁列表

  vulnList = 'service-platform/terminal/vulnList',

  // 漏洞任务列表——仅运维侧
    // 漏洞统计
  vulnTaskCount= 'service-platform/vulnTask/count',
    // 漏洞任务管理列表
    vulnTaskList= 'service-platform/vulnTask/list',
    // 扫描目标列表
    scanningList= 'service-platform/vulnTask/scanningList',
    // 漏洞任务详情
    vulnTask= 'service-platform/vulnTask/vulnTask',

// 用户关联的资产

   uesrAsset = 'service-platform/terminal/uesrAsset',

   // 漏洞用户关联的资产

   vulnTaskRelationUser = 'service-platform/vulnTask/relationUser',

}
/** 漏洞用户关联的资产
 */
function vulnTaskRelationUser(parms: any) {
  return get(API.vulnTaskRelationUser, parms)
}

/** 用户关联的资产 */
function uesrAsset(parms: any) {
  return get(API.uesrAsset, parms)
}

/** 终端列表分页 */
function terminalList(parms: any) {
  return post(API.terminalList, parms)
}

/** 关联用户 */
function terminalUesr(parms: any) {
  return get(API.terminalUesr, parms)
}

/** 操作系统占比统计 */
function systemCount(parms: any) {
  return get(API.systemCount, parms)
}

/** 终端详情 */
function terminalDetail(parms: any) {
  return get(API.terminalDetail, parms)
}

/** 终端统计 */
function terminalCount(parms: any) {
  return get(API.terminalCount, parms)
}

/** 操作系统占比统计 */
function softwareList(parms: any) {
  return post(API.softwareList, parms)
}

/** 确认关联用户 */
function relationUser(parms: any) {
  return get(API.relationUser, parms)
}

/** 漏洞补丁列表 */
function vulnList(parms: any) {
  return post(API.vulnList, parms)
}

// 漏洞统计
function vulnTaskCount(parms: any) {
  return get(API.vulnTaskCount, parms)
}

// 漏洞任务管理列表
function vulnTaskList(parms: any) {
  return post(API.vulnTaskList, parms)
}

// 扫描目标列表
function scanningList(parms: any) {
  return post(API.scanningList, parms)
}
// 漏洞任务详情
function vulnTask(parms: any) {
  return get(API.vulnTask, parms)
}

export {
  vulnTaskRelationUser,
  terminalList,
  terminalUesr,
  systemCount,
  terminalDetail,
  softwareList,
  terminalCount,
  relationUser,
  vulnList,
  vulnTaskCount,
  vulnTaskList,
  scanningList,
  vulnTask,
  uesrAsset,

}
