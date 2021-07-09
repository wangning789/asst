<!-- 顶栏 -->
<template>
  <ElHeader
    style="padding: 0;"
    :class="$style.wrapper"
  >
    <ILogo
      :home="home"
      :class="$style.ib"
    />
    <!-- <ITitle :class="[$style.ib, $style.ml]" /> -->
    <!-- <INav
      :home="home"
      :class="[$style.ib, $style.ml2]"
    /> -->

    <IBar
      :home="home"
      :class="[$style.ib, $style.ml, $style.fr]"
    />
  </ElHeader>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElHeader from 'element-ui/lib/header'

import ILogo from './Logo'
// import ITitle from './Title'
// import INav from './Nav'
import IBar from './Bar'
/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: 事件说明 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { home: { type: String, default: '' } },
  components: { ElHeader, ILogo, IBar },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/header';
</style>

<style lang="scss" module>
.wrapper {
  width: 100%;
  height: $heightHeader !important;
  margin: 0;
  padding: 0;
  background: #233141;
}

.ib {
  display: inline-block;
  vertical-align: middle;
}

.ml {
  margin-left: $gapNormal / 2;
}

.ml2 {
  margin-left: $gapNormal !important;
}

.fr {
  float: right;
}
</style>
