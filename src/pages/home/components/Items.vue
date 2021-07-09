<!-- 商品列表 -->
<script lang="tsx">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import { CreateElement } from 'Vue'

// import ElTag from 'element-ui/lib/tag'
import ElInputNumber from 'element-ui/lib/input-number'
// import Icon from '@com/Icon'

// import { SPA } from '@/config'
import MSG from '@/config/message'
// import { getIcon } from '@/enums/mall'
import { Basket } from '@/store/cart'
import formatNumber from '@/utils/formatNumber'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
function formatPrice(price?: number | string) {
  return formatNumber(price, 2)
}
// function filterByStatus(item: Basket['items'][0]) {
//   return !item.status
// }

/** emit: (事件名: [参数列表, ...])
 *    toggle: [item: Cart] 切换商品选中
 *    remove: [item: Cart] 移除一个商品
 */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    /** 购物车/结算 篮子 */
    requirement: { type: Array as Basket[], required: true },
    /** 有效商品总数 */
    // total: { type: Number, default: 0 },
    disable: { type: Boolean, default: false },
    /** 是否只允许修改数量(for 结算) */
    countonly: { type: Boolean },
    serviceList: { type: Array as Basket[], required: true },
  },
  // see: https://github.com/vuejs/jsx
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(h: CreateElement) {
    const cart: Basket[] = this.requirement
    const countonly: boolean = this.countonly
    const disable: boolean = this.disable
    const STYLE = this.$style
    const colspan = countonly ? 7 : 9
    const rendBasket = () => {
      const rows = []

      const cLen = cart.length
      let i
      let basket
      // let type
      let items
      let iLen
      let j
      let products
      let k
      let pLen
      let cells
      for (i = 0; i < cLen; i++) {
        basket = cart[i]
        if (!basket) {
          continue
        }

        // 服务
        items = basket.items

        iLen = items.length
        for (j = 0; j < iLen; j++) {
          const item = items[j]
          if ((products = item.productDTOList) && (pLen = products.length)) {
            for (k = 0; k < pLen; k++) {
              const product = products[k]
              cells = [
                // 内容
                <td>{product.productsName}</td>,
                // 单价
                <td>￥{formatPrice(product.originalPrice)}</td>,
                // 折扣价
                <td>
                  <el-input
                    disabled={disable}
                    size="small"
                    value={
                      (product.productPrice =
                        product.productPrice || 0)
                    }
                    on={{
                      input(productPrice: string) {
                        product.productPrice = productPrice.replace(/[^\d.]/g, '') || 0
                        if (+productPrice >= (+product.originalPrice || 0)) {
                          product.productPrice = +product.originalPrice
                        }
                      },
                    }}
                  >
                    <template slot="prepend">￥</template>
                  </el-input>
                </td>,
                // 数量
                <td>
                  <ElInputNumber
                    disabled={disable}
                    value={(product.quantity = product.quantity | 0 || 1)}
                    size="small"
                    step={1}
                    step-strictly={true}
                    min={1}
                    max={1000}
                    on={{
                      change(quantity: string) {
                        product.quantity = quantity | 0 || 1
                      },
                    }}
                  />
                </td>,
              ]

              rows.push(
                k ? (
                  <tr key={'' + i + j + k}>{cells}</tr>
                ) : (
                  <tr key={'' + i + j + k}>
                    {/* 产品名称 */}
                    <td rowspan={pLen}>
                      {
                        <el-select
                          size="small"
                          disabled={disable}
                          value={item.serviceId}
                          on={{
                            change: (serviceId: any) => {
                              item.serviceId = serviceId
                              this.$emit('init', item)
                            },
                          }}
                        >
                          {this.serviceList &&
                            this.serviceList.length &&
                            this.serviceList.map(service => {
                              return (
                                <el-option
                                  value={service.id}
                                  label={service.serviceName}
                                />
                              )
                            })}
                        </el-select>
                      }
                    </td>
                    {/* 规格 */}
                    <td rowspan={pLen}>
                      {
                        <el-select
                          disabled={disable}
                          size="small"
                          value={item.packageId}
                          on={{
                            change: (packageId: string) => {
                              item.packageId = packageId
                              this.$emit('update', item)
                            },
                          }}
                        >
                          {item.packageList &&
                            item.packageList.length &&
                            item.packageList.map(packageItem => {
                              return (
                                <el-option
                                  value={packageItem.id}
                                  label={packageItem.packageName}
                                />
                              )
                            })}
                        </el-select>
                      }
                    </td>
                    {/* 购买时长 */}
                    <td rowspan={pLen}>
                      {/* item.purchaseDuration */}
                      <ElInputNumber
                        disabled={disable}
                        value={
                          (item.purchaseDuration =
                            item.purchaseDuration | 0 || 1)
                        }
                        size="small"
                        step={1}
                        step-strictly={true}
                        min={1}
                        max={1000}
                        on={{
                          change(purchaseDuration: string) {
                            item.purchaseDuration = purchaseDuration | 0 || 1
                          },
                        }}
                      />
                    </td>
                    {/* 内容 */}
                    {cells}
                    {/* 总计 */}
                    <td rowspan={pLen} class={STYLE.amount}>
                      ￥{formatPrice(item.totalAmount)}
                    </td>
                    {/* 操作 */}
                    {countonly || (
                      <td rowspan={pLen} class={STYLE.operation}>
                        {iLen !== 1 && (
                          <el-tooltip content="移除">
                            <el-button
                              disabled={disable}
                              type="text"
                              icon="el-icon-delete-solid"
                              on={{ click: () => this.$emit('remove', item) }}
                            />
                          </el-tooltip>
                        )}
                        {j === iLen - 1 && (
                          <el-tooltip content="添加">
                            <el-button
                              disabled={disable}
                              type="text"
                              icon="el-icon-circle-plus-outline"
                              on={{ click: () => this.$emit('add') }}
                            />
                          </el-tooltip>
                        )}
                      </td>
                    )}
                  </tr>
                )
              )
            }
          }
        }

        // 总计
        rows.push(
          <tr key={i + '_'} style="display:none">
            <td colspan={colspan} class={STYLE.price}>
              总计：<span>￥{formatPrice(basket.price)}</span>
            </td>
          </tr>
        )
      }

      return rows
    }

    return (
      <table class={STYLE.table}>
        <thead>
          <tr>
            <th>服务名称</th>
            <th>服务内容</th>
            <th width="90px">购买时长（年）</th>
            <th>服务产品</th>
            <th width="121px">单价</th>
            <th width="180px">调整后单价</th>
            <th width="155px">购买数量</th>
            <th width="137px">总价</th>
            {countonly || <th width="100px">操作</th>}
          </tr>
        </thead>

        <tbody>
          {cart && cart.length ? (
            rendBasket()
          ) : (
            <tr>
              <td colspan={colspan} class={STYLE.empty}>
                <i class="i-zanwushuju" /> {MSG.empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    )
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/tag';
@import '~element-ui/packages/theme-chalk/src/input-number';
</style>

<style lang="scss" module>
.table {
  width: 100%;
  margin: $gapNormal 0;
  color: $colorTextCommon;
  text-align: left;
  border-collapse: collapse;

  :global {
    .el-checkbox {
      margin-right: 10px;
    }
  }

  thead {
    background: $colorTheme9;
  }

  td {
    border: $borderBase;
  }

  td,
  th {
    box-sizing: border-box;
    padding: $gapNormal / 2;
    text-overflow: ellipsis;
    vertical-align: middle;
  }
}

.center {
  text-align: center;

  :global(.el-checkbox) {
    margin-right: 5px !important;
  }
}

.type,
.price,
.empty {
  border: none !important;
}

.type {
  text-align: left;

  svg {
    margin-right: $gapNormal / 4;
    vertical-align: middle;
  }
}

.price {
  text-align: right;

  > span {
    font-weight: bold;
    font-size: $large;
  }
}

.amount {
  color: $colorTextMain;
  font-weight: bold;
}

.operation {
  text-align: center;

  i {
    font-size: $large;
  }
}

.empty {
  padding: $gapNormal !important;
  font-size: $larger;
  text-align: center;

  > i {
    font-size: $xLarge;
    vertical-align: middle;
  }
}
</style>
