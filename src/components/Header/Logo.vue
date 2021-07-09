<!-- logo -->
<template>
  <div
    :class="$style.wrapper"
    @click="goHome"
  >
    <div :class="$style.logo" />
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import CONFIG, { SPA } from '@/config'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: 事件说明 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  methods: {
    goHome() {
      CONFIG.g(SPA.home)
    },
  },
}
</script>

<style lang="scss" module>
$width: 198px;
$gap: 16px;

.wrapper {
  position: relative;
  z-index: $zero;
  height: 100%;
  cursor: pointer;
}

.logo {
  width: 200px;
  height: 40px;
  margin-top: 5px;
  background: url(~@/assets/logo-small.png) 10px center no-repeat;
}
</style>
