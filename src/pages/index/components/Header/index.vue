<!-- 顶栏 -->
<template>
  <ElHeader
    :class="$style.wrapper"
  >
    <RouterLink
      :to="`/`"
    >
      <img
        src="@/assets/logo.png"
        alt="Westone · 卫士通"
        :class="$style.logo"
      >
    </RouterLink>

    <ElButton
      type="text"
      @click="goLogin"
    >
      登录
    </ElButton>
  </ElHeader>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElHeader from 'element-ui/lib/header'
import CONFIG, { SPA } from '@/config'

// import ILogo from './Logo'
// import INav from './Nav'
// import IBar from './Bar'
// import MenuIcon from './MenuIcon'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: 事件说明 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  // components: { ElHeader, ILogo, INav, IBar, MenuIcon },
  components: { ElHeader },
  methods: {
    goLogin() {
      CONFIG.g(SPA.login)
    },
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/header';
</style>

<style lang="scss" module>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: $heightHeader !important;
  margin: 0;
  padding: 0 $gapNormal * 2;
  background: $colorWhite;
}

.logo {
  width: 179px;
  height: 48px;
}
</style>
