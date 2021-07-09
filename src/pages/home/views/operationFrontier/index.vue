<template>
  <div class="el-card">
    <ElTabs v-model="activeTab">
      <ElTabPane
        label="安全产品巡检"
        name="security"
      >
        <Security />
      </ElTabPane>
      <ElTabPane
        label="服务器巡检"
        name="host"
      >
        <Host />
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import Host from './host.vue'
import Security from './security.vue'
export default {
  components: {
    Host,
    Security,
  },
  data() {
    return {
      activeTab: 'security',
    }
  },
}
</script>
<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/tabs';
@import '~element-ui/packages/theme-chalk/src/tab-pane';
</style>
