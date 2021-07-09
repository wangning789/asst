<!-- 工单管理 -->
<template>
  <div :class="$style.wrapper">
    <!-- 统计 -->
    <IStat :class="$style.mb" />

    <div :class="'el-card ' + $vnode.data.class">
      <!-- 筛选 -->
      <IFilter
        v-model="query"
        :title="route.meta.title"
      />
      <!-- 列表 -->
      <IList
        ref="table"
        :head="head"
        :query="query"
        :get="get"
        :show-total="showTotal"
      />
    </div>
  </div>
</template>

<script lang="ts">// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
// import ITable from '@com/Table'
import IList from './List'
import IStat from './Statistics'
import IFilter from './Filter'

import {
  customerOrderList,
  cloudServiceOrderList,
  sellsOrderList,
  PurchaseOrder,
  saleManagerOrderList,
  commercialOrderList,
  optManagerOrderList,
} from '@/api/servicePlatform/purchaseOrder'
import { toDetail } from '@/api/workflow/workflow'
import { ROLES } from '@/enums'
import formatNumber from '@/utils/formatNumber'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { route: { type: Object, required: true } },
  components: { IStat, IFilter, IList },
  data() {
    return { query: {} as PurchaseOrder, visible: false }
  },
  computed: {
    showTotal() {
      return this.authFit(ROLES.custom)
    },
    get() {
      switch (true) {
        case this.authFit(ROLES.custom):
          return customerOrderList
        case this.authFit(ROLES.cloudService):
          return cloudServiceOrderList
        case this.authFit(ROLES.sales):
          return sellsOrderList
        case this.authFit(ROLES.salesManager):
          return saleManagerOrderList
        case this.authFit(ROLES.commercial):
          return commercialOrderList
        case this.authFit(ROLES.operationManager):
          return optManagerOrderList
        default:
          return null
      }
    },
    head() {
      const orderNo = {
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
      }
      const orderPeopleName = { prop: 'customer', label: '下单客户' }
      const orderContent = { prop: 'orderContent', label: '订单内容' }
      // const securityServiceName = { prop: 'securityServiceName', label: '下单产品' }
      const orderPrice = {
        prop: 'discountOrderPrice',
        label: '订单金额（元）',
        formatter: row =>
          this.$createElement(
            'b',
            `￥${formatNumber(row.discountOrderPrice, 2)}`
          ),
      }
      const contractNumber = { prop: 'contractNumber', label: '合同编号' }
      // const createDate = { prop: 'orderBeginTime', label: '下单时间' }
      const expectDeliveryTime = {
        prop: 'expectDeliveryTime',
        label: '预计交付时间',
      }
      const orderStatusName = { prop: 'orderStatusName', label: '订单状态' }

      switch (true) {
        case this.authFit(ROLES.sales):
        case this.authFit(ROLES.custom):
        case this.authFit(ROLES.cloudService):
          orderNo.width = orderPrice.width = orderStatusName.width = 210
          return [orderNo, orderContent, orderPrice, orderStatusName]
        case this.authFit(ROLES.salesManager):
        case this.authFit(ROLES.commercial):
        case this.authFit(ROLES.operationManager):
        case this.authFit(ROLES.operation):
          orderNo.width = contractNumber.width = 200
          orderPeopleName.width = orderStatusName.width = 150
          expectDeliveryTime.width = 152
          orderPrice.width = 120
          return [
            orderNo,
            // securityServiceName,
            orderContent,
            orderPeopleName,
            contractNumber,
            // createDate,
            expectDeliveryTime,
            orderPrice,
            orderStatusName,
          ]
        default:
          return []
      }
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  padding: 0;
}

.mb {
  margin-bottom: $gapNormal;
}
</style>
