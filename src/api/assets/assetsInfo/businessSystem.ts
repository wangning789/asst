import { post, get, put, del, getUri } from '@/utils/ajax'
import { download } from '@/utils/downloader'

export const enum API {

  // 获取组织机构树
  allWhole = '/asset/biz/listAll', // 查看全部
  biz='/asset/biz/listBiz', // 查看当前和下级
  edit='asset/biz/modify',
  delete='asset/biz/delete/{id}',
  state='asset/biz/changeUseStatus', // 业务系统状态
  addField='asset/biz/getColumn', // 新增所有字段接扣
  add='asset/biz/add', // 新增业务系统
  exportAll='asset/biz/exportAll', // 导出所有业务系统
  exportCurrent= 'asset/biz/exportCurrentAll',
  downloadTemplate='asset/biz/downloadTemplate',
  leadIn='asset/biz/importBizReport'
}
let _uploadUrl!: string
function leadIn() {
  return _uploadUrl || (_uploadUrl = getUri(API.leadIn))
}
function downloadTemplate() {
  const res = download(API.downloadTemplate)
  return res
}

function allWhole(param: Record<string, any>) {
  return post(API.allWhole, param)
}

function biz(param: Record<string, any>) {
  return post(API.biz, param)
}

function details(id: Record<string, any>) {
  return get(`asset/biz/get/${id}?s='${Math.random()}'`)
}

function edit(param: Record<string, any>) {
  return put(API.edit, param)
}

function state(param: Record<string, any>) {
  return put(API.state, param)
}

function add(param: Record<string, any>) {
  return put(API.add, param)
}

function deleteData(param: Record<string, any>) {
  return del(`asset/biz/delete/${param}`)
}

function addField(param: Record<string, any>) {
  return get(API.addField, param)
}

function exportAll(dto: Record<string, any>) {
  return download(API.exportAll, dto, '', 'post')
}

function exportCurrent(dto: Record<string, any>) {
  return download(API.exportCurrent, dto, '', 'post')
}

function caseKeep(param: Record<string, any>) {
  return get(`asset/biz/getBizArchives/${param}`)
}
export {
  allWhole,
  biz,
  details,
  edit,
  deleteData,
  state,
  addField,
  add,
  exportAll,
  exportCurrent,
  caseKeep,
  downloadTemplate,
  leadIn,
}
