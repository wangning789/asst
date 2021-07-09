<!-- 统计 -->
<script lang="tsx">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import { CreateElement } from 'vue'
import IChooser from '@com/ChooserAsyncFunctional'
import IStat from '@com/Statistics'

import { trim } from '@/pipe'
import {
  customCount,
  sellsCount,
  operationManagerCount,
  commercialCount,
  cloudServiceCount,
  sellsManagerCount,
} from '@/api/servicePlatform/purchaseOrder'
import { ROLES } from '@/enums'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
const rule = (v: any, k: string) => ({ v, k: k.substring(12) })
const icons = {
  all: 'i-qbdd',
  // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
  to_delivered: 'i-dqrdd',
  delivering: 'i-djfdd',
  // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
  pending_evaluation: 'i-cswjfdd',
  // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
  pending_confirm: 'i-dqrdd',
  // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
  pending_handle: 'i-djfdd',
  overtime: 'i-cswjfdd',
  finish: 'i-ywcdd',
}

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    fetch() {
      switch (true) {
        case this.authFit(ROLES.custom):
          return customCount
        case this.authFit(ROLES.sales):
          return sellsCount
        case this.authFit(ROLES.operationManager):
          return operationManagerCount
        case this.authFit(ROLES.commercial):
          return commercialCount
        case this.authFit(ROLES.cloudService):
          return cloudServiceCount
        case this.authFit(ROLES.salesManager):
          return sellsManagerCount
        default:
          return () => Promise.reject(new Error('没有数据权限'))
      }
    },
  },
  // see: https://github.com/vuejs/jsx
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(h: CreateElement) {
    const fetch = this.fetch

    return (
      fetch && (
        <IChooser
          fetch={fetch}
          scopedSlots={{
            success: ({
              data: {
                data: { body },
              },
            }) => <IStat icons={icons} data={trim(body, rule, true)} />,
          }}
        />
      )
    )
  },
}
</script>
