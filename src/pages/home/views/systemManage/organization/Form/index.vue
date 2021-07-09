<!-- 描述 -->
<template>
  <div>
    <ElForm
      ref="form"
      :model="form"
      :disabled="disabled"
      label-width="135px"
      size="small"
    >
      <ElFormItem
        label="组织机构名称"
        prop="organizationName"
        :rules="{ required: true, message: '请输入组织机构名称', trigger: 'blur' }"
      >
        <ElInput
          v-model="form.organizationName"
          placeholder="请输入组织机构名称"
          :class="$style.input"
        />
      </ElFormItem>
      <ElFormItem
        prop="organizationLevel"
        label="级别："
      >
        <ElSelect
          v-model="form.organizationLevel"
          filterable
          :popper-append-to-body="false"
          placeholder="请选择组织机构级别"
          :class="$style.input"
        >
          <ElOption
            v-for="(val, key) in LEVELLIST"
            :key="key"
            :label="val"
            :value="key"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem
        label="上级单位："
        prop="parentId"
        :rules="{ required: true, message: '请选择上级单位' }"
      >
        <ElSelect
          v-model="form.parentId"
          placeholder="请选择"
          clearable
          :class="$style.input"
        >
          <ElOption
            v-for="item in organizations"
            :key="item.id"
            :label="item.organizationName"
            :value="item.id"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem
        label="简称"
        prop="abbreviation"
      >
        <ElInput
          v-model="form.abbreviation"
          placeholder="请输入简称"
          :class="$style.input"
        />
      </ElFormItem>
      <ElFormItem
        label="备注"
        prop="organizationDesc"
      >
        <ElInput
          v-model="form.organizationDesc"
          show-word-limit
          type="textarea"
          maxlength="60"
          placeholder="请输入备注"
          :class="$style.input"
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
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/** emit: (事件名: [参数列表 , ...]) */
import { getOrganizationUpdateInfo } from '@/api/systemManage/organization'
import getCode from '@/enums/code'
const LEVELLIST = getCode('1', 'SYS_ORGANIZATION_LEVEL')

function update(data: IObject) {
  return {
    organizationName: '',
    organizationLevel: '',
    parentName: '',
    abbreviation: '',
    organizationDesc: '',
    ...data,
  }
}

export default {
  props: {
    data: { type: null as any, required: true },
    disabled: { type: Boolean },
  },
  data() {
    return {
      form: update(this.data as any),
      organizations: [],
    }
  },
  computed: {
    LEVELLIST: () => LEVELLIST.value || [],
  },
  watch: {
    data(data: any) {
      this.form = update(data)
    },
  },
  methods: {
    save() {
      const data = this.form
      ;(this.$refs.form as any).validate((valid: boolean) => {
        if (valid) {
          this.$emit('save', data)
        }
      })
    },
    cancel() {
      this.form = { ...(this.data as any) }
      this.$emit('cancel')
    },
    async fetchOrganization() {
      this.organizations = Object.freeze(
        (await getOrganizationUpdateInfo()).data.body || []
      )
    },
  },
  created() {
    this.fetchOrganization()
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/switch';
</style>

<style lang="scss" module>
.input {
  width: 400px;
}
</style>
