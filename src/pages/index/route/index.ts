/** 路由配置 */
import { RouterOptions } from 'vue-router'

import CONF, { SPA } from '@/config'
import CONFIG from '@index/config'
import { main } from '@index/views'

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
  // scrollBehavior() {
  //   return { x: 0, y: 0 }
  // },
  routes: [main({ id: SPA.index })],
} as RouterOptions
