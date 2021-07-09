import { get, post } from '@/utils/ajax'

// service-platform 网关路径
/** 公告相关接口 */
export const enum API {
  /** 首页公开公告分页查询 */
  noticeOpenList = 'service-platform/notice/openNoticePageList',
  /** 首页公开公告详情查询 */
  noticeDetail = 'service-platform/notice/openNotice',
  /** 公告分页查询 */
  noticeList = 'service-platform/notice/list',
  /** 查询公告详情 */
  noticeInfo = 'service-platform/notice/selectById',
  /** 新增产品 */
  noticeSave = 'service-platform/notice/add',
  /** 修改产品 */
  noticeEdit = 'service-platform/notice/updateNotice',
  /** 删除产品 */
  noticeDel = 'service-platform/notice/deleteNotice',
  /** 接收对象,后来接收对象改为了调用单位接口 */
  listCustomer = 'service-platform/notice/listCustomer',
  /** 客户公告中心最新 */
  customerNoticeList = 'service-platform/notice/customerNoticeList',
  /** 销售公告中心最新 */
  sellList = 'service-platform/notice/sellList',
  /** 公告收藏 */
  Mark = 'service-platform/notice/Mark',
  /** 取消收藏 */
  cancelMark = 'service-platform/notice/cancelMark',
  /** 公告编辑详情 */
  getNoticeByExaminationId = 'service-platform/notice/getNoticeByExaminationId',
  /** 客户查询详情 */
  CustomerNoticeById = 'service-platform/notice/CustomerNotice',
  /** 云服务商最新 + 北京项目单位领导及单位安全管理员查询本级及下级公开公告 */
  cloudServiceList = 'service-platform/notice/cloudServicesList',
  /** 运维处置工单列表 */
  optWorkOrder = 'service-platform/notice/getWorkOrderByOpertion',
  /** 用户处置工单列表 */
  customWorkOrder = 'service-platform/notice/getWorkOrderByUser',
}

/** 公告信息 */
export interface Notice {
  /**    公告内容 */
  content?: string
  /** 创建日期 example: 1970-1-1 00:00:00 */
  createDate?: string

  /** 创建者 example: uuid */
  createUser?: string

  /**   */
  customers?: [] /**    关联的审批ID */
  departmentDTOList?: [] /**    接收对象ID */
  examinationId?: string
  /** 主键ID example: uuid */
  id?: string

  /**   */
  ids?: [] /** 关键字查询 example: 关键词 */
  keyword?: string

  /** 最后修改日期 example: 1970-1-1 00:00:00 */
  modifyDate?: string

  /** 最后修改者 example: uuid */
  modifyUser?: string

  /**    公告级别 */
  noticeLevel?: string
  /**    公告编号 */
  noticeNo?: string
  /**    公告范围 0全员 1部分用户 */
  noticeRange?: number
  /**    公告状态 0 待审批通过 1 审批通过 2拒绝 3撤回 */
  noticeStatus?: number
  /**    公告类型 */
  noticeType?: string
  /** 排序字段 example: field */
  orderField?: string

  /** 排序字段类型 example: desc */
  orderFieldType?: string

  /** 页码 example: 1 */
  page?: number

  /** 页面条数 example: 10 */
  pageSize?: number

  /**    阅读计数 */
  readCount?: number
  /**    生效时间 */
  takeEffectTime?: string
  /**    公告标题 */
  title?: string
  /**    接收对象 */
  userId?: string
}

const STATUS = {
  0: '不公开',
  1: '公开',
}

/** 首页列表分页 */
function noticeOpenList(parms: any) {
  return post(API.noticeOpenList, parms)
}

/** 首页查询公告详情 */
function noticeDetail(parms: any) {
  return get(API.noticeDetail, parms)
}

/** 列表分页 */
function noticeList(parms: any) {
  return post(API.noticeList, parms)
}

/** 查询公告详情 */

function noticeInfo(parms: any) {
  return get(API.noticeInfo, parms)
}

/** 保存公告 */
function noticeSave(parms: any) {
  return post(API.noticeSave, parms)
}

/** 修改公告 */
function noticeEdit(parms: any) {
  return post(API.noticeEdit, parms)
}

/** 删除公告 */
function noticeDel(parms: any) {
  return post(API.noticeDel, parms)
}

// 接收对象
function listCustomer(parms: any) {
  return get(API.listCustomer, parms)
}

// 客户最新公告列表
function customerNoticeList(parms: any) {
  return post(API.customerNoticeList, parms)
}

// 销售最新公告列表
function sellList(parms: any) {
  return post(API.sellList, parms)
}

// 收藏
function Mark(parms: any) {
  return post(API.Mark, parms)
}

// 取消收藏
function cancelMark(parms: any) {
  return post(API.cancelMark, parms)
}

// 公告信息详情
function getNoticeByExaminationId(parms: any) {
  return post(API.getNoticeByExaminationId, parms)
}

// 客户信息详情
function CustomerNoticeById(parms: any) {
  return get(API.CustomerNoticeById, parms)
}

// 云服务商最新
function cloudServiceList(parms: any) {
  return post(API.cloudServiceList, parms)
}

// 根据公告id查询关联工单信息 -- 用户
function customWorkOrder(parms: any) {
  return get(API.customWorkOrder, parms)
}
// 根据公告id查询关联工单信息 -- 运维
function optWorkOrder(parms: any) {
  return get(API.optWorkOrder, parms)
}

export {
  noticeOpenList,
  noticeDetail,
  noticeList,
  noticeInfo,
  noticeSave,
  noticeEdit,
  noticeDel,
  listCustomer,
  customerNoticeList,
  sellList,
  Mark,
  cancelMark,
  getNoticeByExaminationId,
  CustomerNoticeById,
  cloudServiceList,
  customWorkOrder,
  optWorkOrder,
  STATUS,
}
