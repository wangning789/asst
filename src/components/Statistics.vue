<!-- 一般统计卡片, 支持筛选 -->
<template>
  <ElRow
    :gutter="gutter"
    type="flex"
  >
    <!-- justify="space-between" -->
    <ElCol
      v-for="(item, index) in data"
      :key="item.type || index"
      :span="span"
    >
      <ElCard
        :shadow="filter ? value === item.value ? 'always' : 'hover' : 'never'"
        :class="$style.card + (filter ? ' ' + $style.filter : '')"
        @click.native="filter && $emit('input', value === item.value ? '' : item.value)"
      >
        <IIcon
          :icon="item.icon || icons[item.type]"
          :img-icon="item.imgIcon || imgIcons[item.type]"
          :size="size"
        />
        <div :class="$style.content">
          <p>{{ item.title }}</p>
          <span>
            {{ item.value ? formatter(item.value) : '0' }}
            <span v-if="item.unit && item.value">{{ item.unit }}</span>
          </span>
        </div>
      </ElCard>
    </ElCol>
  </ElRow>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import IIcon from '@com/Icon'

import formatNumber from '@/utils/formatNumber'
import layout from '@/scss/export/layout.scss'
import fontSize from '@/scss/export/fontSize.scss'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** 可通过 v-model 绑定当前选中类型
 *  emit: (事件名: [参数列表, ...])
 *    input:[value:当前选中类型(点一下选中, 再点一下取消选中)]
 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    /** 统计数据 */
    data: {
      type: Array as {
        /** 字体图标, 没有时根据type从字体图标字典icons获取, 与imgIcon(优先)二选一 */
        icon?: string
        /** 图片图标(svg/png...), 没有时根据type从图片图标字典imgIcons获取 */
        imgIcon?: string
        /** 显示的标题 */
        title: string
        /** 显示的数值 */
        value: string | number
        /** 显示的单位 */
        unit?: string
        /** 类型标识, filter 时 v-model 绑定选中 */
        type?: string
      }[],
      required: true,
    },
    /** 当前选中类型 */
    value: { type: [String, Number], default: '' },
    /** 字体图标字典, 优先data指定 */
    icons: { type: Object, default: () => ({}) },
    /** 图片图标字典(svg/png...), 优先data指定 */
    imgIcons: { type: Object, default: () => ({}) },
    /** 列宽(24栏) */
    span: { type: Number, default: 6 },
    /** 列间距 */
    gutter: { type: Number, default: +layout.gap },
    /** 数值格式化方法 */
    formatter: { type: Function, default: formatNumber },
    /** 是否可筛选 */
    filter: { type: Boolean },
  },
  components: { IIcon },
  computed: { size: () => fontSize.xxxxLarge },
}
</script>

<style lang="scss" module>
.card {
  background-image: url(~@/assets/card.png);
  background-repeat: no-repeat;
  background-position: 85% 95%;

  &:global(.is-always-shadow) {
    box-shadow: $shadowPrefixLight $colorTheme;
  }

  :global(.el-card__body > *) {
    display: inline-block;
    vertical-align: middle !important;
  }
}

.filter {
  cursor: pointer;
}

.content {
  margin-left: $gapNormal;

  > p {
    margin: $gapNormal / 4 0;
    color: $colorTextCommon;
  }

  > span {
    font-weight: bold;
    font-size: $xLarge;

    > span {
      font-size: $medium;
    }
  }
}
</style>
