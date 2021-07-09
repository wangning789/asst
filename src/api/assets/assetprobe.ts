// 探针API
import { post, get } from '@/utils/ajax'

export const enum API {
  // 新增探针
 add = 'asset/probe/add',
 // 删除探针
 del = 'asset/probe/del?id=',
 // 探针详情
  info = 'asset/probe/get?id=',
  // 查询所有探针
  probeGetAllList = 'asset/probe/getAllList',
  // 查询当前探针
  probeGetUniList = 'asset/probe/getUniList',
  // 修改探针
  probeUpdate = 'asset/probe/update'
}
// 新增
function add(param: Record<string, any>) {
  return post(API.add, param)
}
// 删除
function del(id: Record<string, any>) {
  return get(`${API.del}` + id)
}
// 详情
function info(id: Record<string, any>) {
  return get(`${API.info}` + id)
}
// 查询所有探针
function probeGetAllList(param: Record<string, any>) {
  return post(API.probeGetAllList, param)
}
// 查询当前单位探针
function probeGetUniList(param: Record<string, any>) {
  return post(API.probeGetUniList, param)
}
// 修改探针
function probeUpdate(param: Record<string, any>) {
  return post(API.probeUpdate, param)
}
const ASSET_PROBE = {
  0: '内网',
  1: '互联网',
}
export {
  add,
  del,
  info,
  probeGetAllList,
  probeGetUniList,
  probeUpdate,
  ASSET_PROBE,
}
