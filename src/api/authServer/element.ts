/** 元素管理 */
import { post } from '@/utils/ajax'

export const enum API {
  /** 批量新增元素 */
  bind = 'auth-server/element/addList',
  /** 删除一个元素 */
  unbind = 'auth-server/element/delete',
  /** 查询一个菜单下的元素列表以及授权情况 */
  page = 'auth-server/element/getPageList',
  /** 更新一个菜单下的元素列表的授权情况 */
  update = 'auth-server/element/updateElementRoleAuth',
}

export interface Element {
  /** 是否授权 1-有授权 0-无授权 example: 1 */
  auth?: number

  /** 创建日期 example: 1970-1-1 00:00:00 */
  createDate?: number

  /** 创建者 example: uuid */
  createUser?: string

  /** 描述 */
  description?: string

  /** 元素编码 */
  elementCode?: string

  /** 元素类型 */
  elementType?: number

  /** 主键ID example: uuid */
  id?: string

  ids?: string[]
  /** 关键字查询 example: 关键词 */
  keyword?: string

  /** 所属菜单ID */
  menuId?: string

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

  /** 授权角色ID */
  roleId?: string
}

/** 批量新增元素 */
function bind(elementList: Element[]) {
  return post(API.bind, elementList)
}

/** 删除一个元素 */
function unbind(element: Element) {
  return post(API.unbind, element)
}

/** 查询一个菜单下的元素列表以及授权情况 */
function page(element: Element, noCache?: boolean) {
  return post(API.page, element, null, { noCache: !!noCache })
}

/** 更新一个菜单下的元素列表的授权情况 */
function update(elementList: Element[]) {
  return post(API.update, elementList)
}

export { bind, unbind, page, update }
