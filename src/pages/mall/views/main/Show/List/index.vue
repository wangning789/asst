<!-- 商品分页列表 -->
<template>
  <IChooser
    :fetch="fetch"
    :args="args"
  >
    <ICard
      v-for="(data,index) in body.data"
      :key="index"
      :data="data"
    />

    <!-- 翻页 -->
    <ElPagination
      v-show="total"
      background
      :total="total"
      :layout="layout"
      :page-sizes="sizes"
      :page-size="params.pageSize"
      :current-page="params.page"
      @size-change="setPageSize"
      @current-change="setPage"
    />
  </IChooser>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElPagination from 'element-ui/lib/pagination'
import IChooser from '@com/ChooserAsyncFunctional'
import ICard from './Card'

import { ROLES } from '@/enums'
import CONFIG_PAGE from '@com/config/table'
import { debounce } from '@/utils/performance'
import {
  pageCustomerAndSales,
  pageCloudService,
} from '@/api/servicePlatform/securityServiceMarket'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { query: { type: Object, required: true } },
  components: { IChooser, ICard, ElPagination },
  data() {
    return {
      body: [],
      params: { page: 1, pageSize: 10 },
      total: 0,
    }
  },
  computed: {
    sizes: () => CONFIG_PAGE.sizes,
    layout: () => CONFIG_PAGE.layout,
    args() {
      return [Object.assign(this.params, this.query)]
    },
    fetch() {
      let page
      switch (true) {
        case this.authFit(ROLES.custom):
        case this.authFit(ROLES.sales):
          page = pageCustomerAndSales
          break
        case this.authFit(ROLES.cloudService):
          page = pageCloudService
          break
        default:
          return
      }

      const FN = debounce((params: any, resolve: any, reject: any) => {
        page(params).then(res => {
          const body = res.data.body || {}
          const total = body.total

          const params = this.params
          const lastPage = Math.ceil(total / params.pageSize) || 1
          if (params.page > lastPage) {
            params.page = lastPage
            return
          }

          this.total = total
          this.body = body
          resolve(res)
        }).catch(reject)
      }, 250)

      return (params: any) => new Promise((resolve, reject) => {
        FN(params, resolve, reject)
      })
    },
  },
  methods: {
    setPageSize(val) {
      this.params.pageSize = val
      this.params.page = 1
    },
    setPage(val) {
      this.params.page = val
    },
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/pagination';
</style>
