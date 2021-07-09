/** 系统资产 */
import { post } from '@/utils/ajax'

export const enum API {
  /** 添加资产 */
  add = 'service-platform/applicationAssets/addAsset',
  /** 删除资产 */
  dele = 'service-platform/applicationAssets/deleteAsset',
  /** 用户====预留接口，用户自己添加资产，添加后status状态直接为1 */
  addC = 'service-platform/applicationAssets/addAssetByUser',
  /** 用户====预留接口，用户自己删除资产 */
  deleC = 'service-platform/applicationAssets/delAssetByUser',
  /** 用户自己修改资产 */
  updataC = 'service-platform/applicationAssets/updateAssetByUser',
  /** 查询资产详情 */
  info = 'service-platform/applicationAssets/getAssetDetail',
  /** 分页查询已确认资产列表 */
  page = 'service-platform/applicationAssets/getAssetListByPage',
  /** 分页查询待确认资产列表 */
  unPage = 'service-platform/applicationAssets/getAssetListByPageForConfirm',
  /** 通过用户ID查询资产列表 */
  list = 'service-platform/applicationAssets/getAssetListByUser',
  /** 修改资产 */
  upDate = 'service-platform/applicationAssets/updateAsset',
  /** 资产类型 */
  ciTypes = 'service-platform/serverAssets/getAssetType  ',
  /** 资产所属用户 */
  ciUsers = 'service-platform/serverAssets/getUserList',
  /** 用户可以对资产状态进行更改，待确认的资产可以改为已确认，已确认的可以改为待确认 */
  status = 'service-platform/applicationAssets/updateAssetStatusByUser',
  /** 用户获取系统资产统计 */
  userCount = 'service-platform/applicationAssets/getCountByUser',
  /** 运维获取系统资产统计 */
  optCount = 'service-platform/applicationAssets/getCount',
}

/** 系统资产 */
export interface Notice {
  /**    区域 */
  networkArea?: string
  /** 服务器数量 */
  assetNum?: string

  /** 开始时间 */
  beginTime?: string

  /** 相关服务器资产  */
  assetList?: []
  /**    资产编号 */
  ciCode?: string
  /** 资产id */
  ciId?: number

  /**  资产名称 */
  ciName?: string

  /** 资产类型 */
  ciType?: string

  /**   状态 */
  status?: string

  /** 所属云平台 */
  cloudPlatform?: string

  /** 创建日期 */
  createDate?: {}

  /**    创建者 */
  createUser?: string

  /**    删除标识 */
  delStatus?: boolean

  /**    删除时间 */
  deleteDate?: {}

  /**    描述 */
  describe?: string
  /**    域名 */
  domainName?: string

  /**    结束时间 */
  endTime?: string

  /**    主键ID */
  id?: string

  /**    主键IDS */
  ids?: []

  /**    关键词  关键字查询 */
  keyword?: string

  /**    字后删除日期 */
  modifyDate?: {}
  /**    最后修改者 */
  modifyUser?: string

  /**    排序字段 */
  orderField?: string

  /**    排序字段类型 */
  orderFieldType?: string

  /** 页码 */
  page?: number

  /** 页面条数 */
  pageSize?: number

  /**    所属用户 */
  ownUserId?: string

}

/** 添加资产
 * @param noCache
 */
function addS(params: Notice) {
  return post(API.add, params)
}
/** 用户添加资产
 * @param noCache
 */
function addSC(params: Notice) {
  return post(API.addC, params)
}

/** 删除资产C
 * @param noCache
 */
function deleS(id: string) {
  return post(API.dele, { id })
}

/** 用户自己删除资产
 * @param noCache
 */
function deleSC(id: string) {
  return post(API.deleC, { id })
}

/** 资产详情
 * @param noCache
 */
function infoS(id: string) {
  return post(API.info, { id })
}

/** 分页查询资产已经
 * @param noCache
 */
function pageS(params: Notice) {
  return post(API.page, params)
}
/** 分页查询待确认资产列表
 * @param noCache
 */
function unPageS(params: Notice) {
  return post(API.unPage, params)
}
/** 通过用户ID查询资产列表
 * @param noCache
 */
function listS(params: Notice) {
  return post(API.list, params)
}
/** 修改资产
 * @param noCache
 */
function upDateS(params: Notice) {
  return post(API.upDate, params)
}
/** 用户修改资产
 * @param noCache
 */
function upDateSC(params: Notice) {
  return post(API.updataC, params)
}
/** 获取资产类型
 * @param noCache
 */
function ciTypeS() {
  return post(API.ciTypes)
}

/** 获取资产所属用户
 * @param noCache
 */
function ciUserS() {
  return post(API.ciUsers)
}

/** 获取资产所属用户
 * @param noCache
 */
function statusS(params: Notice) {
  return post(API.status, params)
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
  deleSC,
  upDateSC,
  addSC,
  addS,
  deleS,
  infoS,
  pageS,
  unPageS,
  listS,
  upDateS,
  ciTypeS,
  ciUserS,
  statusS,
  userCount,
  optCount,
}
