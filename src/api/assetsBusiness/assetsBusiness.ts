
import { post, getUri, get } from '@/utils/ajax'
import { download } from '@/utils/downloader'

export const enum API {

  // 导出所有单位业务资产
  exportallBiz = 'asset/biz/export/allBizList',
  // 导出所有单位业务资产,应用系统模板
  exportallBizTwo = 'asset/biz/export/allBizList2',
  // 导出当前单位业务资产和下级单位资产
  exportBiz = 'asset/biz/export/bizList',
  // 导出当前单位业务资产和下级单位资产,应用系统模板
  exportBizTwo = 'asset/biz/export/bizList2',
  // 导出当前单位资产
  exportcurrentBiz = 'asset/biz/export/currentBizList',
  // 导出当前单位资产,应用系统模板
  exportcurrentBizTwo = 'asset/biz/export/currentBizList2',
  // 导入单位资产
  importBiz = 'asset/biz/import/bizList',
  // 导入单位资产
  importBiz2 = 'asset/biz/import/bizList2',
  // 获取业务资产详情
  querydetailBiz = 'asset/biz/detailBiz/{id}',
  // 查询单位资产
  querypageAllBiz = 'asset/biz/pageQueryAllBiz',
  // 查询当前单位及下级单位资产
  querypageBiz = 'asset/biz/pageQueryBiz',
  // 查询当前单位及下级单位资产
  querypageBizForOP = 'asset/biz/pageQueryBizForOP',
  // 查询当前单位资产
  querypageCurrentBiz = 'asset/biz/pageQueryCurrentBiz',
  // 修改资产
  updateBiz = 'asset/biz/updateBiz',
  // 添加资产业务
  addBiz = 'asset/biz/addBiz',
  // 删除业务资产
  deleteBiz = 'asset/biz/deleteBiz/{id}',
  // 下载导入模板
  downloadTemp = 'asset/biz/downloadTemp',
  // 下载导入模板
  downloadTemp2 = 'asset/biz/downloadTemp2',
  // 批量删除
  deleteAllBiz = 'asset/biz/deleteBizs'
}

function querydetailBiz(id: any) {
  return get(API.querydetailBiz.replace('{id}', id))
}

function querypageAllBiz(param: Record<string, any>) {
  return post(API.querypageAllBiz, param)
}

function querypageBiz(param: Record<string, any>) {
  return post(API.querypageBiz, param)
}

function querypageBizForOP(param: Record<string, any>) {
  return post(API.querypageBizForOP, param)
}

function querypageCurrentBiz(param: Record<string, any>) {
  return post(API.querypageCurrentBiz, param)
}

function updateBiz(param: Record<string, any>) {
  return post(API.updateBiz, param)
}

function addBiz(param: Record<string, any>) {
  return post(API.addBiz, param)
}

function deleteBiz(id: any) {
  return get(API.deleteBiz.replace('{id}', id))
}
function deleteAllBiz(ids: Record<string, any>) {
  return post(API.deleteAllBiz, ids)
}

function downloadTemp() {
  return download(API.downloadTemp)
}

function downloadTemp2() {
  return download(API.downloadTemp2)
}

function exportallBiz(dto: Record<string, any>) {
  const res = download(API.exportallBiz, dto)
  return res
}

function exportallBizTwo(dto: Record<string, any>) {
  const res = download(API.exportallBizTwo, dto)
  return res
}
function exportBiz(dto: Record<string, any>) {
  const res = download(API.exportBiz, dto)
  return res
}

function exportBizTwo(dto: Record<string, any>) {
  const res = download(API.exportBizTwo, dto)
  return res
}
function exportcurrentBiz(dto: Record<string, any>) {
  const res = download(API.exportcurrentBiz, dto)
  return res
}

function exportcurrentBizTwo(dto: Record<string, any>) {
  const res = download(API.exportcurrentBizTwo, dto)
  return res
}

let _uploadUrl!: string
function importBiz() {
  return _uploadUrl || (_uploadUrl = getUri(API.importBiz))
}

let _uploadUrl1!: string
function importBiz2() {
  return _uploadUrl1 || (_uploadUrl1 = getUri(API.importBiz2))
}

export {
  exportallBiz,
  exportallBizTwo,
  exportBiz,
  exportBizTwo,
  exportcurrentBiz,
  exportcurrentBizTwo,
  importBiz,
  querydetailBiz,
  querypageAllBiz,
  querypageBiz,
  querypageCurrentBiz,
  updateBiz,
  addBiz,
  deleteBiz,
  downloadTemp,
  deleteAllBiz,
  querypageBizForOP,
  downloadTemp2,
  importBiz2,
}
