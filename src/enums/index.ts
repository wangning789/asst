/** 窗口尺寸 */
export const enum SIZE {
  xSmall = 'xs',
  small = 'sm',
  medium = 'md',
  large = 'lg',
  xLarge = 'xl',
}

/** 本地存储 */
export const enum STORAGE {
  /** 用户信息 */
  me = '`',
  /** 权限 */
  auth = '~',
  /** 偏好 */
  prefer = '!',
  /** 购物车 */
  cart = '@',
  /** 结算 */
  cashier = '#',
  /** 云平台ID */
  platform = '$',
}

/** 授权 */
export const enum AUTH {
  /** cookie字段 */
  cookie = 'XSRF-TOKEN',
  /** http head字段 */
  head = 'X-XSRF-TOKEN',
}

/** 权限注册 { 键: 描述 } */
export type Auth = { [key: string]: string }

/** 所有皮肤 */
export const enum SKIN {
  light = 'light',
}
/** 所有皮肤 */
export const SKINS = [SKIN.light]

/** 接口响应代码 */
export const enum API_CODE {
  success = 200,
  unauthorized = 401,
  error = 500,
  timeout = 'ECONNABORTED',
  /** 修改密码 */
  MODIFY_PASSWORD = 10001,
  /** 用户不存在或者密码不正确 */
  LOGIN_ERROR = 10002,
  /** 错误登录超过5次,限制登录30分钟 */
  RESTRICT_LOGIN = 10003,
  /** 密码错误 */
  PASSWORD_ERROR = 10004,
  /** 没有登录 */
  SESSION_NOT_LOGIN = 20001,
  /** 没有权限 */
  SESSION_NOT_PERMISSION = 20002,
  /** 没有CSRF或者CSRF不正确 */
  SESSION_NOT_CSRF = 20003,
  /** 网关超时 */
  GATEWAY_TIMEOUT = 20004,
  /** 服务异常 */
  SERVER_EXCEPTION = 20005,
  /** 请求异常 */
  REQUEST_EXCEPTION = 20006,
}

/** 通用权限代码 by 角色 */ // TODO 角色管理
export const enum ROLES {
  /** 管理员 */
  admin = 'ADMIN',
  /** 运维 */
  operation = 'OPERATION',
  /** 运营 */
  commercial = 'COMMERCIAL',
  /** 销售 */
  sales = 'SALES',
  /** 云服务商 */
  cloudService = 'CLOUD_SERVICE',
  /** 客户 */
  custom = 'CUSTOM',
  /** 超级管理员 */
  superAdmin = 'SUPER_ADMIN',
  /** 系统管理员 */
  systemAdmin = 'SYSTEM_ADMIN',
  /** 运维经理 */
  operationManager = 'OPERATION_MANAGER',
  /** 运维人员 */
  operationMember = 'OPERATION_MEMBER',
  /** 运营经理 */
  commercialManager = 'COMMERCIAL_MANAGER',
  /** 运营人员 */
  commercialMember = 'COMMERCIAL_MEMBER',
  /** 销售经理 */
  salesManager = 'SALES_MANAGER',
  /** 销售人员 */
  salesMember = 'SALES_MEMBER',
  /** ------- 北京角色 -------/
  /** 通报联络员 */
  communicationLLY = 'NOTIFY_COMMUNICATION_ROLE',
  /** 单位领导 */
  groupLeaders = 'PROJECT_MANAGER_ROLE',
  /** 单位安全管理员 */
  unitSO = 'UNIT_SECURITY_OPERATOR',
  /** 监测分析员 */
  monitorAnlysis = 'MONITOR_ANLYSIS',
  /** 运维管理员 */
  opertateMaintenance = 'OPERATE_MAINTENANCE',
  /** 项目经理 */
  projectManager = 'PROJECT_MANAGER',
  /** 安全专家 */
  securityExperts = 'PROJECT_SECURITY_EXPERTS',

  /** 普通用户通用权限 运营经理,销售经理,运维经理 */
  common = 'COMMON_USER',
  /** 其他 */
  other = 'OTHER',
   /** 资产管理员 */
  assetManager='ASSETMANAGER',
}
/** 通用权限代码描述 by 角色 */
export const ROLE_DES: { [key in Exclude<ROLES, ROLES.other>]: string } = {
  [ROLES.admin]: '管理员',
  [ROLES.operation]: '运维',
  [ROLES.commercial]: '运营',
  [ROLES.sales]: '销售',
  [ROLES.cloudService]: '云服务商',
  [ROLES.custom]: '客户',
  [ROLES.superAdmin]: '超级管理员',
  [ROLES.systemAdmin]: '系统管理员',
  [ROLES.operationManager]: '运维经理',
  [ROLES.operationMember]: '运维人员',
  [ROLES.commercialManager]: '运营经理',
  [ROLES.commercialMember]: '运营人员',
  [ROLES.salesManager]: '销售经理',
  [ROLES.salesMember]: '销售人员',
  [ROLES.common]: '普通用户通用权限 运营经理,销售经理,运维经理',
  [ROLES.unitSO]: '单位安全管理员',
  [ROLES.groupLeaders]: '单位领导',
  [ROLES.communicationLLY]: '通报联络员',
  [ROLES.monitorAnlysis]: '监测分析员',
  [ROLES.opertateMaintenance]: '运维管理员',
  [ROLES.projectManager]: '项目经理',
  [ROLES.securityExperts]: '安全专家',
  [ROLES.assetManager]: '资产管理员',
}
