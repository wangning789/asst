/** 安全设备管理 */
import { get, post, put, del } from '@/utils/ajax'

export const enum API {
  /** 删除产品(delete) ?ids
   */
  del = 'maintance/securityDevice/delete',
  /** 查询产品分页(post)
   */
  page = 'maintance/securityDevice/listSecurityDevice',
  /** 新建产品(post)
   */
  add = 'maintance/securityDevice/add',
  /** 修改设备(put)
   */
  edit = 'maintance/securityDevice/modify',
  /** 查看详情(get)
   */
  details = 'maintance/securityDevice/getSecurityDeviceInfo',
  /** 关联用户(post)
   */
  relUser = 'maintance/securityDevice/relUser',

  /** 查询安全设备关联用户 */
  all = 'service-platform/serverAssets/getUserList',
}

/** 详情
 * @param {code} code
 *
 * @returns {Promise}
 */
function det(id: string) {
  return get(API.details, { id })
}

/** 关联用户
 * @param {code} code
 *
 * @returns {Promise}
 */
function rel(code: any) {
  return post(API.relUser, code)
}

interface IPage {
  [propName: string]: string | number
  // page?: number
  // pageSize?: number
}

// type IPage = string | number
/** 翻页查询参数
 */
// interface IQuery extends IPage {
//   parentId: string
//   dictType: string
// }
/** 获取安全设备分页列表
 * @param {IQuery} page 查询参数
 * @param {boolean} noCache 禁用缓存
 *
 * @returns {Promise}
 */
function page(page: IPage, noCache?: boolean) {
  return post(API.page, page, { noCache })
}

/** 安全设备
 */
// export type code = {
//   id?: string
//   dictType: string
//   parentId?: string
//   dictCode: string
//   dictName: string
//   /** 是否生效
//    */
//   isEffect?: '0' | '1'
//   sortNo?: number
//   remark?: string
// }

/** 新增安全设备
 * @param {code} code
 *
 * @returns {Promise}
 */
function add(code: any) {
  return post(API.add, code)
}
/** 修改安全设备
 * @param {code} code
 *
 * @returns {Promise}
 */
function edit(code: any) {
  return put(API.edit, code)
}
/** 删除安全设备
 * @param {string} id
 *
 * @returns {Promise}
 */
function dele(id: string) {
  return del(API.del, { id })
}

// 安全设备关联用户

function all() {
  return post(API.all)
}

export { page, add, edit, dele, rel, det, all }
