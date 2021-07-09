<!-- 评分 -->
<script lang="tsx">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import { CreateElement, RenderContext } from 'vue'
import ElRate from 'element-ui/lib/rate'

import enhanceRate from '@/libs/enhancers/rate'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

const Rate = enhanceRate(ElRate)
function generateScore(score: number) {
  return score * 2 || ''
}

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  functional: true,
  // see: https://github.com/vuejs/jsx
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(h: CreateElement, context: RenderContext) {
    const data = context.data
    const props = context.props
    const dataProps = (data.props || (data.props = {}))

    dataProps.disabled = props.disabled !== false
    props.allowHalf || (dataProps.allowHalf = true)
    props.showScore || (dataProps.showScore = true)
    props.scoreTemplate || (dataProps.scoreTemplate = generateScore)

    return <Rate {...data}>{context.children}</Rate>
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/rate';
</style>
