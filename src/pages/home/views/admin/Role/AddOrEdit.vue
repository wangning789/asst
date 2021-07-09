<!-- 新建/编辑角色 -->
<template>
  <ElDialog
    :visible="visible"
    width="380px"
    :title="(data.id ? '编辑' : '新建') + '角色'"
    @close="close"
  >
    <ElForm
      ref="form"
      :class="$style.form"
      :model="form"
      label-width="100px"
      size="small"
    >
      <ElFormItem
        prop="departmentId"
        label="所属部门："
        :rules="{ required: true, message: '请选择所属部门' }"
      >
        <DepSelect
          v-model="form.departmentId"
          :visible="visible"
        />
      </ElFormItem>

      <ElFormItem
        prop="roleName"
        label="角色名："
        :rules="{ required: true, message: '请输入角色名' }"
      >
        <ElInput
          v-model="form.roleName"
          clearable
          placeholder="请输入角色名"
        />
      </ElFormItem>

      <ElFormItem
        prop="roleCode"
        label="角色类型："
        :rules="{ required: true, message: '请输入角色类型' }"
      >
        <ElSelect
          v-model="form.roleCode"
          clearable
          filterable
          :loading="loading"
          :popper-append-to-body="false"
          placeholder="请选择角色类型"
        >
          <ElOption
            v-for="(item, i) in roleCodeList"
            :key="i"
            :label="item && item.name"
            :value="item && item.code"
          />
        </ElSelect>
      </ElFormItem>

      <ElFormItem
        prop="roleLevel"
        label="角色等级："
        :rules="checkLevel"
      >
        <ElInput
          v-model="form.roleLevel"
          clearable
          type="number"
          placeholder="请输入等级"
        />
      </ElFormItem>
    </ElForm>

    <template #footer>
      <ElButton
        type="primary"
        size="small"
        :loading="isSaving"
        @click="isSaving || save()"
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
import DepSelect from '@homeCom/admin/DepSelect'

import { pInt } from '@/functions/validators'
import { add, update, getColdeList } from '@/api/authServer/role'
import { trim } from '@/pipe'
import { ROLES } from '@/enums'
import me from '@/store/user'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...])
 *    update:visible [false] 隐藏弹窗
 *    success [] 新增/修改成功
 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    data: { type: null as any, required: true },
    visible: { type: Boolean },
  },
  components: { DepSelect },
  data() {
    return { form: { ...this.data }, isSaving: false, roleCodeList: [], loading: false }
  },
  computed: {
    checkLevel() {
      return {
        required: true,
        validator: (rule: any, value: string, callback: (error?: Error) => void) => {
          if (!value) {
            return callback(new Error('请输入角色等级'))
          }

          try {
            pInt(value) && this.checkUserLevel(value)
          } catch (error) {
            return callback(error)
          }

          callback()
        },
      }
    },
  },
  watch: {
    data: {
      immediate: true,
      handler(data?: boolean) {
        this.form = { ...data }
        this.getList()
      },
    },
  },
  methods: {
    checkUserLevel(val: string) {
      if (this.authFit(ROLES.superAdmin)) {
        return true
      }
      const role = me?.roleList && me?.roleList[0]
      if (!role) {
        return true
      }
      const level = role.roleLevel
      if (+val > level) {
        return true
      }
      throw new Error(`请输入大于${level}的正整数`)
    },
    getList() {
      this.loading = true
      getColdeList().then(res => {
        this.roleCodeList = trim(res?.data?.body)
        this.loading = false
      })
    },
    close() {
      this.$emit('update:visible', false)
      this.$refs.form.resetFields()
    },
    save() {
      ;(this.$refs.form as any).validate((valid: boolean) => {
        if (!valid) {
          return
        }

        this.isSaving = true
        const form = this.form
        ;(form.id ? update : add)(form)
          .then(() => {
            this.$notify.success(`${form.id ? '修改' : '新增'}角色成功`)
            this.$emit('success')
            this.$emit('update:visible', false)
          })
          .finally(() => {
            this.isSaving = false
          })
      })
    },
  },
}
</script>

<style lang="scss" module>
.form {
  width: 322px;
}
</style>
