import { get, post, put, getUri } from '@/utils/ajax'
import { download } from '@/utils/downloader'

export const enum API {
  listAll = 'asset/scDevStatistics/listAll', // 全部设备
  list='asset/scDevStatistics/listCurrentAndNext', // 当前或者下级设备
  addControllableServer='asset/scDevStatistics/add', // 新增可控服务器
  deleteControllableServer='asset/scDevStatistics/delete', // 删除可控服务
  addSecretCount='asset/scDevStatistics/add', // 新增
  deleteSecreCount='asset/scDevStatistics/delete', // 删除
  importSecreCount='asset/scDevStatistics/importCurrentAndNext2', // 导入涉密
  imporNonsecret='asset/scDevStatistics/importCurrentAndNext1', // 导入非密
  downloadTemplate='asset/scDevStatistics/downloadTemplate', // 下载模板
  exportAll='asset/scDevStatistics/exportAll', // 导出所有
  exportCurrentAndNext='asset/scDevStatistics/exportCurrentAndNext', // 导出本级或者下级
  query='asset/scDevStatistics/get/{scDevStatisticsId}', // 查询
  modify='asset/scDevStatistics/modify', // 编辑
}
function modify(param: Record<string, any>) {
  return put(API.modify, param)
}

function listAll(param: Record<string, any>) {
  return post(API.listAll, param)
}

function list(param: Record<string, any>) {
  return post(API.list, param)
}

function addControllableServer(param: Record<string, any>) {
  return put(API.addControllableServer, param)
}

function deleteControllableServer(param: Record<string, any>) {
  return put(API.deleteControllableServer, param)
}

function addSecretCount(param: Record<string, any>) {
  return put(API.addSecretCount, param)
}
function deleteSecreCount(param: Record<string, any>) {
  return put(API.deleteSecreCount, param)
}

let _uploadUrl!: string
function importSecreCount() {
  return _uploadUrl || (_uploadUrl = getUri(API.importSecreCount))
}

let uploadUrlpm!: string
function imporNonsecret() {
  return uploadUrlpm || (uploadUrlpm = getUri(API.imporNonsecret))
}

function downloadTemplate(dto: Record<string, any>) {
  const res = download(API.downloadTemplate, dto)
  return res
}

function exportAll(dto: Record<string, any>) {
  const res = download(API.exportAll, dto)
  return res
}

function exportCurrentAndNext(dto: Record<string, any>) {
  const res = download(API.exportCurrentAndNext, dto)
  return res
}

function query(param: Record<string, any>) {
  return get(`asset/scDevStatistics/get/${param}`)
}

export {
  listAll,
  addControllableServer,
  deleteControllableServer,
  addSecretCount,
  deleteSecreCount,
  importSecreCount,
  imporNonsecret,
  list,
  downloadTemplate,
  exportAll,
  exportCurrentAndNext,
  query,
  modify,
}
