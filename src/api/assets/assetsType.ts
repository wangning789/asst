// 这是资产类型管理
import { post, get, del, put } from '@/utils/ajax'

export const enum API {
  // 新增资产类型
  ciTypeAdd = 'asset/ciType/add',
 // 删除资产类型
 ciTypeDelete = 'asset/ciType/delete',
 // 查询资产类型详情
 ciTypeDetail = 'asset/ciType/get',
  // 修改资产类型
  ciTypeModify = 'asset/ciType/modify',
  // 移动资产类型
  modifyDisplayOrder = 'asset/ciType/modifyDisplayOrder',

  // 新增资产属性
  ciColumnAdd = 'asset/ciColumn/add',
  // 删除资产属性
  ciColumnDelete = 'asset/ciColumn/delete',
  // 查询资产属性详情
  ciColumnDetail = 'asset/ciColumn/get',
  // 修改资产属性
  ciColumnModify = 'asset/ciColumn/modify',
  // 查询该资产的所有属性
  listAllColumns = 'asset/ciColumn/listAllColumns',

}

// 资产类型
export interface AssetsType {
  /** 主键ID example: uuid */
  id?: string
  /** 中文名称 */
  chName?: string
  /** 英文名称 */
  enName?: string
  /** 备注 */
  description?: string

}

// 资产类型字段
export interface AssetsField {
  /** 资产类型id */
  ciTypeId?: string
  /** 主键ID example: uuid */
  id?: string
  /** 中文名称 */
  chName?: string
  /** 英文名称 */
  enName?: string
  /** 排序 */
  displayOrder?: number
  /** 是否显示 */
  display?: string
  /** 是否必填 */
  required?: string
  /** 字段类型 */
  type?: string
  /** 枚举值 下拉才有 */
  enumeration?: string
  /** 备注 */
  description?: string
}

// 1:短文本（25 ）;2:长文本（ 200）;3:数字(整数);4:数字(小数);5:日期;6:时间;7:下拉框
// 字段类型
export const FIELD_TYPE = {
  1: '短文本(25)',
  2: '长文本(200)',
  3: '数字(整数)',
  4: '数字(小数)',
  5: '日期(yyyy-MM-dd)',
  6: '时间(yyyy-MM-dd HH:mm:ss)',
  7: '下拉框',
}
// 是否列表展示
export const DISPLAY_TYPE = {
  1: '是',
  2: '否',
}
// 是否必填
export const REQUIRED_TYPE = {
  1: '是',
  2: '否',
}
// 是否导出
export const EXPORT_TYPE = {
  1: '是',
  2: '否',
}

// 新增资产类型
function ciTypeAdd(param: Record<string, any>) {
  return post(API.ciTypeAdd, param)
}
// 删除资产类型
function ciTypeDelete(id: string) {
  return del(API.ciTypeDelete + '/' + id)
}
// 查询资产类型详情
function ciTypeDetail(id: string) {
  return get(API.ciTypeDetail + '/' + id)
}
// 修改资产类型
function ciTypeModify(param: Record<string, any>) {
  return post(API.ciTypeModify, param)
}
// 移动资产类型
function modifyDisplayOrder(param: Record<string, any>) {
  return get(API.modifyDisplayOrder, { ...param, t: new Date().getTime() })
}

// 新增资产属性
function ciColumnAdd(param: Record<string, any>) {
  return post(API.ciColumnAdd, param)
}
// 删除资产属性
function ciColumnDelete(id: string) {
  return del(API.ciColumnDelete + '/' + id)
}
// 查看资产属性
function ciColumnDetail(id: string) {
  return post(API.ciColumnDetail + '/' + id)
}
// 修改资产属性
function ciColumnModify(param: Record<string, any>) {
  return put(API.ciColumnModify, param)
}
// 修改资产属性
function listAllColumns(id: string) {
  return get(`${API.listAllColumns}/${id} ?t=${new Date().getTime()}`)
}

export {
  ciTypeAdd,
  ciTypeDelete,
  ciTypeDetail,
  ciTypeModify,
  modifyDisplayOrder,
  ciColumnAdd,
  ciColumnDelete,
  ciColumnDetail,
  ciColumnModify,
  listAllColumns,
}
