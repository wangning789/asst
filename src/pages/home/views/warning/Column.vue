<!-- 分栏信息展示 -->
<template>
  <table :class="$style.wrapper">
    <tr
      v-for="(item, index) in data"
      :key="index"
    >
      <td :width="labelWidth + 'px'">
        {{ item.title }}
      </td>
      <td :class="item.class">
        {{ item.value }}
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    data: {
      type: Array as {
        title: string
        value: string | number
        class?: string
      }[],
      required: true,
    },
    labelWidth: { type: Number, default: 100 },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  width: 100%;
  table-layout: fixed;
  border: $borderBase;
  border-spacing: 0;

  tr {
    > td {
      padding: $gapNormal / 2 $gapNormal;
      white-space: pre-wrap;
      word-break: break-all;
      border-bottom: $borderBase;

      &:first-child {
        background: $colorTheme9;
      }
    }
  }
}
</style>
