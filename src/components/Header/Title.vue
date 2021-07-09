<!-- 父级标题 -->
<template>
  <h1 :class="$style.wrapper">
    {{ title }}
  </h1>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: 事件说明 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  computed: {
    title() {
      const meta = this.$route.meta
      return meta && (meta.parent?.meta?.title || meta.title)
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  margin-left: $gapNormal;
  font-weight: normal;
  font-size: $xLarge;
  line-height: 100%;
}
</style>
