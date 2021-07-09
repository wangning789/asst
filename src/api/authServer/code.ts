/** api 管理 */
import { get, post, del } from '@/utils/ajax'
export const enum API {
  /** 查重(get)
   */
  check = 'auth-server/sysCodeTable/checkDictCode',
  /** 删除码表(delete) ?id
   */
  del = 'auth-server/sysCodeTable/delete',
  /** 获取码表分类(get)
   */
  type = 'auth-server/sysCodeTable/getCode',
  /** 获取码表名称(get) ?dictCode
   */
  name = 'auth-server/sysCodeTable/getCodeName',
  /** 获取码表树结构(get) ?dictType
   */
  tree = 'auth-server/sysCodeTable/getEasyUiTree',
  /** 获取码表分页表格(get)
   */
  page = 'auth-server/sysCodeTable/getListData',
  /** 获取下级码表(get)
   */
  sub = 'auth-server/sysCodeTable/getSubList',
  /** 获取二级下级码表(get)
   */
  subSub = 'auth-server/sysCodeTable/getSubListTwo',
  /** 新建码表(post)
   */
  add = 'auth-server/sysCodeTable/save',
  /** 修改码表(post)
   */
  edit = 'auth-server/sysCodeTable/update',
}

interface ICheck {
  id?: string
  dictType: string
  dictCode: string
}
/** 查重
 * @param {ICheck} param 查询参数
 * @param {boolean} noCache 禁用缓存
 *
 * @returns {Promise}
 */
function check(param: ICheck, noCache?: boolean) {
  return get(API.check, param, { noCache })
}

/** 获取码表分类
 * @param {boolean} noCache 禁用缓存
 *
 * @returns {Promise}
 */
function type(noCache?: boolean, param?: IObject) {
  return get(API.type, param, { noCache })
}

/** 获取码表名称
 * @param {string} dictCode 编码
 * @param {boolean} noCache 禁用缓存
 *
 * @returns {Promise}
 */
function name(dictCode: string, noCache?: boolean) {
  return get(API.name, { dictCode }, { noCache })
}

/** 获取码表树结构
 * @param {string} dictType 码表类型
 * @param {boolean} noCache 禁用缓存
 *
 * @returns {Promise}
 */
function tree(dictType: string, noCache?: boolean) {
  return get(API.tree, { dictType }, { noCache })
}

interface IPage {
  page?: number
  pageSize?: number
}

/** 翻页查询参数
 */
interface IQuery extends IPage {
  parentId: string
  dictType: string
}
/** 获取码表列表
 * @param {IQuery} page 查询参数
 * @param {boolean} noCache 禁用缓存
 *
 * @returns {Promise}
 */
function page(page: IQuery, noCache?: boolean) {
  return get(API.page, page, { noCache })
}

/** 获取下级码表
 * @param {ICheck} param 查询参数
 * @param {boolean} noCache 禁用缓存
 *
 * @returns {Promise}
 */
function sub(param: ICheck, noCache?: boolean) {
  return get(API.sub, param, { noCache })
}

/** 码表
 */
export type code = {
  id?: string
  dictType: string
  parentId?: string
  dictCode: string
  dictName: string
  /** 是否生效
   */
  isEffect?: '0' | '1'
  sortNo?: number
  remark?: string
}

/** 增加码表
 * @param {code} code
 *
 * @returns {Promise}
 */
function add(code: code) {
  return post(API.add, code)
}
/** 修改码表
 * @param {code} code
 *
 * @returns {Promise}
 */
function put(code: code) {
  return post(API.edit, code)
}
/** 删除码表
 * @param {string} id
 *
 * @returns {Promise}
 */
function dele(id: string) {
  return del(API.del, { id })
}

export { check, type, name, tree, page, sub, add, put, dele }
