<!-- 顶栏 -->
<template>
  <div
    :class="visible ? $style.btn2 : $style.btn1"
    @click.stop="menuClicked"
  />
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module

import { emit } from '@/utils/eventBus'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: 事件说明 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { visible: { type: Boolean, default: false } },
  components: { },
  methods: {
    menuClicked() {
      emit('header-menu-clicked')
    },
  },
}
</script>

<style lang="scss" module>
.btn1,
.btn2 {
  position: absolute;
  top: calc(50vh - #{$heightHeader} - 40px);
  box-sizing: border-box;
  width: 20px;
  height: $heightHeader;
  color: $colorWhite;
  transform: translateX(0);
  cursor: pointer;
  transition: 0.3s;
}

.btn1 {
  background: url(~@/assets/side-icon.png) 0 center no-repeat;
}

.btn2 {
  background: url(~@/assets/side-icon2.png) 0 center no-repeat;
  transform: translateX(240px); // 跟ElDrawer的宽度保持一致
}
</style>
