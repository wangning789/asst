<!-- 购物车入口 -->
<script lang="tsx">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import { CreateElement } from 'vue'

import ElBadge from 'element-ui/lib/badge'
import ElDropdown from 'element-ui/lib/dropdown'
import ElDropdownMenu from 'element-ui/lib/dropdown-menu'
import ElDropdownItem from 'element-ui/lib/dropdown-item'
import Icon from '@com/Icon'

import { SPA } from '@/config'
import { getIcon } from '@/enums/mall'
import { MODULE } from '@/enums/module'
import cart from '@/store/cart'
import formatNumber from '@/utils/formatNumber'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
function formatPrice(price?: number | string) {
  return formatNumber(price, 2)
}

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  // see: https://github.com/vuejs/jsx
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(h: CreateElement) {
    const STYLE = this.$style

    const instanceCart = cart()
    const rendBasket = () => {
      const rows = []

      const cart = instanceCart.cart
      const cartLen = cart.length
      let basket
      let items
      let i = 0
      let type
      let iLen
      let j
      while (i < cartLen) {
        if (!(basket = cart[i++])) {
          continue
        }

        type = basket.type
        rows.length && rows.push(<el-divider key={'' + type + i} />)

        // 分类
        rows.push(
          <ElDropdownItem disabled key={'_' + type + i} class={STYLE.type}>
            <Icon icon={getIcon(type)} />
            {basket.name} (￥{formatPrice(basket.price)})
          </ElDropdownItem>
        )

        // 商品
        items = basket.items
        iLen = items.length
        for (j = 0; j < iLen; j++) {
          const item = items[j]
          item.productDTOList?.length &&
            rows.push(
              <ElDropdownItem key={'' + type + i + j}>
                <a
                  class="el-link el-link--default"
                  on={{
                    click: () => {
                      this.jump({
                        SPA: SPA.mall,
                        id: SPA.mall,
                        path: item.serviceId,
                        append: true,
                      })
                    },
                  }}
                >
                  {item.serviceName} ({item.packageName})
                </a>
              </ElDropdownItem>
            )
        }
      }

      return rows
    }

    const total = instanceCart.total
    const icon = (
      <ElBadge max={99} value={instanceCart.total} hidden={!instanceCart.total}>
        <a
          class={'el-link el-link--default i-gouwuche1 ' + STYLE.icon}
          on={{
            click: () => {
              this.jump({ SPA: SPA.mall, id: MODULE.cart })
            },
          }}
        />
      </ElBadge>
    )

    return total ? (
      <ElDropdown vLoading={instanceCart.pending}>
        {icon}
        <template slot="dropdown">
          <ElDropdownMenu class={STYLE.menu}>{rendBasket()}</ElDropdownMenu>
        </template>
      </ElDropdown>
    ) : (
      icon
    )
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/badge';
@import '~element-ui/packages/theme-chalk/src/dropdown';
@import '~element-ui/packages/theme-chalk/src/dropdown-menu';
@import '~element-ui/packages/theme-chalk/src/dropdown-item';
</style>

<style lang="scss" module>
.icon {
  font-size: inherit !important;
}

.menu {
  max-height: 50vh;
  overflow-y: auto;

  :global(.el-divider) {
    margin: $gapNormal / 4 0;
  }
}

.type {
  color: $colorTextMain !important;
  font-weight: bold;

  > svg {
    margin-right: $gapNormal / 4;
    vertical-align: middle !important;
  }
}
</style>
