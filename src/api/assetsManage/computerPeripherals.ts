import { post, put, get, getUri } from '@/utils/ajax'
import { download } from '@/utils/downloader'

export const enum API {
 list = 'asset/officePeripheral/listAll',
 addPeripherals ='asset/officePeripheral/add',
 query ='/officePeripheral/get/',
 editingPeripherals='asset/officePeripheral/modify',
 equipment='asset/officePeripheral/listCurrentAndNext',
 exportAll='asset/officePeripheral/exportAll',
 exportCurrentLevel='asset/officePeripheral/exportCurrentAndNext',
 importSevice='asset/officePeripheral/importCurrentAndNext',
 deletePeripheral='asset/officePeripheral/delete',
 downloadTemplate='asset//officePeripheral/downloadTemplate'
}

function listAll(param: Record<string, any>) {
  return post(API.list, param)
}

function addPeripheral(param: Record<string, any>) {
  return put(API.addPeripherals, param)
}

function queryQetails(param: Record<string, any>) {
  return get(`asset/officePeripheral/get/${param}`)
}

function editingPeripherals(param: Record<string, any>) {
  return put(API.editingPeripherals, param)
}

function equipment(param: Record<string, any>) {
  return post(API.equipment, param)
}

function exportPeripheralsAll(dto: Record<string, any>) {
  const res = download(API.exportAll, dto)
  return res
}

function exportCurrentLevel(dto: Record<string, any>) {
  const res = download(API.exportCurrentLevel, dto)
  return res
}

let _uploadUrl!: string
function importSevice() {
  return _uploadUrl || (_uploadUrl = getUri(API.importSevice))
}

function deletePeripheral(param: Record<string, any>) {
  return put(API.deletePeripheral, param)
}

function downloadTemplate(dto: Record<string, any>) {
  const res = download(API.downloadTemplate, dto)
  return res
}

export {
  listAll,
  addPeripheral,
  queryQetails,
  editingPeripherals,
  equipment,
  exportPeripheralsAll,
  exportCurrentLevel,
  importSevice,
  deletePeripheral,
  downloadTemplate,
}
