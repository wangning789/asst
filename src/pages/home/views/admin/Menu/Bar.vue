<!-- 表单 -->
<template>
  <div :class="$style.bar">
    <ElButton
      type="text"
      :icon="'i-tianjia1 ' + STYLE.primary"
      @click="$emit('add')"
    >
      新增
    </ElButton>
    <ElButton
      type="text"
      :icon="'i-bianji ' + STYLE.success"
      @click="$emit('edit')"
    >
      编辑
    </ElButton>
    <ElButton
      type="text"
      :icon="'i-shanchu1 ' + STYLE.danger"
      @click="$emit('del')"
    >
      删除
    </ElButton>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import STYLE from '@/scss/status.module.scss'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...])
 *    add: [] 点击新增
 *    edit: [] 点击编辑
 *    del: [] 点击删除
 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  computed: {
    STYLE: () => STYLE,
  },
}
</script>

<style lang="scss" module>
.bar {
  height: $heightInput;
  text-align: right;
  border-bottom: $borderBase;

  :global(.el-button--text) {
    padding-top: 0;
    color: $colorTextCommon;

    &:hover {
      color: $colorTheme;
    }
  }
}
</style>
