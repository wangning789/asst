<!-- 订单 -->
<template>
  <div>
    <IBar :to="to">
      最新订单
    </IBar>

    <ITable
      ref="table"
      :get="page"
      :query="query"
      :head="head"
      layout
    />
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
import ITable from '@com/Table'
import IBar from './Bar'

import { getNewOrderList } from '@/api/servicePlatform/purchaseOrder'
import { toDetail } from '@/api/workflow/workflow'
import { MODULE } from '@/enums/module'

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  components: { IBar, ITable },
  computed: {
    to: () => ({ id: MODULE.order }),
    page: () => getNewOrderList,
    query: () => ({ pageSize: 5 }),
    head() {
      return [
        { prop: 'servicePackageName', label: '服务包名' },
        { prop: 'orderStatusName', label: '订单状态' },
        {
          label: '操作',
          formatter: (row: any) => this.$createElement(
            'a',
            {
              class: 'el-link el-link--primary ',
              on: {
                click: () => {
                  toDetail(row.processId, '订单详情', msg => {
                    msg.data === 'close' && this.$refs.table.fetch()
                  })
                },
              },
            },
            '查看'
          ),
        },
      ]
    },

  },
}
</script>
