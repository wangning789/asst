import { get, post, getUri } from '@/utils/ajax'
import { download } from '@/utils/downloader'

export const enum API {
  queryTotalTerminal = 'asset/terminal/queryTotalTerminal',
  queryCompanyBelowTotalTerminal = 'asset/terminal/queryCompanyBelowTotalTerminal',
  queryCompanyTotalTerminal = 'asset/terminal/queryCompanyTotalTerminal',
  exportTotalTerminal = 'asset/terminal/exportTotalTerminal',
  exportCompanyTotalTerminal = 'asset/terminal/exportCompanyTotalTerminal',
  exportCompanyBelowTotalTerminal = 'asset/terminal/exportCompanyBelowTotalTerminal',
  importTerminals = 'asset/terminal/importTerminals',
  queryTerminal = 'asset/terminal/queryTerminalsByIds',
  createTerminal = 'asset/terminal/createNewTerminal',
  updateTerminal = 'asset/terminal/updateTerminal',
  deleteTerminal = 'asset/terminal/deleteTerminal/{id}',
  downloadTemp = 'asset/terminal/downloadTerminalTemplate'
}

function queryTotalTerminal(param: Record<string, any>) {
  return post(API.queryTotalTerminal, param)
}

function queryCompanyBelowTotalTerminal(param: Record<string, any>) {
  return post(API.queryCompanyBelowTotalTerminal, param)
}

function queryCompanyTotalTerminal(param: Record<string, any>) {
  return post(API.queryCompanyTotalTerminal, param)
}

function exportTotalTerminal(dto: Record<string, any>) {
  const res = download(API.exportTotalTerminal, dto)
  return res
}

function exportCompanyTotalTerminal(dto: Record<string, any>) {
  const res = download(API.exportCompanyTotalTerminal, dto)
  return res
}

function exportCompanyBelowTotalTerminal(dto: Record<string, any>) {
  const res = download(API.exportCompanyBelowTotalTerminal, dto)
  return res
}
let _uploadUrl!: string
function importTerminals() {
  return _uploadUrl || (_uploadUrl = getUri(API.importTerminals))
}

function queryTerminal(ids: Record<string, any>) {
  return post(API.queryTerminal, ids)
}

function createTerminal(param: Record<string, any>) {
  return post(API.createTerminal, param)
}

function updateTerminal(param: Record<string, any>) {
  return post(API.updateTerminal, param)
}

function deleteTerminal(id: any) {
  return get(API.deleteTerminal.replace('{id}', id))
}

function downloadTemp() {
  return download(API.downloadTemp)
}

export {
  queryTotalTerminal,
  queryCompanyBelowTotalTerminal,
  queryCompanyTotalTerminal,
  exportTotalTerminal,
  exportCompanyTotalTerminal,
  exportCompanyBelowTotalTerminal,
  importTerminals,
  queryTerminal,
  createTerminal,
  updateTerminal,
  deleteTerminal,
  downloadTemp,
}
