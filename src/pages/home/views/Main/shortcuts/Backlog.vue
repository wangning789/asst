<!-- 订单 -->
<template>
  <div>
    <IBar :to="to">
      {{ authFit(USER) ? '最新订单' : '待处理订单' }}
    </IBar>

    <ITable
      ref="table"
      :get="page"
      :head="head"
      layout
    />
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
import {
  getUserOrderList,
  getToDoOrderList,
} from '@/api/servicePlatform/purchaseOrder'
import { toDetail } from '@/api/workflow/workflow'
import ITable from '@com/Table'
import IBar from './Bar'

import { ROLES } from '@/enums'
import { MODULE } from '@/enums/module'

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  components: { IBar, ITable },
  computed: {
    USER: () => ROLES.custom,
    to: () => ({ id: MODULE.order }),
    page() {
      switch (true) {
        case this.authFit(ROLES.custom):
          return getUserOrderList
        default:
          return getToDoOrderList
      }
    },
    head() {
      const orderNo = {
        prop: 'orderNo',
        label: '订单编号',
        formatter: row => this.$createElement('a', {
          class: 'el-link el-link--primary',
          on: {
            click: () => {
              toDetail(row.processId, '订单详情', msg => {
                msg.data === 'close' && this.$refs.table.fetch()
              })
            },
          },
        }, row.orderNo),
        width: '170px',
      }
      return [
        orderNo,
        { prop: 'orderContent', label: '订单内容' },
        { prop: 'orderStatusName', label: '订单状态', width: '80px' },
      ]
    },

  },
}
</script>
