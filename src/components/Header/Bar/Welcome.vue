<!-- 描述 -->
<template>
  <div :class="$style.wrapper">
    <!-- <div>欢迎，</div> -->
    <ElTooltip
      :content="me.aliasName"
      effect="light"
    >
      <div :class="$style.aliasName">
        欢迎，{{ me.aliasName }}
      </div>
    </ElTooltip>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import me from '@/store/user'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  computed: {
    me: () => me,
  },
}
</script>

<style lang="scss" module>
.wrapper {
  color: $colorWhite;
  line-height: 1.5em;
}

.aliasName {
  width: 120px;
  overflow: hidden; //隐藏
  white-space: nowrap; //文本不进行换行
  text-align: right;
  text-overflow: ellipsis;  //显示省略符号来代表被修剪的文本
  word-wrap: normal;    //保持默认处理
  word-break: keep-all;  //中英文不断词
}
</style>
