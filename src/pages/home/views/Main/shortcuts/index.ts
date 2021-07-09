import { authFit } from '@/functions/auth'
import { MODULE } from '@/enums/module'

import Approve from './Approve'
import Notice from './Notice'
import Alarm from './Alarm'
import Order from './Order'
import WorkOrder from './WorkOrder'
import Backlog from './Backlog'

export const enum AUTH {
  /** 告警 */
  alarm = '0',
  /** 审批 */
  approve = '1',
  /** 待交付订单 */
  backlog = '2',
  /** 公告列表 */
  notice='3',
  /** 最新订单 */
  order='4',
  /** 待处理工单 */
  workOrder='5'

}

/** 获取要展示的模块 */
export default () => {
  const shortcuts = []
  authFit(MODULE.main, [AUTH.approve]) && shortcuts.push(Approve)
  authFit(MODULE.main, [AUTH.notice]) && shortcuts.push(Notice)
  authFit(MODULE.main, [AUTH.alarm]) && shortcuts.push(Alarm)
  authFit(MODULE.main, [AUTH.order]) && shortcuts.push(Order)
  authFit(MODULE.main, [AUTH.workOrder]) && shortcuts.push(WorkOrder)
  authFit(MODULE.main, [AUTH.backlog]) && shortcuts.push(Backlog)
  return shortcuts
}
