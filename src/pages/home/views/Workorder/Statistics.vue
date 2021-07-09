<!-- 统计 -->
<script lang="tsx">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import { CreateElement } from 'vue'
import IChooser from '@com/ChooserAsyncFunctional'
import IStat from '@com/Statistics'

import { trim } from '@/pipe'
import {
  getWorkorderStatistics,
  getWorkOrderCountToCustomer,
} from '@/api/servicePlatform/workorder'
import { ROLES } from '@/enums'
// import workorderIcon from '@home/assets/svg/workorder'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
const rule = (v: any, k: string) => ({ v, k: k.substring(12) })
const workorderIcon = {
  all: 'i-gdtj',
  pending: 'i-dclgd',
  advent: 'i-djfgd',
  disposalRate: 'i-gdczl',
  exigence: 'i-jjgd',
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
      const fn = this.authFit(ROLES.custom) ? getWorkOrderCountToCustomer : getWorkorderStatistics
      // TODO: 查询接口
      return () => {
        return fn().then((res: any) => {
          if (res && res.data && res.data.body) {
            let data = []
            const body = res.data.body
            switch (true) {
              case this.authFit(ROLES.custom):
                data = body.filter((item: any) => item.statistical_type === 'all' || item.statistical_type === 'pending')
                break
              case this.authFit(ROLES.operation):
                data = body
                break
              default:
                data = body.filter((item: any) => item.statistical_type === 'all' || item.statistical_type === 'pending')
                break
            }
            return {
              data: {
                body: data,
              },
            }
          }
          return res
        })
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
                data: {
                  body,
                },
              },
            }) => {
              const data = trim(body, rule, true).map((item) => {
                item.icon = workorderIcon[item.type]
                return item
              })
              return <IStat icons={workorderIcon} data={data}/>
            },
          }}
        />
      )
    )
  },
}
</script>
