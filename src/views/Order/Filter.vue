<!-- 筛选条件 -->
<template>
  <div>
    <h4 :class="$style.title">
      {{ title }}
    </h4>

    <ElButton
      type="text"
      :icon="`el-icon-arrow-${showFilter ? 'up' : 'down'}`"
      :class="$style.fr"
      @click="showFilter = !showFilter"
    >
      {{ showFilter ? '隐藏' : '显示' }}筛选
    </ElButton>

    <Transition
      name="fold"
      mode="out-in"
    >
      <ElForm
        v-show="showFilter"
        inline
      >
        <ElFormItem label="关键字：">
          <ElInput
            :value="value.keyword"
            clearable
            placeholder="请输入关键字"
            @input="update('keyword', $event)"
          />
        </ElFormItem>

        <ElFormItem
          v-if="!isUser"
          label="下单客户："
        >
          <ElInput
            :value="value.customer"
            clearable
            placeholder="请输入下单客户"
            @input="update('customer', $event)"
          />
        </ElFormItem>

        <!-- <ElFormItem
          v-if="!authFit(ROLES.custom)"
          label="合同编号："
        >
          <ElInput
            :value="value.contractNumber"
            clearable
            placeholder="请输入合同编号"
            @input="update('contractNumber', $event)"
          />
        </ElFormItem> -->

        <ElFormItem
          label="订单状态："
        >
          <ElCascader
            v-model="statu"
            :props="props"
            clearable
            @change="update('statuList', $event)"
          />
        </ElFormItem>

        <ElFormItem label="下单时间：">
          <ElDatePicker
            v-model="orderDateRange"
            clearable
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :format="DATE_TIME.dateTime"
            :value-format="DATE_TIME.serverDateTime"
            @change="update('orderDateRange', $event)"
          />
        </ElFormItem>

        <ElFormItem
          v-if="!isUser"
          label="预计交付时间："
        >
          <ElDatePicker
            v-model="deliveryDateRange"
            clearable
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :format="DATE_TIME.dateTime"
            :value-format="DATE_TIME.serverDateTime"
            @change="update('deliveryDateRange', $event)"
          />
        </ElFormItem>
      </ElForm>
    </Transition>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElDatePicker from 'element-ui/lib/date-picker'
import ElCascader from 'element-ui/lib/cascader'

import { ROLES } from '@/enums'
import { DATE_TIME } from '@/enums/format'
import {
  customStatus,
  operationStatus,
  commercialStatus,
  sellsStatus,
  getChildStatus,
} from '@/api/servicePlatform/purchaseOrder'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** 可通过 v-model 绑定
 * emit: (事件名: [参数列表, ...])
 *  input: [value]
 *  add: [] 点击新增按钮
 */
// "expectDeliveryBeginTime": "1970-1-1 00:00:00",
// "expectDeliveryEndTime": "1970-1-1 00:00:00",
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    value: { type: Object, required: true },
    title: { type: String, default: '' },
  },
  components: {
    ElDatePicker,
    ElCascader,
  },
  data() {
    return {
      showFilter: false,
      statu: [],
      status: null,
      subList: [],
      subStatuLoading: false,
      orderStatus: '',
      orderDateRange: [],
      deliveryDateRange: [],
      props: {
        lazy: true,
        multiple: true,
        lazyLoad: (node, resolve) => {
          const { level } = node
          if (level > 1) {
            return resolve()
          }

          node.root
            ? this.fetchStatus().then(res => {
              this.status = res.data.body || []
              const nodes = this.status.map((item: any) => ({
                id: item.id,
                value: item.statusCode,
                label: item.statusName,
              }))
              return resolve(nodes)
            })
            : getChildStatus(node.data.id).then(res => {
              this.subList = res.data.body || []
              const nodes = this.subList.map((item: any) => ({
                id: item.id,
                value: item.statusCode,
                label: item.statusName,
                leaf: 1,
              }))
              return resolve(nodes)
            })
        },
      },
    }
  },
  computed: {
    ROLES: () => ROLES,
    DATE_TIME: () => DATE_TIME,
    isUser() {
      return this.authFit(ROLES.sales) ||
          this.authFit(ROLES.custom) ||
          this.authFit(ROLES.cloudService)
    },
    showSubStatu() {
      this.orderStatus && this.getChildStatus(this.orderStatus)
      return !!this.orderStatus
    },
    fetchStatus() {
      let fetchStatus
      switch (true) {
        case this.authFit(ROLES.custom):
          fetchStatus = customStatus
          break
        case this.authFit(ROLES.operationManager):
          fetchStatus = operationStatus
          break
        case this.authFit(ROLES.commercial):
          fetchStatus = commercialStatus
          break
        case this.authFit(ROLES.cloudService):
        case this.authFit(ROLES.sales):
        case this.authFit(ROLES.salesManager):
          fetchStatus = sellsStatus
          break
      }
      return fetchStatus
    },
  },
  methods: {
    update(attr: string, value: any) {
      if (attr === 'orderDateRange') {
        const beginTime = value && value.length ? value[0] : ''
        const endTime = value && value.length ? value[1] : ''
        this.$emit('input', { beginTime, endTime })
      } else if (attr === 'deliveryDateRange') {
        const expectDeliveryBeginTime = value && value.length ? value[0] : ''
        const expectDeliveryEndTime = value && value.length ? value[1] : ''
        this.$emit('input', { expectDeliveryBeginTime, expectDeliveryEndTime })
      } else {
        if (attr === 'statuList') {
          value = value.map(item => item[1])
        }
        this.$emit('input', { ...this.value, [attr]: value || '' })
      }
    },
    getChildStatus(pid: string) {
      this.subStatuLoading = true
      getChildStatus(pid).then(res => {
        this.subStatuLoading = false
        this.subList = res.data.body || []
      })
    },
  },
}
</script>
<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/date-picker';
@import '~element-ui/packages/theme-chalk/src/cascader';

@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
  /* 仅对 IE 10+ 生效 */
  .el-cascader__tags .el-tag > span {
    min-width: 150px;
  }
}
</style>

<style lang="scss" module>
.title {
  display: inline-block;
  margin: $gapNormal/2 0 $gapNormal 0;
  font-size: $larger;
}

.fr {
  float: right;
}
</style>
