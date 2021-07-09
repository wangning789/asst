import { ChildInfo } from '@/functions/auth'
import { SPA } from '@/config'

/** 模块【唯一】【固定】标识 【不能与SPA重复】
 *    62进制: 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
 */
export const enum MODULE {
    /** 导航 */
    main = '0',
    /** 部门管理 */
    department = '1',
    /** 角色管理 */
    role = '2',
    /** 人员管理 */
    user = '3',
    /** 菜单管理 */
    menu = '4',
    /** 权限管理 */
    auth = '5',
    /** 审批管理 */
    approve = '6',
    /** 公告管理 */
    notice = '7',
    /** 工单管理 */
    workorder = '8',
    /** 订单管理 */
    order = '9',
    /** 产品管理 */
    product = 'a',
    /** 服务管理 */
    serve = 'b',
    /** 告警管理 */
    warning = 'c',
    /** 供应商管理 */
    supplier = 'd',
    /** 安全日志 */
    securityLog = 'e',
    /** 客户管理 */
    client = 'f',
    /** 公告中心 */
    noticeCenter = 'g',
    /** 购物车 */
    cart = 'h',
    /** 收银台 */
    cashier = 'i',
    /** 系统日志 */
    systemLog = 'j',
    /** 码表管理 */
    code = 'k',
    /** 服务资产 */
    property = 'l',
    /** 设备管理 */
    facility = 'm',
    /** 采购记录 */
    requirement = 'n',
    /** 安全报表 */
    report = 'o',
    /** 知识库维护管理 */
    knowledge = 'p',
    /** 安全报表 */
    securityReport = 'q',
    /** 学习资料 */
    data = 'r',
    /** 法律法规 */
    law = 's',
    /** 风险预警 */
    risk = 't',
    /** 安全资讯 */
    security = 'u',
    /** 安全资产 */
    safetyAsset = 'v',
    /** 系统资产 */
    appAsset = 'w',
    /**  用户概览  */
    userOverview = 'x',
    /**  安全服务管理  */
    securityServe = 'y',
    /** 安全终端管理 */
    vulnerTask = 'z',
    /** 安全告警 */
    securityWarning = 'A',
    /** 采购下单 */
    placeOrder = 'B',
    /** 通报管理 */
    noticeManage = 'C',
    /** 组织机构管理 */
    organization = 'D',
    /** 用户管理 */
    userManage = 'E',
    /** 安全事件 */
    securityIncident = 'F',
    /** 资产管理 */
    assetsManage = 'G',
    /** 资产概览 */
    assetsOverview = 'H',
    /** 任务管理 */
    taskManagement = 'I',
    /** 概览 */
    roleOverview = 'J',
    /** 报告管理 */
    reportManage = 'K',
    /** 任务概况 */
    leaderTaskOverview = 'L',
    /** 威胁情报 */
    threatNotification='S',
    /** 日常巡检 */
    operationFrontier='T',
    /** 巡检任务管理 */
    operationManagement='U',
    /** 组织架构 */
    organizational='V',
    /** 资产关系管理 */
    assetsRelation='W',
    /** 资产信息 */
    assetsInfo='N',
    /** 资产类型管理 */
    assetsType='X',
    /** 资产针孔管理 */
    assetsProbe='Y',
    /** 概览 */
    overview='Z',
    /** 资产发现任务 */
    assetDiscoveryTask = '01',
    /** 已忽略主机 */
    hostIgnored = '02',
}

type ModuleDictionary = { [key in MODULE]: string } & { [key in SPA]?: string }

/** 模块字典 */
export const MODULES: ModuleDictionary = {
  [SPA.mall]: '服务商城',
  [MODULE.main]: '导航',
  [MODULE.department]: '部门管理',
  [MODULE.role]: '角色管理',
  [MODULE.user]: '人员管理',
  [MODULE.menu]: '菜单管理',
  [MODULE.auth]: '权限管理',
  [MODULE.approve]: '审批管理',
  [MODULE.notice]: '公告管理',
  [MODULE.workorder]: '工单管理',
  [MODULE.order]: '订单管理',
  [MODULE.product]: '产品管理',
  [MODULE.serve]: '服务管理',
  [MODULE.warning]: '告警管理',
  [MODULE.supplier]: '供应商管理',
  [MODULE.securityLog]: '安全日志',
  [MODULE.client]: '客户管理',
  [MODULE.noticeCenter]: '公告中心',
  [MODULE.cart]: '购物车',
  [MODULE.cashier]: '收银台',
  [MODULE.systemLog]: '系统日志',
  [MODULE.code]: '码表管理',
  [MODULE.property]: '服务资产',
  [MODULE.appAsset]: '系统资产',
  [MODULE.facility]: '安全设备',
  [MODULE.code]: '码表管理',
  [MODULE.requirement]: '采购记录',
  [MODULE.report]: '安全终端管理',
  [MODULE.safetyAsset]: '安全资产',
  [MODULE.userOverview]: '用户概览',
  [MODULE.securityServe]: '安全服务管理',
  [MODULE.vulnerTask]: '漏洞任务管理',
  [MODULE.knowledge]: '标准指南',
  [MODULE.securityReport]: '安全报表',
  [MODULE.data]: '学习资料',
  [MODULE.law]: '法律法规',
  [MODULE.risk]: '风险预警',
  [MODULE.security]: '安全资讯',
  [MODULE.securityWarning]: '安全告警',
  [MODULE.placeOrder]: '采购下单',
  [MODULE.noticeManage]: '通报管理',
  [MODULE.organization]: '组织机构管理',
  [MODULE.userManage]: '用户管理',
  [MODULE.securityIncident]: '安全事件',
  [MODULE.assetsManage]: '资产管理',
  [MODULE.assetsOverview]: '资产概览',
  [MODULE.taskManagement]: '任务管理',
  [MODULE.roleOverview]: '概览',
  [MODULE.reportManage]: '报告管理',
  [MODULE.leaderTaskOverview]: '任务概况',
  [MODULE.threatNotification]: '威胁情报',
  [MODULE.operationFrontier]: '日常巡检',
  [MODULE.operationManagement]: '巡检任务管理',
  [MODULE.organizational]: '组织架构',
  [MODULE.assetsRelation]: '资产关系管理',
  [MODULE.assetsInfo]: '资产信息',
  [MODULE.assetsType]: '资产类型管理',
  [MODULE.assetsProbe]: '资产探针管理',
  [MODULE.overview]: '概览',
  [MODULE.assetDiscoveryTask]: '资产发现任务',
  [MODULE.hostIgnored]: '已忽略主机',
}

/** 下级模块字典(仅供菜单管理编辑用), 与下级页面(children数组)一一对应(从后往前匹配), 支持嵌套 */
export const SUB_MODULES: { [key in MODULE]?: ChildInfo[] } = {
  [MODULE.department]: [
    { title: '创建部门' },
    { title: '部门详情' },
    { title: '编辑部门' },
  ],
  [MODULE.user]: [
    { title: '增加用户' },
    { title: '编辑用户' },
    { title: '用户详情' },
  ],
  [MODULE.workorder]: [{ title: '工单列表' }],
  [MODULE.order]: [{ title: '订单列表' }],
  [MODULE.product]: [
    { title: '新增产品' },
    { title: '产品详情' },
    { title: '编辑产品' },
  ],
  [MODULE.serve]: [
    { title: '新建服务' },
    { title: '服务详情' },
    { title: '编辑服务' },
  ],
  [MODULE.notice]: [
    { title: '新增公告' },
    { title: '公告详情' },
    { title: '编辑公告' },
  ],
  [MODULE.approve]: [{ title: '审批详情' }],
  [MODULE.warning]: [{ title: '告警详情' }, { title: '升级为安全事件' }],
  [MODULE.supplier]: [{ title: '供应商详情' }, { title: '编辑供应商' }],
  [MODULE.securityLog]: [{ title: '安全日志详情' }],
  [MODULE.client]: [
    { title: '新增客户' },
    { title: '客户详情' },
    { title: '编辑客户' },
  ],
  [MODULE.noticeCenter]: [{ title: '公告详情' }],
  [MODULE.systemLog]: [{ title: '查看日志' }],
  [MODULE.code]: [{ title: '码表管理' }],
  [MODULE.property]: [{ title: '资产详情' }],
  [MODULE.appAsset]: [{ title: '资产详情' }],
  [MODULE.facility]: [{ title: '安全设备' }],
  [MODULE.safetyAsset]: [{ title: '安全资产' }],
  [MODULE.knowledge]: [{ title: '标准指南' }, { title: '法律法规' }, { title: '学习资料' }, { title: '安全资讯' }, { title: '风险预警' }],
}
