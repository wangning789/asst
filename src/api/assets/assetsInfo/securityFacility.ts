// 这是安全设备api
import { post, get, getUri } from '@/utils/ajax'
import { download } from '@/utils/downloader'
export const enum API {
  // 新增安全设备
  addSecurityDevice = 'asset/securityDevice/addSecurityDevice',
  // 启用/停用安全设备
  changeSecurityDeviceStatus = 'asset/securityDevice/changeSecurityDeviceStatus',
  // 删除安全设备
  deleteSecurityDevice = 'asset/securityDevice/deleteSecurityDevice',
  // 所有安全设备列表分页查询
  getList = 'asset/securityDevice/getList',
  // getList = 'asset/biz/listBiz',
  getAllList = 'asset/securityDevice/getAllList',
  // getAllList = 'asset/biz/listAll',
  // 安全设备详情查看
  getSecurityDevice = 'asset/securityDevice/getSecurityDevice',
  // getSecurityDevice = 'asset/biz/get',
  // 修改安全设备
  modifySecurityDevice = 'asset/securityDevice/modifySecurityDevice',
  //  安全设备关联资产
  securityDeviceAssociatedAssets = 'asset/securityDevice/securityDeviceAssociatedAssets',
  // 获取安全设备的所有字段信息
  getSecurityDeviceColumn = 'asset/securityDevice/getSecurityDeviceColumn',
  // 导出本级和下级
  downloadAssets = 'asset/securityDevice/exportServerDevice',
  // 导出all
  downloadAllAssets = 'asset/securityDevice/exportAllServerDevice',
  // 下载模板
  downloadTemplate='asset/securityDevice/downloadTemplate',
  // 导入
  leadIn='asset/securityDevice/importsecurityDeviceReport'
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

// 资产关系新增
function addSecurityDevice(param: Record<string, any>) {
  return post(API.addSecurityDevice, param)
}
// 启用/停用安全设备
function changeSecurityDeviceStatus(param: Record<string, any>) {
  return post(API.changeSecurityDeviceStatus, param)
}
// 删除安全设备
function deleteSecurityDevice(id: string) {
  return get(API.deleteSecurityDevice, { securityDeviceId: id })
}
// 安全设备列表分页查询
function getList(param: Record<string, any>) {
  // if (!param.companyIds.length) {
  //   delete param.companyIds
  // }
  return post(API.getList, param)
}
// 安全设备列表分页查询
function getAllList(param: Record<string, any>) {
  // if (!param.companyIds.length) {
  //   delete param.companyIds
  // }
  return post(API.getAllList, param)
}
// 安全设备详情查看
function getSecurityDevice(id: string) {
  return get(API.getSecurityDevice, { id, t: new Date().getTime() })
}
// 修改安全设备
function modifySecurityDevice(param: Record<string, any>) {
  return post(API.modifySecurityDevice, param)
}
// 安全设备关联资产
function securityDeviceAssociatedAssets(param: Record<string, any>) {
  return post(API.securityDeviceAssociatedAssets, param)
}
// 获取安全设备的所有字段信息
function getSecurityDeviceColumn(param: Record<string, any>) {
  return get(API.getSecurityDeviceColumn, param)
}
// 导出本级和下级
function downloadAssets(param: Record<string, any>) {
  return download(API.downloadAssets, param, '', 'post')
}
// 导出所有
function downloadAllAssets(param: Record<string, any>) {
  return download(API.downloadAllAssets, param, '', 'post')
}
export {
  addSecurityDevice,
  changeSecurityDeviceStatus,
  deleteSecurityDevice,
  getList,
  getAllList,
  getSecurityDevice,
  modifySecurityDevice,
  securityDeviceAssociatedAssets,
  getSecurityDeviceColumn,
  downloadAssets,
  downloadAllAssets,
  downloadTemplate,
  leadIn,
}
