<!-- 安全服务类型标签 -->
<template>
  <div :class="[$style.type, $style['t' + type]]">
    {{ SERVICE_TYPE[type] }}
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import { SERVICE_TYPE } from '@/enums/mall'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { type: { type: null, required: true } },
  computed: { SERVICE_TYPE: () => SERVICE_TYPE },
}
</script>

<style lang="scss" module>
.type {
  display: inline-block;
  padding: $gapNormal / 4 $gapNormal / 2;
  color: $colorWhite;
  line-height: normal;
  border-radius: $borderRadiusSmall;
}

.t0 {
  background: linear-gradient(90deg, $colorTheme, mix($colorWhite, $colorTheme, 15%));
}

.t1 {
  background: linear-gradient(90deg, $colorDanger, mix($colorWhite, $colorDanger, 15%));
}
</style>
