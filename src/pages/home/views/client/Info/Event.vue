<!-- 待处理事件 -->
<template>
  <div>
    <h3>待处理安全事件事件</h3>
    <ITable
      :get="page"
      :query="params"
      :head="head"
      :layout="false"
    >
      <ElTableColumn
        fixed="right"
        label="操作"
        width="120"
      >
        <template #default="">
          <i
            class="i-cuiban"
            :class="$style.icon"
          />
        </template>
      </ElTableColumn>
    </ITable>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ITable, { ElTableColumn } from '@com/Table'
import { selectEventList } from '@/api/sell/client'
/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { id: { type: String, required: true } },
  components: { ITable, ElTableColumn },
  data() {
    return {
      params: {
        customerId: this.id,
      },
    }
  },
  computed: {
    page: () => selectEventList,
    head: () => [
      { prop: 'eventNo', label: '安全事件编号' },
      { prop: 'createDate', label: '发生时间' },
      { prop: 'eventName', label: '事件名称' },
      { prop: 'department', label: '事件类型' },
      { prop: 'threatLevel', label: '事件级别' },
      { prop: 'eventStatus', label: '状态' },
    ],

  },
}
</script>

<style lang="scss" module>
.icon {
  font-size: $large;

  &:hover {
    cursor: pointer;
  }
}
</style>
