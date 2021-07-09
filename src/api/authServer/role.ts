/** 角色管理 */
import { post, get } from '@/utils/ajax'

export const enum API {
  /** 新增角色 */
  add = 'auth-server/role/add',
  /** 删除角色 */
  del = 'auth-server/role/delete',
  /** 停用角色 */
  disable = 'auth-server/role/disable',
  /** 启用角色 */
  enable = 'auth-server/role/enable',
  /** 通过部门ID查询一个部门下的所有角色 */
  listByDep = 'auth-server/role/getListByDepartmentId',
  /** 获取角色类型 */
  code = 'auth-server/role/getRoleCodeList',
  /** 超管查询角色列表 */
  tableSA = 'auth-server/role/getRoleTableDataForSuperAdmin',
  /** 系统管理员查询角色列表 */
  tableA = 'auth-server/role/getRoleTableDataForSystemAdmin',
  /** 查询一个角色的详情 */
  info = 'auth-server/role/info',
  /** 查询一个角色拥有的所有菜单ID */
  menuIds = 'auth-server/role/menuIdList',
  /** 编辑角色 */
  update = 'auth-server/role/update',
  /** 更新一个角色的菜单权限列表 */
  updateMenuIds = 'auth-server/role/updateMenuList',
}

export interface Role {
  /** 创建日期 example: 1970-1-1 00:00:00 */
  createDate?: number

  /** 创建者 example: uuid */
  createUser?: string

  /** 部门ID */
  departmentId?: string

  /** 部门名称 */
  departmentName?: string

  /** 是否可用，0：否，1：是 */
  enabled?: number

  /** 主键ID example: uuid */
  id?: string

  /** */
  ids?: string[]
  /** 是否系统内置角色 0：内置角色， 1：新增角色 */
  issys?: number

  /** 关键字查询 example: 关键词 */
  keyword?: string

  /** */
  menuIdList?: string[]
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

  /** 角色编码 */
  roleCode?: string

  /** 角色等级，1为超级管理员 */
  roleLevel?: number

  /** 角色名称 */
  roleName?: string
}

/** 新增角色 */
function add(role: Role) {
  return post(API.add, role)
}

/** 删除角色 */
function del(role: Role) {
  return post(API.del, role)
}

/** 停用角色 */
function disable(role: Role) {
  return post(API.disable, role)
}

/** 启用角色 */
function enable(role: Role) {
  return post(API.enable, role)
}

/** 获取角色类型 */
function getColdeList(noCache?: boolean) {
  return get(API.code, {}, { noCache })
}
/** 通过部门ID查询一个部门下的所有角色 */
function listByDep(departmentId: string, noCache?: boolean) {
  return get(API.listByDep, { departmentId }, { noCache })
}

/** 超管查询角色列表 */
function tableSA(role: Role, noCache?: boolean) {
  return post(API.tableSA, role, null, { noCache: !!noCache })
}
/** 超管查询角色列表 */
function tableA(role: Role, noCache?: boolean) {
  return post(API.tableA, role, null, { noCache: !!noCache })
}

/** 查询一个角色的详情 */
function info(roleId?: string, noCache?: boolean) {
  return get(API.info, { roleId }, { noCache })
}

/** 查询一个角色拥有的所有菜单ID */
function menuIds(roleId?: string, noCache?: boolean) {
  return get(API.menuIds, { roleId }, { noCache })
}

/** 编辑角色 */
function update(role: Role) {
  return post(API.update, role)
}

/** 更新一个角色的菜单权限列表 */
function updateMenuIds(role: Role) {
  return post(API.updateMenuIds, role)
}

export {
  add,
  del,
  disable,
  enable,
  listByDep,
  tableSA,
  tableA,
  info,
  menuIds,
  update,
  updateMenuIds,
  getColdeList,
}
