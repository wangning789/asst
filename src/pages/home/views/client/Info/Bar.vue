<!-- 工具栏 -->
<template>
  <div :class="$style.wrapper">
    <!-- 编辑 -->
    <span
      :class="$style.btn"
      @click="$emit('edit')"
    >
      <i
        class="i-bianji "
        style="color: #5992d3;"
      />
      <span>编辑</span>
    </span>
    <!-- 删除 -->
    <span
      :class="$style.btn"
      @click="$emit('del')"
    >
      <i
        class="i-shanchu1 "
        style="color: #ec5e5e;"
      />
      <span>删除</span>
    </span>
    <!-- 分配 -->
    <span
      :class="$style.btn"
      @click="$emit('distribute')"
    >
      <i
        class="i-fenpeifuzeren "
        style="color: #f8902a;"
      />
      <span>分配</span>
    </span>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...])
 *    edit: [] 编辑
 *    del: [] 删除
 *    distribute: [] 分配
*/
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { title: { type: String, default: '' } },
}
</script>

<style lang="scss" module>
.wrapper {
  text-align: right;
}

.btn {
  margin: 0 $gapNormal;

  &:hover {
    cursor: pointer;
  }
}
</style>
