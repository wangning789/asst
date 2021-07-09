<!-- 导航 -->
<template>
  <div v-if="MENUS.length">
    <IMenu
      v-for="MENU in MENUS"
      :key="MENU.id"
      :data="MENU"
      @click="setMenu"
    />
  </div>

  <IInfo
    v-else
    type="info"
    icon="i-zanwushuju"
    msg="empty"
    retry
    :class="$style.info"
  />
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import IInfo from '@com/Info'
import IMenu from './Menu'

import { AUTH, Menu } from '@/functions/auth'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: 事件说明 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  components: { IInfo, IMenu },
  data() {
    return { menu: Object.freeze(AUTH) }
  },
  computed: {
    MENUS() {
      return ((this.menu as Menu)?.children || []).filter(menu => !menu.hide)
    },
  },
  methods: {
    setMenu(menu: Menu) {
      if (menu.path) {
        const router = this.$router
        menu.path === router.currentRoute.fullPath
          ? router.replace('/r' + menu.path)
          : router.push(menu.path)
      } else if (menu.children?.length) {
        this.menu = Object.freeze({ children: [menu] })
      }
    },
  },
}
</script>

<style lang="scss" module>
.info {
  min-height: 40vh;
}
</style>
