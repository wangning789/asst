<!-- 运维处置记录 -->
<template>
  <div>
    <h4>运维处置记录</h4>

    <ITable
      ref="table"
      :get="page"
      :query="{ id }"
      :head="head"
      :layout="false"
    />
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
// import ITable, { ElTableColumn } from '@com/Table'
import ITable from '@com/Table'
import { ROLES } from '@/enums'
import {
  toDetail,
} from '@/api/workflow/workflow'

import {
  customWorkOrder,
  optWorkOrder,
} from '@/api/servicePlatform/notice'
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
    page() {
      switch (true) {
        // 用户
        case this.authFit(ROLES.custom):
          return customWorkOrder
        // 运维
        case this.authFit(ROLES.operation):
          return optWorkOrder
        default:
          return null
      }
    },
    head() {
      return [
        {
          prop: 'workOrderNo',
          label: '工单编号',
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
        },
        { prop: 'createDate', label: '创建时间' },
        { prop: 'dealContent', label: '服务内容' },
        { prop: 'handlerName', label: '运维人员' },
      ]
    },
  },
  methods: {
    refresh() {
      this.$refs.table.fetch()
    },
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
