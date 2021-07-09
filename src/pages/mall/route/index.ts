/** 路由配置 */
import { RouterOptions } from 'vue-router'

import CONF, { SPA } from '@/config'
import CONFIG from '@mall/config'
import { MODULE } from '@/enums/module'
import { main, cart, cashier } from '@mall/views'

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
    main({ id: SPA.mall }),
    cart({ id: MODULE.cart }),
    cashier({ id: MODULE.cashier }),
  ],
} as RouterOptions
