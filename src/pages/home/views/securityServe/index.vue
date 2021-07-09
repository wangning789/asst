<template>
  <div :class="$style.wrapper">
    <ElTabs
      v-model="activeName"
      class="serverTabs"
      type="card"
    >
      <ElTabPane
        v-for="(item,index) in eltabData"
        :key="index.dictCode"
        :label="`${item.dictName}`"
        :name="`${item.dictCode}`"
      >
        <FBingDu
          v-if="activeName==='USR_HOST_ANTIVIRUS'"
          :route="route"
        />
        <VirtualFanFire
          v-if="activeName==='USR_FIREWALL'"
        />
        <VulneDetect
          v-if="activeName==='USR_VULNERABILITY_SCAN'"
          :route="route"
        />
        <FhqService v-if="activeName==='USR_APP_PROTECTIVE'" />
        <TamperProofing v-if="activeName==='USR_TAMPER_PROOFING'" />
      </ElTabPane>
      <!-- <ElTabPane
        label="虚拟防火墙服务"
        name="two"
      >
        <VirtualFanFire
          v-if="activeName==='two'"
        />
      </ElTabPane>
      <ElTabPane
        label="主机漏洞检测服务"
        name="three"
      >
        <VulneDetect
          v-if="activeName==='three'"
          :route="route"
        />
      </ElTabPane>
      <ElTabPane
        label="应用层防火墙服务"
        name="four"
      >
        <FhqService v-if="activeName==='four'" />
      </ElTabPane>
      <ElTabPane
        label="网页防篡改服务"
        name="five"
      >
        <TamperProofing v-if="activeName==='five'" />
      </ElTabPane> -->
    </ElTabs>
  </div>
</template>
<script lang="ts">
// @ts-nocheck
import ElTabs from 'element-ui/lib/tabs'
import ElTabPane from 'element-ui/lib/tab-pane'
import TamperProofing from './tamperProofing'
import FhqService from './FhqService'
import FBingDu from './FBingDu'
import VirtualFanFire from './virtualFanFire'
import VulneDetect from './vulneDetect'
import { purchasedList } from '@/api/servicePlatform/SecurityService'
import { userOverviewCode } from '@home/enum/userOverviewCode'

export default {
  props: {
    route: {
      type: Object,
      required: true,
    },
  },
  components: {
    ElTabs,
    ElTabPane,
    TamperProofing,
    FhqService,
    FBingDu,
    VirtualFanFire,
    VulneDetect,
  },
  data() {
    return {
      activeName: '',
      eltabData: [],
    }
  },
  computed: {
    userOverviewCode: () => {
      return userOverviewCode
    },
  },

  watch: {
    route: {
      immediate: true,
      handler(route?: any) {
        switch (route.query.code) {
          // 主机防病毒服务
          case userOverviewCode.USRHOSTANTIVIRUS:
            this.activeName = userOverviewCode.USRHOSTANTIVIRUS
            break
            // 主机漏洞检测服务
          case userOverviewCode.USRVULNERABILITYSCAN:
            this.activeName = userOverviewCode.USRVULNERABILITYSCAN
            break
            // web网页防篡改
          case userOverviewCode.USRTAMPERPROOFING:
            this.activeName = userOverviewCode.USRTAMPERPROOFING
            break
            // 二代防火墙
          case userOverviewCode.USRFIREWALL:
            this.activeName = userOverviewCode.USRFIREWALL
            break
            // 应用防护
          case userOverviewCode.USRAPPPROTECTIVE:
            this.activeName = userOverviewCode.USRAPPPROTECTIVE
            break
          default:
            break
        }
      },
    },
  },

  methods: {
    getPurchasedList() {
      purchasedList({}).then(res => {
        this.eltabData = res.data.body
        if (!this.route.query.code) {
          this.activeName = this.eltabData[0]?.dictCode
        }
      })
    },
  },
  mounted() {
    this.getPurchasedList()
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/tabs';
@import '~element-ui/packages/theme-chalk/src/tab-pane';
@import '~element-ui/packages/theme-chalk/src/table-column';

.serverTabs {
  margin-bottom: 24px;
  border: none;
}

.serverTabs > .el-tabs__header {
  border-bottom: none !important;
}

.serverTabs > .el-tabs__header .el-tabs__nav {
  border: none !important;
}

.serverTabs > .el-tabs__header .el-tabs__item {
  width: 180px;
  height: 50px;
  margin-right: 24px;
  color: #333;
  font-weight: 400;
  font-size: 16px;
  line-height: 50px;
  text-align: center;
  background: #fff;
  border: none !important;
  border-radius: 2px;
}

.serverTabs > .el-tabs__header .el-tabs__item.is-active {
  height: 56px;
  color: #fff;
  font-weight: 400;
  font-size: 16px;
  line-height: 50px;
  background-color: rgba(255, 255, 255, 0);
  background-image: url('~@/assets/tabPaneSel.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.el-progress-bar__innerText {
  margin-top: -5px;
}
</style>

<style lang="scss" module>
.wrapper {
  padding: 0;
}

</style>
