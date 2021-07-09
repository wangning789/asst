/** 路由配置 */
import { RouterOptions } from 'vue-router'

import CONF, { SPA } from '@/config'
import CONFIG from '@help/config'
import { main } from '@help/views'

export default {
  mode: CONF.mode,
  base: CONFIG.base,
  meta: { name: process.env.APP_NAME },
  /** 滚动行为, 仅<body>, 不能处理指定元素的滚动 */
  scrollBehavior(to, from, savedPosition) {
    return !to.meta.parent && (to.hash ? { selector: to.hash } : savedPosition)
  },
  routes: [main({ id: SPA.help })],
} as RouterOptions
