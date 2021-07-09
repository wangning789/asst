<template>
  <div>
    <ElDialog
      :visible="visible"
      width="1000px"
      :title="`选择${activeTab === 'business' ? '应用系统' : '服务器'}`"
      @close="close"
    >
      <!-- <ElTabs
        v-model="activeTab"
        type="card"
      >
        <ElTabPane
          label="应用系统"
          name="business"
        > -->
      <Business
        v-show="activeTab === 'business'"
        :belong-company-id="companyId"
        @getData="getBusinessData"
      />
      <!-- </ElTabPane>
        <ElTabPane
          label="服务器"
          name="host"
        > -->
      <Host
        v-show="activeTab === 'host'"
        :company-id="companyId"
        @getData="getHostData"
      />
      <!-- </ElTabPane>
      </ElTabs> -->

      <span
        slot="footer"
        class="dialog-footer"
      >
        <ElButton
          type="primary"
          @click="confirm"
        >确认</ElButton>
        <ElButton
          type="primary"
          @click="close"
        >取消</ElButton>
      </span>
    </ElDialog>
  </div>
</template>
<script lang="ts">
// @ts-nocheck
// import ElTabs from 'element-ui/lib/tabs'
// import ElTabPane from 'element-ui/lib/tab-pane'
import Host from './host'
import Business from './business'
export default {
  props: {
    visible: { type: Boolean },
    organizations: { type: Array, default: () => [] },
    company: { type: String, default: () => '' },
    activeTab: { type: String, default: () => '' },
  },
  components: { Host, Business },
  data() {
    return {
      hostArr: [],
      businessArr: [],
      companyId: '',
      assets: {
        businessArr: [],
        hostArr: [],
      },
    }
  },
  watch: {
    company(newVal) {
      this.companyId = newVal
    },
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
    },
    confirm() {
      this.$emit('success', this.assets, this.activeTab)
    },
    getBusinessData(data) {
      this.assets.businessArr = data
    },
    getHostData(data) {
      this.assets.hostArr = data
    },
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/tabs';
@import '~element-ui/packages/theme-chalk/src/tab-pane';
</style>
