<!-- 描述 -->
<template>
  <div class="el-card">
    <IChooser :fetch="fetch">
      <template #success="{ data = {} }">
        <div :class="$style.container">
          <ElTabs
            v-model="activeName"
            :class="$style.tabs"
          >
            <ElTabPane
              v-for="(item, index) in data"
              :key="index"
              :name="item.enName"
              :label="item.chName"
            />
          </ElTabs>
          <ElButton
            size="small"
            :class="$style.orgBtn"
            @click="drawer = true"
          >
            选择所属单位
          </ElButton>
        </div>

        <!-- 这是服务器 -->
        <Server
          v-show="activeName === 'server'"
          :active-name="activeName"
          :checked-org-list="checkedOrgList"
        />
        <!-- 这是业务系统 -->
        <BusinessSystem
          v-show="activeName === 'biz'"
          :active-name="activeName"
          :checked-org-list="checkedOrgList"
        />
        <!-- 这是安全设备 -->
        <SecurityFacility
          v-show="activeName === 'security_device'"
          :active-name="activeName"
          :checked-org-list="checkedOrgList"
        />
        <!-- 这是自定义资产 -->
        <template v-for="(item, index) in data">
          <Customize
            v-show="
              activeName !== 'security_device' &&
                activeName !== 'biz' &&
                activeName !== 'server' && activeName === item.enName
            "
            :key="index"
            :ci-type-id="item.id"
            :active-name="item.enName"
            :checked-org-list="checkedOrgList"
            :ci-name="item.chName"
          />
        </template>
      </template>
    </IChooser>
    <div>
      <IDrawer
        :drawer="drawer"
        :title="'选择所属单位'"
        @handleClose="handleClose"
      >
        <div slot="buttons">
          <ElButton
            type="primary"
            size="small"
            @click="handleClose"
          >
            确认
          </ElButton>
        </div>
        <div slot="content">
          <ElTree
            ref="tree"
            node-key="number"
            :expand-on-click-node="false"
            :default-expanded-keys="[1]"
            :check-strictly="true"
            :data="orgTree"
            :props="defaultProps"
            :class="$style.tree"
            show-checkbox
          >
            <span
              slot-scope="{ node }"
              :class="$style.customTree"
            >
              <ElTooltip
                class="item"
                effect="dark"
                :content="node.label"
                placement="top-start"
              >
                <div :class="$style.name">{{ node.label }}</div>
              </ElTooltip>
            </span>
          </ElTree>
        </div>
      </IDrawer>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import Server from './server/index'
import SecurityFacility from './securityFacility/index'
import BusinessSystem from './businessSystem/index'
import Customize from './customize/index'
import IDrawer from '@homeCom/assets/Drawer'
import IChooser from '@com/ChooserAsyncFunctional'
import STYLE from '@/scss/status.module.scss'

import { assetsTypeAll } from '@/api/assets/assetsInfo/index'
import { getOrganizationTree, getAllOrganizationTree } from '@/api/assetsManage'
import { ROLES } from '@/enums'
export default {
  name: 'AssetsInfo',
  components: {
    Server,
    SecurityFacility,
    BusinessSystem,
    Customize,
    IChooser,
    IDrawer,
  },
  data() {
    return {
      activeName: 'server',
      ciTypeId: '',
      drawer: false,
      defaultProps: {
        children: 'children',
        label: 'organizationName',
      },
      checkedOrgList: [], // 选择所属单位
      orgTree: [],
    }
  },
  computed: {
    STYLE: () => STYLE,
  },
  watch: {
    activeName(a, b) {
      if (a !== b) {
        this.filtrate(a)
      }
    },
  },
  methods: {
    async fetch() {
      const param = {}
      const data = (await assetsTypeAll(param)).data.body
      this.activeName = data[0].enName
      return data
    },
    filtrate(activeName) {
      const param = {}
      assetsTypeAll(param).then((res) => {
        res.data.body.forEach((o) => {
          if (o.enName === activeName) {
            this.ciTypeId = o.id
          }
        })
      })
    },
    async fetchTree() {
      const fn = this.authFit(ROLES.systemAdmin)
        ? getAllOrganizationTree
        : getOrganizationTree
      this.orgTree = (await fn()).data.body
      this.$set(this.orgTree[0], 'number', 1)
    },
    handleClose() {
      this.drawer = false
      this.checkedOrgList = this.$refs.tree.getCheckedNodes().map((o) => {
        return { id: o.id, organizationName: o.organizationName }
      })
    },
  },
  created() {
    this.fetchTree()
  },
}
</script>

<style lang="scss" module>
.name {
  width: 95%;
  overflow: hidden;
  font-size: 14px;
  text-overflow: ellipsis;
}

.customTree {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
  font-size: 14px;
}

.container {
  position: relative;
}

.orgBtn {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  color: $colorTheme;
}

.tree :global(.el-tree-node__content) {
  height: 32px;
}

.tabs :global(.el-tabs__active-bar) {
  background: $colorTheme;
}

.tabs :global(.el-tabs__nav-scroll) {
  width: 67%;
}

.tabs :global(.el-tabs__nav-next) {
  left: 67%;
}

.tabs :global(.el-tabs__item) {
  color: $colorTextMain;
  font-weight: bold;

  &:hover {
    color: $colorTheme;
  }
}

.tabs :global(.el-tabs__item.is-active) {
  color: $colorTheme;
  font-weight: bold;
}

.tree {
  position: relative;
  height: 700px;
  overflow-x: hidden;
}

.tree::-webkit-scrollbar-thumb {
  //滑块部分
  background-color: #e5e5e5;
}

.tree :global(.el-tree-node.is-current > .el-tree-node__content) {
  color: $colorTheme;
}
</style>
