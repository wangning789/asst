<!-- 工具条 -->
<template>
  <div :class="$style.bar">
    <h4>{{ title }}</h4>
    <div
      v-show="show"
      :class="$style.fr"
    >
      <RouterLink
        class="el-button el-button--text"
        to="edit"
      >
        <i :class="'i-bianji ' + STYLE.primary" /> 编辑
      </RouterLink>

      <ElButton
        type="text"
        :icon="'i-caidan ' + STYLE.warn"
        @click="$emit('menu')"
      >
        分配菜单
      </ElButton>

      <RouterLink
        class="el-button el-button--text"
        to="add"
      >
        <i :class="'el-icon-plus ' + STYLE.success" /> 新增下级部门
      </RouterLink>

      <ElButton
        type="text"
        :icon="'i-shanchu1 ' + STYLE.danger"
        @click="$emit('del')"
      >
        删除
      </ElButton>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import STYLE from '@/scss/status.module.scss'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...])
 *    menu:[] 点击分配菜单
 *    del:[] 点击删除
*/
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    show: { type: null, default: 0 },
    title: { type: String, default: '' },
  },
  computed: { STYLE: () => STYLE },
}
</script>

<style lang="scss" module>
.bar {
  margin-bottom: $gapNormal;
  border-bottom: $borderBase;

  > h4 {
    display: inline-block;
    margin: 0 0 $gapNormal / 2 0;
    font-size: $larger;
  }

  :global(.el-button--text) {
    padding-top: 0;
    color: $colorTextCommon;

    &:hover {
      color: $colorTheme;
    }
  }
}

.fr {
  float: right;
}
</style>
