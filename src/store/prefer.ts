/** 偏好管理 */
import { VuexModule, Mutation } from 'vuex-module-decorators'
import { local } from '@/utils/storage'
import { set } from '@/skin'
import { STORAGE } from '@/enums'

/** 偏好管理 */
export interface IPrefer {
  /** 皮肤 */
  skin: string
}
/** 本地存储单例对象 【应确保本网站(所有html)存储键值不会冲突】 */
export interface IPREFER extends IPrefer {
  // 存储键值
  /** 自动登录 */
  remember?: boolean
}

/** 本地存储的偏好信息对象 单例, 注意key是否冲突 */
const PREFER = (local.get(STORAGE.prefer) || {}) as IPREFER

/** 偏好管理 */
class Prefer extends VuexModule implements IPrefer {
  /// State & Getter(public) ///
  skin = (PREFER.skin = set(PREFER.skin))

  /// Mutation ///
  @Mutation
  SET_SKIN(skin: string) {
    this.skin = PREFER.skin = set(skin)
  }

  /// Action ///
  /** 设置皮肤
   * @param {String} skin 皮肤名
   */
  // @Action
  // setSkin(skin: string) {
  //   this.context.commit('SKIN', skin) // 非动态模块
  //   // this.SKIN(skin) // 动态模块
  // }
}

type hook = (PREFER: IObject) => any
type hooks = (hook: hook) => void
interface IHooks extends hooks {
  _h: hook[]
}

/** 添加偏好配置写入本地前钩子
 * @param {hook} fn 钩子
 */
const hook: IHooks = (fn: hook) => {
  const hooks = hook._h
  if (!hooks.includes(fn)) {
    hooks.push(fn)
  }
}
hook._h = []

/** 关闭窗口前写入本地 */
window.addEventListener('beforeunload', () => {
  for (const fn of hook._h) {
    fn(PREFER)
  }
  local.set(STORAGE.prefer, PREFER) // 允许多个标签多个号挺好的
})

export { Prefer as default, PREFER, hook }
