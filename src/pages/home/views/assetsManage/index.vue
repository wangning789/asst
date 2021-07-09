<!-- 描述 -->
<template>
  <div class="el-card">
    <ElRow>
      <ElTabs v-model="activeName">
        <ElTabPane
          v-for="(item, index) in TITLE"
          :key="index"
          :label="item"
        />
      </ElTabs>
    </ElRow>

    <ElRow
      :gutter="GAP"
      :class="$style.main"
    >
      <ElCol
        v-show="activeName === '0' || activeName === '1' || activeName === '2'"
        v-loading="isLoadingTree"
        :span="5"
      >
        <ElRow :class="$style.treeTitle">
          <ElCol :span="12">
            <span>组织机构列表</span>
          </ElCol>
          <ElCol :span="12">
            <div :class="$style.levelSwitch">
              <span>只看本级：</span>
              <ElSwitch
                v-model="levelSwitch"
                :disabled="!companyId"
              />
            </div>
          </ElCol>
        </ElRow>

        <ElInput
          v-model.lazy.trim="keyWord"
          clearable
          size="medium"
          suffix-icon="i-sousuo"
          placeholder="请输入名称"
        />
        <ITree
          :data="tree"
          :key-word="keyWord"
          :class="$style.tree"
          @change="onChange"
        />
      </ElCol>
      <ElCol
        v-loading="isLoadingTable"
        :span="19"
      >
        <SystemAssets
          v-show="activeName === '0'"
          :belong-company-id="companyId"
          :level-switch="levelSwitch"
          :route="route"
          :active-name="activeName"
        />
        <HostAssets
          v-show="activeName === '1'"
          :belong-company-id="companyId"
          :level-switch="levelSwitch"
          :route="route"
          :active-name="activeName"
        />
        <!-- <SecretCount
          v-show="activeName === '3'"
          :route="route"
          :active-name="activeName"
        />
        <NonSecretCount
          v-show="activeName === '4'"
          :route="route"
          :active-name="activeName"
        /> -->
        <SecurityAssets
          v-show="activeName === '2'"
          :belong-company-id="companyId"
          :level-switch="levelSwitch"
          :route="route"
          :active-name="activeName"
        />
        <!-- <ComputerTerminal
          v-show="activeName === '5'"
          :belong-company-id="companyId"
          :level-switch="levelSwitch"
          :route="route"
          :active-name="activeName"
        />
        <Computerperipherals
          v-show="activeName === '6'"
          :belong-company-id="companyId"
          :level-switch="levelSwitch"
          :route="route"
          :active-name="activeName"
        />
        <Storage
          v-show="activeName === '7'"
          :belong-company-id="companyId"
          :level-switch="levelSwitch"
          :route="route"
          :active-name="activeName"
        /> -->
      </ElCol>
    </ElRow>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { TITLE } from './enums'
import ITree from '@homeCom/admin/TreeRadio'
import ElTabs from 'element-ui/lib/tabs'
import ElTabPane from 'element-ui/lib/tab-pane'
import ElSwitch from 'element-ui/lib/switch'
import HostAssets from './hostAssets'
// import SecretCount from './secretCount'
// import NonSecretCount from './nonSecretCount'
import SystemAssets from './systemAssets'
import SecurityAssets from './securityAssets'
// import ComputerTerminal from './computerTerminal'
// import Storage from './storage'
// import Computerperipherals from
// '@/pages/home/views/assetsManage/computerPeripherals/computerPeripherals'
import { trim } from '@/pipe'
import LAYOUT from '@/scss/export/layout.scss'
import { Menu, getOrganizationTree } from '@/api/assetsManage'
const whiteList = [
  'id',
  'enabled',
  'organizationName',
  'organizationLevel',
  'parentName',
  'abbreviation',
  'organizationDesc',
  'parentId',
  'organizationPath',
]
export default {
  props: {
    route: {
      type: Object,
      required: true,
    },
  },
  components: {
    ITree,
    ElTabs,
    ElTabPane,
    ElSwitch,
    HostAssets,
    // SecretCount,
    // NonSecretCount,
    SystemAssets,
    SecurityAssets,
    // ComputerTerminal,
    // Storage,
    // Computerperipherals,
  },
  data() {
    return {
      keyWord: '',
      isLoadingTree: true,
      tree: (null as any) as Menu,
      isLoadingTable: false,
      disabled: true,
      selected: (null as any) as Menu,
      companyId: '',
      activeName: '0',
      levelSwitch: false,
    }
  },
  computed: {
    GAP: () => +LAYOUT.gap,
    TITLE: () => TITLE,
  },
  methods: {
    getTree() {
      this.isLoadingTree = this.disabled = true
      getOrganizationTree()
        .then((res) => {
          if (res && res.data && res.data.body) {
            this.tree = res.data.body
          }
        })
        .finally(() => {
          this.isLoadingTree = false
        })
    },
    onChange(treeNode: Menu) {
      this.selected = trim(treeNode, whiteList)
      if (!treeNode.id) {
        return
      }
      this.companyId = treeNode.id
    },
  },
  beforeMount() {
    const active = sessionStorage.getItem('activeName') || '0'
    this.activeName = active === this.activeName ? this.activeName : active
    sessionStorage.removeItem('activeName')
  },
  created() {
    this.getTree()
  },
  beforeDestroy() {
    sessionStorage.setItem('activeName', this.activeName)
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/tabs';
@import '~element-ui/packages/theme-chalk/src/tab-pane';
@import '~element-ui/packages/theme-chalk/src/switch';
</style><style lang="scss" module>
.tree {
  max-height:
    calc(
      100vh - #{$gapTop + $gapBottom + $gapNormal * 2.25 + $heightInput}
    );
  overflow: auto;
  border: $borderBase;
}

.main {
  margin: auto !important;
}

.treeTitle {
  // display: flex;
  // justify-content: space-between;
  margin-bottom: 16px;
  font-weight: bold;
  font-size: $larger;

  .levelSwitch {
    display: flex;
    justify-content: flex-end;
    font-size: $medium;
  }
}
</style>
