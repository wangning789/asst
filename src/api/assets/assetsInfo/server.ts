// 服务器API
import { post, get, getUri } from '@/utils/ajax'
import { download } from '@/utils/downloader'
export const enum API {
  // 所有服务器列表
  serverGetAllList='asset/server/getAllList',
  // 获取服务器所有字段
  serverGetColumn = 'asset/server/getColumn',
  // 服务器详情
  serverInfo = 'asset/server/getServer',
  // 新增服务器
  addServer = 'asset/server/addServer',
  // 启用停用
  changeServerStatus = 'asset/server/changeServerStatus',
  // 删除服务器
  delServer = 'asset/server/delServer?id=',
  // 导出服务报表
  exportServerReport = 'asset/server/exportServerReport',
  // 本级及下级服务器列表分页查询
  serverGetList ='asset/server/getList',
  // 修改服务器
  modifyServer = 'asset/server/modifyServer',
  // 服务器关联资产
  serverAssociatedAssets = 'asset/server/serverAssociatedAssets',
  // 导出所有
  exportAllServerReport = 'asset/server/exportAllServerReport',
  // 下载模板
  downloadTemplate ='asset/server/downloadTemplate',
  // 导入
  leadIn='asset/server/importServerReport'
}
const ASSET_USE_SERVER = {
  0: '物理服务器',
  1: '虚拟机',
}
// 导入
let _uploadUrl!: string
function leadIn() {
  return _uploadUrl || (_uploadUrl = getUri(API.leadIn))
}
// 下载模板
function downloadTemplate() {
  const res = download(API.downloadTemplate)
  return res
}

// 修改
function modifyServer(param: Record<string, any>) {
  return post(API.modifyServer, param)
}
function serverAssociatedAssets(param: Record<string, any>) {
  return post(API.serverAssociatedAssets, param)
}
// 服务器列表
function serverGetAllList(param: Record<string, any>) {
  return post(API.serverGetAllList, param)
}
// 获取服务器字段
function serverGetColumn() {
  return get(API.serverGetColumn)
}
// 服务器详情
function serverInfo(id: string) {
  return get(`${API.serverInfo}?id=${id}&t=${new Date().getTime()}`)
}
// 新增服务器
function addServer(param: Record<string, any>) {
  return post(API.addServer, param)
}
// 启用停用
function changeServerStatus(param: Record<string, any>) {
  return post(API.changeServerStatus, param)
}
// 删除服务器
function delServer(id: string) {
  return get(API.delServer + id)
}
// 导出服务器报表
function exportServerReport(param: Record<string, any>) {
  return download(API.exportServerReport, param, '', 'post')
}
// 导出所有
function exportAllServerReport(param: Record<string, any>) {
  return download(API.exportAllServerReport, param, '', 'post')
}
// 本级下级分页列表查询
function serverGetList(param: Record<string, any>) {
  return post(API.serverGetList, param)
}
export {
  serverGetAllList,
  serverGetColumn,
  serverInfo,
  addServer,
  changeServerStatus,
  exportAllServerReport,
  delServer,
  exportServerReport,
  serverGetList,
  modifyServer,
  serverAssociatedAssets,
  ASSET_USE_SERVER,
  downloadTemplate,
  leadIn,
}
