<!-- 统计 -->
<script lang="tsx">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import { CreateElement } from 'vue'
import IChooser from '@com/ChooserAsyncFunctional'
import IStat from '@com/Statistics'

import {
  userCount,
  optCount,
} from '@/api/servicePlatform/serverAssets'
import { ROLES } from '@/enums'
// import workorderIcon from '@home/assets/svg/workorder'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
const workorderIcon = {
  0: 'i-fuwuqizichanzongshu',
  1: 'i-daiquerenfuwuqizichanzongshu',
  2: 'i-djfgd',
  3: 'i-gdczl',
  4: 'i-jjgd',
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
      return this.authFit(ROLES.custom) ? userCount : optCount
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
              const data = body.map((item, i) => {
                item.icon = workorderIcon[i]
                item.title = item.name
                return item
              })

              return <IStat icons={workorderIcon} data={data} span={24 / data.length}/>
            },
          }}
        />
      )
    )
  },
}
</script>
