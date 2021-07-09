<!-- 分配弹框 -->
<template>
  <ElDialog
    title="分配销售"
    :visible.sync="visible"
  >
    <ElForm>
      <ElFormItem
        label="请分配负责销售:"
        label-width="150px"
      >
        <ElSelect
          v-model="sellMan"
          placeholder="请选择活动区域"
        >
          <ElOption
            label="区域一"
            value="shanghai"
          />
          <ElOption
            label="区域二"
            value="beijing"
          />
        </ElSelect>
      </ElFormItem>
    </ElForm>

    <template #footer>
      <ElButton
        type="primary"
        @click="visible = false"
      >
        确定
      </ElButton>

      <ElButton @click="visible = false">
        取消
      </ElButton>
    </template>
  </ElDialog>
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
  props: { visible: { type: Boolean, required: true } },
  data() {
    return {
      sellMan: '',
    }
  },
}
</script>

<style lang="scss" module>
.wrapper {
  text-align: center;
}
</style>
