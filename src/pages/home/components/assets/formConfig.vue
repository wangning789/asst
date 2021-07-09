<template>
  <ElForm
    ref="form"
    :model="form"
    size="small"
    :label-width="labelWidth"
  >
    <ElRow :class="$style.row">
      <ElCol
        v-for="(item, index) in formConfig"
        :key="index"
        :span="8"
      >
        <ElRow type="flex">
          <ElFormItem
            :prop="item.enName"
            :rules="[
              {
                required: item.required === '1',
                message: `${Number(item.type) >= 5 ? '请选择' : '请输入'}${
                  item.chName
                }`,
                trigger: 'change',
              },
              {
                pattern:
                  item.type === '2' &&
                  (
                    item.enName === 'intranetAddress' ||
                    item.enName === 'internetAddress')
                    ? /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/
                    : '',
                message: '请输入正确的网址',
                trigger: 'blur',
              },

              {
                pattern: item.type === '3' ? /^-?[0-9]\d*$/ : '',
                message: '请输入整数',
                trigger: 'blur',
              },
              {
                pattern:
                  item.type === '4'
                    ? /^((([0-9][0-9]*\.\d{2})))$/
                    : '',
                message: '请输入两位小数',
                trigger: 'blur',
              },
            ]"
          >
            <div
              v-if="item.chName.length > 7"
              slot="label"
              :class="$style.lebee"
            >
              <p> {{ item.chName + '：' }}</p>
            </div>
            <span
              v-else
              slot="label"
            >
              {{ item.chName + '：' }}
            </span>
            <!-- {
                pattern:
                  item.type === '2' &&
                  (
                    item.enName === 'intranetIp' ||
                    item.enName === 'interiorIp')
                    ? /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/
                    : '',
                message: '请输入正确的IP',
                trigger: 'blur',
              }, -->
            <ElInput
              v-if="item.type === '1'"
              v-model="form[item.enName]"
              show-word-limit
              maxlength="25"
              :placeholder="'请输入' + item.chName"
            />
            <ElInput
              v-if="item.type === '2'"
              v-model="form[item.enName]"
              show-word-limit
              maxlength="200"
              :placeholder="'请输入' + item.chName"
            />
            <ElInput
              v-if="item.type === '3'"
              v-model="form[item.enName]"
              show-word-limit
              maxlength="9"
              :placeholder="'请输入' + item.chName"
            />

            <ElInput
              v-if="item.type === '4'"
              v-model="form[item.enName]"
              show-word-limit
              maxlength="10"
              :placeholder="'请输入' + item.chName"
            />
            <ElDatePicker
              v-if="item.type === '5'"
              v-model="form[item.enName]"
              :value-format="DATE_TIME.serverDate"
              style="width: 100%;"
              type="date"
              placeholder="选择日期"
            />
            <ElDatePicker
              v-if="item.type === '6'"
              v-model="form[item.enName]"
              :value-format="DATE_TIME.serverDateTime"
              type="datetime"
              style="width: 100%;"
              placeholder="选择日期时间"
            />
            <ElSelect
              v-if="item.type === '7'"
              v-model="form[item.enName]"
              :placeholder="'请选择' + item.chName"
            >
              <ElOption
                v-for="(label, key) in JSON.parse(item.enumeration)"
                :key="key"
                :label="label"
                :value="key"
              />
            </ElSelect>
          </ElFormItem>
        </ElRow>
      </ElCol>
      <!-- 插入其他选项 -->
      <slot />
    </ElRow>
  </ElForm>
</template>
<script lang="ts">
// @ts-nocheck
/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
/** emit: (事件名: [参数列表, ...]) */
import ElDatePicker from 'element-ui/lib/date-picker'
import { DATE_TIME } from '@/enums/format'
// import ElInputNumber from 'element-ui/lib/input-number'
export default {
  props: {
    formConfig: { type: Array, required: true }, // 配置项
    form: { type: Object, required: true }, // 表单对象
    labelWidth: { type: String, default: '100px' },
  },
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  components: { ElDatePicker },
  computed: {
    DATE_TIME: () => DATE_TIME,
  },
  methods: {
    validate() {
      let formValid
      this.$refs.form.validate((valid: boolean) => {
        formValid = valid
      })
      return formValid
    },
  },
}
</script>
<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/date-picker';
@import '~element-ui/packages/theme-chalk/src/input-number';
</style>
<style lang="scss" module>
.row {
  .label {
    width: 120px;
    min-width: 80px;
    padding: 0 40px;
    color: #071124;
    font-weight: 400;
    text-align: left;
  }

  .text {

    @extend %ellipsis;
    // min-width: 50px;
    padding-left: 20px;
  }
}

.lebee {
  width: 100px;
  height: 32px;

  p {
    margin: 0;
    line-height: 20px;
  }
}

.row :global(.el-form-item) {
  width: 100%;
}

.row :global(.el-input__suffix) {
  top: 2px;
}
</style>
