<!-- 菜单 -->
<template>
  <div
    :class="$style.wrapper"
  >
    <IMenu
      :data="MENU"
      :class="[STYLE.menu]"
      @noPath="goHome"
      @path="getPath"
    />
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import IMenu from './Menu'

import CONFIG, { SPA } from '@/config'
import { AUTH } from '@/functions/auth'

import { on } from '@/utils/eventBus'

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
  data() {
    return {
      showSide: false,
      navList: [], // 匹配到的菜单
    }
  },
  computed: {
    STYLE: () => STYLE,
    COLOR: () => COLOR,
    MENU() {
      return {
        children: AUTH.children,
      }
    },
  },
  methods: {
    goHome(menu: any) {
      menu.$ && CONFIG.g(SPA.home)
    },
    getPath(menu: any) {
      this.navList = []
      if (menu.id) {
        this.findTree(this.MENU.children, menu.id)
      }
      this.$emit('setNavList', this.navList)
    },
    // 根据id拿name
    findTree(arr, id) {
      for (let index = 0; index < arr.length; index++) {
        const item = arr[index]
        if (item.id === id) {
          this.findTreeByName(this.MENU.children, item.title)
          break
        } else if (item.children && item.children.length) {
          this.findTree(item.children, id)
        }
      }
    },
    // 根据name拿匹配到的菜单
    findTreeByName(arr, title, perTitle) {
      for (let index = 0; index < arr.length; index++) {
        const item = arr[index]
        if (item.title === title) {
          this.navList.unshift({ path: item.path, title: item.title })
          this.findTreeByName(this.MENU.children, perTitle)
          break
        } else if (item.children && item.children.length) {
          this.findTreeByName(item.children, title, item.title)
        }
      }
    },
    handleClose(done: any) {
      done()
    },
  },
  mounted() {
    this.getPath(this.$route.meta)
    on('header-menu-clicked', () => (this.showSide = !this.showSide))
    // on(GLOBAL.click, () => (this.showSide = false))
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/drawer';
</style>

<style lang="scss" module>
.wrapper {
  width: $widthSideBar;

  :focus {
    outline: none;
  }

  :global(.el-drawer) {
    background: rgba(18, 75, 146, 0.94); // $colorWhite;
  }

  :global(.el-drawer__wrapper) {
    top: $heightHeader;

    :global(.el-drawer__body) {
      overflow-y: auto;
    }
  }
}
</style>
