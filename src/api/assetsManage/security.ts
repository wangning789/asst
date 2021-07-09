
import { post, getUri, put, get } from '@/utils/ajax'
import { download } from '@/utils/downloader'

export const enum API {
  // 新增安全产品
  add = 'asset/securityDevice/add',
  // 删除安全产品
  deleteSecurity = 'asset/securityDevice/delete',
  // 导出所有的安全产品
  exportAll = 'asset/securityDevice/exportAll',
  // 导出当前的安全产品
  exportCurrent = 'asset/securityDevice/exportCurrent',
  // 导出当前单位以及下级单位的安全产品
  exportCurrentAndNext = 'asset/securityDevice/exportCurrentAll',
  // 查询安全产品详情
  getWhenUpdate = 'asset/securityDevice/getWhenUpdate/{securityDeviceId}',
  // 查询安全产品详情页面
  securityDeviceId = 'asset/securityDevice/get/{securityDeviceId}',
  // 查询所有的安全产品
  listAll = 'asset/securityDevice/listAll',
  // 查询所有的安全产品
  listCurrent = 'asset/securityDevice/listCurrent',
  // 查询当前单位以及下级单位的安全产品
  listCurrentAndNext = 'asset/securityDevice/listCurrentAndNext',
  // 查询当前单位以及下级单位的安全产品
  listCurrentAndNextForOP = 'asset/securityDevice/listCurrentAndNextForOP',
  // 导入当前单位以及下级单位的安全产品
  importCurrentAll = 'asset/securityDevice/importCurrentAll',
  // 修改安全产品
  modify = 'asset/securityDevice/modify',
  // 下载模板
  downloadTemplate = 'asset/securityDevice/downloadTemplate',
}

// 下载模板
function downloadTemplate() {
  const res = download(API.downloadTemplate)
  return res
}

// 新增安全设备
function add(param: Record<string, any>) {
  return post(API.add, param)
}

// 导入当前单位
let _uploadUrl2!: string
function importCurrentAll() {
  return _uploadUrl2 || (_uploadUrl2 = getUri(API.importCurrentAll))
}

// 查询所有的安全设备列表
function listAll(param: Record<string, any>) {
  return post(API.listAll, param)
}

// 查询当前单位的安全设备列表
function listCurrent(param: Record<string, any>) {
  return post(API.listCurrent, param)
}

// 查询当前单位以及下级单位的安全产品
function listCurrentAndNextForOP(param: Record<string, any>) {
  return post(API.listCurrentAndNextForOP, param)
}

// 查询当前单位以及下级单位的安全产品
function listCurrentAndNext(param: Record<string, any>) {
  return post(API.listCurrentAndNext, param)
}

// 查询安全设备详情
function getWhenUpdate(id: any) {
  return get(API.getWhenUpdate.replace('{securityDeviceId}', id))
}

// 查询安全设备详情
function securityDeviceId(id: any) {
  return get(API.securityDeviceId.replace('{securityDeviceId}', id))
}

// 导出所有的安全产品
function exportAll(dto: Record<string, any>) {
  const res = download(API.exportAll, dto)
  return res
}

// 导出当前的安全产品
function exportCurrent(dto: Record<string, any>) {
  const res = download(API.exportCurrent, dto)
  return res
}

// 导出当前单位以及下级单位的安全产品
function exportCurrentAndNext(dto: Record<string, any>) {
  const res = download(API.exportCurrentAndNext, dto)
  return res
}

// 删除安全设备
function deleteSecurity(param: Record<string, any>) {
  return put(API.deleteSecurity, param)
}

// 修改安全设备
function modify(param: Record<string, any>) {
  return put(API.modify, param)
}

export {
  deleteSecurity,
  exportAll,
  exportCurrent,
  exportCurrentAndNext,
  getWhenUpdate,
  securityDeviceId,
  listAll,
  listCurrent,
  listCurrentAndNext,
  importCurrentAll,
  modify,
  add,
  downloadTemplate,
  listCurrentAndNextForOP,
}
