/** api 管理 */
import { post } from '@/utils/ajax'

export const enum API {
  /** 批量将API绑定在某菜单上 */
  bind = 'auth-server/api/bindApiToMenu',
  /** 查询一个菜单下的API列表以及授权情况 */
  page = 'auth-server/api/getPageList',
  /** 查询一个菜单下的未绑定的API列表分页 */
  available = 'auth-server/api/getUnbindApiByMenuId',
  /** 将一个API从一个菜单上解绑 */
  unbind = 'auth-server/api/unbindApiFromMenu',
  /** 更新一个菜单下的API列表的授权情况 */
  update = 'auth-server/api/updateApiRoleAuth',
}

export interface Api {
  /** 接口名称 example: getdiskIOChartDataUsingGET */
  apiName?: string

  /** 是否授权 1-有授权 0-无授权 example: 1 */
  auth?: number

  /** 接口所属controller example: device-host-controller */
  controller?: string

  /** 创建日期 example: 1970-1-1 00:00:00 */
  createDate?: number

  /** 创建者 example: uuid */
  createUser?: string

  /** 接口描述 example: 详情页-性能-cpu使用率 */
  description?: string

  /** 主键ID example: uuid */
  id?: string

  /** */
  ids?: string[]
  /** 关键字查询 example: 关键词 */
  keyword?: string

  /** 所属菜单ID */
  menuId?: string

  /** 接口方法 example: GET */
  method?: string

  /** 最后修改日期 example: 1970-1-1 00:00:00 */
  modifyDate?: number

  /** 最后修改者 example: uuid */
  modifyUser?: string

  /** 排序字段 example: field */
  orderField?: string

  /** 排序字段类型 example: desc */
  orderFieldType?: string

  /** 页码 example: 1 */
  page?: number

  /** 页面条数 example: 10 */
  pageSize?: number

  /** 接口访问路径 example: /deviceHost/detail/performance/cpuRate */
  path?: string

  /** 授权角色ID */
  roleId?: string

  /** 所属服务名称 example: auth */
  service?: string
}

/** 批量将API绑定在某菜单上 */
function bind(apiList: Api[]) {
  return post(API.bind, apiList)
}

/** 查询一个菜单下的API列表以及授权情况 */
function page(api: Api, noCache?: boolean) {
  return post(API.page, api, null, { noCache: !!noCache })
}

/** 查询一个菜单下的未绑定的API列表分页 */
function available(api: Api, noCache?: boolean) {
  return post(API.available, api, null, { noCache: !!noCache })
}

/** 将一个API从一个菜单上解绑 */
function unbind(api: Api) {
  return post(API.unbind, api)
}

/** 更新一个菜单下的API列表的授权情况 */
function update(api: Api[]) {
  return post(API.update, api)
}

export { bind, page, available, unbind, update }
