import { get } from '@/utils/ajax'
import { showDialog } from '@com/WorkflowDialog'

// workflow 工作流
/** 服务相关接口 */
export const enum API {
  /** 根据流程ID跳转慧正流程 */
  getWorkflowUrlById = '/workflow/workflowPage/moduleIndex/{workId}',
}

/** 根据流程ID跳转慧正流程 */
function getWorkflowUrlById(id: string) {
  return get(API.getWorkflowUrlById.replace('{workId}', id))
}

function toDetail(
  id: string,
  title?: string,
  onmessage?: (msg: MessageEvent) => void
) {
  getWorkflowUrlById(id).then((res: any) => {
    res?.data?.body && showDialog(res.data.body, title || '工单流程', onmessage)
    return res
  })
}

export {
  getWorkflowUrlById,
  // getUrl,
  toDetail,
}
