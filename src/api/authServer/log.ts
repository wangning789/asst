/** 日志管理 */
import { get, post } from '@/utils/ajax'

export const enum API {
  /** 日志详情查询 /logId */
  detail = 'auth-server/log/getLog',
  /** 日志分页查询 */
  page = 'auth-server/log/listLogPage',

  /** 对象操作日志分页查询 */
   logPage = 'auth-server/ /log/operateLogPage',

}

export interface Log {
  /** 接口名称 */
  apiName?: string

  /** 开始时间 example: 1970-1-1 00:00:00 */
  beginTime?: string

  /** 控制层 */
  controller?: string

  /** */
  createDate?: string
  /** 创建者 example: uuid */
  createUser?: string

  /** 删除标识 */
  delStatus?: boolean

  /** */
  deleteDate?: string
  /** 结束时间 example: 1970-1-1 00:00:00 */
  endTime?: string

  /** 异常描述 */
  exception?: string

  /** 主键ID example: uuid */
  id?: string

  /** */
  ids?: string[]
  /** IP */
  ip?: string

  /** 关键字查询 example: 关键词 */
  keyword?: string

  /** 方法 */
  method?: string

  /** */
  modifyDate?: string
  /** 最后修改者 example: uuid */
  modifyUser?: string

  /** 名称 */
  name?: string

  /** 排序字段 example: field */
  orderField?: string

  /** 排序字段类型 example: desc */
  orderFieldType?: string

  /** 页码 example: 1 */
  page?: number

  /** 页面条数 example: 10 */
  pageSize?: number

  /** 参数 */
  params?: string

  /** 路径 */
  path?: string

  /** 状态 */
  status?: boolean
}

/** 日志详情查询 */
function detail(
  logId: string,
  noCache?: boolean
): Promise<{ data: { body: Log } }> {
  return get(`${API.detail}/${logId}`, { noCache })
}

/** 日志分页查询 */
function page(log: Log, noCache?: boolean): Promise<{ data: { body: Log[] } }> {
  return post(API.page, log, null, { noCache: !!noCache })
}

/** 日志分页查询 */
function logPage(log: Log, noCache?: boolean): Promise<{ data: { body: Log[] } }> {
  return post(API.logPage, log, null, { noCache: !!noCache })
}

export { detail, page, logPage }
