<!-- 购物车 -->
<template>
  <div
    v-loading="cashier.pending"
    :class="'el-card ' + $style.wrapper"
  >
    <h4 :class="$style.title">
      {{ route.meta.title }} ({{ cashier.total }})
    </h4>
    <h5>确认联系信息</h5>
    <IContact v-model="contact" />

    <h5>确认订单信息</h5>
    <template v-for="cart in cashier.cart">
      <h6 :key="cart.type + '0'">
        <IIcon :icon="getIcon(cart.type)" />{{ cart.name }}
      </h6>
      <IItems
        :key="cart.type + '1'"
        countonly
        :cart="[cart]"
      />
      <span
        :key="cart.type + '2'"
        :class="[$style.middle, $style.label]"
      >订单备注：</span>
      <ElInput
        :key="cart.type + '3'"
        v-model="remarks[cart.type]"
        show-word-limit
        type="textarea"
        placeholder="请输入订单备注"
        :rows="2"
        :maxlength="CONFIG.maxLength * 3"
        :class="[$style.middle, $style.remark]"
      />
    </template>
    <!-- 结算 -->
    <div :class="$style.bar">
      总计：<span :class="$style.price">￥{{ format(cashier.price) }}</span>

      <ElButton
        type="primary"
        @click="order"
      >
        结算
      </ElButton>

      <ElButton
        type="info"
        @click="$router.back()"
      >
        取消
      </ElButton>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import IIcon from '@com/Icon'
import IItems from '@mallCom/Items'
import IContact from './Contact'

import { getIcon } from '@/enums/mall'
import { cashier } from '@/store/cart'
import formatNumber from '@/utils/formatNumber'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { route: { type: Object, required: true } },
  components: { IIcon, IItems, IContact },
  data: () => ({ contact: {}, remarks: {} }),
  computed: { cashier },
  methods: {
    getIcon,
    format(price?: number | string) {
      return formatNumber(price, 2)
    },
    order() {
      const contact = this.contact
      if (!contact.id) {
        return this.$message.warning('请选择联系人信息')
      }

      this.cashier.order(contact, this.remarks)
    },
  },
  activated() {
    const cashier = this.cashier
    cashier.cart.length || cashier.init()
  },
  deactivated() {
    this.cashier.clear()
  },
}
</script>

<style lang="scss" module>
$labelWidth: 90px;

.wrapper {
  h4,
  h5 {
    margin: $gapNormal / 2 0;
  }

  h4 {
    color: $colorTextMain;
    font-size: $larger;
  }

  h5,
  h6 {
    font-size: $medium;
  }

  h6 {
    padding-left: $gapNormal / 2;
    border-left: 4px solid $colorTheme;

    > svg {
      margin-right: $gapNormal / 4;
      vertical-align: middle;
    }
  }
}

.title {
  margin-top: 0 !important;
}

.middle {
  display: inline-block;
  vertical-align: middle;
}

.label {
  width: $labelWidth;
}

.remark {
  width: calc(100% - #{$labelWidth}) !important;
}

.bar {
  margin-top: $gapNormal;
  text-align: right;
}

.price {
  margin-right: $gapNormal;
  color: $colorTheme;
  font-weight: bold;
  font-size: $xxLarge;
}
</style>
