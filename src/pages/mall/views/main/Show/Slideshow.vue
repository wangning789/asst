<!-- 轮播图 -->
<template>
  <ElCarousel
    trigger="click"
    height="264px"
    indicator-position
    :class="$style.wrapper"
  >
    <ElCarouselItem
      v-for="(src, index) in imgs"
      :key="index"
    >
      <img
        :src="src"
        :class="$style.imgBox"
      >
    </ElCarouselItem>
  </ElCarousel>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
/** emit: (事件名: [参数列表, ...]) */
// @ts-nocheck
import ElCarousel from 'element-ui/lib/carousel'
import ElCarouselItem from 'element-ui/lib/carousel-item'
import img1 from '@mall/assets/banner1.png'
import img2 from '@mall/assets/banner2.png'
import img3 from '@mall/assets/banner3.png'

export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  components: { ElCarousel, ElCarouselItem },
  computed: { imgs: () => [img1, img2, img3] },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/carousel';
@import '~element-ui/packages/theme-chalk/src/carousel-item';
</style>

<style lang="scss" module>
.wrapper {
  text-align: center;
}

.imgBox {
  width: 90%;
  height: 100%;
  margin: auto;
  overflow: hidden;
  border-radius: 4px;
}
</style>
