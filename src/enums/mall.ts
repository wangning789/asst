/** 服务类型 */
export const enum ServiceType {
  /** 自营 */
  selfOperate = 0,
  /** 统采 */
  centralPurchase = 1,
}
/** 服务类型字典 */
export const SERVICE_TYPE: { [key in ServiceType]: string } = {
  [ServiceType.selfOperate]: '自营产品',
  [ServiceType.centralPurchase]: '统采产品',
}

/** 获取类型图标名 */
export function getIcon(type: ServiceType) {
  switch (type) {
    case ServiceType.selfOperate:
      return 'i-ziyingchanpin1'
    case ServiceType.centralPurchase:
      return 'i-tongcaichanpin1'
  }
}
