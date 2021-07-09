<!-- 描述 -->
<template>
  <IChooser
    :fetch="noticeDetail"
    :args="[{id: be}]"
    :class="$style.wrapper"
  >
    <template #success="{ data: { data: { body } } }">
      <h2>{{ body.title }}</h2>
      <div :class="$style.subTitle">
        发布时间：{{ body.takeEffectTime }}
      </div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="body.content" />
    </template>
  </IChooser>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import IChooser from '@com/ChooserAsyncFunctional'
import { noticeDetail } from '@/api/servicePlatform/notice'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    be: { type: String, default: '', required: true },
  },
  components: { IChooser },
  methods: {
    noticeDetail,
  },
}
</script>

<style lang="scss" module>
.wrapper {
  width: $lg;
  min-height: $sm;
  margin: 0 auto;
  padding: $gapNormal * 2 $gapNormal * 4;
  text-align: left;
  background-color: $colorWhite;
  transform: translateY(-110px);

  .subTitle {
    padding: $gapNormal / 2 $gapNormal * 2;
    font-size: $smaller;
    text-align: right;
    border-bottom: $borderBase;
  }

  h2 {
    text-align: center;
  }
}

@media screen and (min-width: $sm + $gapNormal * 2) {
  .wrapper {
    padding: $gapNormal * 2 $gapNormal;
  }
}
</style>
