<!-- 修改/重置密码 -->
<template>
  <!-- 修改密码 -->
  <ElDialog
    v-if="visible === false"
    visible
    append-to-body
    title="修改密码"
    width="430px"
    @close="close"
  >
    <ElForm
      ref="form"
      size="small"
      label-width="90px"
      :model="form"
    >
      <ElFormItem
        label="当前密码"
        prop="old"
        :rules="{
          required: true,
          message: '请输入当前密码',
        }"
      >
        <ElInput
          v-model.lazy.trim="form.old"
          show-password
          type="password"
          placeholder="请输入当前密码"
        />
      </ElFormItem>

      <ElFormItem
        prop="new"
        :rules="checkNew"
      >
        <template #label>
          新密码
          <ElTooltip
            content="随机"
            placement="top-start"
          >
            <ElButton
              type="text"
              icon="el-icon-sugar"
              @click="random"
            />
          </ElTooltip>
        </template>

        <ElInput
          v-model.lazy.trim="form.new"
          show-password
          type="password"
          placeholder="请输入新密码"
        />
      </ElFormItem>

      <ElFormItem
        label="确认密码"
        prop="now"
        :rules="checkNow"
      >
        <ElInput
          v-model.lazy.trim="form.now"
          show-password
          type="password"
          placeholder="请重复新密码"
        />
      </ElFormItem>
    </ElForm>

    <template #footer>
      <ElButton
        size="small"
        type="primary"
        :loading="load"
        @click="load || modify()"
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
  <!-- 重置密码 -->
  <ElDialog
    v-else-if="visible === true"
    visible
    append-to-body
    title="重置密码"
    width="380px"
    @close="close"
  >
    <ElInput
      ref="copy"
      readonly
      :value="form.new"
      style="width: 180px;"
    />
    <ElTooltip content="复制密码">
      <ElButton
        type="text"
        icon="el-icon-document-copy el-button--mini"
        @click="copy"
      />
    </ElTooltip>
    <ElButton
      type="primary"
      :loading="load"
      @click="load || reset()"
    >
      点击重置
    </ElButton>
  </ElDialog>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import { password, randomPassword } from '@/functions/validators'
import { reset, modify } from '@/api/authServer/user'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...])
 *    revised: [] 修改密码成功
 *    update:visible: [false] 隐藏弹窗
 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    /** 用户id */
    id: { type: String, required: true },
    /** 用户名(加密密码用) */
    username: { type: String, required: true },
    /** false: 修改密码 true: 重置密码 其他: 不显示 */
    visible: { type: null as any, default: null },
  },
  data() {
    return {
      load: false,
      form: { old: '', new: '', now: '' },
    }
  },
  computed: {
    checkNew() {
      return {
        required: true,
        validator: (
          rule: any,
          value: string,
          callback: (error?: Error) => void
        ) => {
          if (!value) {
            return callback(new Error('请输入新密码'))
          }

          if (value === this.form.old) {
            return callback(new Error('不能与当前密码相同'))
          }

          try {
            password(value)
          } catch (error) {
            return callback(error)
          }

          callback()
        },
      }
    },
    checkNow() {
      return {
        required: true,
        validator: (
          rule: any,
          value: string,
          callback: (error?: Error) => void
        ) => {
          if (!value) {
            return callback(new Error('请重复新密码'))
          }

          if (value !== this.form.new) {
            return callback(new Error('两次输入的密码不一致'))
          }

          callback()
        },
      }
    },
  },
  methods: {
    random() {
      this.form.new = randomPassword()
    },
    close() {
      this.$emit('update:visible', null)
      const form: any = this.$refs.form
      if (form) {
        form.resetFields()
      } else {
        this.form.new = this.form.now = ''
      }
    },
    modify() {
      ;(this.$refs.form as any).validate((valid: boolean) => {
        if (!valid) {
          return
        }

        this.load = true
        const form = this.form
        modify(this.id, this.username, form.old, form.new)
          .then(() => {
            this.$notify.success('修改密码成功')
            this.$emit('revised')
            this.close()
          })
          .finally(() => {
            this.load = false
          })
      })
    },
    reset() {
      this.$confirm('此操作不可逆, 确定要重置密码？', '重置密码', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      }).then(() => {
        this.load = true
        const password = randomPassword()
        reset(this.id, this.username, password)
          .then(() => {
            this.form.new = password
          })
          .finally(() => {
            this.load = false
          })
      })
    },
    copy() {
      ;(this.$refs.copy as any).select()
      document.execCommand('copy')
    },
  },
}
</script>
