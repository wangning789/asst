<!-- 联系人信息 -->
<template>
  <!-- 编辑联系人信息 -->
  <ElForm
    ref="form"
    :model="form"
    inline
    :class="$style.edit"
    :disabled="disable"
    label-width="135px"
  >
    <!--    :rules="{required: authFit(ROLES.commercial), message: '请选择交付单位'}"-->
    <h5>采购单位信息：</h5>
    <div>
      <ElFormItem
        prop="customerId"
        label="采购单位："
        :rules="{required: true, message: '请选择交付单位'}"
      >
        <IChooser
          v-if="getter"
          :fetch="getter"
          tag="ElSelect"
          clearable
          filterable
          allow-create
          :value="form.customerId"
          @change="onChange"
        >
          <ElOption
            v-for="item in body"
            :key="item.id"
            :label="item.department"
            :value="item.id"
          />
        </IChooser>
      </ElFormItem>
      <div>
        <ElFormItem
          prop="contacts"
          label="联系人："
          :rules="{required: true, message: '请输入联系人'}"
        >
          <ElInput
            v-model="form.contacts"
            placeholder="请输入联系人"
            @change="$emit('input', form)"
          />
        </ElFormItem>

        <ElFormItem
          prop="contactsPhone"
          label="联系方式："
          :rules="checkPhone"
          @change="$emit('input', form)"
        >
          <ElInput
            v-model="form.contactsPhone"
            placeholder="请输入联系方式"
            @change="$emit('input', form)"
          />
        </ElFormItem>

        <ElFormItem
          prop="email"
          label="邮箱："
          :rules="checkMail"
        >
          <ElInput
            v-model="form.email"
            placeholder="请输入邮箱"
            @change="$emit('input', form)"
          />
        </ElFormItem>
      </div>
    </div>

    <h5>使用单位信息：</h5>
    <div>
      <ElFormItem
        prop="useDepartment"
        label="使用单位："
        :rules="{required: true, message: '请输入使用单位'}"
      >
        <ElInput
          v-model="form.useDepartment"
          placeholder="请输入使用单位"
          @change="$emit('input', form)"
        />
      </ElFormItem>
      <div>
        <ElFormItem
          prop="businessContacts"
          label="业务联系人："
          :rules="{required: true, message: '请输入业务联系人'}"
        >
          <ElInput
            v-model="form.businessContacts"
            placeholder="请输入业务联系人"
            @change="$emit('input', form)"
          />
        </ElFormItem>

        <ElFormItem
          prop="businessPhone"
          label="业务联系人电话："
          :rules="checkPhone"
          @change="$emit('input', form)"
        >
          <ElInput
            v-model="form.businessPhone"
            placeholder="请输入业务联系人电话"
            @change="$emit('input', form)"
          />
        </ElFormItem>

        <ElFormItem
          prop="businessEmail"
          label="业务联系人邮箱："
          :rules="checkMail"
        >
          <ElInput
            v-model="form.businessEmail"
            placeholder="请输入业务联系人邮箱"
            @change="$emit('input', form)"
          />
        </ElFormItem>
      </div>
      <div>
        <ElFormItem
          prop="technicalContacts"
          label="技术联系人："
          :rules="{required: true, message: '请输入技术联系人'}"
        >
          <ElInput
            v-model="form.technicalContacts"
            placeholder="请输入技术联系人"
            @change="$emit('input', form)"
          />
        </ElFormItem>

        <ElFormItem
          prop="technicalPhone"
          label="技术联系人电话："
          :rules="checkPhone"
          @change="$emit('input', form)"
        >
          <ElInput
            v-model="form.technicalPhone"
            placeholder="请输入技术联系人电话"
            @change="$emit('input', form)"
          />
        </ElFormItem>

        <ElFormItem
          prop="technicalEmail"
          label="技术联系人邮箱："
          :rules="checkMail"
        >
          <ElInput
            v-model="form.technicalEmail"
            placeholder="请输入技术联系人邮箱"
            @change="$emit('input', form)"
          />
        </ElFormItem>
      </div>
    </div>

    <h5>其他信息：</h5>
    <ElFormItem
      prop="cloudControlNo"
      label="云管控单号："
    >
      <!-- :rules="{required: true, message: '请输入云管控单号'}" -->
      <ElInput
        v-model="form.cloudControlNo"
        placeholder="请输入云管控单号"
        @change="$emit('input', form)"
      />
    </ElFormItem>

    <ElFormItem
      prop="projectName"
      label="项目名称："
    >
      <!-- :rules="{required: true, message: '请输入项目名称'}" -->
      <ElInput
        v-model="form.projectName"
        placeholder="请输入项目名称"
        @change="$emit('input', form)"
      />
    </ElFormItem>
    <div>
      <ElFormItem
        label="备注："
        prop="note"
      >
        <ElInput
          v-model.lazy.trim="form.note"
          show-word-limit
          :rows="5"
          type="textarea"
          maxlength="60"
          placeholder="请输入备注"
          @change="$emit('input', form)"
        />
      </ElFormItem>
    </div>
  </ElForm>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import IChooser from '@com/ChooserAsyncFunctional'

import { decode } from '@/functions/cipher' // encode,
import { email } from '@/functions/validators' // phone,
import { ROLES } from '@/enums'

import { listCloudService } from '@/api/servicePlatform/customer'
import { ciUsers } from '@/api/servicePlatform/serverAssets'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** 可通过v-model绑定
 * emit: (事件名: [参数列表, ...])
 *  input: [userInfo] 选中的联系人信息
*/
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    value: { type: Object, default: () => ({}) },
    disable: {
      type: Boolean,
      default: false,
    },
  },
  components: { IChooser },
  data() {
    return {
      getter: null,
      body: null,
      form: {
        customerId: '', // 客户ID
        cloudControlNo: '', // 云服务单号
        contacts: '', // 联系人名称
        contactsPhone: '', // 联系人电话
        department: '', // 部门
        email: '', // 邮箱
        projectName: '', // 项目名称
        businessContacts: '', // 业务联系人
        businessEmail: '', // 业务联系人邮箱
        businessPhone: '', // 业务联系人电话
        technicalContacts: '', // 技术联系人
        technicalEmail: '', // 技术联系人邮箱
        technicalPhone: '', // 技术联系人电话
        useDepartment: '', // 使用单位
        note: '', // 备注
      },
    }
  },
  computed: {
    ROLES: () => ROLES,
    checkPhone() {
      return {
        required: true,
        message: '请输入联系方式',
        // validator: (
        //   rule: any,
        //   value: string,
        //   callback: (error?: Error) => void
        // ) => {
        //   if (!value) {
        //     return callback(new Error('请输入手机号码'))
        //   }

        //   try {
        //     phone(value)
        //     callback()
        //   } catch (error) {
        //     return callback(error)
        //   }
        // },
      }
    },
    checkMail() {
      return {
        validator: (
          rule: any,
          value: string,
          callback: (error?: Error) => void
        ) => {
          if (!value) {
            return callback()
          }

          try {
            email(value)
            callback()
          } catch (error) {
            return callback(error)
          }
        },
      }
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(value: any) {
        if (value && value.id) {
          this.form = Object.assign(this.form, value)
        }
      },
    },
  },
  methods: {
    onChange(id: string) {
      const item = this.body.find(item => item.id === id)
      this.form.customerId = id
      this.form.department = item ? item.department : id

      if (this.authFit(ROLES.cloudService)) {
        this.form.contacts = item ? item.contacts : ''
        this.form.contactsPhone = item ? this.decode(item.phone) : ''
        this.form.useDepartment = item ? item.department : id
        this.form.businessContacts = item ? item.contacts : ''
        this.form.businessPhone = item ? this.decode(item.phone) : ''
        this.form.technicalContacts = item ? item.contacts : ''
        this.form.technicalPhone = item ? this.decode(item.phone) : ''
      }

      const form = { ...this.form }
      if (!item) {
        form.customerId = ''
      }
      this.$emit('input', form)
    },
    decode(phone: string) {
      try {
        return decode(phone)
      } catch (error) {
        return phone
      }
    },
    formValidate() {
      return (this.$refs.form as any).validate()
    },
  },
  created() {
    let getter
    switch (true) {
      case this.authFit(ROLES.cloudService):
        getter = listCloudService
        break
      case this.authFit(ROLES.commercial):
        getter = ciUsers
        break
    }
    getter && (this.getter = () => getter().then(res => (this.body = res.data.body)))
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/radio';
</style>

<style lang="scss" module>
.edit {
  display: inline-block;
  margin-left: $gapNormal;
  vertical-align: middle;
}
</style>
