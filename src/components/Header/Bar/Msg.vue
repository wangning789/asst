<!-- 消息 -->
<template>
  <ElDropdown>
    <ElBadge
      :max="99"
      :value="6"
    >
      <ElLink
        icon="i-xiaoxi2"
        :underline="false"
        :class="$style.icon"
      />
    </ElBadge>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem icon="el-icon-circle-plus">
          这是一条消息
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElBadge from 'element-ui/lib/badge'
import ElDropdown from 'element-ui/lib/dropdown'
import ElDropdownMenu from 'element-ui/lib/dropdown-menu'
import ElDropdownItem from 'element-ui/lib/dropdown-item'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  components: { ElDropdown, ElDropdownMenu, ElDropdownItem, ElBadge },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/badge';
@import '~element-ui/packages/theme-chalk/src/dropdown';
@import '~element-ui/packages/theme-chalk/src/dropdown-menu';
@import '~element-ui/packages/theme-chalk/src/dropdown-item';
</style>

<style lang="scss" module>
.icon {
  font-size: inherit !important;
}
</style>
