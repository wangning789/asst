<!-- 联系人信息 -->
<template>
  <div>
    <!-- 代下单选客户 -->
    <IChooser
      v-if="getter"
      :fetch="getter"
      tag="ElSelect"
      filterable
      :value="val.id"
      @change="onChange"
    >
      <ElOption
        v-for="item in body"
        :key="item.id"
        :label="item.contacts"
        :value="item.id"
      />
    </IChooser>

    <!-- 联系人信息 -->
    <div
      v-show="val.id && !isEdit"
      :class="$style.info"
    >
      <ElRadio
        value
        label
      />
      <span>{{ val.contacts }}</span>
      <span>{{ decode(val.phone) }}</span>
      <ElButton
        type="text"
        @click="edit"
      >
        修改
      </ElButton>
    </div>

    <!-- 编辑联系人信息 -->
    <ElForm
      v-show="val.id && isEdit"
      ref="form"
      inline
      :model="form"
      :class="$style.edit"
    >
      <ElFormItem
        prop="contacts"
        label="联系人："
        :rules="{required: true, message: '请输入联系人'}"
      >
        <ElInput
          v-model="form.contacts"
          placeholder="请输入联系人"
        />
      </ElFormItem>

      <ElFormItem
        prop="phone"
        label="联系方式："
        :rules="checkPhone"
      >
        <ElInput
          v-model="form.phone"
          placeholder="请输入联系方式"
        />
      </ElFormItem>

      <ElFormItem>
        <ElButton
          type="text"
          @click="confirm"
        >
          确定
        </ElButton>

        <ElButton
          type="text"
          @click="isEdit = false"
        >
          取消
        </ElButton>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElRadio from 'element-ui/lib/radio'
import IChooser from '@com/ChooserAsyncFunctional'

import { SPA } from '@/config'
import { ROLES } from '@/enums'
import { authFit } from '@/functions/auth'
import { encode, decode } from '@/functions/cipher'
import { phone } from '@/functions/validators'
import me from '@/store/user'

import { info, listCloudService, listSales } from '@/api/servicePlatform/customer'

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
  props: { value: { type: Object, default: () => ({}) } },
  components: { ElRadio, IChooser },
  data() {
    return { getter: null, isEdit: false, val: {}, body: null, form: {} }
  },
  computed: {
    checkPhone() {
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

          try {
            phone(value)
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
        this.val = { ...value }
      },
    },
  },
  methods: {
    onChange(id: string) {
      const item = this.body.find(item => item.id === id)
      this.$emit('input', item)
      this.val = item
    },
    decode(phone: string) {
      try {
        return decode(phone)
      } catch (error) {
        return phone
      }
    },
    edit() {
      const val = this.val
      this.form = {
        contacts: val.contacts,
        phone: this.decode(val.phone),
      }
      this.isEdit = true
    },
    confirm() {
      ;(this.$refs.form as any).validate((valid: boolean) => {
        if (valid) {
          const val = this.val
          const form = this.form
          val.contacts = form.contacts
          val.phone = encode(form.phone)
          this.$emit('input', val)
          this.isEdit = false
        }
      })
    },
  },
  created() {
    let getter
    switch (true) {
      case authFit(SPA.mall, [ROLES.custom]):
        info(me.id).then(res => {
          this.$emit('input', {
            id: me.id,
            department: me.departmentName || me.aliasName,
            contacts: (me.contacts = (res.data.body || {}).contacts),
            phone: me.cellPhone || me.username,
          })
        })
        return this.$emit('input', {
          id: me.id,
          department: me.departmentName || me.aliasName,
          contacts: me.aliasName,
          phone: me.cellPhone || me.username,
        })
      case authFit(SPA.mall, [ROLES.cloudService]):
        getter = listCloudService
        break
      case authFit(SPA.mall, [ROLES.sales]):
        getter = listSales
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
.info,
.edit {
  display: inline-block;
  margin-left: $gapNormal;
  vertical-align: middle;
}

.edit :global {
  .el-form-item,
  .el-form-item__content {
    margin-bottom: 0 !important;
  }
}

.info {
  > :global(.el-radio) {
    margin-right: 0;
  }

  > span {
    margin-right: $gapNormal;
  }
}
</style>
