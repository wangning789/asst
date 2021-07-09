// 自定义资产
import { post, get, put, del, getUri } from '@/utils/ajax'
import { download } from '@/utils/downloader'
export const enum API{
  // 新增资产
  addBaseCi = 'asset/baseCi/add',
  // 删除资产
  deleteCiType = 'asset/baseCi/delete/',
  // 批量删除资产
  deleteBatch = 'asset/baseCi/deleteBatch',
  // 导出所有资产
  exportAll = 'asset/baseCi/exportAll',
  // 获取自定义所有细节
  getBaseCiColumn ='asset/baseCi/getBaseCiColumn',
  // 导出当前单位及下级单位所有资产
  exportCurrAndNext = 'asset/baseCi/exportCurrAndNext',
  // 查询资产详情
  getBaseCi = 'asset/baseCi/get',
  // 查询所有资产
  baseCiListAll = 'asset/baseCi/listAll',
  // 根据关键字搜索有权限的资产信息
  listByKeyword = 'asset/baseCi/listByKeyword',
  // 查询当前单位及下级单位所有资产
  listCurrAndNext = 'asset/baseCi/listCurrAndNext',
  // 修改资产
  modifyBaseCi = 'asset/baseCi/modify',
  // 修改状态
  changeStatus = 'asset/baseCi/changeStatus',
    // 下载模板
    downloadTemplate='asset/baseCi/downloadTemplate',
      // 导入
  leadIn='asset/baseCi/importCiReport'
}
// 导入
let _uploadUrl!: string
function leadIn() {
  return _uploadUrl || (_uploadUrl = getUri('asset/baseCi/importCiReport/'))
}

// 下载模板
function downloadTemplate(param: Record<string, any>) {
  const res = download(`${API.downloadTemplate}/${param}`)
  return res
}
function changeStatus(param: Record<string, any>) {
  return post(API.changeStatus, param)
}

function getBaseCiColumn(param: Record<string, any>) {
  return get(`${API.getBaseCiColumn}?ciTypeId=${param.ciTypeId}`)
}

function addBaseCi(param: Record<string, any>) {
  return post(API.addBaseCi, param)
}

function deleteCiType(param: Record<string, any>) {
  return del(`${API.deleteCiType}${param.ciTypeId}/${param.id}`)
}

function deleteBatch(param: Record<string, any>) {
  return del(API.deleteBatch, param)
}

function exportAll(param: Record<string, any>) {
  return download(API.exportAll, param, '', 'post')
}

function exportCurrAndNext(param: Record<string, any>) {
  return download(API.exportCurrAndNext, param, '', 'post')
}

function getBaseCi(param: Record<string, any>) {
  return get(`${API.getBaseCi}/${param.ciTypeId}/${param.id}?t=${new Date().getTime()}`)
}

function baseCiListAll(param: Record<string, any>) {
  return post(API.baseCiListAll, param)
}

function listByKeyword(param: Record<string, any>) {
  return post(API.listByKeyword, param)
}

function listCurrAndNext(param: Record<string, any>) {
  return post(API.listCurrAndNext, param)
}

function modifyBaseCi(param: Record<string, any>) {
  return put(API.modifyBaseCi, param)
}
export {
  addBaseCi,
  deleteCiType,
  getBaseCiColumn,
  deleteBatch,
  exportCurrAndNext,
  exportAll,
  modifyBaseCi,
  changeStatus,
  listByKeyword,
  listCurrAndNext,
  baseCiListAll,
  getBaseCi,
  downloadTemplate,
  leadIn,
}
