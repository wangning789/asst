<!-- 树形下拉选择 -->
<template>
  <ElSelect
    ref="select"
    :filterable="filterable"
    :value="selected[label]"
    :loading="loading"
    :disabled="disabled"
    :clearable="clearable"
    :placeholder="placeholder"
    :filter-method="filter"
    :popper-append-to-body="popperAppendToBody"
    @clear="onChange();$emit('input')"
  >
    <ElOption
      :value="selected.id"
      :label="selected[label]"
      :class="$style.tree"
    >
      <ITree
        ref="tree"
        :data="data"
        :label="label"
        :value="value"
        :disabled="disabled"
        :key-word="keyWord"
        @input="$emit('input', $event)"
        @change="onChange"
      />
    </ElOption>
  </ElSelect>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ITree from './TreeRadio'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** 可通过 v-model 绑定
 * emit: (事件名: [参数列表, ...])
 *  input: [icon: 选中的节点]
 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    /** 树形数据(数组) */
    data: { type: null as any, required: true },
    /** 隐藏节点id */
    id: { type: String, default: '' },
    /** 绑定数据 */
    value: { type: String, default: '' },
    /** 树:标签字段 */
    label: { type: String, default: 'title' },
    placeholder: { type: String, default: '请选择' },
    popperAppendToBody: { type: Boolean },
    clearable: { type: Boolean },
    disabled: { type: Boolean },
    loading: { type: Boolean },
    filterable: { type: Boolean, default: true },
  },
  components: { ITree },
  data() {
    return { keyWord: '', selected: {} }
  },
  watch: {
    data: {
      immediate: true,
      handler(value) {
        value && this.$nextTick(this.init)
      },
    },
    id() {
      this.$nextTick(this.init)
    },
    value() {
      this.$nextTick(this.init)
    },
  },
  methods: {
    init() {
      const tree = this.$refs.tree as any
      if (tree) {
        this.selected = Object.freeze(tree.selected || {})
        this.id && tree.hideById(this.id)
      }
    },
    filter(keyWord: string) {
      this.keyWord = keyWord
    },
    onChange(selected: any) {
      this.selected = Object.freeze(selected || {})
      this.$refs.select.visible = false
      this.keyWord = ''
    },
  },
}
</script>

<style lang="scss" module>
.tree {
  height: auto !important;
  padding: 0 !important;
  font-weight: normal !important;
}
</style>
