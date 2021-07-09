<!-- 工具条 -->
<template>
  <div :class="$style.wrapper">
    <IWelcome :class="$style.welcome" />
    <!-- NEXT: 搜索 -->

    <ElTooltip
      v-if="refresh"
      content="刷新"
    >
      <ElLink
        icon="el-icon-refresh-left"
        :underline="false"
        @click="refresh"
      />
    </ElTooltip>

    <!-- <ElTooltip content="获取帮助">
      <ElLink
        icon="i-bangzhu"
        :underline="false"
        :href="help"
        target="_blank"
      />
    </ElTooltip> -->

    <!-- 购物车 -->
    <ElTooltip
      v-if="hasCart"
      content="购物车"
    >
      <ICart />
    </ElTooltip>

    <!-- 消息 -->
    <!-- <IMsg v-if="me.id" /> -->

    <!-- 菜单 -->
    <!-- <IMenu
      v-if="me.id"
      :home="home"
    /> -->

    <!-- 用户 -->
    <IAvatar :data="me" />
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ICart from './Cart'
import IAvatar from './Avatar'
import IWelcome from './Welcome'

import { SPA } from '@/config'
import { ROLES } from '@/enums'
import me from '@/store/user'
import { authHas } from '@/functions/auth'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { home: { type: String, default: '' } },
  components: { ICart, IAvatar, IWelcome },
  computed: {
    me: () => me,
    // help: () => CONFIG.help,
    hasCart() {
      return authHas(SPA.mall, [ROLES.custom, ROLES.cloudService, ROLES.sales])
    },
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/badge';
</style>

<style lang="scss" module>
.wrapper {
  height: 100%;

  :global(.el-link) {
    color: $colorWhite !important;
  }

  &::after {
    display: inline-block;
    height: 100%;
    vertical-align: middle;
    content: '';
  }

  > * {
    display: inline-block;
    margin: 0 $gapNormal 0 0;
    font-size: $large !important;
    vertical-align: middle;
  }

  .welcome {
    font-size: $smaller !important;
  }
}
</style>
