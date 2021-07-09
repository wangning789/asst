<!-- 菜单 -->
<template>
  <IMenu
    :home="home"
    :data="MENU"
    mode="horizontal"
    :class="[STYLE.menu, $style.menu]"
    @noPath="goHome"
  />
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import IMenu from '../Menu'

import CONFIG, { SPA } from '@/config'
import { AUTH } from '@/functions/auth'

import STYLE from '../menu.module.scss'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { home: { type: String, default: '' } },
  components: { IMenu },
  computed: {
    STYLE: () => STYLE,
    MENU() {
      return {
        children: [
          {
            $: 1, // 标识
            icon: 'i-fangzicopy',
            children: AUTH.children,
          },
        ],
      }
    },
  },
  methods: {
    goHome(menu: any) {
      menu.$ && CONFIG.g(SPA.home)
    },
  },
}
</script>

<style lang="scss" module>
.menu {
  > :global(.el-submenu:hover) {
    background-color: unset !important;
  }

  > :global(.el-submenu > .el-submenu__title) {
    padding: 0 !important;
    color: unset !important;
    border: none !important;

    > :global(.el-submenu__icon-arrow) {
      margin: 0;
    }
  }
}
</style>
