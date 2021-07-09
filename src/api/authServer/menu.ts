/** 菜单管理 */
import { get, post } from '@/utils/ajax'

import { Api } from './api'
import { Element } from './element'

export const enum API {
  /** 新增菜单 */
  add = 'auth-server/menu/add',
  /** 查询全量菜单树 */
  allTree = 'auth-server/menu/allTree',
  /** 删除菜单 (post) */
  delete = 'auth-server/menu/delete',
  /** 查询一个部门的menuTree */
  departmentMenuTree = 'auth-server/menu/departmentMenuTree',
  /** 查询一个菜单的详细信息 */
  info = 'auth-server/menu/info',
  /** 查询一个角色的菜单tree */
  roleMenuTree = 'auth-server/menu/roleMenuTree',
  /** 编辑菜单 (post) */
  update = 'auth-server/menu/update',
  /** 查询当前用户的menuTree */
  userMenuTree = 'auth-server/menu/userMenuTree',
  /** 查询系统列表 运维系统/资产系统 */
  systemList = 'auth-server/authSystem/authSystemListByAdmin',
}

export interface Menu {
  /** */
  apiList?: Api[]
  /** 子页面信息 example: OrderedMap { "JSON": null } */
  childInfo?: string

  /** */
  children?: Menu[]
  /** 创建日期 example: 1970-1-1 00:00:00 */
  createDate?: number

  /** 创建者 example: uuid */
  createUser?: string

  /** 模块说明 example: 系统管理模块 */
  description?: string

  /** */
  elementList?: Element[]
  /** 是否可用 */
  enabled?: number

  /** 所属系统编码 */
  systemCode?: string

  /** 图标名称 */
  icon?: string

  /** 主键ID example: uuid */
  id?: string

  /** */
  ids?: string[]
  /** 关键字查询 example: 关键词 */
  keyword?: string

  /** 级别 */
  level?: number

  /** 菜单编码 */
  menuCode?: string

  /** 菜单类型 1-目录 2-页面 3-外链 example: 1 */
  menuType?: number

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

  /** 模块上级 */
  parentId?: string

  /** 访问路径 */
  path?: string

  /** 是否根部节点 0否 1是 example: 1 */
  rootNode?: number

  /** 排序号 */
  sortNo?: number

  /** 模块名称 */
  title?: string
}

/** 新增菜单
 * @param menu
 */
function add(menu: Menu) {
  return post(API.add, menu)
}

/** 查询全量菜单树
 * @param noCache
 */
function allTree(noCache?: boolean): Promise<{ data: { body: Menu } }> {
  return get(API.allTree, undefined, { noCache })
}

/** 删除菜单
 * @param menu
 */
function del(menu: Menu) {
  return post(API.delete, menu)
}

/** 查询一个部门的menuTree
 * @param departmentId
 * @param noCache
 */
function depMenuTree(
  departmentId: string,
  noCache?: boolean
): Promise<{ data: { body: Menu } }> {
  return get(API.departmentMenuTree, { departmentId }, { noCache })
}

/** 查询一个菜单的详细信息
 * @param menuId
 * @param noCache
 */
function info(
  menuId: string,
  noCache?: boolean
): Promise<{ data: { body: Menu } }> {
  return get(API.info, { menuId }, { noCache })
}

/** 查询一个角色的菜单tree
 * @param roleId
 * @param noCache
 */
function roleMenuTree(
  roleId: string,
  noCache?: boolean
): Promise<{ data: { body: Menu } }> {
  return get(API.roleMenuTree, { roleId }, { noCache })
}

/** 编辑菜单
 * @param menu
 */
function update(menu: Menu) {
  return post(API.update, menu)
}

/** 查询当前用户的menuTree */
function userMenuTree(noCache?: boolean): Promise<{ data: { body: Menu } }> {
  return get(API.userMenuTree, undefined, { noCache })
}

/** 查询已有系统**/
function systemList() {
  return get(API.systemList)
}

export {
  add,
  allTree,
  del,
  depMenuTree,
  info,
  roleMenuTree,
  update,
  userMenuTree,
  systemList,
}
