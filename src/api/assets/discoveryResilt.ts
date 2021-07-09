// 发现资产
import { post, get, del, put } from '@/utils/ajax'

export const enum API {
  // 新建 互联网、内网 资产发现
  discoveryResultAdd = 'asset/discoveryResult/add',
  // 删除资产发现任务
  discoveryResultDelete = 'asset/discoveryResult/delete/',
  // 任务下发
  distribute = 'asset/discoveryResult/distribute',
  // 查询业务系统资产详情
  discoveryResultGet = 'asset/discoveryResult/get/',
  // 分页查询资产发现任务（系统管理员）
  discoveryResultListAll = 'asset/discoveryResult/listAll',
  // 分页查询资产发现任务（单位管理员）
  discoveryResultListBiz = 'asset/discoveryResult/listBiz',
  // 任务状态更新
  discoveryResultModify = 'asset/discoveryResult/modify',
  //已发现资产批量忽略
  ignore = 'asset/discoveryResultServer/batch/ignore',
  //已发现资产详情
  ignoreInfo = 'asset/discoveryResultServer/get/',
  //分页查询已发现资产列表(单位管理员)
  ignoreList = 'asset/discoveryResultServer/list',
  //已发现资产纳管
  nanotube ='asset/discoveryResultServer/nanotube',
  //已发现资产-端口纳管
  nanotubePort = 'asset/discoveryResultServer/port/nanotube',
}

export const PROBE = [
  {
    id: '1',
    name: '内网资产发现',
    disable: true,
  }, {
    id: '2',
    name: '互联网资产发现',
  },
]
export const PROBE_INTRANET = [
  {
    id: '1',
    name: '内网资产发现',
  }, {
    id: '2',
    name: '互联网资产发现',
    disable: true,
  },
]

export const PROBE_INT = {
  2: '互联网资产发现',
  1: '内网资产发现',
}

export const DISCOVER_LEVEL = {
  1: '快速扫描',
  2: '深度扫描',
}
export const EXECUTE_IMMEDIATELY = {
  1: '是',
  2: '否',
}
//已发现资产-端口纳管
function nanotubePort(param: Record<string, any>){
  return post(API.nanotubePort,param)
}
//已发现资产-纳管
function nanotube(param: Record<string, any>){
  return post(API.nanotube,param)
}
//分页查询已发现资产列表(单位管理员)
function ignoreList(param: Record<string, any>){
  return post(API.ignoreList,param)
}
//已发现资产详情
function ignoreInfo(param: Record<string, any>){
  return get(API.ignoreInfo + param)
}
//已发现资产批量忽略
function ignore(param: Record<string, any>){
  return post(API.ignore,param)
}
// 新建
function discoveryResultAdd(param: Record<string, any>) {
  return post(API.discoveryResultAdd, param)
}
// 删除
function discoveryResultDelete(id: string) {
  return del(API.discoveryResultDelete + id)
}
// 任务下发
function distribute(param: Record<string, any>) {
  return post(API.distribute, param)
}
// 查询业务系统资产详情
function discoveryResultGet(id: string) {
  return get(API.discoveryResultGet + id)
}
// 分页查询资产发现任务（系统管理员）
function discoveryResultListAll(param: Record<string, any>) {
  return post(API.discoveryResultListAll, param)
}
/// /分页查询资产发现任务（单位管理员）
function discoveryResultListBiz(param: Record<string, any>) {
  return post(API.discoveryResultListBiz, param)
}
// 任务状态更新
function discoveryResultModify(param: Record<string, any>) {
  return put(API.discoveryResultModify, param)
}

export {
  discoveryResultAdd,
  discoveryResultDelete,
  distribute,
  discoveryResultGet,
  discoveryResultListAll,
  discoveryResultListBiz,
  discoveryResultModify,
  nanotubePort,
  nanotube,
  ignoreList,
  ignoreInfo,
  ignore
}
