<!-- 相关订单 -->
<template>
  <div>
    <h3>相关订单</h3>
    <ITable
      :get="page"
      :query="params"
      :head="head"
      :layout="false"
    />
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ITable from '@com/Table'
import { selectOrderList } from '@/api/sell/client'
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
    page: () => selectOrderList,
    head: () => [
      { prop: 'orderNo', label: '订单编号' },
      { prop: 'orderBeginTime', label: '下单时间' },
      { prop: 'processor', label: '当前处理人' },
      { prop: 'orderStatus', label: '订单状态' },
      { prop: 'expectDeliveryTime', label: '预计交付时间' },
      { prop: 'realDeliveryTime', label: '实际交付时间' },
      { prop: 'evaluationContent', label: '评价' },
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
