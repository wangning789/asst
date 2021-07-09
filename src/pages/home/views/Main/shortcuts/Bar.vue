<!-- 工具条 -->
<template>
  <div :class="$style.wrapper">
    <h4>{{ title }}<slot /></h4>
    <RouterLink
      class="el-link el-link--primary"
      :to="to"
      :append="append"
    >
      查看更多
    </RouterLink>
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
  props: {
    title: { type: String, default: '' },
    to: { type: [String, Object], default: '' },
    append: { type: Boolean },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  margin: 0 0 $gapNormal/2 0;

  > h4 {
    display: inline-block;
    margin: 0;
    font-size: $larger;
  }

  > a {
    float: right;
    font-size: $smaller;
  }
}
</style>
