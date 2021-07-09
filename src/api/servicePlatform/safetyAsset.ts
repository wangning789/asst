/** 系统资产 */
import { post, get } from '@/utils/ajax'

export const enum API {
 /** 安全资产详情-防篡改 post */
  appInfo = 'service-platform/securityAsset/getAppprotectInfo',
  /** 安全资产详情-防火墙策略信息  GET */
  ruleInfo = 'service-platform/securityAsset/getFirewallRuleInfo',
  /** 安全资产详情-防火墙业务信息 GET  */
  workInfo = 'service-platform/securityAsset/getFirewallWorkInfo',
  /** 安全资产详情-主机杀毒  GET */
  antivirusInfo = 'service-platform/securityAsset/getHostAntivirusInfo',
  /** 安全资产详情-漏洞扫描  GET */
  scanInfo = 'service-platform/securityAsset/getVulScanInfo',
  /** 安全资产详情-防篡改 get */
  tamperInfo = 'service-platform/securityAsset/getWebTamperInfo',
  /** 用户查看自己的安全资产列表 post */
  customerPage = 'service-platform/securityAsset/listSecurityAssetByCustomer',
  /** 运维查看所有安全资产列表 */
  maintainPage = 'service-platform/securityAsset/listSecurityAssetByMaintain',
  /** 修改到期时间 */
  updTime = 'service-platform/securityAsset/updBueTime',
  /** 安全资产详情基础信息 */
  baseInfo = 'service-platform/securityAsset/getSecurityAssetInfo',

}

/** 系统资产 */
export interface Notice {
  /** 是否在生效中,1-生效中，0-失效 */
  activeStatus?: string

  /** 开始时间 */
  beginTime?: string

  /** 创建日期 */
  createDate?: {}

  /** 创建者 */
  createUser?: string

  /**   删除标识 */
  delStatus?: boolean

  /** 删除日期 */
  deleteDate?: {}

  /** 即将到期,1-是，0-否 */
  dueStatus?: string

  /** 到期时间 yyyy-MM-dd HH:mm:ss */
  dueTime?: string

  /** 结束时间 */
  endTime?: string

  /** 主键ID */
  id?: string

  /** 主键IDS  */
  ids?: []

  /** 关键字查询 */
  keyword?: string

  /** 最后修改时间 */
  modifyDate?: {}

  /** 最后修改者 */
  modifyUser?: string

  /** 购买时间 yyyy-MM-dd HH:mm:ss */
  orderBeginTime?: string

  /** 排序字段 */
  orderField?: string

  /** 排序字段类型 */
  orderFieldType?: string

  /** 订单ID */
  orderId?: string

  /** 订单编号 */
  orderNo?: string

  /** 页码 */
  page?: number

  /** 页面条数 */
  pageSize?: number

  /** 安全产品资产编号 */
  productAssetNo?: string

  /** 产品类型 */
  productsTypeCode?: string

  /** 防护配置信息 */
  protectionConfigInfo?: string

  /** 描述 */
  remark?: string

  /** 安全资产名称 */
  securityAssetName?: string

  /** 安全资产编号 */
  securityAssetNo?: string

  productsTypeName?: string

  /** 用户ID */
  userId?: string
}

/** 安全资产详情-waf
 * @param noCacheid
 */
function appInfo(id: string) {
  return get(API.appInfo, { id })
}

/** 安全资产详情-防火墙业务信息
 * @param noCache
 */
function ruleInfo(id: string) {
  return get(API.ruleInfo, { id })
}

/** 安全资产详情-防火墙业务信息
 * @param noCache
 */
function workInfo(id: string) {
  return get(API.workInfo, { id })
}

/** 安全资产详情-主机杀毒
 * @param noCache
 */
function antivirusInfo(id: string) {
  return get(API.antivirusInfo, { id })
}

/** 安全资产详情-漏洞扫描
 * @param noCache
 */
function scanInfo(id: string) {
  return get(API.scanInfo, { id })
}

/** 安全资产详情-防篡改
 * @param noCache
 */

function tamperInfo(id: string) {
  return get(API.tamperInfo, { id })
}

/** 用户查看自己的安全资产列表
 * @param noCache
 */
function customerPage(params: Notice) {
  return post(API.customerPage, params)
}

/** 运维查看所有安全资产列表
 * @param noCache
 */
function maintainPage(params: Notice) {
  return post(API.maintainPage, params)
}

/** 修改到期时间
 * @param noCache
 */
function updTime(id: string, dueTime: string) {
  return post(API.updTime, { id, dueTime })
}

/** 基础详情
 * @param noCache
 */
function baseInfo(id: string) {
  return get(API.baseInfo, { id })
}

export {
  updTime,
  maintainPage,
  customerPage,
  tamperInfo,
  scanInfo,
  antivirusInfo,
  workInfo,
  ruleInfo,
  appInfo,
  baseInfo,
}
