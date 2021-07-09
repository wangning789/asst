<!-- 待办与审批 -->
<template>
  <div>
    <IBar :to="to">
      最新告警
    </IBar>

    <ITable
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
import { detaList } from '@/api/servicePlatform/safety'
import ITable from '@com/Table'
import IBar from './Bar'

import { MODULE } from '@/enums/module'

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  components: { IBar, ITable },
  computed: {
    to: () => ({ id: MODULE.warning }),
    query: () => ({ pageSize: 5 }),
    page: () => detaList,
    head() {
      return [
        { prop: 'alarm_name', label: '告警名称' },
        { prop: 'alarm_level', label: '告警级别' },
        {
          label: '操作',
          formatter: (row: any) => this.$createElement(
            'RouterLink',
            {
              class: 'el-link el-link--primary',
              props: {
                to: {
                  id: MODULE.warning,
                  path: `${row.id}/info`,
                  append: true,
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
