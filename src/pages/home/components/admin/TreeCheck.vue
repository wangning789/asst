<!-- 多选树 -->
<template>
  <KeepAlive>
    <ElTree
      v-if="data"
      ref="tree"
      node-key="id"
      show-checkbox
      default-expand-all
      :data="[{...data}]"
      :filter-node-method="filter"
      :expand-on-click-node="false"
      :default-checked-keys="checked"
      @check="onCheck"
    >
      <template #default="{ data: node }">
        <ElTooltip
          :content="node[label]"
          :disabled="!node[label]"
          placement="right"
        >
          <span class="el-tree-node__label">{{ node[label] }}</span>
        </ElTooltip>
      </template>
    </ElTree>

    <IInfo
      v-else
      type="info"
      icon="i-zanwushuju"
      msg="empty"
      retry
      :class="$style.info"
    />
  </KeepAlive>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElTree from 'element-ui/lib/tree'
import IInfo from '@com/Info'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
interface Tree {
  id: string
  children?: Tree[]
  [key: string]: any
}
function filterLeaf(tree: Tree, checked: string[], result?: string[]) {
  result || (result = [])
  const children = tree.children
  if (children && children.length) {
    let child
    for (child of children) {
      filterLeaf(child, checked, result)
    }
  } else if (checked.includes(tree.id)) {
    result.push(tree.id)
  }
  return result
}

/** 支持v-model绑定当前选中
 *  emit: (事件名: [参数列表, ...])
 *    input: [ids:当前选中id数组(含父节点id)]
 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    /** 树形数据 */
    data: { type: null as any, required: true },
    /** 标签字段 */
    label: { type: String, default: 'title' },
    /** 绑定值(字符串数组) */
    value: { type: Array, default: () => [] },
    /** 查询节点名 */
    keyWord: { type: String, default: '' },
    disabled: { type: Boolean },
  },
  components: { ElTree, IInfo },
  computed: {
    checked() {
      return filterLeaf(this.data, this.value)
    },
  },
  watch: {
    data: {
      immediate: true,
      handler(value) {
        value && this.$nextTick(this.search)
      },
    },
    keyWord() {
      this.search()
    },
  },
  methods: {
    onCheck(data: Tree, info: any) {
      this.$emit('input', info.halfCheckedKeys.concat(info.checkedKeys))
    },
    filter(value: string, node: any) {
      return (
        !value ||
        (node = node[this.label]).includes(value) ||
        value.includes(node)
      )
    },
    search() {
      const tree: any = this.$refs.tree
      tree && tree.filter(this.keyWord)
    },
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/tree';
</style>

<style lang="scss" module>
.info {
  min-height: 250px;
}
</style>
