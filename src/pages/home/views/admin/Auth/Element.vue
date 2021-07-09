<!-- 元素权限 -->
<template>
  <IAuth
    ele
    :query="query"
    :head="head"
  />
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import IAuth from './Auth'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: 事件说明 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { query: { type: Object, required: true } },
  components: { IAuth },
  computed: {
    head: () => [
      { prop: 'description', label: '描述' },
      { prop: 'elementCode', label: '码值' },
    ],
  },
}
</script>
