/*
 * @Description: 页面入口
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 */
import App from './App'

import CONF, { SPA } from '@/config'
import CONFIG from './config'
import mount from '@/functions/main'
import { setBase } from '@/utils/ajax'
// import { AUTH } from '@/enums'
// import { remove } from '@/utils/cookie'

// remove(AUTH.cookie)
setBase(CONFIG.baseUrl)
Object.assign(CONF, CONFIG)
mount(SPA.login, App)
