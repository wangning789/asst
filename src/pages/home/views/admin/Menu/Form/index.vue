<!-- 表单 -->
<template>
  <ElForm
    ref="form"
    :model="form"
    :disabled="disabled"
    label-width="100px"
    size="small"
  >
    <ElFormItem
      label="所属系统"
      prop="systemCode"
      :rules="{ required: true, message: '请选择系统', trigger: 'change' }"
    >
      <ElSelect
        v-model="form.systemCode"
        clearable
        placeholder="请选择"
      >
        <ElOption
          v-for="item in systemList"
          :key="item.systemCode"
          :label="item.systemName"
          :value="item.systemCode"
        />
      </ElSelect>
    </ElFormItem>
    <ElFormItem
      label="父节点"
      prop="parentId"
      :rules="{ required: true, message: '请选择父节点', trigger: 'change' }"
    >
      <TreeSelect
        :id="data && data.id"
        v-model="form.parentId"
        :data="tree"
      />
    </ElFormItem>

    <ElFormItem
      label="标题"
      prop="title"
      :rules="{ required: true, message: '请输入标题', trigger: 'blur' }"
    >
      <ElInput
        v-model="form.title"
        placeholder="请输入标题"
      />
    </ElFormItem>

    <ElFormItem
      label="排序"
      prop="sortNo"
      :rules="{ required: true, message: '请输入序号', trigger: 'blur' }"
    >
      <ElInput
        v-model="form.sortNo"
        type="number"
        placeholder="请输入序号"
      />
    </ElFormItem>

    <ElFormItem
      label="图标"
      prop="icon"
    >
      <IIcon v-model="form.icon" />
    </ElFormItem>

    <ElFormItem
      label="模块"
      prop="menuCode"
    >
      <ElSelect
        v-model="form.menuCode"
        clearable
        filterable
        placeholder="请选择"
      >
        <ElOption
          v-for="(label, value) in MODULES"
          :key="value"
          :label="label"
          :value="value"
        />
      </ElSelect>
    </ElFormItem>

    <ElFormItem prop="path">
      <template #label>
        <span>
          访问路径
          <ElTooltip content="链接地址: 站内以 / 开头; 外链以 http(s):// 开头">
            <i :class="'i-bangzhu ' + $style.help" />
          </ElTooltip>
        </span>
      </template>
      <ElInput
        v-model="form.path"
        placeholder="请输入访问路径"
      />
    </ElFormItem>

    <ElFormItem
      label="下级页面"
      prop="childInfo"
    >
      <IChild
        :id="form.menuCode"
        v-model="form.childInfo"
      />
    </ElFormItem>

    <ElFormItem
      label="描述"
      prop="description"
    >
      <ElInput
        v-model="form.description"
        show-word-limit
        type="textarea"
        maxlength="60"
        placeholder="请输入描述"
      />
    </ElFormItem>

    <ElFormItem prop="rootNode">
      <template #label>
        <span>
          抽象节点
          <ElTooltip content="抽象节点不出现在导航中, 其非抽象子节点将提升">
            <i :class="'i-bangzhu ' + $style.help" />
          </ElTooltip>
        </span>
      </template>
      <ElSwitch
        :value="!!form.rootNode"
        @change="form.rootNode = form.rootNode ? 0 : 1"
      />
    </ElFormItem>

    <ElFormItem
      label="启用"
      prop="enabled"
    >
      <ElSwitch
        :value="!!form.enabled"
        @change="form.enabled = form.enabled ? 0 : 1"
      />
    </ElFormItem>

    <ElFormItem v-show="!disabled">
      <ElButton
        type="primary"
        @click="save"
      >
        保存
      </ElButton>
      <ElButton @click="cancel">
        取消
      </ElButton>
    </ElFormItem>
  </ElForm>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElSwitch from 'element-ui/lib/switch'
import TreeSelect from '@homeCom/admin/TreeSelect'
import IIcon from './Icon'
import IChild from './Child'

import { MODULES } from '@/enums/module'
import {
  systemList,
} from '@/api/authServer/menu'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
function update(data: IObject) {
  return {
    systemCode: '',
    childInfo: '',
    description: '',
    icon: '',
    id: '',
    menuCode: '',
    parentId: '',
    path: '',
    rootNode: '',
    sortNo: '',
    title: '',
    enabled: '',
    ...data,
  }
}

/** emit: (事件名: [参数列表, ...])
 *    cancel: []
 *    save: [formData: 编辑的表单数据]
 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    data: { type: null as any, required: true },
    tree: { type: null as any, required: true },
    disabled: { type: Boolean },
  },
  components: { ElSwitch, TreeSelect, IIcon, IChild },
  data() {
    return {
      form: update(this.data),
      systemList: [],
    }
  },
  computed: { MODULES: () => MODULES },
  watch: {
    data(data: any) {
      this.form = update(data)
    },
    disabled(disabled: boolean) {
      disabled && (this.$refs.form as any).clearValidate()
    },
  },
  methods: {
    cancel() {
      this.form = { ...(this.data as any) }
      this.$emit('cancel')
    },
    save() {
      ;(this.$refs.form as any).validate((valid: boolean) => {
        valid && this.$emit('save', this.form)
      })
    },
    list() {
      systemList().then(res => {
        this.systemList = res.data.body
      })
    },
  },
  mounted() {
    this.list()
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/switch';
</style>

<style lang="scss" module>
.help {
  cursor: help;
}
</style>
