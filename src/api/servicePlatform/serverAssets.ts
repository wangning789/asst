/** 服务器资产 */
import { post } from '@/utils/ajax'

export const enum API {
  /** 用户====预留接口，用户自己的详细详情 */
  ciUsersC = 'service-platform/serverAssets/getAssetByUserSelf',
  /** 用户====预留接口，用户自己添加资产，添加后status状态直接为1 */
  addC = 'service-platform/serverAssets/addAssetByUser',
  /**   用户====预留接口，用户自己删除资产 */
  deleC = 'service-platform/serverAssets/delAssetByUser',
  /**   用户====预留接口，用户自己修改资产，但是status状态直接为1 */
  updateC = 'service-platform/serverAssets/updateAssetByUser',
  /** 添加资产 */
  add = 'service-platform/serverAssets/addAsset',
  /** 删除资产 */
  dele = 'service-platform/serverAssets/deleteAsset',
  /** 查询资产详情 */
  info = 'service-platform/serverAssets/getAssetDetail',
  /** 通过用户ID和资产ID查询资产详情基础信息 */
  detail = 'service-platform/applicationAssets/getAssetDetailByUserId',
  /** 分页查询已确认资产列表 */
  page = 'service-platform/serverAssets/getAssetListByPage',
  /** 分页查询未确认资产列表 */
  unPage = 'service-platform/serverAssets/getAssetListByPageForConfirm',
  /** 通过用户ID查询资产列表 */
  list = 'service-platform/serverAssets/getAssetListByUser',
  /** 修改资产 */
  upDate = 'service-platform/serverAssets/updateAsset',
  /** 资产类型 */
  ciTypes = 'service-platform/serverAssets/getAssetType  ',
  /** 资产所属用户 */
  ciUsers = 'service-platform/serverAssets/getUserList',
  /** 通过用户ID查询资产告警 */
  warning = 'service-platform/serverAssets/getAssetAlarmByUser',
  /** 通过用户ID和资产ID查询资产详情安全告警 */
  warningByCiid = 'service-platform/serverAssets/getAssetAlarmDetailByUser',
  /** 通过用户ID和资产ID查询资产详情基础信息 */
  baseByCiid = 'service-platform/serverAssets/getAssetBasicDetailByUserId',
  /** 通过用户ID和资产ID查询资产详情指纹信息 */
  fingerId = 'service-platform/serverAssets/getAssetFingerDetailByUser',
  /** 通过询资产漏洞 */
  leak = 'service-platform/serverAssets/getAssetLeakByUser',
  /** 通过用户ID和资产ID查询资产详情漏洞信息 */
  leakByCiid = 'service-platform/serverAssets/getAssetLeakDetailByUser',
  /** 为应用管理添加处查询资产列表 */
  forAppList = 'service-platform/serverAssets/getAssetListForApply',
  /** 通过用户ID查询资产统计 */
  stat = 'service-platform/serverAssets/getAssetStatisticsByUser',
  /** 用户可以对资产状态进行更改，待确认的资产可以改为已确认，已确认的可以改为待确认 */
  status = 'service-platform/serverAssets/updateAssetStatusByUser',
  /** 用户====通过用户ID和资产ID查询漏洞数据信息，包括总数和具体的数据 */
  leakNum = 'service-platform/serverAssets/getAssetLeakDataDetailByUser',
  /** 用户====通过用户ID和资产ID查询资产详情安全告警数据信息，包括总数和具体的数据 */
  alarmNum = 'service-platform/serverAssets/getAssetAlarmDataDetailByUser',
  /** 用户获取服务器资产统计 */
  userCount = 'service-platform/serverAssets/getCountByUser',
  /** 运维获取服务器资产统计 */
  optCount = 'service-platform/serverAssets/getCount',
}

/** 服务器资产 */
export interface Notice {
  /** 基线对应的UUID */
  agentUuid?: string

  /** 告警数 */
  alarmNum?: string

  // /** 区域/vpc */
  // networkArea?: string

  /** 开始时间 */
  beginTime?: string

  /** 业务影响 */
  businessImpact?: string

  /** 资产编号 */
  ciCode?: string

  /** CPU */
  ciCpu?: string

  /** 硬盘 */
  ciHardDisk?: string

  /** 资产id */
  ciId?: number

  /** 内存 */
  ciMemory?: string

  /** 资产名称 */
  ciName?: string

  /** 资产类型 */
  ciType?: string

  /** 所属云平台 */
  cloudPlatform?: string

  /**    创建时间 */
  createDate?: {}

  /** 创建者 */
  createUser?: string

  /**    删除标识 */
  delStatus?: string

  /**   状态 */
  status?: boolean

  /**    删除时间 */
  deleteDate?: {}

  /** 磁盘空间 */
  diskSpace?: string

  /** 结束时间 */
  endTime?: string

  /** 主键ID */
  id?: string

  /**    主键IDS */
  ids?: []
  /** IP地址 */
  ipAddress?: string

  /** 关键字查询 */
  keyword?: string

  /** 漏洞数 */
  leakNum?: string

  /** 位置 */
  location?: string

  /** MAC地址 */
  macAddress?: string

  /**    最后修改日期 */
  modifyDate?: {}

  /** 最后修改者 */
  modifyUser?: string

  /** 所属网络区域 */
  networkArea?: string

  /** 排序字段 */
  orderField?: string

  /** 排序字段类型 */
  orderFieldType?: string

  /** 操作系统 */
  os?: string

  /** 当前页 */
  page?: number

  /** 页面条数 */
  pageSize?: number

  /** 处理器个数 */
  processorCount?: string

  /** 处理器名称 */
  processorName?: string

  /** 处理器速度 */
  processorSpeed?: string

  /** 业务名称 */
  serviceName?: string

  /** 总内存 */
  totalMemory?: number

  /** 用户Id */
  ownUserId?: string

  /** 所属用户名称 */
  userName?: string

  /** 内核版本 */
  version?: string

}

/** 用户自己name
 * @param noCache
 */
function ciUserF() {
  return post(API.ciUsersC)
}
/** 用户自己修改
 * @param noCache
 */
function updataFC(params: Notice) {
  return post(API.updateC, params)
}
/** 用户自己删除
 * @param noCache
 */
function deleFC(id: string) {
  return post(API.deleC, { id })
}
/** 用户自己添加
 * @param noCache
 */
function addFC(params: Notice) {
  return post(API.addC, params)
}

/** 通过ciid 查告警 列表
 * @param noCache
 */
function warningByCiid(params: Notice) {
  return post(API.warningByCiid, params)
}
/** 添加资产
 * @param noCache
 */
function addF(params: Notice) {
  return post(API.add, params)
}

/** 删除资产
 * @param noCache
 */
function deleF(id: string) {
  return post(API.dele, { id })
}

/** 资产详情
 * @param noCache
 */
function infoF(id: string) {
  return post(API.info, { id })
}

/** 通过用户ID和资产ID查询资产详情基础信息
 * @param noCache
 */
function detailF(id: string) {
  return post(API.detail, { id })
}

/** 分页已确认查询资产
 * @param noCache
 */
function pageF(params: Notice) {
  return post(API.page, params)
}
/** 分页待确认查询资产
 * @param noCache
 */
function unPageF(params: Notice) {
  return post(API.unPage, params)
}
/** 通过用户ID查询资产列表
 * @param noCache
 */
function listF(params: Notice) {
  return post(API.list, params)
}
/** 修改资产
 * @param noCache
 */
function upDateF(params: Notice) {
  return post(API.upDate, params)
}
/** 获取资产类型
 * @param noCache
 */
function ciTypeF() {
  return post(API.ciTypes)
}
/** 资产所属用户
 * @param noCache
 */
function ciUsers() {
  return post(API.ciUsers)
}
/**   通过用户ID查询资产告警
 * @param noCache
 */
function warning() {
  return post(API.warning)
}
/**   通过用户ID和资产ID查询资产详情基础信息
 * @param noCache
 */
function baseByCiid(id: string) {
  return post(API.baseByCiid, { id })
}
/**   通过用户ID和资产ID查询资产详情指纹信息
 * @param noCache
 */
function fingerId(params: Notice) {
  return post(API.fingerId, params)
}
/**   通过用户ID查询资产漏洞
 * @param noCache
 */
function leak() {
  return post(API.leak)
}
/**   通过用户ID和资产ID查询资产详情漏洞信息
 * @param noCache
 */
function leakByCiid(params: Notice) {
  return post(API.leakByCiid, params)
}
/**   为应用管理添加处查询资产列表
 * @param noCache
 */
function forAppList(
  Notice: Notice
) {
  return post(API.forAppList, Notice)
}
/**   通过用户ID查询资产统计
 * @param noCache
 */
function stat() {
  return post(API.stat)
}

/**   用户可以对资产状态进行更改，待确认的资产可以改为已确认，已确认的可以改为待确认
 * @param noCache
 */
function statusF(params: Notice) {
  return post(API.status, params)
}

function leakNum(id: string) {
  return post(API.leakNum, { id })
}

function alarmNum(id: string) {
  return post(API.alarmNum, { id })
}
/** 获取用户资产统计
 */
function userCount() {
  return post(API.userCount)
}
/** 获取运维资产统计
 */
function optCount() {
  return post(API.optCount)
}

export {
  ciUserF,
  addFC,
  deleFC,
  updataFC,
  addF,
  deleF,
  infoF,
  detailF,
  pageF,
  unPageF,
  listF,
  upDateF,
  ciTypeF,
  ciUsers,
  warning,
  stat,
  forAppList,
  leakByCiid,
  leak,
  fingerId,
  baseByCiid,
  statusF,
  warningByCiid,
  leakNum,
  alarmNum,
  userCount,
  optCount,
}
