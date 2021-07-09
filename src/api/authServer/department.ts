/** 部门管理 */
import { get, post } from '@/utils/ajax'
import { Role } from './role'

export const enum API {
  /** 添加部门 */
  addDep = 'auth-server/department/addDep',
  /** 删除部门 */
  deleteDep = 'auth-server/department/deleteDep',
  /** 获得一个部门 */
  department = 'auth-server/department/department',
  /** 通过parent_id查询部门树 */
  selectAll = 'auth-server/department/selectAll',
  /** 查询部门详情部门下的角色，菜单关系 */
  selectDep = 'auth-server/department/selectDep',
  /** 修改部门信息 */
  updateDep = 'auth-server/department/updateDep',
  /** 更新部门和部门下面角色与菜单的关系 */
  updateDepMenu = 'auth-server/department/updateDepMenu',
}

export interface Department {
  /** 创建日期 */
  createDate?: number
  /** 创建者 */
  createUser?: string
  /** 是否删除 */
  delStatus?: 0 | 1
  /** 删除日期 */
  deleteDate?: number
  /** 删除者 */
  deleteUser?: string
  /** 部门说明 */
  departmentDesc?: string
  /** 部门等级，1为顶级部门节点 */
  departmentLevel?: number
  /** 部门名称 */
  departmentName?: string
  /** 是否可用，0：否，1：是 */
  enabled?: 0 | 1
  /** 编号 */
  id?: string
  /** 主键IDS */
  ids?: string[]
  /** 是否系统内置部门 0：内置部门， 1：新增部门 */
  issys?: 0 | 1
  /** 关键字 */
  keyword?: number
  /** 最后修改日期 */
  modifyDate?: number
  /** 最后修改者 */
  modifyUser?: number
  /** 上级部门ID */
  parentId?: string
  /** 排序字段 */
  orderField?: string
  /** 排序字段类型 */
  orderFieldType?: string
  /** 页码 */
  page?: number
  /** 页面条数 */
  pageSize?: number
  /** 角色信息 */
  roleList?: Role[]
  /** 子部门信息 (childrenList 重命名) */
  children?: Department[]
}

/** 添加部门 */
function addDep(department: Department) {
  return post(API.addDep, department)
}

/** 删除部门 */
function deleteDep(id: string) {
  return post(API.deleteDep, null, { id })
}

/** 获得一个部门 */
function department(departmentId: string, noCache?: boolean) {
  return get(API.department, { departmentId }, { noCache })
}

/** 通过parent_id查询部门树 */
function selectAll(department?: Department, noCache?: boolean) {
  return get(API.selectAll, department, { noCache })
}

/** 查询部门详情部门下的角色，菜单关系 */
function selectDep(id: string, noCache?: boolean) {
  return post(API.selectDep, undefined, { id }, { noCache: !!noCache })
}

/** 修改部门信息 */
function updateDep(department: Department) {
  return post(API.updateDep, department)
}

/** 更新部门关联菜单 */
function updateDepMenu(departmentId: string, menuIDs: string[]) {
  return post(API.updateDepMenu, menuIDs, { departmentId })
}

export {
  addDep,
  deleteDep,
  department,
  selectAll,
  selectDep,
  updateDep,
  updateDepMenu,
}
