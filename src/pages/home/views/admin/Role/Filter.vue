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
      <ElButton
        type="primary"
        size="small"
        @click="$emit('add')"
      >
        新建
      </ElButton>
    </div>

    <Transition
      name="fold"
      mode="out-in"
    >
      <ElForm
        v-show="showFilter"
        inline
        size="small"
      >
        <ElFormItem>
          <ElInput
            :value="value.keyword"
            clearable
            placeholder="请输入关键字"
            @input="update('keyword', $event)"
          />
        </ElFormItem>

        <ElFormItem>
          <ElSelect
            v-model="value.roleCode"
            clearable
            filterable
            :popper-append-to-body="false"
            placeholder="请选择角色类型"
          >
            <ElOption
              v-for="(item, i) in roleCodeList"
              :key="i"
              :label="item.name"
              :value="item.code"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem>
          <DepSelect
            :visible="showFilter"
            :value="value.departmentId"
            @input="update('departmentId', $event)"
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
import { getColdeList } from '@/api/authServer/role'
import { trim } from '@/pipe'

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
    return { showFilter: false, roleCodeList: [] }
  },
  watch: {
    showFilter(data: any) {
      data && getColdeList().then(res => {
        this.roleCodeList = trim(res?.data?.body)
      })
    },
  },
  methods: {
    update(attr: string, value: any) {
      this.$emit('input', { ...this.value, [attr]: value })
    },
    checkLevel(attr: string, value: string) {
      ;((value = value.trim()) === '' ||
        (value > 0 && +value === (value | 0))) &&
        this.update(attr, value)
    },
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
