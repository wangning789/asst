<!-- 描述 -->
<template>
  <div>
    <h3>规格</h3>
    <ElTable
      :data="data"
      border
      style="width: 100%;"
    >
      <ElTableColumn
        prop="packageName"
        label="规格"
      />
      <ElTableColumn
        label="配置详情"
      >
        <template #default="{ row: { productList = [] } }">
          <div
            v-for="item in productList"
            :key="item.id"
          >
            {{ item.productsName }}
          </div>
        </template>
      </ElTableColumn>
    </ElTable>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElTable from 'element-ui/lib/table'
import ElTableColumn from 'element-ui/lib/table-column'
/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { data: { type: Array, required: true } },
  components: { ElTable, ElTableColumn },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/table';
@import '~element-ui/packages/theme-chalk/src/table-column';
</style>

<style lang="scss" module>
.wrapper {
  text-align: center;
}
</style>
