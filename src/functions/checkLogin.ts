// 检查是否登录
import CONFIG from '@/config'
import { STORAGE, AUTH } from '@/enums'
import { setHEAD } from '@/utils/ajax'
import { local } from '@/utils/storage'
import { get } from '@/utils/cookie'
import { decode } from '@/functions/cipher'

const token = get(AUTH.cookie)
token && local.get(STORAGE.me, decode)
  ? setHEAD(AUTH.head, token, true)
  : CONFIG.g()

/** 检查是否登录 */
export default (cb: () => any) => {
  cb()
}
