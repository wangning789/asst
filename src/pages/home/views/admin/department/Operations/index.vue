<!-- 详情/新增/编辑 -->
<template>
  <IChooser
    v-loading="isSaving"
    :fetch="fetch"
    :args="[route.params.id]"
    class="el-card"
  >
    <div :class="$style.wrapper">
      <!-- 工具条 -->
      <IBar
        :show="route.params.id"
        :title="route.meta.title"
        @del="del"
        @menu="showMenu = true"
      />

      <!-- 表单 -->
      <ElForm
        ref="form"
        label-width="100px"
        label-position="right"
        :model="form"
        :disabled="be === 'info'"
        size="small"
      >
        <ElFormItem
          v-show="parentName"
          label="上级部门"
        >
          {{ parentName }}
        </ElFormItem>

        <ElFormItem
          label="部门名称"
          prop="departmentName"
          :rules="{required: true, message: '请输入部门名称', trigger: 'blur'}"
        >
          <ElInput
            v-model.lazy.trim="form.departmentName"
            placeholder="请输入部门名称"
          />
        </ElFormItem>

        <ElFormItem
          label="部门描述"
          prop="departmentDesc"
        >
          <ElInput
            v-model.lazy.trim="form.departmentDesc"
            show-word-limit
            type="textarea"
            maxlength="60"
            placeholder="部门描述"
          />
        </ElFormItem>
      </ElForm>

      <!-- 按钮 -->
      <div
        v-show="be !== 'info'"
        :class="$style.fr"
      >
        <ElButton
          type="primary"
          size="small"
          @click="save"
        >
          保存
        </ElButton>
        <RouterLink
          v-show="be === 'edit'"
          class="el-button"
          :class="'el-button--small'"
          to="info"
        >
          取消
        </RouterLink>
      </div>
    </div>
    <!-- 分配菜单 -->
    <IMenu
      :id="id"
      :parent-id="parentId"
      :visible.sync="showMenu"
    />
  </IChooser>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import IChooser from '@com/ChooserAsyncFunctional'
import IBar from './Bar'
import IMenu from '../Menu'

import {
  selectDep,
  deleteDep,
  addDep,
  updateDep,
  Department,
} from '@/api/authServer/department'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    route: { type: Object, required: true },
    be: { type: String, required: true },
  },
  components: { IChooser: IChooser as any, IBar, IMenu },
  data() {
    return {
      form: {} as Department,
      id: '',
      parentId: '',
      parentName: '',
      isSaving: false,
      showMenu: false,
    }
  },
  methods: {
    async fetch(id?: string) {
      if (!id) {
        return 1
      }

      let data = (await selectDep(id)).data.body || {}
      if (this.be === 'add') {
        this.parentName = data.departmentName
        data = { parentId: data.id }
      } else {
        this.parentName = ''
      }
      this.id = data.id
      this.parentId = data.parentId
      return (this.form = data)
    },
    async del() {
      const data = this.form
      await this.$confirm(
        `此操作不可逆, 确定要删除部门【${data.departmentName}】？`,
        '删除确认',
        {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }
      )
      this.isSaving = true
      let res
      try {
        res = (await deleteDep(data.id as string)).data
      } catch (error) {
        this.isSaving = false
        return
      }
      this.isSaving = false
      if (res.status) {
        this.up(true)
        this.$notify.success(`删除部门【${data.departmentName}】成功`)
      } else {
        this.$notify.error(res.msg || `删除部门【${data.departmentName}】失败`)
      }
    },
    async save() {
      const data = this.form
      this.isSaving = true
      const isAdd = this.be === 'add'
      isAdd && !data.parentId && (data.parentId = '0')
      try {
        await (isAdd ? addDep : updateDep)(data)
      } catch (error) {
        this.isSaving = false
        return
      }
      this.isSaving = false
      this.up(true)
      this.$notify.success(
        `${isAdd ? '添加' : '更新'}部门【${data.departmentName}】成功`
      )
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  max-width: $sm;
  margin: auto;
}

.fr {
  float: right;
}
</style>
