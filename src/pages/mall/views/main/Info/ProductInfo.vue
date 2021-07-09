<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <h3>产品详情</h3>
    <div
      :class="$style.content"
      v-html="content"
    />
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { content: { type: String, required: true } },
}
</script>

<style lang="scss" module>
.content {
  width: 100%;
  overflow: auto;
}
</style>
