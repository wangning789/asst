<!-- 部门选择 -->
<template>
  <TreeSelect
    :data="tree"
    :value="value"
    :disabled="disabled"
    :loading="isLoadingTree"
    :popper-append-to-body="false"
    :filterable="false"
    clearable
    label="departmentName"
    placeholder="请选择部门"
    @input="$emit('input', $event)"
  />
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import TreeSelect from './TreeSelect'

import { selectAll } from '@/api/authServer/department'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
let instanceCount = 0
let cache

/** 可通过 v-model 绑定
 * emit: (事件名: [参数列表, ...])
 *   input: [value] 选中节点id
 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    value: { type: String, default: '' },
    visible: { type: Boolean },
    disabled: { type: Boolean },
  },
  components: { TreeSelect },
  data() {
    return { tree: null, isLoadingTree: false }
  },
  watch: {
    visible: {
      immediate: true,
      handler(visible?: boolean) {
        if (cache) {
          this.tree = cache
        } else if (visible && !this.tree) {
          this.isLoadingTree = true
          selectAll()
            .then(res => {
              this.tree = cache = Object.freeze(res.data.body?.children)
            })
            .finally(() => {
              this.isLoadingTree = false
            })
        }
      },
    },
  },
  created() {
    instanceCount++
    this.$once('hook:destroyed', () => {
      instanceCount-- || (cache = 0)
    })
  },
}
</script>
