/** 当前登陆用户信息 */
import Vue from 'vue'

import { trim } from '@/pipe'
import { STORAGE } from '@/enums'
import { isEqual } from '@/utils'
import clone from '@/utils/clone'
import { local } from '@/utils/storage'
import { User } from '@/api/authServer/user'
import { encode, decode } from '@/functions/cipher'

const info = local.get(STORAGE.me, decode) as User
/** 当前登陆用户信息 */
const observedInfo = Vue.observable(clone(info))
/** 获取当前登陆用户信息拷贝 */
const copy = () => clone(info)

/** 关闭窗口前写入本地 */
window.addEventListener('beforeunload', () => {
  isEqual(info, observedInfo) ||
    local.set(STORAGE.me, trim(observedInfo, true), encode)
})

export { observedInfo as default, copy }
