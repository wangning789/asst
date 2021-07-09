<!-- 菜单树 -->
<template>
  <div :class="$style.wrapper">
    <ElForm
      inline
      label-width="80px"
      size="small"
    >
      <ElFormItem label="部门：">
        <DepSelect
          visible
          :value="depId"
          @input="setDepId"
        />
      </ElFormItem>

      <ElFormItem label="角色：">
        <ElSelect
          filterable
          :value="roleId"
          :loading="loadRole"
          placeholder="请选择角色"
          @change="setRoleId"
        >
          <ElOption
            v-for="role in roles"
            :key="role.id"
            :value="role.id"
            :label="role.roleName"
          />
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="关键字：">
        <ElInput
          v-model="keyWord"
          suffix-icon="i-sousuo"
          placeholder="请输入关键字"
        />
      </ElFormItem>
    </ElForm>

    <TreeRadio
      v-loading="loadTree"
      :data="tree"
      :value="menuId"
      :key-word="keyWord"
      @change="change"
    />
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import DepSelect from '@homeCom/admin/DepSelect'
import TreeRadio from '@homeCom/admin/TreeRadio'

import { listByDep } from '@/api/authServer/role'
import { Menu, roleMenuTree } from '@/api/authServer/menu'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...])
 *    change: [{ roleId: string, menuId: string, moduleId: string }
 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  components: { DepSelect, TreeRadio },
  data: () => ({
    depId: '',
    roleId: '',
    menuId: '',
    loadRole: false,
    roles: [],
    keyWord: '',
    loadTree: false,
    tree: null,
  }),
  methods: {
    setDepId(depId: string) {
      this.depId = depId
      if (!depId) {
        return
      }

      this.loadRole = true
      listByDep(depId)
        .then(res => {
          this.roles = res.data.body || []
        })
        .finally(() => {
          this.loadRole = false
        })
    },
    setRoleId(roleId: string) {
      this.roleId = roleId
      if (!roleId) {
        this.data = null
        return
      }

      this.loadTree = true
      roleMenuTree(roleId)
        .then(res => {
          this.tree = res.data.body
        })
        .finally(() => {
          this.loadTree = false
        })
    },
    change(item: Menu) {
      this.$emit(
        'change',
        {
          roleId: this.roleId,
          menuId: (this.menuId = item.id || ''),
          moduleId: item.menuCode || '',
        }
      )
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  padding: $gapNormal / 2;
  border: $borderBase;

  :global {
    .el-form {
      margin-bottom: $gapNormal / 2;
      border-bottom: $borderBase;
    }

    .el-form-item {
      margin: 0;
    }
  }
}
</style>
