<!-- 描述 -->
<template>
  <div class="el-card">
    <ElRow
      :gutter="GAP*2"
      :class="$style.main"
    >
      <ElCol
        v-loading="isLoadingTree"
        :span="9"
      >
        <h3>组织机构列表</h3>
        <ElInput
          v-model.lazy.trim="keyWord"
          clearable
          size="small"
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
        :span="15"
      >
        <IBar
          @add="add"
          @edit="edit"
        />
        <IForm
          ref="organizationForm"
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
import ITree from '@homeCom/admin/TreeRadio'
import IBar from './Bar'
import IForm from './Form'
import { trim } from '@/pipe'
import LAYOUT from '@/scss/export/layout.scss'
import {
  Menu,
  getOrganizationTree,
  getOrganizationInfoById,
  addOrganization,
} from '@/api/systemManage/organization'
const whiteList = [
  'id',
  'enabled',
  'organizationName',
  'organizationLevel',
  'parentName',
  'abbreviation',
  'organizationDesc',
  'parentId',
  'organizationPath',
]
export default {
  components: { ITree, IBar, IForm },
  data: () => ({
    keyWord: '',
    isLoadingTree: true,
    isLoadingForm: false,
    tree: (null as any) as Menu,
    form: (null as any) as Menu,
    disabled: true,
    selected: (null as any) as Menu,
  }),
  computed: { GAP: () => +LAYOUT.gap },
  methods: {
    getTree() {
      this.isLoadingTree = this.disabled = true
      getOrganizationTree()
        .then((res) => {
          if (res && res.data && res.data.body) {
            this.tree = res.data.body
          }
        })
        .finally(() => {
          this.isLoadingTree = false
        })
    },
    onChange(treeNode: Menu) {
      this.selected = trim(treeNode, whiteList)
      if (!treeNode.id) {
        return
      }

      getOrganizationInfoById(treeNode.id)
        .then((res) => {
          if (res && res.data && res.data.body) {
            this.form = res.data.body
          }
        })
        .finally(() => {
          this.isLoadingForm = false
        })
    },
    add() {
      const selected = this.selected
      if (selected.id) {
        this.form = {
          parentName: selected.organizationName,
          parentId: selected.id,
        }
        this.disabled = false
      } else {
        this.$message.warning('请选择要添加节点的父级节点')
      }
    },
    edit() {
      if (this.selected.id) {
        this.form = this.selected
        this.disabled = false
      } else {
        this.$message.warning('请选择要添加节点的父级节点')
      }
    },
    cancel() {
      this.disabled = true
      this.form = this.selected
    },
    save(tree: Menu) {
      this.isLoadingTree = this.disabled = true
      addOrganization(tree)
        .then(() => {
          this.getTree()
          this.$refs.organizationForm.fetchOrganization()
        })
        .catch(() => {
          this.tree = [...this.tree]
          this.disabled = false
        })
        .finally(() => {
          this.isLoadingTree = false
        })
    },
  },
  created() {
    this.getTree()
  },
}
</script>

<style lang="scss" module>
.tree {
  max-height:
    calc(
      100vh - #{$gapTop + $gapBottom + $gapNormal * 2.25 + $heightInput}
    );
  overflow: auto;
  border: $borderBase;
}

.main {
  max-width: $lg;
  padding-left: 100px;
}

.form {
  margin: $gapNormal auto;
}
</style>
