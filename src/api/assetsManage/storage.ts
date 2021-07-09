import { post, getUri, get } from '@/utils/ajax'
import { download } from '@/utils/downloader'

export const enum API {
  pageQueryAllStorage = 'asset//strorage/pageQueryAllStorage',
  pageQueryCurrentStorage = 'asset//strorage/pageQueryCurrentStorage',
  pageQueryStorage = 'asset//strorage/pageQueryStorage',
  exportTotalStorage = 'asset/strorage/export/allStorageList',
  exportCompanyTotalStorage = 'asset/strorage/export/currentStorageList',
  exportCompanyBelowTotalStorage = 'asset/strorage/export/storageList',
  importStorages = 'asset/strorage/import/storageList',
  downloadTemplate = 'asset/strorage/downloadTemp',
  queryStorage = 'asset/strorage/detailStorage/{id}',
  createStorage = 'asset/strorage/addStorage',
  updateStorage = 'asset/strorage/updateStorage',
  deleteStorage = 'asset/strorage/deleteStorage/{id}'
}

function pageQueryAllStorage(param: Record<string, any>) {
  return post(API.pageQueryAllStorage, param)
}

function pageQueryCurrentStorage(param: Record<string, any>) {
  return post(API.pageQueryCurrentStorage, param)
}

function pageQueryStorage(param: Record<string, any>) {
  return post(API.pageQueryStorage, param)
}

function exportTotalStorage(dto: Record<string, any>) {
  const res = download(API.exportTotalStorage, dto)
  return res
}

function exportCompanyTotalStorage(dto: Record<string, any>) {
  const res = download(API.exportCompanyTotalStorage, dto)
  return res
}

function exportCompanyBelowTotalStorage(dto: Record<string, any>) {
  const res = download(API.exportCompanyBelowTotalStorage, dto)
  return res
}
let _uploadUrl!: string
function importStorages() {
  return _uploadUrl || (_uploadUrl = getUri(API.importStorages))
}

function downloadTemplate() {
  return download(API.downloadTemplate)
}

function queryStorage(id: any) {
  return get(API.queryStorage.replace('{id}', id))
}

function createStorage(param: Record<string, any>) {
  return post(API.createStorage, param)
}

function updateStorage(param: Record<string, any>) {
  return post(API.updateStorage, param)
}

function deleteStorage(id: any) {
  return get(API.deleteStorage.replace('{id}', id))
}
export {
  pageQueryAllStorage,
  pageQueryCurrentStorage,
  pageQueryStorage,
  exportTotalStorage,
  exportCompanyTotalStorage,
  exportCompanyBelowTotalStorage,
  importStorages,
  downloadTemplate,
  queryStorage,
  createStorage,
  updateStorage,
  deleteStorage,
}
