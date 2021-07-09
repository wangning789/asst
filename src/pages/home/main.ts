/*
 * @Description: 页面入口
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 */
import checkLogin from '@/functions/checkLogin' // 未登录尽快跳转
import router from './router'
import store from './store'
import App from './App'
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import CONF, { SPA } from '@/config'
import CONFIG from './config'
import mount from '@/functions/main'
import { setBase } from '@/utils/ajax'

Vue.use(ElementUI)

setBase(CONFIG.baseUrl)
Object.assign(CONF, CONFIG)
checkLogin(() => {
  mount(SPA.home, App, router, store)
})
