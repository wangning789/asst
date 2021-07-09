/** 展示布局 */
import { CreateElement, VNode } from 'vue'
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import Info from '@com/Info'

import { sleep } from '@/libs/vue'
import { throttle } from '@/utils/performance'
import { render } from '@/grid/functions'

import STYLE from '@/grid/components/scss/grid.module.scss?skin='

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
let empty: VNode

/** emit: 事件说明 */
export default sleep({
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  // data: responsiveLayout | layout
  props: { data: { type: Object, required: true }, width: { type: Number } },
  data() {
    return { i: 0 } // i: for 窗口尺寸变化
  },
  computed: {
    info(this: any) {
      this.i // eslint-disable-line no-unused-expressions
      return render(this.data, this.width)
    },
    update(this: any) {
      return throttle(() => {
        this.i++
      }, 250)
    },
  },
  created(this: any) {
    window.addEventListener('resize', this.update)
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('resize', this.update)
    })
  },
  // see: https://github.com/vuejs/jsx
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(this: any, h: CreateElement) {
    const info = this.info as ReturnType<typeof render>
    empty || (empty = <Info icon="i-zanwushuju" type="info" msg="empty" retry="" />)

    // TODO: props:provide/inject; 事件及事件广播

    return (
      <div class={STYLE.grid} style={info.style}>
        {info.cells.length
          ? info.cells.map((cell, index) => {
            const Comp: any = cell.is
            return (
              <div key={index} class={STYLE.cell} style={cell.style}>
                {Comp ? <Comp {...cell.data} /> : empty}
              </div>
            )
          })
          : empty}
      </div>
    )
  },
})
