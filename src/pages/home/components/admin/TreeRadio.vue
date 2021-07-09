<!-- 单选树 -->
<template>
  <KeepAlive>
    <ElTree
      v-if="tree"
      ref="tree"
      node-key="id"
      default-expand-all
      :data="tree"
      :style="heightStyle"
      :highlight-current="!disabled"
      :filter-node-method="filter"
      :expand-on-click-node="false"
      :class="$style.tree"
      @current-change="onChange"
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
function getNodeByID(root: Tree[], id?: string): Tree | undefined {
  if (!id || !root || !root.length) {
    return
  }

  // 广度优先
  let queen = root.slice()
  let node
  while (queen.length) {
    node = queen.shift() as Tree
    if (id === node.id) {
      return node
    }
    node.children?.length && (queen = queen.concat(node.children))
  }
}
function hideById(vms: any[], id: string) {
  if (!id || !vms || !vms.length) {
    return
  }
  let vm
  let i
  for (vm of vms) {
    if ((i = vm.node?.data?.id)) {
      vm.$el.style.display = i === id ? 'none' : ''
      hideById(vm.$children, id)
    }
  }
}

/** 支持v-model绑定当前选中
 *  emit: (事件名: [参数列表, ...])
 *    change: [treeNode: 点击的节点]
 *    input: [id: 点击的节点的id]
 *  methods:
 *    hideById(id: string) 隐藏指定id的节点(及其子节点)
 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    /** 树形数据(数组) */
    data: { type: null as any, required: true },
    /** 标签字段 */
    label: { type: String, default: 'title' },
    /** 绑定值 */
    value: { type: String, default: '' },
    /** 查询节点名 */
    keyWord: { type: String, default: '' },
    disabled: { type: Boolean },
  },
  components: { ElTree, IInfo },
  data: () => ({ selected: null as any, heightStyle: {} }),
  computed: {
    tree() {
      const data = this.data
      return data && (Array.isArray(data) ? data : [data])
    },
  },
  watch: {
    tree: {
      immediate: true,
      handler(value: Tree) {
        value && this.$nextTick(() => {
          this.select()
          this.search()
        })
      },
    },
    value() {
      this.select()
    },
    keyWord() {
      this.search()
    },
  },
  methods: {
    onChange(data: any) {
      if (!this.disabled) {
        ;(this as any).selected = Object.freeze(data)
        this.$emit('change', data)
        this.$emit('input', data.id)
      }
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
    select() {
      const data = (this as any).tree as Tree[]
      const selected = ((this as any).selected =
       Object.freeze(data && getNodeByID(data, this.value)) || {})
      const tree = this.$refs.tree as any
      tree && tree.setCurrentKey(selected.id)
      this.$emit('change', selected)
    },
    hideById(id: string) {
      const tree = this.$refs.tree as any
      tree && hideById(tree.$children, id)
    },
  },
  created() {
    if (this.$route.fullPath === '/assetsManage') {
      this.heightStyle = {
        maxHeight: '640px',
      }
    }
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/tree';
</style>

<style lang="scss" module>
.tree :global(.el-tree-node.is-current > .el-tree-node__content) {
  background: $colorTheme7;
}

.info {
  min-height: 250px;
}
</style>
