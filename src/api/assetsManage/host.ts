import { get, post, getUri } from '@/utils/ajax'
import { download } from '@/utils/downloader'

export const enum API {
  queryTotalHost = 'asset/host/queryTotalHost',
  queryCompanyBelowTotalHost = 'asset/host/queryCompanyBelowTotalHost',
  queryCompanyTotalHost = 'asset/host/queryCompanyTotalHost',
  exportTotalHost = 'asset/host/exportTotalHost',
  exportCompanyTotalHost = 'asset/host/exportCompanyTotalHost',
  exportCompanyBelowTotalHost = 'asset/host/exportCompanyBelowTotalHost',
  queryCompanyBelowTotalHostForOP = 'asset/host/queryCompanyBelowTotalHostForOP',
  importHosts = 'asset/host/importHosts',
  queryHost = 'asset/host/queryHostsByIds',
  queryAllHostsNameAndId = 'asset/host/queryAllHostsNameAndId',
  createNewHost = 'asset/host/createNewHost',
  updateHost = 'asset/host/updateHost',
  batchDeleteHosts = 'asset/host/batchDeleteHosts',
  deleteHost = 'asset/host/deleteHost/{id}',
  downloadTemp = 'asset/host/downloadHostTemplate',
  queryBelongCompanyHost='asset/host/queryBelongCompanyHost'
}

function queryTotalHost(param: Record<string, any>) {
  return post(API.queryTotalHost, param)
}

function queryCompanyBelowTotalHost(param: Record<string, any>) {
  return post(API.queryCompanyBelowTotalHost, param)
}

function queryCompanyBelowTotalHostForOP(param: Record<string, any>) {
  return post(API.queryCompanyBelowTotalHostForOP, param)
}

function queryCompanyTotalHost(param: Record<string, any>) {
  return post(API.queryCompanyTotalHost, param)
}

function exportTotalHost(dto: Record<string, any>) {
  const res = download(API.exportTotalHost, dto)
  return res
}

function exportCompanyTotalHost(dto: Record<string, any>) {
  const res = download(API.exportCompanyTotalHost, dto)
  return res
}

function exportCompanyBelowTotalHost(dto: Record<string, any>) {
  const res = download(API.exportCompanyBelowTotalHost, dto)
  return res
}
let _uploadUrl!: string
function importHosts() {
  return _uploadUrl || (_uploadUrl = getUri(API.importHosts))
}

function queryHost(ids: Record<string, any>) {
  return post(API.queryHost, ids)
}
function queryBelongCompanyHost(params: Record<string, any>) {
  return post(API.queryBelongCompanyHost, params)
}

function queryAllHostsNameAndId() {
  return get(API.queryAllHostsNameAndId)
}

function createNewHost(params: Record<string, any>) {
  return post(API.createNewHost, params)
}

function updateHost(params: Record<string, any>) {
  return post(API.updateHost, params)
}

function batchDeleteHosts(idList: Record<string, any>) {
  return post(API.batchDeleteHosts, idList)
}

function deleteHost(id: any) {
  return get(API.deleteHost.replace('{id}', id))
}

function downloadTemp() {
  return download(API.downloadTemp)
}

export {
  queryTotalHost,
  queryCompanyBelowTotalHost,
  queryCompanyTotalHost,
  exportTotalHost,
  exportCompanyTotalHost,
  exportCompanyBelowTotalHost,
  importHosts,
  queryHost,
  queryAllHostsNameAndId,
  createNewHost,
  updateHost,
  batchDeleteHosts,
  deleteHost,
  downloadTemp,
  queryBelongCompanyHost,
  queryCompanyBelowTotalHostForOP,
}
