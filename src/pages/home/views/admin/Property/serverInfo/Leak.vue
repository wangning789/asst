<!-- 描述 -->
<template>
  <ElRow
    :gutter="20"
    :class="$style.wrapper"
  >
    <ElCol :span="12">
      <ElRow>
        <ElCol :span="7">
          <IIcon
            :class="'i-loudongzongshu ' + $style.icon"
            size="40px"
          />
        </ElCol>
        <ElCol :span="17">
          <span :class="$style.title">漏洞总数</span>
          <h4 :class="$style.value">
            {{ (+info.leakNum).toFixed(0) }}
          </h4>
        </ElCol>
      </ElRow>
    </ElCol>
    <ElCol :span="12">
      <ElRow>
        <ElCol :span="7">
          <IIcon
            :class="'i-anquangaojing ' + $style.icon"
            size="40px"
          />
        </ElCol>
        <ElCol :span="17">
          <span :class="$style.title">告警总数</span>
          <h4 :class="$style.value">
            {{ (+info.alarmNum).toFixed(0) }}
          </h4>
        </ElCol>
      </ElRow>
    </ElCol>
  </ElRow>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import IIcon from '@com/Icon'

import formatNumber from '@/utils/formatNumber'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
function formatPrice(price?: number | string) {
  return formatNumber(price)
}

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { info: { type: Object, required: true } },
  components: {
    IIcon,
  },
  computed: {
    formatPrice: () => formatPrice,
  },
}
</script>

<style lang="scss" module >
.wrapper {
  margin-top: $gapNormal / 2;
}

.icon {
  padding: 0 10% 10px 0;
  color: $colorTheme;
  border-right: 2px solid $colorTheme;
}

.title {
  line-height: 2em;
}

.value {
  line-height: 2em;
}
</style>
