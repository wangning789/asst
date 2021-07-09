<!-- 描述 -->
<template>
  <div class="el-card">
    <ElTabs
      v-model="activeName"
      @tab-click="handleClick"
    >
      <ElTabPane
        label="网络扫描发现"
        name="externalSystem"
      />
      <!-- <ElTabPane
        label="外部系统数据导入"
        name="networkScan"
      /> -->
    </ElTabs>
    <!-- <div v-show="activeName === 'networkScan'">
      <ExternalSystem />
    </div> -->
    <div v-show="activeName === 'externalSystem'">
      <NetworkScan />
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
// import ExternalSystem from './externalSystem/index'
import NetworkScan from './networkScanDiscovery/index'
/** emit: (事件名: [参数列表, ...]) */
export default {
  components: {
    // ExternalSystem,
    NetworkScan,
  },
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  data() {
    return {
      activeName: 'externalSystem',
    }
  },
  methods: {
    handleClick(tab) {
      this.activeName = tab.name
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  text-align: center;
}
</style>
