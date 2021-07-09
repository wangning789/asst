import { post } from '@/utils/ajax'

export const enum API {
  /** 用户、销售服务商城列表 */
  pageCustomerAndSales = 'service-platform/SecurityServiceMarket/page',
  /** 云服务商服务商城列表 */
  pageCloudService = 'service-platform/SecurityServiceMarket/providerPage',

  /** 同步购物车 */
  syncCart = 'service-platform/SecurityServiceMarket/cart/addToShoppingCart',
  /** 获取用户的购物车列表 */
  getCart = 'service-platform/SecurityServiceMarket/cart/getShoppingCartList',

  /** 用户下单 */
  orderCustomer = 'service-platform/SecurityServiceMarket/customer/purchaseOrder',
  /** 云服务商下单（代下单） */
  orderCloudService = 'service-platform/SecurityServiceMarket/provider/purchaseOrder',
  /** 销售下单（代下单） */
  orderSales = 'service-platform/SecurityServiceMarket/salesman/purchaseOrder',
}

/** 商城分页列表筛选条件 */
export interface Filter {
  /**  租户评分平均值 */
  averageScore?: number

  /** 开始时间 example: 1970-1-1 00:00:00 */
  beginTime?: string

  /** 创建时间 */
  createDate?: string
  /** 创建者 example: uuid */
  createUser?: string

  /**  使用租户数量 */
  customerNumber?: number

  /**  删除标识 */
  delStatus?: boolean

  /** 删除时间 */
  deleteDate?: string
  /** 结束时间 example: 1970-1-1 00:00:00 */
  endTime?: string

  /** 主键ID example: uuid */
  id?: string

  ids?: string[]
  /** 关键字查询 example: 关键词 */
  keyword?: string

  /**  服务最低价格 */
  miniPrice?: number

  /** 修改事件 */
  modifyDate?: string
  /** 最后修改者 example: uuid */
  modifyUser?: string

  /** 排序字段 example: field */
  orderField?: string

  /** 排序字段类型 example: desc */
  orderFieldType?: string

  /** 页码 example: 1 */
  page?: number

  /** 页面条数 example: 10 */
  pageSize?: number

  /**  产品分类CODE */
  productsTypeCode?: string

  /**  安全服务图片 */
  serviceImageId?: string

  /**  安全服务简介 */
  serviceIntroduce?: string

  /**  安全服务标签 */
  serviceLabel?: string

  /**  安全服务名称 */
  serviceName?: string

  /**  服务类型 0-自营产品 1-统采产品 */
  serviceType?: number

  /**  安全服务版本 */
  version?: string
}

/** 产品 */
export interface Product {
  /** 购物车id example: uuid */
  cartId?: string

  /** 云平台ID example: uuid */
  cloudPlatformId?: string

  /** 云平台名字 */
  cloudPlatformName?: string

  /** 创建日期 example: 1970-1-1 00:00:00 */
  createDate?: number

  /** 创建者 example: uuid */
  createUser?: string

  /** 是否删除 example: 0 */
  delStatus?: number

  /** 删除日期 example: 1970-1-1 00:00:00 */
  deleteDate?: number

  /** 删除者 example: uuid */
  deleteUser?: string

  /** 编号 example: uuid */
  id?: string

  /** 最后修改日期 example: 1970-1-1 00:00:00 */
  modifyDate?: number

  /** 最后修改者 example: uuid */
  modifyUser?: string

  /** 产品id example: uuid */
  productId?: string

  /** 产品名 */
  productName?: string

  /** 产品单价 example: 1299 */
  productPrice?: number

  /** 产品版本 example: uuid */
  productVersion?: string

  /** 数量 example: 2 */
  quantity?: number
}
/** 购物车 */
export interface Cart {
  /** 开始时间 example: 1970-1-1 00:00:00 */
  beginTime?: string

  /** 云服务Id example: uuid */
  cloudPlatformId?: string

  createDate?: string
  /** 创建者 example: uuid */
  createUser?: string

  /** 删除标识 */
  delStatus?: boolean

  deleteDate?: string
  /** 结束时间 example: 1970-1-1 00:00:00 */
  endTime?: string

  /** 主键ID example: uuid */
  id?: string

  ids?: string[]
  /** 关键字查询 example: 关键词 */
  keyword?: string

  modifyDate?: string
  /** 最后修改者 example: uuid */
  modifyUser?: string

  /** 排序字段 example: field */
  orderField?: string

  /** 排序字段类型 example: desc */
  orderFieldType?: string

  /** 套餐ID example: uuid */
  packageId?: string

  /** 套餐名称 example: uuid */
  packageName?: string

  /** 页码 example: 1 */
  page?: number

  /** 页面条数 example: 10 */
  pageSize?: number

  /** 产品列表 */
  productDTOList?: Product[]

  /** 购买时长 example: 3 */
  purchaseDuration?: number

  /** 服务id example: uuid */
  serviceId?: string

  /** 服务名称 example: uuid */
  serviceName?: string

  /** 服务类型 0-自营产品 1-统采产品 example: uuid */
  serviceType?: number

  /** 服务版本 example: uuid */
  serviceVersion?: string

  /** 购物车状态 0-正常,1-无效 example: 0 */
  status?: number

  /** 总价 example: 1200 */
  totalAmount?: number

  /** 添加购物车用户id example: uuid */
  userId?: string
}
/** 订单 */
export interface Order {
  /** 客户名称(单位) */
  customer?: string

  /** 申请客户id */
  customerId?: string

  /** 订单联系人 */
  orderContacts?: string

  /** 订单联系人电话 */
  orderContactsPhone?: string

  /** 安全服务信息 */
  orderServiceDTOList?: {
    /** 购物车id,从购物车购买必填，直接购买不用填 example: uuid */
    cartId?: string

    /** 套餐ID example: uuid */
    packageId?: string

    /** 购买时长 example: uuid */
    purchaseDuration?: number

    /** 服务id example: uuid */
    serviceId?: string

    /** 安全服务产品信息 */
    serviceProductDTOList?: {
      /** 云平台Id example: uuid */
      cloudPlatformId?: string

      /** 云平台名称 example: uuid */
      cloudPlatformName?: string

      /** 产品id example: uuid */
      productId?: string

      /** 产品版本 example: uuid */
      productVersion?: string

      /** 数量 example: 2 */
      quantity?: number
    }[]
    /** 服务版本 example: uuid */
    serviceVersion?: string
  }[]
  /** 订单备注 */
  packageOrderRemark?: string

  /** 安全服务类型 0-自营产品 1-统采产品 */
  serviceType?: number
}

/** 用户、销售服务商城列表 */
function pageCustomerAndSales(filter: Filter, noCache?: boolean) {
  return post(API.pageCustomerAndSales, filter, null, { noCache: !!noCache })
}
/** 云服务商服务商城列表 */
function pageCloudService(filter: Filter, noCache?: boolean) {
  return post(API.pageCloudService, filter, null, { noCache: !!noCache })
}

/** 同步购物车 */
function syncCart(cart: Cart[]): Promise<{ data: { body: Cart[] } }> {
  return post(API.syncCart, cart)
}
/** 获取用户的购物车列表 */
function getCart(cart?: Cart): Promise<{ data: { body: Cart[] } }> {
  return post(API.getCart, cart || {})
}

/** 用户下单 */
function orderCustomer(order: Order[]) {
  return post(API.orderCustomer, order)
}
/** 云服务商下单（代下单） */
function orderCloudService(order: Order[]) {
  return post(API.orderCloudService, order)
}
/** 销售下单（代下单） */
function orderSales(order: Order[]) {
  return post(API.orderSales, order)
}

export {
  pageCustomerAndSales,
  pageCloudService,
  syncCart,
  getCart,
  orderCustomer,
  orderCloudService,
  orderSales,
}
