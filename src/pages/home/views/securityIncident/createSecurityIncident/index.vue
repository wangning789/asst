<template>
  <div class="el-card">
    <div :class="$style.bar">
      <h3>
        {{
          be === 'new' ? '上报安全事件' : '编辑安全事件'
        }}
      </h3>
    </div>
    <Form
      :form-data="form"
      :be="be"
    />
  </div>
</template>
<script lang="ts">
// @ts-nocheck
import Form from './form'
import { getSecurityIncident } from '@/api/securityIncident/securityIncident'
export default {
  props: {
    route: { type: Object, required: true },
    be: { type: String, required: true },
  },
  components: { Form },
  data() {
    return {
      form: {},
    }
  },
  methods: {
    getIncidentInfo() {
      const id = this.route.params.id || ''
      if (id) {
        getSecurityIncident(id).then((res) => {
          if (res && res.data && res.data.body) {
            this.form = res.data.body
          }
        })
      }
    },
  },
  created() {
    this.getIncidentInfo()
  },
}
</script>

<style lang="scss" module>
.bar {
  margin-bottom: $gapNormal;
  border-bottom: $borderBase;
}
</style>
