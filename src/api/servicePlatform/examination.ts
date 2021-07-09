/** 审批 */
import { get, post } from '@/utils/ajax'

export const enum API {
  /** 查询列表 */
  roleList = 'service-platform/examination/managerExamination',
  /** 运营列表 */
  Operate = 'service-platform/examination/operateExamination',
  /** 审批详情 */
  Detail = 'service-platform/examination/getExamination',
  /** 审批记录列表 */
  Record = 'service-platform/examination/examinationRecord',
  /** 审批通过 */
  PassAndRefuse = 'service-platform/examination/passAndRefuse',
  /** 审批详情 */
  GetExaminationEdit = 'service-platform/examination/details',
}

/** 列表 */
export interface Approve {
  /** 查询列表 */
  page?: number
  applicantName?: string
  examinationNo?: string
  pageSize?: number
  /** 审批详情 */
  id?: string
}

/**
 */
type QueryListParams = {
  /** adsad */
  keyWord: string
}
/** 查询列表
 * @param noCache
 */
function list(params: QueryListParams): Promise<Approve> {
  return post(API.roleList, undefined, params)
}

/** 运营列表
 * @param noCache
 */
function listor(params: QueryListParams): Promise<Approve> {
  return post(API.Operate, undefined, params)
}

/** 审批详情
 * @param noCache
 */
function detail(parms: any) {
  return get(API.Detail, parms)
}

/** 审批记录
 * @param
 */
function record(parms: any) {
  return get(API.Record, parms)
}
/** 审批通过和拒绝
 * @param
 */
function passAndRefuseSave(parms: any) {
  return post(API.PassAndRefuse, parms)
}
/** 审批内容详情
 * @param
 */
function getExaminationEdit(parms: any) {
  return post(API.GetExaminationEdit, parms)
}

/** 查询一个角色的详情 */
// function detail(id?: string, noCache?: boolean) {
//   return get(API.Detail, { id }, { noCache })
// }

export { list, detail, record, passAndRefuseSave, getExaminationEdit, listor }
