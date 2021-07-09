/*
 * @Description: 页面入口
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 */
import App from './App'

import { SPA } from '@/config'
import mount from '@/functions/main'

mount(SPA.notFind, App)
