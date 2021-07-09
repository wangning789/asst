<!-- 兄弟菜单导航(没兄弟的显示父级) -->
<template>
  <IMenu
    v-if="MENU.children && MENU.children.length"
    :home="home"
    :data="MENU"
    mode="horizontal"
    :common-txt-color="COLOR.colorTransparentWhite"
    :class="STYLE.menu + ' ' + $style.menu"
  />
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import IMenu from './Menu'

import { siblings, AUTH } from '@/functions/auth'
import STYLE from './menu.module.scss'
import COLOR from '@/scss/export/color.scss'

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
    COLOR: () => COLOR,
    MENU() {
      return {
        children: AUTH.children,
      }
      // return this.siblings(this.$route?.meta?.id)
    },
  },
  methods: {
    siblings(id?: string) {
      return this.$_id === id
        ? this.$_data || (this.$_data = {})
        : (this.$_data = { children: siblings((this.$_id = id)) })
    },
  },
}
</script>

<style lang="scss" module>
.menu {
  width: 100%;
  max-width: calc(100% - 600px);
  overflow: auto;
  white-space: nowrap;
  border-bottom: none !important;
}
</style>>
