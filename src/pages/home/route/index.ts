/** 路由配置 */
import { RouterOptions } from 'vue-router'

import CONF, { SPA } from '@/config'
import CONFIG from '@home/config'
import { MODULE } from '@/enums/module'
import * as modules from '@home/views'
import { order } from '@/views'

export default {
  mode: CONF.mode,
  base: CONFIG.base,
  meta: {
    /** 网站标题 */
    name: process.env.APP_NAME,
    /** 菜单默认图标 */
    // icon: '',
  },
  /** 滚动行为, 仅<body>, 不能处理指定元素的滚动 */
  scrollBehavior(to, from, savedPosition) {
    return !to.meta.parent && (to.hash ? { selector: to.hash } : savedPosition)
  },
  routes: [
    modules.main({ id: MODULE.main }),
    modules.department({ id: MODULE.department }),
    modules.role({ id: MODULE.role }),
    modules.user({ id: MODULE.user }),
    modules.menu({ id: MODULE.menu }),
    modules.auth({ id: MODULE.auth }),
    modules.approve({ id: MODULE.approve }),
    modules.notice({ id: MODULE.notice }),
    modules.workorder({ id: MODULE.workorder }),
    order({ id: MODULE.order }),
    modules.product({ id: MODULE.product }),
    modules.serve({ id: MODULE.serve }),
    modules.warning({ id: MODULE.warning }),
    modules.supplier({ id: MODULE.supplier }),
    modules.securityLog({ id: MODULE.securityLog }),
    modules.client({ id: MODULE.client }),
    modules.noticeCenter({ id: MODULE.noticeCenter }),
    modules.systemLog({ id: MODULE.systemLog }),
    modules.code({ id: MODULE.code }),
    modules.property({ id: MODULE.property }),
    modules.appAsset({ id: MODULE.appAsset }),
    modules.facility({ id: MODULE.facility }),
    modules.requirement({ id: MODULE.requirement }),
    modules.placeOrder({ id: MODULE.placeOrder }),
    modules.report({ id: MODULE.report }),
    modules.vulnerTask({ id: MODULE.vulnerTask }),
    modules.securityServe({ id: MODULE.securityServe }),
    modules.safetyAsset({ id: MODULE.safetyAsset }),
    modules.userOverview({ id: MODULE.userOverview }),
    modules.securityReport({ id: MODULE.securityReport }),
    modules.data({ id: MODULE.data }),
    modules.law({ id: MODULE.law }),
    modules.risk({ id: MODULE.risk }),
    modules.knowledge({ id: MODULE.knowledge }),
    modules.security({ id: MODULE.security }),
    modules.securityWarning({ id: MODULE.securityWarning }),
    modules.noticeManage({ id: MODULE.noticeManage }),
    modules.organization({ id: MODULE.organization }),
    modules.userManage({ id: MODULE.userManage }),
    modules.securityIncident({ id: MODULE.securityIncident }),
    modules.assetsManage({ id: MODULE.assetsManage }),
    modules.assetsOverview({ id: MODULE.assetsOverview }),
    modules.taskManagement({ id: MODULE.taskManagement }),
    modules.roleOverview({ id: MODULE.roleOverview }),
    modules.reportManage({ id: MODULE.reportManage }),
    modules.leaderTaskOverview({ id: MODULE.leaderTaskOverview }),
    modules.threatNotification({ id: MODULE.threatNotification }),
    modules.operationFrontier({ id: MODULE.operationFrontier }),
    modules.operationManagement({ id: MODULE.operationManagement }),
    modules.organizational({ id: MODULE.organizational }),
    modules.assetsInfo({ id: MODULE.assetsInfo, alive: 600000 }),
    modules.assetsRelation({ id: MODULE.assetsRelation }),
    modules.assetsType({ id: MODULE.assetsType }),
    modules.assetsProbe({ id: MODULE.assetsProbe }),
    modules.overview({ id: MODULE.overview }),
    modules.assetDiscoveryTask({ id: MODULE.assetDiscoveryTask }),
    modules.hostIgnored({ id: MODULE.hostIgnored }),
    // 服务商城子站跳转
    {
      meta: { id: SPA.mall },
      redirect() {
        CONF.g(SPA.mall)
      },
    },
  ],
} as RouterOptions
