/** 知识库管理 */
import { get, post } from '@/utils/ajax'
// import { Approve } from "@/api/servicePlatform/examination"

export const enum API {
  // 获取安全报表列表信息
  getSecurityReportList = 'service-platform/security/getSecurityReportList',
  // 知识库列表
  getAppendixInfo = 'service-platform/appendix/getAppendixInfo',
  /** 文件上传 */
  upload = 'tools-server/file/upload',
  /** 文件下载 */
  download = 'tools-server/file/download',
  /** 文件删除 */
  del = 'tools-server/file/delete',
  /** 添加附件信息 */
  saveAppendixInfo = 'service-platform/appendix/saveAppendixInfo',
  /** 删除信息 */
  deleteFile = 'service-platform/appendix/delete',
  /** 发起处置工单 */
  startWorkOrder = 'service-platform/notice/startWorkOrder',
  /** 影响的资产 --运维 */
  assetList = 'service-platform/notice/assetList',
  /** 影响的资产 --用户 */
  userAssetList = 'service-platform/notice/assetListByUser',
  // 运维发起处置工单
  startWorkOrderByOpertion = 'service-platform/notice/startWorkOrderByOpertion'
}

function getSecurityReportList(
  param: any,
  noCache?: boolean
) {
  return get(API.getSecurityReportList, param, { noCache })
}
function getAppendixInfo(
  param: any,
  noCache?: boolean
) {
  return get(API.getAppendixInfo, param, { noCache })
}
function del(
  fileIds: string
) {
  return get(API.del, { fileIds })
}
function download(
  fileId: string
) {
  return get(API.download, { fileId })
}
function saveAppendixInfo(
  param: any
) {
  return post(API.saveAppendixInfo, param)
}
function deleteFile(
  appendixIds: string,
  fileIds: string
) {
  return get(API.deleteFile, { appendixIds, fileIds })
}
function startWorkOrder(
  id: 'f87c4538fe224dfdb6b33ecb3dcbf70b'
) {
  return get(API.startWorkOrder, { id })
}
function assetList(
  noticeId: string
) {
  return get(API.assetList, { noticeId })
}
function userAssetList(
  noticeId: string
) {
  return get(API.userAssetList, { noticeId })
}
function startWorkOrderByOpertion(
  id: string
) {
  return get(API.startWorkOrderByOpertion, { id })
}

export {
  getSecurityReportList,
  getAppendixInfo,
  del,
  download,
  saveAppendixInfo,
  deleteFile,
  assetList,
  startWorkOrder,
  startWorkOrderByOpertion,
  userAssetList,
}
