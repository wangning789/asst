<!-- 购物车 -->
<template>
  <div
    v-loading="cart.pending"
    class="el-card"
  >
    <h4>{{ route.meta.title }} ({{ cart.total }})</h4>
    <!-- 商品列表 -->
    <IItems
      :cart="cart.cart"
      :total="cart.total - cart.invalid"
      :selected="cart.selected"
      @toggle="toggle"
      @remove="remove"
    />
    <!-- 结算按钮 -->
    <div :class="$style.bar">
      <RouterLink
        :to="mall"
        class="el-button el-button--text"
      >
        继续购物
      </RouterLink>

      <div>
        已选择 <span :class="$style.count">{{ cart.selected.length }}</span> 件商品，
        总计：<span :class="$style.price">￥{{ format(cart.selectedPrice) }}</span>
        <ElButton
          type="primary"
          :loading="isSync"
          @click="goCashier"
        >
          去结算
        </ElButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import IItems from '@mallCom/Items'

import { SPA } from '@/config'
import { STORAGE } from '@/enums'
import { MODULE } from '@/enums/module'
import cart from '@/store/cart'
import { local } from '@/utils/storage'
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
  props: { route: { type: Object, required: true } },
  components: { IItems },
  data: () => ({ isSync: false }),
  computed: {
    cart,
    mall: () => ({ id: SPA.mall }),
  },
  methods: {
    format: formatPrice,
    remove(item: any) {
      this.$confirm('确定要移除该商品？', '移除确认', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      }).then(() => {
        this.cart.remove(item)
      })
    },
    toggle(item: any) {
      this.cart.toggle(item)
    },
    goCashier() {
      const selected = this.cart.selected
      if (!selected.length) {
        return this.$message.warning('请选择要结算的商品')
      }

      this.isSync = true
      const cart = this.cart
      cart.submit().then(() => {
        local.set(STORAGE.cashier, selected)
        this.$router.push({ id: MODULE.cashier })
      }).finally(() => {
        this.isSync = false
      })
    },
  },
}
</script>

<style lang="scss" module>
.bar {
  > div {
    float: right;
  }
}

.count,
.price {
  color: $colorTheme;
  font-weight: bold;
}

.count {
  font-size: $larger;
}

.price {
  margin-right: $gapNormal;
  font-size: $xxLarge;
}
</style>
