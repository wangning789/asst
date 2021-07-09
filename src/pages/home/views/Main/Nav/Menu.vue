<!-- 菜单 -->
<template>
  <div :class="$style.wrapper">
    <!-- 标题 -->
    <div :class="$style.bar">
      <div :class="[$style.ladder, $style.l2]" />
      <div :class="$style.ladder" />
      <h4
        :class="$style.title"
        @click="$emit('click', data)"
      >
        <IIcon
          v-if="data.icon"
          :icon="data.icon"
          :size="SIZE.title"
        />
        {{ data.title }}
      </h4>
      <h5 :class="$style.desc">
        {{ data.desc }}
      </h5>
    </div>
    <!-- 卡片 -->
    <div :class="$style.cards">
      <div
        v-for="menu in MENUS"
        :key="menu.id"
        @click="$emit('click', menu)"
      >
        <IIcon
          v-if="menu.icon"
          :icon="menu.icon"
          :size="SIZE.card"
        />
        <ElTooltip
          v-if="menu.desc"
          :content="menu.desc"
        >
          <h6>{{ menu.title }}</h6>
        </ElTooltip>
        <h6 v-else>
          {{ menu.title }}
        </h6>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import IIcon from '@com/Icon'

import FONT_SIZE from '@/scss/export/fontSize.scss'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...])
 *    click:[点击标题或子节点]
 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { data: { type: Object, required: true } },
  components: { IIcon },
  computed: {
    SIZE: () => ({ title: FONT_SIZE.xxLarge, card: FONT_SIZE.xxxxLarge }),
    MENUS() {
      return ((this.data as Menu)?.children || []).filter(menu => !menu.hide)
    },
  },
}
</script>

<style lang="scss" module>
$gap: $heightInput / 5;

.wrapper {
  margin: $gapNormal;
}

.bar {
  position: relative;
  height: $heightInput;
  line-height: $heightInput;
  border-bottom: $borderBase;
}

.ladder {
  position: absolute;
  width: $gap;
  height: 0;
  border-top: $heightInput solid $colorTheme2;
  border-right: $gap * 2 solid $colorTransparent;
}

.l2 {
  margin-left: $gap;
  border-top-color: $colorTheme5;
}

.title,
.desc,
.cards > div {
  display: inline-block;
}

.title {
  margin: 0 $gapNormal 0 $heightInput;
  font-size: $large;
  cursor: pointer;

  &:hover {
    color: $colorTheme2;
  }
}

.desc {
  margin: 0;
  color: $colorTextMinor;
  font: $larger normal;
}

.cards > div {
  box-sizing: border-box;
  width: 240px;
  height: $heightInput * 2;
  margin: $gapNormal $gapNormal / 2 0;
  padding: $heightInput / 2 $gapNormal;
  color: $colorTextMain;
  font-weight: normal;
  vertical-align: middle;
  background: $colorBackGround;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    color: $colorTheme9;
    color: $colorTheme9;
    font-weight: bold;
    background: $colorTheme2;
  }

  > h6 {

    @extend %ellipsis;

    display: inline-block;
    width: 139px;
    margin: 0 0 0 $gapNormal / 2;
    font-weight: inherit;
    font-size: $xLarge;
    line-height: $heightInput;
    vertical-align: top;
  }
}
</style>
