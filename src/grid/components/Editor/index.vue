<!-- 编辑布局 -->
<script lang="tsx">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import { CreateElement } from 'vue'
import Wrapper from './Wrapper'

import { sleep } from '@/libs/vue'
import { throttle } from '@/utils/performance'
import { getPading, getSize, max, render, renderInfo } from '@/grid/functions'

import STYLE from '@/grid/components/scss/grid.module.scss?skin='

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
interface RditorRenderInfo extends renderInfo {
  gridStyle: string
}

/** emit: (事件名: [参数列表, ...])
 *    select: [cell: 模块信息 ]
 */
export default sleep({
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    layout: { type: Object, required: true },
    width: { type: Number },
    rows: { type: Number },
  },
  data() {
    return {
      i: 0, // for 窗口尺寸变化
      active: null,
    }
  },
  computed: {
    info(this: any) {
      this.i // eslint-disable-line no-unused-expressions
      const layout = this.layout
      const width = this.width
      const info = render(layout, width) as RditorRenderInfo
      const size = getSize(layout, width, -0.05)
      info.style = `${max(
        info.style,
        'height',
        parseFloat(size) * this.rows || 0,
        5
      )};${getPading(layout, width)}`
      info.gridStyle = `background-size:${size} ${size}`
      return info
    },
    update(this: any) {
      return throttle(() => {
        this.i++
      }, 250)
    },
    onGrid(this: any) {
      return {
        click: () => {
          this.active = null
        },
      }
    },
    onCell(this: any) {
      return {
        select: (key: number) => {
          this.active = key
          this.$emit('select', this.info.cells[key])
        },
      }
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
    const info = this.info as RditorRenderInfo

    return (
      <div class={STYLE.grid} style={info.style} on={this.onGrid}>
        <div class={this.$style.bg} style={info.gridStyle}>
          {info.cells &&
            info.cells.map((cell, index) => (
              <Wrapper
                key={index}
                cell={cell}
                active={this.active}
                class={STYLE.cell}
                style={cell.style}
                on={this.onCell}
              />
            ))}
        </div>
      </div>
    )
  },
})
</script>

<style lang="scss" module>
.bg {
  height: calc(100% - 5px);
  background-image:
    linear-gradient(
      $colorBorderLv1 $borderSolidWidth,
      $colorTransparent 0
    ),
    linear-gradient(
      90deg,
      $colorBorderLv1 $borderSolidWidth,
      $colorTransparent 0
    );
  border-right: $borderBase;
}
</style>
