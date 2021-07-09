/** 下级页面信息编辑 */
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import { CreateElement } from 'vue'
import { MODULE, SUB_MODULES } from '@/enums/module'
import { trim, Rule } from '@/pipe'
import { ChildInfo } from '@/functions/auth'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
type info = { des: string; title: string; child: info[] }
function mergeTree(info: ChildInfo[] | undefined, module: ChildInfo[]): info[] {
  info || (info = [])
  const result: info[] = []
  let len = module.length
  let subInfo
  let subModule
  while (len--) {
    subInfo = info[len]
    subModule = module[len]
    result[len] = {
      des: subModule.title,
      title: (subInfo && subInfo.title) || '',
      child: subModule.child
        ? mergeTree(subInfo && subInfo.child, subModule.child)
        : [],
    }
  }
  return result
}
const rule: Rule = { des: 1, child: v => v && v.length && { k: 'child', v } }

/** 可通过 v-model 绑定
 * emit: (事件名: [参数列表, ...])
 *  input: [info: 下级页面信息]
 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    value: { type: String, default: '' },
    disabled: { type: Boolean },
    id: { type: String, default: '' },
  },
  computed: {
    info(this: any) {
      const modules = SUB_MODULES[this.id as MODULE]
      if (!modules || !modules.length) {
        return []
      }

      let info
      try {
        info = JSON.parse(this.value)
      } catch (error) {}

      info = mergeTree(info, modules)
      return info
    },
  },
  // see: https://github.com/vuejs/jsx
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(this: any, h: CreateElement) {
    const info = this.info as info[]
    if (!info.length) {
      return <span>无</span>
    }

    const rendFormItem = (subInfo: info, index: number) => (
      <el-form-item key={index} label="标题" label-width="40px">
        <el-input
          value={subInfo.title}
          placeholder={subInfo.des}
          on={{
            input: (value: string) => {
              subInfo.title = value
              this.$emit(
                'input',
                JSON.stringify(trim(info, rule, 'black', true))
              )
            },
          }}
        ></el-input>
        {subInfo.child.map(rendFormItem)}
      </el-form-item>
    )

    return (
      <el-form-item disabled={this.disabled}>
        {info.map(rendFormItem)}
      </el-form-item>
    )
  },
}
