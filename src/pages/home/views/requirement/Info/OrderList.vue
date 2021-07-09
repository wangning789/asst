<!-- 描述 -->
<template>
  <div>
    <h4>
      相关订单
    </h4>
    <ITable
      ref="table"
      :head="head"
      :query="{ id }"
      :get="get"
    />
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import {
  getOrderList,
} from '@/api/requirement/requirement'

import ITable from '@com/Table'
import { toDetail } from '@/api/workflow/workflow'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  components: {
    ITable,
  },
  computed: {
    get: () => getOrderList,
    head() {
      return [
        {
          prop: 'orderNo',
          label: '订单编号',
          formatter: row =>
            this.$createElement(
              'ElButton',
              {
                props: { type: 'text' },
                on: {
                  click: () => {
                    toDetail(row.processId, '订单详情', msg => {
                      msg.data === 'close' && this.$refs.table.fetch()
                    })
                  },
                },
              },
              row.orderNo
            ),
        },
        { prop: 'orderBeginTime', label: '下单时间' },
        { prop: 'orderStatus', label: '订单状态' },
        {
          prop: 'expectDeliveryTime',
          label: '预计交付时间',
        },
        {
          prop: 'realDeliveryTime',
          label: '实际交付时间',
        },
      ]
    },
  },
}
</script>
