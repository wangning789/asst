<template>
  <div>
    <Unified v-if="communicationLLY" />
    <LeadersOverview v-if="isgroupLeaders" />
    <UnitsoOverview v-if="isUnitSO" />
    <ProjectManagerOverview v-if="isProjectManager" />
  </div>
</template>
<script lang="ts">
// @ts-nocheck
import LeadersOverview from './leadersOverview'
import UnitsoOverview from './unitsoOverview'
import Unified from './unified/unified'
import ProjectManagerOverview from './projectManagerOverview/projectManagerOverview.vue'
import { ROLES } from '@/enums'
export default {
  components: {
    LeadersOverview,
    UnitsoOverview,
    Unified,
    ProjectManagerOverview,
  },
  computed: {
    ROLES: () => ROLES,
    communicationLLY() {
      switch (true) {
        case this.authFit(ROLES.communicationLLY) || this.authFit(ROLES.opertateMaintenance) ||
          this.authFit(ROLES.monitorAnlysis) || this.authFit(ROLES.securityExperts):
          return true
        default:
          return ''
      }
    },
    isUnitSO() {
      // 单位安全管理员
      return this.authFit(ROLES.unitSO)
    },
    isgroupLeaders() {
      // 集团领导
      return this.authFit(ROLES.groupLeaders)
    },
    // 项目经理
    isProjectManager() {
      return this.authFit(ROLES.projectManager)
    },
  },
}
</script>
