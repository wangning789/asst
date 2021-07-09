<!-- 角色管理 -->
<template>
  <div :class="$style.wrapper">
    <!--    <Irequire />-->

    <!-- 统计 -->
    <IStat :class="$style.mb" />

    <div :class="'el-card ' + $style.card">
      <!-- 筛选 -->
      <IFilter
        v-model="query"
        :title="route.meta.title"
        @add="role = {}, visible = true"
      />
      <!-- 列表 -->
      <ITable
        ref="table"
        fit
        :head="head"
        :query="query"
        :get="get"
      />
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ITable from '@com/Table'
import IFilter from './Filter'
import IStat from './Statistics'

import {
  getWorkorders,
  getWorkOrderListToCustomer,
} from '@/api/servicePlatform/workorder'
import {
  toDetail,
} from '@/api/workflow/workflow'

import { ROLES } from '@/enums'

const TYPES = {
  DELIVER_WORK_ORDER: '交付工单',
  SERVICE_OPERATE_ORDER: '服务运维工单',
  ALARM_OPERATE_ORDER: '告警处置工单',
  WARN_OPERATE_ORDER: '预警处置工单',
}
const LEVELS = {
  COMMON_LEVEL_WORK: '一般',
  URGENT_LEVEL_WORK: '紧急',
}

// const LEVELS = sub('父节点码值')
// const SOURCECODE = {
//   LOCAL_WORK_ORDER: '本地',
//   REMOTE_WORK_ORDER: '远程',
// }

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { route: { type: Object, required: true } },
  components: { IFilter, ITable, IStat },
  data() {
    return {
      isOperation: false,
      query: {
        dataField: this.route?.params?.dataField || 'all', // 数据范围，all-全部，todo-待办
      },
      visible: false,
      role: '',
    }
  },
  computed: {
    get() {
      if (this.authFit(ROLES.custom)) {
        return getWorkOrderListToCustomer
      } else {
        return getWorkorders
      }
    },
    head() {
      const workOrderNo = {
        prop: 'workOrderNo',
        label: '工单编号',
        width: '350px',
        // 根据id查询慧正流程URL并跳转
        formatter: (row: any) =>
          this.$createElement('ElButton', {
            props: {
              type: 'text',
            },
            on: {
              click: () => {
                toDetail(row.processId, '工单详情', msg => {
                  msg.data === 'close' && this.$refs.table.fetch()
                })
              },
            },
          }, row.workOrderNo || '-'),
      }
      const workOrderName = { prop: 'workOrderName', label: '工单标题' }
      const typeName = { prop: 'typeCode', label: '工单类型', formatter: (row: any) => (TYPES[row.typeCode] || '-') }
      const created = { prop: 'created', label: '创建时间' }
      const initiator = { prop: 'initiator', label: '发起人' }
      const nodeName = { prop: 'nodeName', label: '流程节点' }
      // const purchaseOrderNo = { prop: 'purchaseOrderNo', label: '关联订单' }
      // const securityServiceName = { prop: 'securityServiceName', label: '服务名称' }
      // const sourceName = {
      //   prop: 'sourceCode',
      //   label: '工单来源',
      //   formatter: (row: any) => (SOURCECODE[row.sourceCode] || '-'),
      // }
      const reliveryTime = { prop: 'reliveryTime', label: '到期时间' }
      const handler = { prop: 'handler', label: '当前处理人' }
      const workLevelName = { prop: 'workLevelCode', label: '工单级别', formatter: (row: any) => (LEVELS[row.workLevelCode] || '-') }
      switch (true) {
        // 用户
        case this.authFit(ROLES.custom):
          return [
            workOrderNo,
            workOrderName,
            typeName,
            created,
            initiator,
            nodeName,
          ]
        // 运维
        case this.authFit(ROLES.operation):
          return [
            workOrderNo,
            workOrderName,
            typeName,
            initiator,
            created,
            reliveryTime,
            handler,
            workLevelName,
            nodeName,
          ]
        default:
          return [
            workOrderNo,
            workOrderName,
            typeName,
            created,
            initiator,
            nodeName,
          ]
          // return [
          //   workOrderNo,
          //   workOrderName,
          //   purchaseOrderNo, // 关联订单
          //   sourceName, // 工单来源
          //   securityServiceName, // 服务名称
          //   initiator,
          //   handler,
          //   typeName,
          //   workLevelName,
          //   created,
          //   reliveryTime,
          //   nodeName,
          // ]
      }
    },
  },
  methods: {
    refresh() {
      ;(this.$refs.table as any).fetch()
    },
  },
}
</script>

<style lang="scss" module>
// .switch {
//   margin-left: 10px;
// }
.wrapper {
  padding: 0;
}

.card {
  padding: $gapNormal;
}

.mb {
  margin-bottom: $gapNormal;
}
</style>
