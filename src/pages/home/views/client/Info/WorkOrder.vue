<!-- 相关工单 -->
<template>
  <div>
    <h3>相关工单</h3>
    <ITable
      :get="page"
      :query="params"
      :head="head"
      :layout="false"
    >
      <!-- <ElTableColumn
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
      </ElTableColumn> -->
    </ITable>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
// import ITable, { ElTableColumn } from '@com/Table'
import ITable from '@com/Table'
import { selectWorkOrderList } from '@/api/sell/client'
/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { id: { type: String, required: true } },
  // components: { ITable, ElTableColumn },
  components: { ITable },
  data() {
    return {
      params: {
        customerId: this.id,
      },
    }
  },
  computed: {
    page: () => selectWorkOrderList,
    head: () => [
      { prop: 'workOrderNo', label: '工单编号' },
      { prop: 'created', label: '创建时间' },
      { prop: 'handler', label: '当前处理人' },
      { prop: 'nodeName', label: '当前环节' },
      { prop: 'reliveryTime', label: '预计交付时间' },
      { prop: 'approveTime', label: '实际交付时间' },
      { prop: 'purchaseOrderNo', label: '关联订单' },
      // { prop: 'evaluationContent', label: '评价' },
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
