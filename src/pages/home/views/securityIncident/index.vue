<template>
  <div>
    <Leader v-if="API" />
    <Common v-else />
    <SecurityIncidentTable :route="route" />
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import Common from './topSummary/common'
import Leader from './topSummary/leader'
import SecurityIncidentTable from './securityIncidentTable'

import { ROLES } from '@/enums'
export default {
  props: { route: { type: Object, required: true } },
  components: { Common, Leader, SecurityIncidentTable },
  computed: {
    API() {
      return this.authFit(ROLES.groupLeaders)
    },
    ROLES() {
      return ROLES
    },
  },
}
</script>
