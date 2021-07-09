<!-- 图标选择 -->
<template>
  <span>
    <ElTooltip :content="value ? '修改': '选择'">
      <ElButton
        :disabled="disabled"
        @click="visible = true"
      >
        <IIcon
          v-show="value"
          :icon="value"
          :size="SIZE.xxxLarge"
        />
        {{ value ? '' : '请选择' }}
      </ElButton>
    </ElTooltip>

    <ElDialog
      :visible="visible"
      title="请选择"
      @close="close"
    >
      <ElInput
        v-model.trim="name"
        placeholder="请输入"
        :class="$style.input"
      />
      <div
        v-for="(ICON, prefix) in ICONS"
        :key="prefix"
        :class="$style.icons"
      >
        <span
          v-for="(desc, val) in ICON"
          :key="val"
          :class="(val = prefix + val) === selected ? $style.active : ''"
          @click="selected = val"
          @dblclick="selected = val; save()"
        >
          <IIcon
            :icon="val"
            :size="SIZE.xxxLarge"
          />
          {{ desc }}
        </span>
      </div>

      <template #footer>
        <ElButton
          type="primary"
          @click="save"
        >
          确定
        </ElButton>

        <ElButton
          type="info"
          @click="clear"
        >
          清 除
        </ElButton>

        <ElButton @click="close">
          取消
        </ElButton>
      </template>
    </ElDialog>
  </span>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import IIcon from '@com/Icon'

import ICONS from './enums/icons'
import FONT_SIZE from '@/scss/export/fontSize.scss'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
function match(str1: string, str2: string) {
  return str1.includes(str2) || str2.includes(str1)
}

/** 可通过 v-model 绑定
 * emit: (事件名: [参数列表, ...])
 *  input: [icon: 选中的图标]
 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { value: { type: String, default: '' }, disabled: { type: Boolean } },
  components: { IIcon },
  data() {
    return { visible: false, selected: this.value, name: '' }
  },
  computed: {
    ICONS() {
      const name = this.name
      if (!name) {
        return ICONS
      }

      const icons: any = {}
      let prefix
      let ICON
      let val
      let desc
      for (prefix in ICONS) {
        ICON = ICONS[prefix as keyof typeof ICONS]
        for (val in ICON) {
          desc = ICON[val as keyof typeof ICON]
          ;(match(name, desc) || match(name, val)) &&
            ((icons[prefix] || (icons[prefix] = {}))[val] = desc)
        }
      }
      return icons as typeof ICONS
    },
    SIZE: () => FONT_SIZE,
  },
  watch: {
    value(value) {
      this.selected = value
    },
  },
  methods: {
    close() {
      this.visible = false
      this.selected = this.value
    },
    clear() {
      this.$emit('input', '')
      this.close()
    },
    save() {
      const selected = this.selected
      if (selected) {
        this.$emit('input', selected)
        this.close()
      } else {
        this.$message.warning('未选中任何项')
      }
    },
  },
}
</script>

<style lang="scss" module>
.input {
  display: block !important;
  width: 50% !important;
  margin: auto;
}

.icons {
  max-height: 50vh;
  margin-top: $gapNormal * 3 / 4;
  overflow: auto;

  > span {

    @extend %ellipsis;

    display: inline-block;
    width: $xxxLarge * 3;
    margin: $gapNormal / 4;
    padding: $gapNormal / 3 $gapNormal / 3 0;
    text-align: center;
    border: 1px solid $colorTransparent;
    cursor: pointer;

    &:hover {
      color: $colorTheme;
      box-shadow: 0 0 3px 1px $colorTheme;
    }

    > i,
    > svg,
    > img {
      display: block;
      margin: auto;
    }
  }
}

.active {
  box-shadow: 0 0 5px 3px $colorTheme !important;
}
</style>
