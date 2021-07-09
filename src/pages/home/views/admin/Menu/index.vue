<!-- 菜单管理 -->
<template>
  <div class="el-card">
    <ElRow
      :gutter="GAP"
      :class="$style.main"
    >
      <ElCol
        v-loading="isLoadingTree"
        :span="6"
      >
        <ElInput
          v-model.lazy.trim="keyWord"
          clearable
          size="medium"
          suffix-icon="i-sousuo"
          placeholder="请输入名称"
        />
        <ITree
          :data="tree"
          :key-word="keyWord"
          :class="$style.tree"
          @change="onChange"
        />
      </ElCol>

      <ElCol
        v-loading="isLoadingForm"
        :span="18"
      >
        <IBar
          @add="add"
          @edit="edit"
          @del="del"
        />
        <IForm
          :data="form"
          :tree="tree"
          :class="$style.form"
          :disabled="disabled"
          @cancel="cancel"
          @save="save"
        />
      </ElCol>
    </ElRow>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ITree from '@homeCom/admin/TreeRadio'
import IBar from './Bar'
import IForm from './Form'

import { trim } from '@/pipe'
import { Menu, allTree, info, add, update, del } from '@/api/authServer/menu'
import LAYOUT from '@/scss/export/layout.scss'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
const whiteList = [
  'childInfo',
  'description',
  'icon',
  'id',
  'menuCode',
  'parentId',
  'path',
  'rootNode',
  'sortNo',
  'title',
  'enabled',
  'systemCode',
]

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  components: { ITree, IBar, IForm },
  data: () => ({
    keyWord: '',
    isLoadingTree: true,
    isLoadingForm: false,
    tree: (null as any) as Menu,
    form: (null as any) as Menu,
    disabled: true,
    selected: {} as Menu,
  }),
  computed: { GAP: () => +LAYOUT.gap },
  methods: {
    getTree() {
      this.isLoadingTree = this.disabled = true
      allTree(true)
        .then(res => {
          this.tree = res.data.body
        })
        .finally(() => {
          this.isLoadingTree = false
        })
    },
    onChange(treeNode: Menu) {
      this.selected = trim(treeNode, whiteList)
      if (!treeNode.parentId || !treeNode.id) {
        return
      }

      this.isLoadingForm = true
      info(treeNode.id)
        .then(res => {
          this.form = trim(res.data.body, whiteList)
        })
        .finally(() => {
          this.isLoadingForm = false
        })
    },
    save(tree: Menu) {
      this.isLoadingTree = this.disabled = true
      ;(tree.id ? update : add)(tree)
        .then(() => {
          this.getTree()
        })
        .catch(() => {
          this.tree = { ...this.tree }
          this.disabled = false
        })
        .finally(() => {
          this.isLoadingTree = false
        })
    },
    add() {
      const selected = this.selected
      if (selected.id) {
        this.form = { parentId: selected.id }
        this.disabled = false
      } else {
        this.$message.warning('请选择父节点')
      }
    },
    edit() {
      if (this.selected.id) {
        this.form = this.selected
        this.disabled = false
      } else {
        this.$message.warning('请选择节点')
      }
    },
    cancel() {
      this.disabled = true
      this.form = this.selected
    },
    async del() {
      const selected = this.selected
      if (!selected.id) {
        this.$message.warning('请选择节点')
        return
      }

      await this.$confirm(
        `确定要删除节点【${selected.title}】及其子节点?`,
        '删除确认',
        {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }
      )

      this.isLoadingTree = this.isLoadingForm = this.disabled = true
      try {
        await del(trim(selected, whiteList))
      } catch (error) {
        this.isLoadingTree = this.isLoadingForm = false
        return
      }

      this.form = {}
      this.$message.success(`删除节点【${selected.title}】成功！`)
      this.getTree()
      this.isLoadingForm = false
    },
  },
  created() {
    this.getTree()
  },
}
</script>

<style lang="scss" module>
.tree {
  max-height: calc(100vh - #{$gapTop + $gapBottom + $gapNormal * 2.25 + $heightInput});
  overflow: auto;
  border: $borderBase;
}

.main {
  max-width: $lg;
  margin: auto !important;
}

.form {
  width: 650px;
  margin: $gapNormal auto;
}
</style>
