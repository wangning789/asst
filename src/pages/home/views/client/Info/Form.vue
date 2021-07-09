<!-- 编辑表单 -->
<template>
  <ElForm
    ref="form"
    :rules="rules"
    :model="form"
    label-width="140px"
    label-position="right"
    :class="$style.wrapper"
  >
    <!-- 编辑第一行 -->
    <ElRow
      type="flex"
      :class="$style.padBox"
      justify="space-between"
    >
      <ElCol :span="8">
        <ElFormItem
          label="客户单位："
          prop="department"
          :rules="regDepartment"
        >
          <ElInput
            v-model="form.department"
            clearable
            :maxlength="CONFIG.maxNameLength"
            show-word-limit
            placeholder="请输入"
          />
        </ElFormItem>
      </ElCol>
      <ElCol :span="8">
        <ElFormItem
          label="客户联系人："
          prop="contacts"
          :rules="{required: true, message: '请输入客户联系人', trigger: 'blur'}"
        >
          <ElInput
            v-model="form.contacts"
            clearable
            :maxlength="CONFIG.maxNameLength"
            show-word-limit
            placeholder="请输入"
          />
        </ElFormItem>
      </ElCol>
      <ElCol :span="8">
        <ElFormItem
          label="联系方式："
          prop="phone"
          :rules="regPhone"
        >
          <ElInput
            v-model="form.phone"
            clearable
            :maxlength="CONFIG.maxLength"
            show-word-limit
            placeholder="请输入"
          />
        </ElFormItem>
      </ElCol>
    </ElRow>
    <!-- 编辑第二行 -->
    <ElRow
      type="flex"
      :class="$style.padBox"
      justify="space-between"
    >
      <ElCol :span="8">
        <ElFormItem
          label="是否为重点客户："
          prop="keyStatus"
          :rules="{ required: true, message: '请选择是否重点客户', trigger: 'change' }"
        >
          <ElSelect
            v-model="form.keyStatus"
            clearable
            placeholder="请选择"
          >
            <ElOption
              v-for="item in booleanOption"
              :key="item.value"
              :class="$style.sel"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </ElFormItem>
      </ElCol>
      <ElCol :span="8">
        <ElFormItem
          label="负责人："
          prop="sellMan"
          :rules="{ required: true, message: '请选择负责人', trigger: 'change' }"
        >
          <ElSelect
            v-model="form.sellMan"
            clearable
            value-key="id"
            placeholder="请选择"
          >
            <ElOption
              v-for="item in getsellman"
              :key="item.id"
              :label="item.name"
              :value="item"
            />
          </ElSelect>
        </ElFormItem>
      </ElCol>
      <ElCol :span="8">
        <ElFormItem
          label="云服务商："
          prop="provider"
          :rules="{ required: true, message: '请选择云服务商', trigger: 'change' }"
        >
          <ElSelect
            v-model="form.provider"
            multiple
            value-key="id"
            clearable
            placeholder="请选择"
          >
            <ElOption
              v-for="item in getprovider"
              :key="item.id"
              :label="item.providerName"
              :value="item"
            />
          </ElSelect>
        </ElFormItem>
      </ElCol>
    </ElRow>
    <!-- 编辑第三行 -->
    <ElRow>
      <ElFormItem label="备注：">
        <ElInput
          v-model="form.note"
          type="textarea"
          :rows="4"
          :maxlength="CONFIG.maxLength*5"
          show-word-limit
          placeholder="请输入"
        />
      </ElFormItem>
    </ElRow>
    <ElFormItem>
      <ElButton
        size="medium"
        type="primary"
        @click="save"
      >
        保存
      </ElButton>
      <ElButton
        size="medium"
        @click="$emit('cancel')"
      >
        取消
      </ElButton>
    </ElFormItem>
  </ElForm>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import { checkPhone, checkClient } from '@/api/sell/client'
import { phone, aliaName } from '@/functions/validators'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
function getForm(data: any) {
  return {
    department: '',
    contacts: '',
    phone: '',
    keyStatus: '',
    password: '',
    sellMan: [][0],
    provider: [],
    note: '',
    ...data,
  }
}

/** emit: (事件名: [参数列表, ...])
 *    save: [formData: 表单数据]
 *    cancel: [] 取消
 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    data: { type: Object, required: true },
    getsellman: { type: Array, required: true },
    getprovider: { type: Array, required: true },
  },
  data() {
    return {
      form: getForm(this.data),
      rules: {
        department: [
          { required: true, message: '请输入客户单位', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    booleanOption: () => [
      {
        value: true,
        label: '是',
      },
      {
        value: false,
        label: '否',
      },
    ],
    phoneNum() {
      return this.data.phone
    },
    department1() {
      return this.data.department
    },
    regPhone() {
      return {
        required: true,
        validator: (
          rule: any,
          value: string,
          callback: (error?: Error) => void
        ) => {
          if (!value) {
            return callback(new Error('请输入手机号码'))
          }

          if (value === this.phoneNum) {
            return callback()
          }
          try {
            phone(value)
          } catch (error) {
            return callback(error)
          }

          checkPhone(value, this.form.id).then(res => {
            res.status && callback()
          }).catch(err => {
            callback(new Error(err.msg || '该号码已经存在'))
          })
        },
        trigger: 'blur',
      }
    },
    regDepartment() {
      return {
        required: true,
        validator: (
          rule: any,
          value: string,
          callback: (error?: Error) => void
        ) => {
          if (!value) {
            return callback(new Error('请输入客户单位'))
          }

          if (value === this.department1) {
            return callback()
          }

          try {
            aliaName(value, '客户单位')
          } catch (error) {
            return callback(error)
          }
          checkClient(value, this.form.id).then(res => {
            res.status && callback()
          }).catch(err => {
            callback(new Error(err.msg || '该客户单位已经存在'))
          })
        },
        trigger: 'blur',
      }
    },
  },
  methods: {
    save() {
      ;(this.$refs.form as any).validate((valid: boolean) => {
        valid && this.$emit('save', this.form)
      })
    },
  },
  created() {
    if (this.type === 'add') { this.form.sellMan = this.form.sellMan[0] }
  },

}
</script>

<style lang="scss" module>
.wrapper :global(.el-select) {
  display: block !important;
}
</style>
