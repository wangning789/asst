import { get, post } from '@/utils/ajax'

export const enum API {
  // 安全事件统计-本级及下级数据统计-集团领导概览
  record = 'service-platform/threatIp/threatRecordPageList',
  searchDetails='service-platform/threatIp/threatIpByIp',
  addTags='service-platform/threatIp/addThreatIpLabel',
  upload='service-platform/threatIp/threatIpCollision',
  addThreat='service-platform/threatIp/addThreatIp'

}
/** 获取文件上传地址 */
function upload(param: Record<string, any>) {
  return post(API.upload, param)
}

function record(param: Record<string, any>) {
  return get(API.record, param)
}

function searchDetails(param: Record<string, any>) {
  return post(API.searchDetails, param)
}

function addTags(param: Record<string, any>) {
  return post(API.addTags, param)
}
function addThreat(param: Record<string, any>) {
  return post(API.addThreat, param)
}
export {
  record,
  searchDetails,
  addTags,
  upload,
  addThreat,
}
