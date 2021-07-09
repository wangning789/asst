<!-- 编辑包裹 -->
<script lang="tsx">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import { CreateElement, VNode } from 'vue'
import Info from '@com/Info'

import { renderInfo } from '@/grid/functions'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
let empty: VNode

/** emit: (事件名: [参数列表, ...])
 *    select: [key: 绑定key ]
 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    cell: { type: Object, required: true },
    active: { type: null as any, required: true },
  },
  computed: {
    on() {
      return {
        click: (event: MouseEvent) => {
          event.stopPropagation()
          const key = this.$vnode.key
          key === this.active || this.$emit('select', key)
        },
      }
    },
  },
  // see: https://github.com/vuejs/jsx
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(h: CreateElement) {
    const cell = this.cell as renderInfo['cells'][0]
    const Comp = cell.is as any
    const STYLE = this.$style

    return (
      <div
        class={
          STYLE.wrapper +
          (this.$vnode.key === this.active ? ' ' + STYLE.active : '')
        }
        on={this.on}
      >
        {Comp ? (
          <Comp {...cell.data} class={STYLE.cell} />
        ) : (
          empty ||
          (empty = (
            <Info icon="i-zanwushuju" type="info" msg="empty" retry="" />
          ))
        )}
      </div>
    )
  },
}
</script>

<style lang="scss" module>
.wrapper {
  cursor: pointer;

  &:hover {
    z-index: $zTop;
    box-shadow: 0 0 3px 1px $colorTheme;
  }

  &.active {
    z-index: $zTop;
    box-shadow: 0 0 5px 3px $colorTheme;
  }
}

.cell {
  pointer-events: none;
}
</style>
