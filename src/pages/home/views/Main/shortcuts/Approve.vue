<!-- 待办与审批 -->
<template>
  <div>
    <IBar :to="to">
      审批
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
import { list, listor } from '@/api/servicePlatform/examination'
import ITable from '@com/Table'
import IBar from './Bar'

import { ROLES } from '@/enums'
import { MODULE } from '@/enums/module'
import { THEME } from '@/enums/approve'

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  components: { IBar, ITable },
  computed: {
    examinationThemes: () => THEME,
    to: () => ({ id: MODULE.approve }),
    query: () => ({ pageSize: 5, examinationStatus: 0 }),
    page() {
      switch (true) {
        case this.authFit(ROLES.commercialManager):
          return list
        case this.authFit(ROLES.commercialMember):
          return listor
        default:
          return null
      }
    },
    head() {
      return [
        {
          prop: 'examinationTheme',
          label: '审批主题',
          formatter: (row: any) => {
            const state = row.examinationTheme
            return row.domainName || this.examinationThemes[state] || '未知'
          },

        },
        { prop: 'applicantName', label: '审批发起人' },
        {
          label: '操作',
          formatter: (row: any) => {
            let name = ''
            if (this.authFit(ROLES.commercialManager)) {
              name = '审批'
            } else {
              name = '查看'
            }
            return this.$createElement(
              'RouterLink',
              {
                class: 'el-link el-link--primary',
                props: {
                  to: {
                    id: MODULE.approve,
                    path: `detail?id=${row.id}`,
                    append: true,
                  },
                },
              },
              name
            )
          },
        },
      ]
    },

  },
}
</script>
