<!-- 详情展示 -->
<template>
  <ElForm
    :label-width="CONFIG.labelWidth"
    label-position="right"
  >
    <!-- 详情第一行 -->
    <ElRow
      type="flex"
      justify="space-between"
    >
      <ElCol :span="8">
        <ElFormItem label="客户编号：">
          <span>{{ data.customerNo }}</span>
        </ElFormItem>
      </ElCol>
      <ElCol :span="8">
        <ElFormItem label="客户联系人：">
          <span>{{ data.contacts }}</span>
        </ElFormItem>
      </ElCol>

      <ElCol :span="8">
        <ElFormItem label="联系方式：">
          <span>{{ data.phone }}</span>
        </ElFormItem>
      </ElCol>
    </ElRow>
    <!-- 详情第二行 -->
    <ElRow
      type="flex"
      justify="space-between"
    >
      <ElCol :span="8">
        <ElFormItem label="客户单位：">
          <span>{{ data.department }}</span>
        </ElFormItem>
      </ElCol>
      <ElCol :span="8">
        <ElFormItem label="是否重点客户：">
          <span>{{ data.keyStatus?'是':'否' }}</span>
        </ElFormItem>
      </ElCol>
      <ElCol :span="8">
        <ElFormItem label="负责人：">
          <span
            v-for="(item,index) in sellMan"
            :key="index"
          >【{{ item.name }}】</span>
        </ElFormItem>
      </ElCol>
    </ElRow>
    <!-- 第三行 -->
    <ElRow
      type="flex"
      justify="space-between"
    >
      <ElCol :span="8">
        <ElFormItem label="云服务商：">
          <div
            v-for="(item,index) in data.provider"
            :key="index"
          >
            【{{ item.name }}】
          </div>
        </ElFormItem>
      </ElCol>
      <ElCol :span="8">
        <ElFormItem label="最后编辑时间：">
          <span>{{ data.createDate }}</span>
        </ElFormItem>
      </ElCol>
      <ElCol :span="8">
        <ElFormItem label="备注：">
          <span>{{ data.note }}</span>
        </ElFormItem>
      </ElCol>
    </ElRow>
  </ElForm>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { data: { type: Object, required: true } },
  computed: {
    sellMan() {
      return [this.data.sellMan]
    },
  },
}
</script>
