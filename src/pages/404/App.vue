<!-- 未知页 -->
<template>
  <body>
    <IHead />
    <p :class="$style.pic" />
    <div :class="$style.text">
      <p>您访问的网页不存在</p>

      <ElButton
        type="primary"
        @click="goHome"
      >
        去首页
      </ElButton>

      <ElButton
        type="info"
        @click="back"
      >
        返回
      </ElButton>
    </div>
  </body>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import IHead from '@com/Header'
import CONFIG, { SPA } from '@/config'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  components: { IHead },
  methods: {
    goHome() {
      CONFIG.g(SPA.index)
    },
    back() {
      try {
        history.back()
      } catch (error) {
        CONFIG.g(SPA.home)
      }
    },
  },
}
</script>

<style lang="scss" module>
.pic {
  height: 220px;
  margin-top: 12%;
  background: url(~@404/assets/404.png) center no-repeat;
  background-size: contain;
}

.text {
  text-align: center;
}
</style>
