<!-- 分配菜单 -->
<template>
  <ElDialog
    :visible="visible"
    title="分配菜单"
    @close="close"
  >
    <ElInput
      v-model="keyWord"
      placeholder="请输入"
      size="small"
      :class="$style.input"
    />
    <ITree
      v-model="checked"
      v-loading="isLoading"
      :data="tree"
      :key-word="keyWord"
      :class="$style.tree"
    />

    <template #footer>
      <ElButton
        type="primary"
        :load="isLoading"
        class="el-button--small"
        @click="save"
      >
        确定
      </ElButton>

      <ElButton
        size="small"
        @click="close"
      >
        取消
      </ElButton>
    </template>
  </ElDialog>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ITree from '@homeCom/admin/TreeCheck'

import { depMenuTree } from '@/api/authServer/menu'
import { Role, menuIds, updateMenuIds } from '@/api/authServer/role'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
const updateTree = {
  immediate: true,
  handler(this: any) {
    this.getTree()
  },
}

/** emit: (事件名: [参数列表, ...])
 *    update:visible [visible:弹窗显示]
 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    data: { type: Object, required: true },
    visible: { type: Boolean },
  },
  components: { ITree },
  data() {
    return { keyWord: '', tree: null, checked: [], isLoading: false }
  },
  watch: {
    visible: updateTree,
    data: updateTree,
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
      this.keyWord = ''
    },
    async getTree() {
      if (!this.visible) {
        return
      }

      const data = this.data as Role
      if (!data.departmentId) {
        return
      }

      this.isLoading = true
      try {
        this.tree = Object.freeze((await depMenuTree(data.departmentId)).data.body)
      } catch (error) {
        this.isLoading = false
        return
      }

      this.checked = []
      if (data.id) {
        try {
          this.checked = (await menuIds(data.id)).data.body || []
        } catch (error) {
          this.isLoading = false
          return
        }
      }

      this.isLoading = false
    },
    async save() {
      this.isLoading = true

      try {
        await updateMenuIds({ ...this.data, menuIdList: this.checked })
      } catch (error) {
        this.isLoading = false
        return
      }

      this.$message.success('更新成功')
      this.isLoading = false
      this.close()
    },
  },
}
</script>

<style lang="scss" module>
.input {
  display: block;
  width: 50%;
  margin: auto;
}

.tree {
  max-height: 50vh;
  margin-top: $gapNormal;
  overflow: auto;
  border: $borderBase;
}
</style>
