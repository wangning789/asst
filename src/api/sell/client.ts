import { post, put, del, get } from '@/utils/ajax'
import { encrypt } from '@/functions/auth'
import { decode, encode } from '@/functions/cipher'

/** 客户管理 */
export const enum API {
  /** 新增客户(post) */
  addClient = 'service-platform/customer/add', //
  /** 分配云服务商(put) */
  allocationProvider = 'service-platform/customer/allocationProvider',
  /** 分配销售人员(put) */
  allocationSellMan = 'service-platform/customer/allocationSellMan',
  /** 联系方式判重(post) */
  sortPhone = 'service-platform/customer/checkPhone',
  /** 客户单位判重(post) */
  sortClient = 'service-platform/customer/checkDepartment',
  /** 删除客户(del) */
  delClient = 'service-platform/customer/delete', //

  /** 运营，销售经理查询所有客户统计数据(get) */
  selCountByRun = 'service-platform/customer/getCustomerCount',
  /** 云服务商查询负责客户统计数据(get) */
  selCountByProvider = 'service-platform/customer/getCustomerCountByProvider',
  /** 销售或经销商查询负责客户统计数据(get) */
  selCountBySellMan = 'service-platform/customer/getCustomerCountBySellMan',

  /** 查询客户详情(get) */
  selClientInfo = 'service-platform/customer/getCustomerInfo',

  /** 运营，销售经理查询所有客户分页(post) */
  selListByRun = 'service-platform/customer/listCustomerPage',
  /** 云服务商查询负责客户分页(post) */
  selListByProvider = 'service-platform/customer/listCustomerByProviderPage',
  /** 销售或经销商查询负责客户分页(post) */
  selListBySell = 'service-platform/customer/listCustomerBySellManPage',

  /** 修改客户(put) */
  updClient = 'service-platform/customer/modify', //
  /** 修改客户为已签约客户(put) */
  updClientSign = 'service-platform/customer/updSignStatus',

  /** 获取云服务商下拉的值(post) */
  getProvider = 'service-platform/product/getProvider',

  /** 获取相关订单列表(post) */
  getOrderList = 'service-platform/order/getOrderListLimit5',
  /** 获取相关工单列表(post) */
  getWorkOrderList = 'service-platform/workOrder/getWorkOrderByCustomer',
  /** 获取安全事件列表(post) */
  getEventList = 'service-platform/alarmWithEvent/getEventListByCustomer',
}

/** 客户管理 */
export interface ClientManagement {
  /** 开始时间 example: 1970-1-1 00:00:00 */
  beginTime?: string

  /** 客户联系人 */
  contacts?: string

  /** */
  createDate?: string
  /** 创建者 example: uuid */
  createUser?: string

  /** 客户编号 */
  customerNo?: string

  /** 删除标识 */
  delStatus?: boolean

  /** 删除日期 example: 1970-1-1 00:00:00 */
  deleteDate?: number

  /** 客户单位 */
  department?: string

  /** 结束时间 example: 1970-1-1 00:00:00 */
  endTime?: string

  /** 最近安全服务到期时间 */
  expireTime?: string

  /** 主键ID example: uuid */
  id?: string

  /** */
  ids?: string[]
  /** 是否重点客户(0：否、1：是) */
  keyStatus?: boolean

  /** 关键字查询 example: 关键词 */
  keyword?: string

  /** */
  modifyDate?: string
  /** 最后修改者 example: uuid */
  modifyUser?: string

  /** 备注 */
  note?: string

  /** 排序字段 example: field */
  orderField?: string

  /** 排序字段类型 example: desc */
  orderFieldType?: string

  /** 已签约金额 */
  orderPrice?: string

  /** 页码 example: 1 */
  page?: number

  /** 页面条数 example: 10 */
  pageSize?: number

  /** 密码 */
  password?: string

  /** 客户联系方式 */
  phone?: string

  /** 已购安全服务数 */
  productCount?: string

  /** */
  provider?: { id?: string; name?: string }[]
  /** */
  sellMan?: { id?: string; name?: string }[]
  /** 是否签约(0：否、1：是) */
  signStatus?: boolean

  /** 人员id */
  userId?: string
}

/** 新增客户 */
function addClient(data: ClientManagement) {
  const phone = data.phone as string
  const ciphered = encrypt({
    username: phone,
    password: phone.substring(phone.length - 6),
  })

  return post(API.addClient, {
    ...data,
    phone: ciphered.username,
    password: ciphered.password,
  })
}

/** 删除客户 */
function delClient(id: string) {
  return del(API.delClient, { id })
}

/** 修改客户 */
function updClient(data: ClientManagement) {
  const phone = data.phone as string
  const ciphered = encode(phone)
  return put(API.updClient, {
    ...data,
    phone: ciphered,
  })
}

/** 分配销售人员 */
function allocationSellMan(data: ClientManagement) {
  return put(API.allocationSellMan, data)
}

/** 分配云服务商 */
function allocationProvider(data: ClientManagement) {
  return put(API.allocationProvider, data)
}

/** 运营查询客户统计数据 */
function selectCountByRun() {
  return get(API.selCountByRun)
}
/** 云服务商查询统计数据 */
function selectCountByProvider() {
  return get(API.selCountByProvider)
}
/** 销售查询客户统计数据 */
function selectCountBySellMan() {
  return get(API.selCountBySellMan)
}

/** 运营查询列表 */
// function selectListByRun(data: ClientManagement) {
//   return post(API.selListByRun, data)
// }
async function selectListByRun(data: ClientManagement) {
  const res = await post(API.selListByRun, data)
  const resData = res.data.body?.data
  resData.forEach((item: any) => {
    if (item.phone) {
      try {
        item.phone = decode(item.phone)
      } catch (error) {}
    }
  })
  return res
}
/** 云服务商查询列表 */
async function selectListByProvider(data: ClientManagement) {
  const res = await post(API.selListByProvider, data)
  const resData = res.data.body?.data
  resData.forEach((item: any) => {
    if (item.phone) {
      try {
        item.phone = decode(item.phone)
      } catch (error) {}
    }
  })
  return res
}
/** 销售查询列表 */
async function selectListBySell(data: ClientManagement) {
  const res = await post(API.selListBySell, data)
  const resData = res.data.body?.data
  resData.forEach((item: any) => {
    if (item.phone) {
      try {
        item.phone = decode(item.phone)
      } catch (error) {}
    }
  })
  return res
}

/** 查询客户详情 */
async function selectClientInfo(id: string) {
  const res = await get(API.selClientInfo, { id })
  const phone = res.data.body?.phone
  if (phone) {
    try {
      res.data.body.phone = decode(phone)
    } catch (error) {}
  }
  return res
}

/** 获取销售负责人下拉的值 */
function getProvider() {
  return post(API.getProvider)
}

/** 相关订单列表查询 */
function selectOrderList(params: any) {
  return post(API.getOrderList, undefined, params)
}

/** 相关工单列表查询 */
function selectWorkOrderList(params: any) {
  return get(API.getWorkOrderList, params)
}

/** 安全事件列表查询 */
function selectEventList(params: any) {
  return get(API.getEventList, params)
}

/** 联系方式判重 */
function checkPhone(phone: string, id?: string) {
  return post(API.sortPhone, undefined, { phone: encode(phone), id })
}

/** 联系方式判重 */
function checkClient(department: string, id?: string) {
  return post(API.sortClient, undefined, { department, id })
}

export {
  addClient,
  delClient,
  updClient,
  allocationSellMan,
  allocationProvider,
  selectCountByRun,
  selectCountByProvider,
  selectCountBySellMan,
  selectListByRun,
  selectListByProvider,
  selectListBySell,
  selectClientInfo,
  getProvider,
  selectOrderList,
  selectWorkOrderList,
  selectEventList,
  checkPhone,
  checkClient,
}
