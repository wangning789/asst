<!-- 筛选条件 -->
<template>
  <div>
    <h4 :class="$style.title">
      {{ title }}
    </h4>

    <div :class="$style.fr">
      <ElButton
        type="text"
        size="small"
        :icon="`el-icon-arrow-${showFilter ? 'up' : 'down'}`"
        @click="showFilter = !showFilter"
      >
        {{ showFilter ? '隐藏' : '显示' }}筛选
      </ElButton>

      <RouterLink
        class="el-button el-button--primary el-button--small"
        to="add"
        append
      >
        新建
      </RouterLink>
    </div>

    <Transition
      name="fold"
      mode="out-in"
    >
      <ElForm
        v-show="showFilter"
        size="small"
        inline
      >
        <ElFormItem>
          <ElInput
            :value="value.employeeNumber"
            clearable
            placeholder="请输入工号"
            @input="update('employeeNumber', $event)"
          />
        </ElFormItem>

        <ElFormItem>
          <ElInput
            :value="value.aliasName"
            clearable
            placeholder="请输入姓名"
            @input="update('aliasName', $event)"
          />
        </ElFormItem>

        <ElFormItem>
          <DepSelect
            :visible="showFilter"
            :value="value.departmentIds"
            @input="onSelectDep"
          />
        </ElFormItem>

        <ElFormItem>
          <ElSelect
            v-model="value.organizationId"
            clearable
            filterable
            placeholder="请选择所属单位"
          >
            <ElOption
              v-for="item in organizations"
              :key="item.id"
              :label="item.organizationName"
              :value="item.id"
            />
          </ElSelect>
        </ElFormItem>

        <ElFormItem>
          <ElSelect
            v-model="value.roleIds"
            clearable
            filterable
            :loading="!!value.departmentIds && !roles"
            :placeholder="value.departmentIds ? '请选择角色' : '请先选择部门'"
          >
            <ElOption
              v-for="role in roles"
              :key="role.id"
              :value="role.id"
              :label="role.roleName"
            />
          </ElSelect>
        </ElFormItem>

        <ElFormItem>
          <ElInput
            :value="value.wechat"
            clearable
            placeholder="请输入微信号"
            @input="update('wechat', $event)"
          />
        </ElFormItem>

        <ElFormItem>
          <ElInput
            :value="value.mailbox"
            clearable
            placeholder="请输入邮箱"
            @input="update('mailbox', $event)"
          />
        </ElFormItem>

        <ElFormItem>
          <ElInput
            :value="value.cellPhone"
            clearable
            placeholder="请输入联系方式"
            @input="update('cellPhone', $event)"
          />
        </ElFormItem>
      </ElForm>
    </Transition>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import DepSelect from '@homeCom/admin/DepSelect'

import { listByDep } from '@/api/authServer/role'
import { getOrganizationInfo } from '@/api/systemManage/organization'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** 可通过 v-model 绑定
 * emit: (事件名: [参数列表, ...])
 *  input: [value]
 *  add: [] 点击新增按钮
 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    value: { type: Object, required: true },
    title: { type: String, default: '' },
  },
  components: { DepSelect },
  data() {
    return { showFilter: false, roles: null, organizations: [] }
  },
  methods: {
    update(attr: string, value: any) {
      this.$emit('input', { ...this.value, [attr]: value, roles: null })
    },
    async fetchRole(depId: string) {
      this.roles = Object.freeze((await listByDep(depId)).data.body || [])
    },
    onSelectDep(dep: string) {
      this.update('departmentIds', dep)
      dep ? this.fetchRole(dep) : (this.roles = [])
    },
    async fetchOrganization() {
      this.organizations = Object.freeze(
        (await getOrganizationInfo()).data.body || []
      )
    },
  },
  created() {
    this.fetchOrganization()
  },
}
</script>

<style lang="scss" module>
.title {
  display: inline-block;
  margin: $gapNormal/2 0 $gapNormal 0;
  font-size: $larger;
}

.fr {
  float: right;
}
</style>
