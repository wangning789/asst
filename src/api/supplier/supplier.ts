/** 供应商管理 */
import { get, post, del, put } from '@/utils/ajax'
import { Approve } from '@/api/servicePlatform/examination'

export const enum API {
  /** 查询供应商列表(get) */
  list = 'service-platform/Vendor/findAllVendor',
  /** 查看供应商详情(post) */
  info = 'service-platform/Vendor/findByIdVendor',
  /** 添加供应商(post) */
  add = 'service-platform/Vendor/addVendor',
  /** 删除供应商 (delete) */
  delete = 'service-platform/Vendor/deleteVendor',
  /** 筛选查询供应商 */
  filter = 'service-platform/Vendor/filterVendors',
  /** 修改供应商信息 (put) */
  update = 'service-platform/Vendor/updateVendor',
}

export interface Supplier {
  /** 对接人  */
  contact?: string
  /** 创建日期 example: 1970-1-1 00:00:00 */
  createDate?: number

  /** 创建者 example: uuid */
  createUser?: string

  /** 是否删除 example: 0 */
  delStatus?: number

  /** 删除日期 example: 1970-1-1 00:00:00 */
  deleteDate?: number

  /** 删除者 example: uuid */
  deleteUser?: string

  /** 编号 example: uuid */
  id?: string

  /** 最后修改日期 example: 1970-1-1 00:00:00 */
  modifyDate?: number

  /** 最后修改者 example: uuid */
  modifyUser?: string

  /** 联系方式  */
  phoneNumber?: string
  /**   */
  products?: string[]
  /** 供应产品  */
  productsName?: string
  /** 供应商名  */
  vendorName?: string
  /** 供应商编号  */
  vendorNo?: string
}

/** 查询供应商列表
 *
 */
function allList(
  param: any,
  noCache?: boolean
): Promise<{ data: { body: Supplier } }> {
  return get(API.list, param, { noCache })
}

/** 查看一个供应商详情
 * @param id
 *
 */
function info(
  id: string,
  noCache?: boolean
): Promise<{ data: { body: Approve } }> {
  return post(API.info, undefined, { id }, { noCache })
}

/** 新增供应商
 * @param supplier
 */
function add(supplier: Supplier) {
  return post(API.add, supplier)
}

/** 删除供应商
 * @param supplier
 */
function delet(
  id: string,
  noCache?: boolean
): Promise<{ data: { body: Approve } }> {
  return del(API.delete, { id }, { noCache })
}

// function delet(supplier: Supplier) {
//   return del(API.delete, supplier)
// }

/** 模糊查询供应商
 * @param supplier
 */
function fil(supplier: Supplier) {
  return post(API.filter, supplier)
}

/** 修改供应商
 * @param supplier
 */
function update(supplier: Supplier) {
  return put(API.update, supplier)
}

export { allList, info, add, delet, fil, update }
