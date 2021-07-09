<!-- 描述 -->
<template>
  <div :class="$style.wrapper">
    <div
      v-for="(item,i) of data"
      :key="i"
    >
      {{ i }}
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module

import COLOR from '@/scss/export/color.scss'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  computed: {
    defaultColor() {
      return COLOR
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  text-align: center;
}
</style>
