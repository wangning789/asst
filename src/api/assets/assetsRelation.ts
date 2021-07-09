// 这是资产关系api
import { post, get } from '@/utils/ajax'

export const enum API {
  // 资产关系新增
 exportAddRelation = 'asset/relation/addRelation',
 // 资产关系删除
 exportDelRelation = 'asset/relation/delRelation?id=',
 // 资产关系编辑
  exportEditRelation = 'asset/relation/editRelation',
  // 资产关系列表
  exportGetList = 'asset/relation/getList'
}
// 资产关系新增
function exportAddRelation(param: Record<string, any>) {
  return post(API.exportAddRelation, param)
}
// 资产关系删除
function exportDelRelation(id: string) {
  return get(API.exportDelRelation + id)
}
// 资产关系编辑
function exportEditRelation(param: Record<string, any>) {
  return post(API.exportEditRelation, param)
}
// 资产关系列表
function exportGetList(param: Record<string, any>) {
  return post(API.exportGetList, param)
}

export {
  exportAddRelation,
  exportDelRelation,
  exportEditRelation,
  exportGetList,
}
