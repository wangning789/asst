/** 用户管理 */
import { trim } from '@/pipe'
import CONFIG, { SPA } from '@/config'
import { local } from '@/utils/storage'
import { get as getCookie } from '@/utils/cookie'
import { STORAGE, AUTH, API_CODE } from '@/enums'
import { setHEAD, get, post, put } from '@/utils/ajax'
import { rebuild, encode, encrypt, pwd } from '@/functions/auth'

import { userMenuTree } from './menu'
import { Role } from './role'

export const enum API {
  /** 用户登录 */
  login = 'auth-server/login',
  /** 用户注销登录 */
  logout = 'auth-server/logout',
  /** 查询当前登录的用户信息 */
  info = 'auth-server/user/info',
  /** 用户修改自己的信息 */
  edit = 'auth-server/user/updateSelfInfo',

  /** 修改密码 */
  modifyPassword = 'auth-server/user/modifyPassword',
  /** 超管重置密码 */
  resetPassword = 'auth-server/user/superAdminResetUserPassword',
  /** 查询所有用户 */
  all = 'auth-server/user/listUser',
  /** 普通用户查询用户分页 */
  cPage = 'auth-server/user/listUserPageForCommonUser',
  /** 超管查询用户分页 */
  saPage = 'auth-server/user/listUserPageForSuperAdmin',
  /** 系统管理员查询用户分页 */
  aPage = 'auth-server/user/listUserPageForSystemAdmin',

  /** 普通用户新增用户 */
  cAdd = 'auth-server/user/commonUserAddUser',
  /** 超管新增用户 */
  saAdd = 'auth-server/user/superAdminAddUser',
  /** 管理员新增用户 */
  aAdd = 'auth-server/user/systemAdminAddUser',

  /** 普通用户删除用户 */
  cDel = 'auth-server/user/commonUserDeleteUser',
  /** 超管删除用户 */
  saDel = 'auth-server/user/superAdminDeleteUser',
  /** 管理员删除用户 */
  aDel = 'auth-server/user/systemAdminDeleteUser',

  /** 普通用户修改用户 */
  cUpdate = 'auth-server/user/commonUserUpdateUser',
  /** 超管修改用户 */
  saUpdate = 'auth-server/user/superAdminUpdateUser',
  /** 管理员修改用户 */
  aUpdate = 'auth-server/user/systemAdminUpdateUser',

  /** 普通用户查询用户详情 */
  cInfo = 'auth-server/user/UserInfoForCommonUser',
  /** 超管查询用户详情 */
  saInfo = 'auth-server/user/UserInfoForSuperAdmin',
  /** 系统管理员查询用户详情 */
  aInfo = 'auth-server/user/UserInfoForSystemAdmin',

  /** 超管激活用户 */
  enable = 'auth-server/user/superAdminEnableUser',
  /** 超管反激活用户 */
  disable = 'auth-server/user/superAdminDisableUser',

  /** 超管解锁用户 */
  unlock = 'auth-server/user/superAdminUnlockUser',

  /** 获取销售负责人下拉的值(get) */
  getSellMan = 'auth-server/user/getSalesmanList',

  /** 工号验重 */
  enCheck = 'auth-server/user/employeeNumberCheck',
  /** 用户名验重 */
  unCheck = 'auth-server/user/userNameCheck',
  /** 获取验证码 */
  code = 'auth-server/validateCode/image',
}
/** 用/客户信息 */
export interface User {
  /** 账户是否锁定 */
  accountNonLocked?: number

  /** 昵称 */
  aliasName?: string

  /** 手机号 */
  cellPhone?: string

  /** */
  createDate?: string
  /** 创建者 example: uuid */
  createUser?: string

  /** 删除标识 */
  delStatus?: boolean

  /** 删除日期 example: 1970-1-1 00:00:00 */
  deleteDate?: number

  /** */
  departmentIdList?: string[]
  /** 用户的部门ID */
  departmentIds?: string

  /** 部门名称，多个用逗号隔开 */
  departmentName?: string

  /** 描述 */
  description?: string

  /** 工号 */
  employeeNumber?: string

  /** 激活状态：0：未激活、1：激活 */
  enabled?: number

  /** 主键ID example: uuid */
  id?: string

  /** */
  ids?: string[]
  /** 非法登录次数 */
  illegalLoginCount?: number

  /** 非法登录时间 */
  illegalLoginTime?: string

  /** 关键字查询 example: 关键词 */
  keyword?: string

  /** 上次登录ip */
  lastLoginIp?: string

  /** 上次登录时间 */
  lastLoginTime?: string

  /** 登录次数 */
  loginCount?: number

  /** 邮箱 */
  mailbox?: string

  /** */
  modifyDate?: string
  /** 最后修改者 example: uuid */
  modifyUser?: string

  /** 旧密码 */
  oldPassword?: string

  /** 排序字段 example: field */
  orderField?: string

  /** 排序字段类型 example: desc */
  orderFieldType?: string

  /** 页码 example: 1 */
  page?: number

  /** 页面条数 example: 10 */
  pageSize?: number

  /** 密码 */
  password?: string

  /** 头像 */
  profilePicture?: string

  /** 查询时使用的角色编码(角色；类型) */
  roleCode?: string

  /** 用户的角色ID */
  roleIds?: string

  /** 系统管理员查询用的角色等级 */
  roleLevel?: number

  /** */
  roleList?: Role[]
  /** 角色名称，多个用逗号隔开 */
  roleName?: string

  /** 用户身份 */
  userIdentity: ''
  /** 用户单位 */
  departmentId: ''

  /** 用户单位 */
  organizationId: ''

  /** 用户名 */
  username?: string

  /** 微信 */
  wechat?: string
}
/** 登录表单 */
export interface Login {
  username: string
  password: string
  imageCode?: string
  systemCode?: string
}

/** 登录 */
async function login(form: Login, encrypted?: boolean) {
  encrypted || (form = encrypt(form))
  const resLogin = await post(
    API.login,
    `username=${form.username}&password=${form.password}&imageCode=${form.imageCode}&systemCode=${form.systemCode}`
  )
  setHEAD(AUTH.head, getCookie(AUTH.cookie), true)

  const userInfo = trim((await info()).data.body as User, true)
  if (resLogin.data.code === API_CODE.MODIFY_PASSWORD) {
    return userInfo
  }
  // console.log(STORAGE.auth, (await userMenuTree()).data.body)

  local.set(
    STORAGE.auth,
    rebuild((await userMenuTree()).data.body),
    encode,
    CONFIG.tokenAlive
  )
  local.set(STORAGE.me, userInfo, encode, CONFIG.tokenAlive)
  return (cb?: (form: Login) => any) => {
    cb && cb(form)
    CONFIG.g(SPA.home)
  }
}
/** 注销 */
function logout() {
  return post(API.logout)
}
/** 查询当前登录的用户信息 */
function info() {
  return get(API.info)
}
/** 用户修改自己的信息 */
function edit(user: User) {
  return post(API.edit, user)
}

/** 修改密码 */
function modify(
  id: string,
  username: string,
  oldPassword: string,
  password: string
) {
  username = username.trim()
  return put(API.modifyPassword, {
    id,
    username,
    oldPassword: pwd(oldPassword.trim(), username),
    password: pwd(password.trim(), username),
  })
}
/** 重置密码 */
function reset(id: string, username: string, password: string) {
  return post(API.resetPassword, {
    id,
    password: pwd(password.trim(), username.trim()),
  })
}

/** 普通用户查询用户分页 */
function cPage(params: User, noCache?: boolean) {
  return post(API.cPage, params, null, { noCache: !!noCache })
}
/** 超管查询用户分页 */
function saPage(params: User, noCache?: boolean) {
  return post(API.saPage, params, null, { noCache: !!noCache })
}
/** 系统管理员查询用户分页 */
function aPage(params: User, noCache?: boolean) {
  return post(API.aPage, params, null, { noCache: !!noCache })
}

/** 普通用户新增用户 */
function cAdd(params: User) {
  return post(API.cAdd, { ...params, ...encrypt(params as Login) })
}
/** 超管新增用户 */
function saAdd(params: User) {
  return post(API.saAdd, { ...params, ...encrypt(params as Login) })
}
/** 管理员新增用户 */
function aAdd(params: User) {
  return post(API.aAdd, { ...params, ...encrypt(params as Login) })
}

/** 普通用户删除用户 */
function cDel(userId: string) {
  return post(API.cDel, null, { userId })
}
/** 超管删除用户 */
function saDel(userId: string) {
  return post(API.saDel, null, { userId })
}
/** 管理员删除用户 */
function aDel(userId: string) {
  return post(API.aDel, null, { userId })
}

/** 普通用户修改用户 */
function cUpdate(params: User) {
  return post(API.cUpdate, params)
}
/** 超管修改用户 */
function saUpdate(params: User) {
  return post(API.saUpdate, params)
}
/** 管理员修改用户 */
function aUpdate(params: User) {
  return post(API.aUpdate, params)
}

/** 普通用户查询用户详情 */
function cInfo(userId: string, noCache?: boolean) {
  return get(API.cInfo, { userId }, { noCache })
}
/** 超管查询用户详情 */
function saInfo(userId: string, noCache?: boolean) {
  return get(API.saInfo, { userId }, { noCache })
}
/** 系统管理员查询用户详情 */
function aInfo(userId: string, noCache?: boolean) {
  return get(API.aInfo, { userId }, { noCache })
}
/** 获取所有用户 */
function allUser(noCache?: boolean) {
  return get(API.all, {}, { noCache })
}

/** 超管激活用户 */
function enable(userId: string) {
  return post(API.enable, null, { userId })
}
/** 超管反激活用户 */
function disable(userId: string) {
  return post(API.disable, null, { userId })
}

/** 超管解锁用户 */
function unlock(userId: string) {
  return post(API.unlock, null, { userId })
}

/** 获取销售负责人下拉的值 */
function getSellMan() {
  return get(API.getSellMan)
}

/** 工号验重 */
function enCheck(employeeNumber: string, userId?: string) {
  return get(API.enCheck, { employeeNumber, userId })
}
/** 用户名验重 */
function unCheck(userName: string, userId?: string) {
  return get(API.unCheck, { userName, userId })
}

export {
  login,
  logout,
  info,
  edit,
  modify,
  reset,
  cPage,
  saPage,
  aPage,
  cAdd,
  saAdd,
  aAdd,
  cDel,
  saDel,
  aDel,
  cUpdate,
  saUpdate,
  aUpdate,
  cInfo,
  saInfo,
  aInfo,
  enable,
  disable,
  unlock,
  allUser,
  getSellMan,
  enCheck,
  unCheck,
}
