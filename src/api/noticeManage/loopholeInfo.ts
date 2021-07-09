
import { get, post, getUri } from '@/utils/ajax'
import { showDialog } from '@com/WorkflowDialog'

export const enum API {
  // 获取通报详情反馈列表
  queryList = 'service-platform/circular/getCircularAllDetail',
  // 获取通报详情漏洞反馈列表
  getCircularDetail = 'service-platform/circular/getCircularDetail',
  // 更新通报反馈信息状态
  updateCircularFeedbackStatus = 'service-platform/circular/updateCircularFeedbackStatus',
  // 直接创建通用运维任务，有按钮
  addGeneralOperaMaintBySafety = 'service-platform/workTask/addGeneralOperaMaintBySafety',
  /** 文件上传 */
  upload = 'tools-server/file/upload',
  // 更新通报反馈信息
  updateCircularFeedback = 'service-platform/circular/updateCircularFeedback',
  // 工作流作业详情页面
  workflow = 'workflow/workflowPage/moduleIndex/{workId}',

}

// 获取通报详情反馈列表
function queryList(param: Record<string, any>) {
  return get(API.queryList, param)
}

// 获取通报详情漏洞反馈列表
function getCircularDetail(param: Record<string, any>) {
  return get(API.getCircularDetail, param)
}

// 更新通报反馈信息状态
function updateCircularFeedbackStatus(param: Record<string, any>) {
  return get(API.updateCircularFeedbackStatus, param)
}

// 直接创建通用运维任务，有按钮
function addGeneralOperaMaintBySafety(param: Record<string, any>) {
  return post(API.addGeneralOperaMaintBySafety, param)
}

// 更新通报反馈信息
function updateCircularFeedback(param: Record<string, any>) {
  return post(API.updateCircularFeedback, param)
}

// 工作流作业详情页面
function workflow(id: any) {
  return get(API.workflow.replace('{workId}', id))
}

let _uploadUrl!: string
/** 获取文件上传地址 */
function upload() {
  return _uploadUrl || (_uploadUrl = getUri(API.upload))
}

function toDetail(
  id: string,
  title?: string,
  onmessage?: (msg: MessageEvent) => void
) {
  workflow(id).then((res: any) => {
    res?.data?.body && showDialog(res.data.body, title || '工单流程', onmessage)
    return res
  })
}
export {
  queryList,
  getCircularDetail,
  updateCircularFeedbackStatus,
  addGeneralOperaMaintBySafety,
  upload,
  updateCircularFeedback,
  toDetail,
}
